# TODO

Things the site and CV are waiting for. Nothing below is shown as a placeholder: until it is supplied, it is simply left out.

## Media

- [ ] Screenshots for the email analysis project → `assets/img/projects/email-analysis/`
- [ ] Screenshots for the restaurant project → `assets/img/projects/restaurant-management/`
- [ ] Screenshots for CalTrackr → `assets/img/projects/caltrackr/`
- [ ] Demo video for each project → `assets/video/`, or a YouTube/Vimeo link
- [ ] List each file in `assets/js/data.js` (see "Add screenshots and videos" in the README)
- [ ] Check screenshots for private data before publishing (real email addresses, customer names, keys)

## Details to confirm

- [ ] CalTrackr: your specific contributions. The site currently uses general team wording
- [ ] CalTrackr: whether to link a hosted version of the app. No live link is shown now
- [ ] GPA omitted until confirmed. Add it to `cv.html` and `index.html` only when you have the current value
- [ ] The `APIProject6` repository description says ASP.NET Core 6, while the original brief said 8. The site and CV use 6, as confirmed. Change it in `assets/js/data.js` and `cv.html` if that is wrong

## Turkish wording to confirm

The Turkish text was translated from the English brief. You are the native speaker, so read it through once. These names in particular were translated, not copied from an official source:

- [ ] Certificate titles: "Robotik Kodlama — Türk Hava Kurumu Üniversitesi" and "Web Tasarımı — Kadir Has Üniversitesi". Use the exact wording printed on the certificates
- [ ] Club name: "Yaşar Üniversitesi Dağcılık Kulübü", and the role "Başkan Yardımcısı"
- [ ] Internship title: "ASP.NET Core Geliştirici Stajyeri"
- [ ] Degree line: "Bilgisayar Mühendisliği (Lisans)"

They appear in `assets/js/tr.js` and `cv-tr.html`. Change both if you correct one.

## Optional

- [ ] Certificate dates or verification links
- [ ] Dates for the Mountaineering Club role
- [ ] Phone number on the CV (not needed on the public site)

## Every time content changes

- [ ] Update both languages (see "Edit the content" in the README)
- [ ] If a CV changed, run `pwsh -File scripts/build-cv.ps1` and confirm it prints PASS and one page for both PDFs

## Publishing

- [ ] Create the `Houzcetin.github.io` repository and push (steps in the README)
- [ ] Open https://houzcetin.github.io/ and check the pages, project links and CV download
