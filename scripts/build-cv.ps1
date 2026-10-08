<#
.SYNOPSIS
  Builds and checks the English and Turkish CV PDFs.

.DESCRIPTION
  Uses an installed Chromium browser (Microsoft Edge or Google Chrome) in
  headless mode, so the PDF contains real, selectable text. Afterwards the
  text is extracted again with pdftotext (if available) to confirm that the
  required text and section order survived in both CVs.

.EXAMPLE
  pwsh -File scripts/build-cv.ps1
  pwsh -File scripts/build-cv.ps1 -OgImage
  pwsh -File scripts/build-cv.ps1 -Browser "C:\Path\To\chrome.exe"
#>
[CmdletBinding()]
param(
    # Full path to msedge.exe or chrome.exe. Found automatically when omitted.
    [string]$Browser,
    # Render scripts/og-image.html to assets/img/og-image.png instead of building the CV PDFs.
    [switch]$OgImage
)

$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot
$ogHtml   = Join-Path $PSScriptRoot 'og-image.html'
$ogPng    = Join-Path $siteRoot 'assets\img\og-image.png'

function Find-Browser {
    if ($Browser) {
        if (Test-Path -LiteralPath $Browser) { return $Browser }
        throw "Browser not found at: $Browser"
    }
    $candidates = @(
        'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
        'C:\Program Files\Google\Chrome\Application\chrome.exe',
        'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    throw 'No Edge or Chrome installation found. Pass one with -Browser "<path to msedge.exe or chrome.exe>".'
}

function Find-Tool([string]$name) {
    $command = Get-Command $name -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }
    $gitCopy = "C:\Program Files\Git\mingw64\bin\$name.exe"
    if (Test-Path -LiteralPath $gitCopy) { return $gitCopy }
    return $null
}

function Invoke-HeadlessBrowser([string]$browserPath, [string[]]$browserArguments) {
    # A throwaway profile keeps this run separate from any browser window that is already open.
    $profileDir = Join-Path ([System.IO.Path]::GetTempPath()) ("cv-build-" + [System.Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $profileDir | Out-Null
    try {
        $allArguments = @('--headless', '--disable-gpu', "--user-data-dir=`"$profileDir`"") + $browserArguments
        $process = Start-Process -FilePath $browserPath -ArgumentList $allArguments -Wait -PassThru -WindowStyle Hidden
        return $process.ExitCode
    }
    finally {
        Remove-Item -LiteralPath $profileDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

$browserPath = Find-Browser
Write-Host "Browser: $browserPath"

if ($OgImage) {
    $ogUri = [System.Uri]::new($ogHtml).AbsoluteUri
    if (Test-Path -LiteralPath $ogPng) { Remove-Item -LiteralPath $ogPng -Force }
    Invoke-HeadlessBrowser $browserPath @(
        '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
        "--screenshot=`"$ogPng`"", "`"$ogUri`""
    ) | Out-Null
    if (-not (Test-Path -LiteralPath $ogPng)) {
        Write-Host 'FAIL: og-image.png was not created.' -ForegroundColor Red
        exit 1
    }
    Write-Host "PASS: wrote $ogPng ($((Get-Item -LiteralPath $ogPng).Length) bytes)" -ForegroundColor Green
    exit 0
}

$pdftotext = Find-Tool 'pdftotext'
$pdfinfo = Find-Tool 'pdfinfo'

$cvDefinitions = @(
    @{
        Name = 'English'
        Html = 'cv.html'
        Pdf = 'assets\cv\Huseyin_Oguz_Cetin_CV.pdf'
        Required = @('Hüseyin Oğuz Çetin', 'İzmir', 'Yaşar', 'oguzcetin674@gmail.com')
        Headings = @('Summary', 'Education', 'Experience', 'Projects', 'Technical Skills', 'Activities & Certifications', 'Languages')
    },
    @{
        Name = 'Turkish'
        Html = 'cv-tr.html'
        Pdf = 'assets\cv\Huseyin_Oguz_Cetin_CV_TR.pdf'
        Required = @('Hüseyin Oğuz Çetin', 'İzmir', 'Yaşar Üniversitesi', 'oguzcetin674@gmail.com')
        Headings = @('Özet', 'Eğitim', 'Deneyim', 'Projeler', 'Teknik Beceriler', 'Etkinlikler ve Sertifikalar', 'Diller')
    }
)

function Build-AndCheckCv([hashtable]$definition, [string]$browserPath, [string]$pdftotextPath, [string]$pdfinfoPath) {
    $cvHtml = Join-Path $siteRoot $definition.Html
    $pdfPath = Join-Path $siteRoot $definition.Pdf
    $failures = @()
    $workDir = $null

    try {
        if (-not (Test-Path -LiteralPath $cvHtml)) {
            Write-Host "FAIL: $($definition.Name) CV source was not found: $cvHtml" -ForegroundColor Red
            return $false
        }
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $pdfPath) | Out-Null
        if (Test-Path -LiteralPath $pdfPath) { Remove-Item -LiteralPath $pdfPath -Force }

        $cvUri = [System.Uri]::new($cvHtml).AbsoluteUri
        $browserArguments = @(
            '--no-pdf-header-footer',
            ('--print-to-pdf="' + $pdfPath + '"'),
            ('"' + $cvUri + '"')
        )
        Invoke-HeadlessBrowser $browserPath $browserArguments | Out-Null

        if (-not (Test-Path -LiteralPath $pdfPath)) {
            Write-Host "FAIL: $($definition.Name) PDF was not created." -ForegroundColor Red
            return $false
        }
        $pdfSize = (Get-Item -LiteralPath $pdfPath).Length
        if ($pdfSize -lt 5KB) {
            Write-Host "FAIL: $($definition.Name) PDF is only $pdfSize bytes, which is too small to be a real CV." -ForegroundColor Red
            return $false
        }
        Write-Host "Wrote $pdfPath ($pdfSize bytes)"

        if (-not $pdftotextPath) {
            Write-Warning 'pdftotext was not found, so the text check was skipped. Open each PDF and confirm the text can be selected.'
            Write-Host "PASS: $($definition.Name) PDF was created; the text check was skipped." -ForegroundColor Green
            return $true
        }

        # Copy to a temp folder so pdftotext works with any site folder name.
        $workDir = Join-Path ([System.IO.Path]::GetTempPath()) ("cv-check-" + [System.Guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $workDir | Out-Null
        $pdfCopy = Join-Path $workDir 'cv.pdf'
        $txtCopy = Join-Path $workDir 'cv.txt'
        Copy-Item -LiteralPath $pdfPath -Destination $pdfCopy
        & $pdftotextPath -enc UTF-8 $pdfCopy $txtCopy
        if (-not (Test-Path -LiteralPath $txtCopy)) { throw 'pdftotext did not produce any text output.' }
        $text = [System.IO.File]::ReadAllText($txtCopy, [System.Text.Encoding]::UTF8)

        foreach ($required in $definition.Required) {
            if (-not $text.Contains($required)) { $failures += "Missing text: $required" }
        }

        $position = -1
        foreach ($heading in $definition.Headings) {
            $match = [regex]::Match($text, '(?m)^[ \t\f]*' + [regex]::Escape($heading) + '[ \t]*\r?$')
            if (-not $match.Success) {
                $failures += "Missing heading: $heading"
            }
            elseif ($match.Index -lt $position) {
                $failures += "Heading out of order: $heading"
            }
            else {
                $position = $match.Index
            }
        }

        $pages = $null
        if ($pdfinfoPath) {
            $pagesLine = (& $pdfinfoPath $pdfCopy) | Where-Object { $_ -match '^Pages:\s+(\d+)' } | Select-Object -First 1
            if ($pagesLine -match '(\d+)') { $pages = [int]$Matches[1] }
        }
        if (-not $pages) {
            # pdftotext ends each page with a form feed character.
            $pages = ([regex]::Matches($text, [string][char]12)).Count
        }
        Write-Host "$($definition.Name) pages: $pages"
        if ($pages -gt 2) { $failures += "The CV is $pages pages long; the target is one page (two at most)." }
        elseif ($pages -eq 2) { Write-Warning "$($definition.Name) CV runs to two pages. The target is one page." }

        if ($failures.Count -gt 0) {
            Write-Host "FAIL: $($definition.Name) PDF text check found problems:" -ForegroundColor Red
            $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
            return $false
        }
        Write-Host "PASS: $($definition.Name) name, required text, and section order were read back from the PDF." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "FAIL: $($definition.Name) CV build or check failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        if ($workDir) {
            Remove-Item -LiteralPath $workDir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

$failed = $false
foreach ($definition in $cvDefinitions) {
    if (-not (Build-AndCheckCv $definition $browserPath $pdftotext $pdfinfo)) {
        $failed = $true
    }
}
if ($failed) { exit 1 }
exit 0
