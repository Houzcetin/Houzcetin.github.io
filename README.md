# Oğuz Çetin — Portfolio and CV

A personal portfolio website and a separate ATS-friendly CV for Hüseyin Oğuz Çetin.

The site is plain HTML, CSS and JavaScript. There is no framework, no build step and nothing to install. The files in this folder are exactly what GitHub Pages serves.

**The site is not live yet.** It goes online only after you follow [Publish on GitHub Pages](#publish-on-github-pages).

## Folder structure

```
Houzcetin.github.io/
├── index.html          The portfolio page (Home, About, Education, Experience,
│                       Projects, Skills, Activities & Certifications, Contact)
├── project.html        One project in detail. Opened as project.html?id=<slug>
├── cv.html             The English CV as a web page. Source of the English PDF
├── cv-tr.html          The Turkish CV as a web page. Source of the Turkish PDF
├── 404.html            Shown by GitHub Pages when an address does not exist
├── .nojekyll           Tells GitHub Pages to serve the files exactly as they are
├── README.md           This guide
├── TODO.md             What is still missing
├── assets/
│   ├── css/styles.css  Look of the portfolio (colours, layout, responsive rules)
│   ├── css/cv.css      Look of the CV on screen and on paper
│   ├── js/data.js      Your skills and projects, in English and Turkish side by side
│   ├── js/tr.js        The Turkish version of the fixed page text
│   ├── js/site.js      Language switch, light/dark switch, mobile menu
│   ├── js/main.js      Builds the project cards and skill lists
│   ├── js/project.js   Builds the project detail page, gallery and video
│   ├── img/            favicon.svg, og-image.png, and projects/ for screenshots
│   ├── video/          Demo videos (MP4)
│   └── cv/             The two generated PDFs (English and Turkish)
└── scripts/
    ├── build-cv.ps1    Creates both PDFs from the CV pages and checks them
    └── og-image.html   Template for the link-preview picture
```

How the pieces fit together, in one paragraph: `index.html` holds the text that rarely changes (about, education, experience, activities, contact), written in English. The projects and skills are listed once in `assets/js/data.js`; `main.js` reads that list and draws the cards, and `project.js` reads the same list to draw each project's own page. `site.js` runs the two switches in the header: it swaps the English text for the Turkish text from `tr.js`, and it changes the colour theme. The CVs are separate, simple documents so they print cleanly and can be read by applicant tracking systems.

## Languages and themes

**English / Turkish.** The site opens in English. The `EN` / `TR` buttons in the header switch the language, and the browser remembers the choice on that device. A link can also force a language: add `?lang=tr` or `?lang=en` to the address, for example `index.html?lang=tr`.

How it works: every piece of fixed text in the HTML carries a label such as `data-i18n="hero.intro"`. When Turkish is chosen, `site.js` looks that label up in `tr.js` and replaces the text. Switching back restores the English that was in the HTML. Without JavaScript the site simply stays in English.

**Light / dark.** The site follows the visitor's device setting until they press the theme button; after that their choice is remembered. Colours for both themes are the two token blocks at the top of `assets/css/styles.css`. The CV pages are always light because they represent a printed sheet.

## Preview on your computer

Easiest: double-click `index.html`. Everything works straight from disk.

To preview it the way a web server would deliver it, open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. This server is only for previewing. The published site needs no server-side code.

## Edit the content

| What you want to change | English | Turkish |
|---|---|---|
| Projects (text, links, screenshots, video) and skill group names | `assets/js/data.js`, the `en:` text | `assets/js/data.js`, the `tr:` text next to it |
| Hero text, About, Education, Experience, Activities, Certifications, Languages, Contact, menu labels | `index.html` | `assets/js/tr.js`, the line with the same key as the element's `data-i18n` |
| Labels on the project page (Problem, My role, …) | `assets/js/project.js` | `assets/js/tr.js` |
| The CV | `cv.html` | `cv-tr.html` |
| Colours and spacing | the token blocks at the top of `assets/css/styles.css` | same |

Every content change needs both languages. If you edit an English sentence, edit its Turkish partner too, otherwise the two versions will disagree.

Your name, email, GitHub and LinkedIn links appear in four places: the Contact section of `index.html`, the top of `cv.html`, the top of `cv-tr.html`, and the `<head>` of `index.html` (title and description). If one of them changes, update all four.

The website and the CVs do not update each other. After changing a fact on one, check the others, then rebuild the PDFs.

## Add screenshots and videos

Nothing is shown for media that does not exist. A project with no images has no Screenshots block, and a project with no video has no Demo video block. Add the files, list them in `data.js`, and the blocks appear.

**Screenshots**

1. Put the image in `assets/img/projects/<slug>/`. The slugs are `email-analysis`, `restaurant-management` and `caltrackr`.
2. In `assets/js/data.js`, add it to that project's `images` list:

```js
images: [
  {
    src: "assets/img/projects/email-analysis/dashboard.png",
    alt: {
      en: "Admin dashboard listing analyzed emails with their categories",
      tr: "Analiz edilen e-postaları kategorileriyle listeleyen yönetim paneli"
    },
    caption: { en: "Dashboard with classified emails", tr: "Sınıflandırılmış e-postaların yer aldığı panel" }
  }
],
```

Write `alt` as a description of what the picture shows, for people who cannot see it.

**A video file stored in this folder**

```js
video: {
  src: "assets/video/email-analysis-demo.mp4",
  poster: "assets/img/projects/email-analysis/poster.jpg",
  caption: { en: "Two-minute walkthrough", tr: "İki dakikalık tanıtım" }
},
```

`poster` is the still picture shown before playback. Use `poster: ""` if you have none.

**A video hosted elsewhere** (YouTube and Vimeo links are embedded; any other link is shown as a normal link)

```js
video: { url: "https://www.youtube.com/watch?v=VIDEO_ID", caption: { en: "Demo video", tr: "Tanıtım videosu" } },
```

**A live demo link**: set `links.live` to the address. Leave it `null` while there is none.

Practical limits:

- Screenshots: PNG or JPG, about 1600 px wide at most, compressed (for example with <https://squoosh.app>). Aim for under 300 KB each. Any shape works; images are never cropped or stretched.
- Video: MP4 (H.264). Keep each file small, ideally under 25 MB. GitHub rejects files over 100 MB. For longer recordings, upload to YouTube and use `url`.
- Before publishing, check screenshots for private data such as real email addresses, customer names or API keys.

## Rebuild the CV PDFs

Do this after every change to `cv.html`, `cv-tr.html` or `assets/css/cv.css`:

```bash
pwsh -File scripts/build-cv.ps1
```

The script opens each CV page in Microsoft Edge or Google Chrome without showing a window and saves two files:

- `assets/cv/Huseyin_Oguz_Cetin_CV.pdf` (English)
- `assets/cv/Huseyin_Oguz_Cetin_CV_TR.pdf` (Turkish)

It then reads the text back out of each PDF and checks that your name, the Turkish letters and the section headings are present and in order. It prints `PASS` or `FAIL` and the page count for each. The target is one A4 page per CV.

If the script cannot run, do it by hand: open the CV page in Chrome or Edge, press the Print button, choose "Save as PDF", paper size A4, default margins, turn off "Headers and footers", and save the file under the matching name above.

The link-preview picture (`assets/img/og-image.png`) is rebuilt with:

```bash
pwsh -File scripts/build-cv.ps1 -OgImage
```

No tool can promise a particular score in every applicant tracking system. What this CV does is follow the practices those systems handle well: one column, standard headings, a standard font, real text, and no tables, images or icons.

## Publish on GitHub Pages

These steps publish the site as your user site at `https://houzcetin.github.io/`.

1. On GitHub, create a new **public** repository named exactly `Houzcetin.github.io`. Do not add a README or licence there.
2. Open a terminal in this folder and run these commands one at a time:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Add portfolio website and CV"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/Houzcetin/Houzcetin.github.io.git
```

```bash
git push -u origin main
```

3. On GitHub, open the repository, then **Settings → Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. Wait a minute or two, then open <https://houzcetin.github.io/>. Check the pages, the project links and the CV download there.

To update the site later, edit the files and run `git add .`, `git commit -m "Describe the change"`, `git push`.

There is no build step, so no GitHub Actions workflow is needed.

### If you use a project repository instead

If the repository has another name, for example `portfolio`, the address becomes `https://houzcetin.github.io/portfolio/`. The Pages settings are the same.

Every link inside the site is relative, so navigation, styles, scripts, images, video and the CV download keep working under that sub-address without changes. Only the full addresses written out for search engines and link previews need updating:

- `index.html`: the `canonical`, `og:url`, `og:image` and `twitter:image` lines in `<head>`
- `scripts/og-image.html`: the address printed on the picture (then rebuild it with `-OgImage`)

## Responsive design and accessibility

- The layout is mobile-first and fluid. It was checked at 320, 375, 390, 768, 1024, 1440 and 1920 px wide, in phone landscape, and at a size equal to 200% zoom, with no sideways scrolling.
- Project cards go from one column on phones to two and three as space allows.
- A "Skip to main content" link is the first stop for keyboard users, every link and button shows a visible focus outline, and the mobile menu and the screenshot viewer work with the keyboard (Tab, Enter, Esc, arrow keys).
- The site follows the visitor's light or dark setting and turns off motion for visitors who ask for reduced motion.
