(function () {
  "use strict";

  var data = window.PORTFOLIO;
  var site = window.PortfolioSite;
  var root = document.getElementById("project-content");
  if (!data || !site || !root) return;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function addAnchor(parent, href, label, className, external) {
    var anchor = element("a", className, label);
    anchor.href = href;
    if (external) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    parent.appendChild(anchor);
    return anchor;
  }

  function indexHref(hash) {
    return "index.html?lang=" + encodeURIComponent(site.getLang()) + hash;
  }

  function projectHref(slug) {
    return "project.html?id=" + encodeURIComponent(slug) + "&lang=" + encodeURIComponent(site.getLang());
  }

  var sectionLabelFallbacks = {
    "project.problem": "Problem",
    "project.solution": "Solution",
    "project.role": "My role",
    "project.lessons": "Lessons learned"
  };

  function addTextSection(parent, key, bodyText) {
    var body = site.pick(bodyText);
    if (!body || !body.trim()) return;
    var section = element("section", "detail-section");
    section.appendChild(element("h2", "", site.t(key, sectionLabelFallbacks[key])));
    section.appendChild(element("p", "", body));
    parent.appendChild(section);
  }

  function validHttpUrl(value) {
    try {
      var parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function videoEmbedUrl(value) {
    var parsed = validHttpUrl(value);
    if (!parsed) return null;
    var host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") {
      var shortId = parsed.pathname.split("/").filter(Boolean)[0];
      return shortId ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(shortId) : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      var videoId = parsed.searchParams.get("v");
      if (!videoId && parsed.pathname.indexOf("/embed/") === 0) {
        videoId = parsed.pathname.slice("/embed/".length).split("/")[0];
      }
      return videoId ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(videoId) : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      var vimeoId = parsed.pathname.split("/").filter(Boolean).pop();
      return vimeoId && /^\d+$/.test(vimeoId) ? "https://player.vimeo.com/video/" + vimeoId : null;
    }
    return null;
  }

  function renderTags(parent, tags) {
    if (!Array.isArray(tags) || !tags.length) return;
    var list = element("ul", "tag-list detail-tags");
    tags.forEach(function (tag) {
      list.appendChild(element("li", "tag", site.pick(tag)));
    });
    parent.appendChild(list);
  }

  function renderBullets(parent, key, englishFallback, items) {
    if (!Array.isArray(items) || !items.length) return;
    var section = element("section", "detail-section");
    section.appendChild(element("h2", "", site.t(key, englishFallback)));
    var list = element("ul", "content-list");
    items.forEach(function (item) {
      var text = site.pick(item);
      if (text) list.appendChild(element("li", "", text));
    });
    if (list.children.length) {
      section.appendChild(list);
      parent.appendChild(section);
    }
  }

  function renderGallery(parent, images, title) {
    if (!Array.isArray(images) || !images.length) return;
    var section = element("section", "detail-section");
    section.appendChild(element("h2", "", site.t("project.screenshots", "Screenshots")));
    var gallery = element("div", "gallery");
    var dialog = element("dialog", "lightbox");
    dialog.setAttribute("aria-label", site.t("lightbox.label", "Screenshot viewer"));
    var dialogPanel = element("div", "lightbox__panel");
    var toolbar = element("div", "lightbox__toolbar");
    var previous = element("button", "lightbox__button", site.t("lightbox.prev", "Previous"));
    var close = element("button", "lightbox__button lightbox__close", site.t("lightbox.close", "Close"));
    var next = element("button", "lightbox__button", site.t("lightbox.next", "Next"));
    var image = element("img", "lightbox__image");
    var caption = element("p", "lightbox__caption");
    var activeIndex = 0;
    var opener = null;

    previous.type = "button";
    previous.setAttribute("aria-label", site.t("lightbox.prevLabel", "Previous screenshot"));
    next.type = "button";
    next.setAttribute("aria-label", site.t("lightbox.nextLabel", "Next screenshot"));
    close.type = "button";
    close.setAttribute("aria-label", site.t("lightbox.closeLabel", "Close screenshot viewer"));
    image.alt = "";
    image.decoding = "async";
    previous.hidden = images.length < 2;
    next.hidden = images.length < 2;
    toolbar.appendChild(previous);
    toolbar.appendChild(close);
    toolbar.appendChild(next);
    dialogPanel.appendChild(toolbar);
    dialogPanel.appendChild(image);
    dialogPanel.appendChild(caption);
    dialog.appendChild(dialogPanel);

    function imageAlt(item) {
      return site.pick(item.alt) || title + " " + site.t("project.screenshotFallback", "screenshot");
    }

    function showImage(index) {
      activeIndex = (index + images.length) % images.length;
      var selected = images[activeIndex];
      var selectedCaption = site.pick(selected.caption);
      image.src = selected.src;
      image.alt = imageAlt(selected);
      caption.textContent = selectedCaption;
      caption.hidden = !selectedCaption;
    }

    images.forEach(function (item, index) {
      var figure = element("figure", "gallery__item");
      var button = element("button", "gallery__button");
      var thumbnail = element("img", "gallery__thumbnail");
      var itemCaption = site.pick(item.caption);
      var figcaption = element("figcaption", "", itemCaption);
      button.type = "button";
      button.setAttribute("aria-label", site.t("lightbox.open", "Open screenshot") + " " + String(index + 1) + ": " + imageAlt(item));
      thumbnail.src = item.src;
      thumbnail.alt = site.pick(item.alt) || title + " " + site.t("project.screenshotFallback", "screenshot");
      thumbnail.loading = "lazy";
      thumbnail.decoding = "async";
      button.appendChild(thumbnail);
      button.addEventListener("click", function () {
        opener = button;
        showImage(index);
        if (typeof dialog.showModal === "function") dialog.showModal();
        close.focus();
      });
      figure.appendChild(button);
      if (itemCaption) figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });

    previous.addEventListener("click", function () { showImage(activeIndex - 1); });
    next.addEventListener("click", function () { showImage(activeIndex + 1); });
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("keydown", function (event) {
      if (images.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(activeIndex + 1);
      }
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      if (opener) opener.focus();
    });
    section.appendChild(gallery);
    section.appendChild(dialog);
    parent.appendChild(section);
  }

  function renderVideo(parent, video, title) {
    if (!video) return;
    var caption = site.pick(video.caption);
    var section = element("section", "detail-section");
    section.appendChild(element("h2", "", site.t("project.video", "Demo video")));
    if (video.src) {
      var wrapper = element("div", "video-frame");
      var player = element("video", "video-frame__media");
      player.controls = true;
      player.preload = "metadata";
      player.playsInline = true;
      player.src = video.src;
      if (video.poster) player.poster = video.poster;
      wrapper.appendChild(player);
      section.appendChild(wrapper);
      if (caption) section.appendChild(element("p", "media-caption", caption));
      parent.appendChild(section);
      return;
    }
    if (video.url) {
      var parsed = validHttpUrl(video.url);
      if (!parsed) return;
      var embed = videoEmbedUrl(video.url);
      if (embed) {
        var frameWrap = element("div", "video-frame");
        var frame = element("iframe", "video-frame__media");
        frame.src = embed;
        frame.loading = "lazy";
        frame.title = caption || site.t("project.videoFor", "Demo video for") + " " + title;
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.allowFullscreen = true;
        frameWrap.appendChild(frame);
        section.appendChild(frameWrap);
      } else {
        addAnchor(section, parsed.href, site.t("project.watch", "Watch the demo video"), "text-link", true);
      }
      if (caption) section.appendChild(element("p", "media-caption", caption));
      parent.appendChild(section);
    }
  }

  var requestedId = new URLSearchParams(window.location.search).get("id");
  var projects = Array.isArray(data.projects) ? data.projects : [];
  var projectIndex = projects.findIndex(function (project) {
    return project.slug === requestedId;
  });
  var project = projectIndex >= 0 ? projects[projectIndex] : null;

  function renderNotFound() {
    var missingTitle = site.t("project.notFoundTitle", "Project not found");
    document.title = missingTitle + " — Oğuz Çetin";
    var missing = element("section", "not-found");
    missing.appendChild(element("p", "eyebrow", site.t("project.notFoundEyebrow", "Portfolio projects")));
    missing.appendChild(element("h1", "", missingTitle));
    missing.appendChild(element("p", "", site.t("project.notFoundText", "The project link may be incorrect or the project may no longer be available.")));
    addAnchor(missing, indexHref("#projects"), site.t("project.back", "Back to projects"), "button button--primary", false);
    if (projects.length) {
      var all = element("section", "detail-section not-found__list");
      all.appendChild(element("h2", "", site.t("project.browseAll", "Browse all projects")));
      var list = element("ul", "content-list");
      projects.forEach(function (item) {
        var row = element("li");
        addAnchor(row, projectHref(item.slug), site.pick(item.title), "text-link", false);
        list.appendChild(row);
      });
      all.appendChild(list);
      missing.appendChild(all);
    }
    root.appendChild(missing);
  }

  function renderProject() {
    var title = site.pick(project.title);
    document.title = title + " — Oğuz Çetin";
    var intro = element("div", "project-detail__intro");
    var back = addAnchor(intro, indexHref("#projects"), "", "back-link", false);
    var arrow = element("span", "", "←");
    arrow.setAttribute("aria-hidden", "true");
    back.appendChild(arrow);
    back.appendChild(element("span", "", site.t("project.back", "Back to projects")));
    back.setAttribute("aria-label", site.t("project.back", "Back to projects"));
    intro.appendChild(element("span", "status-label", site.pick(project.status)));
    intro.appendChild(element("h1", "project-detail__title", title));
    var summary = site.pick(project.summary);
    if (summary) intro.appendChild(element("p", "project-detail__summary", summary));
    renderTags(intro, project.tags);
    root.appendChild(intro);

    var body = element("div", "project-detail__body");
    addTextSection(body, "project.problem", project.problem);
    addTextSection(body, "project.solution", project.solution);
    addTextSection(body, "project.role", project.role);
    renderBullets(body, "project.highlights", "Highlights", project.highlights);
    if (Array.isArray(project.tags) && project.tags.length) {
      var stack = element("section", "detail-section");
      stack.appendChild(element("h2", "", site.t("project.stack", "Technology stack")));
      stack.appendChild(element("p", "", project.tags.map(site.pick).join(", ")));
      body.appendChild(stack);
    }
    renderGallery(body, project.images, title);
    renderVideo(body, project.video, title);
    addTextSection(body, "project.lessons", project.lessons);

    var linkRows = [];
    if (project.links && project.links.repo) {
      linkRows.push({
        url: project.links.repo,
        label: site.pick(project.links.repoLabel) || site.t("project.repo", "Repository")
      });
    }
    if (project.links && project.links.live) {
      linkRows.push({ url: project.links.live, label: site.t("project.live", "Visit the live project") });
    }
    if (linkRows.length) {
      var links = element("section", "detail-section detail-links");
      links.appendChild(element("h2", "", site.t("project.links", "Links")));
      linkRows.forEach(function (link) {
        var safeUrl = validHttpUrl(link.url);
        if (safeUrl) addAnchor(links, safeUrl.href, link.label, "text-link", true);
      });
      if (links.querySelector("a")) body.appendChild(links);
    }
    root.appendChild(body);

    var pager = element("nav", "project-pager");
    pager.setAttribute("aria-label", site.t("project.pager", "Project navigation"));
    if (projectIndex > 0) {
      var previousProject = projects[projectIndex - 1];
      var prevLink = addAnchor(pager, projectHref(previousProject.slug), "← " + site.pick(previousProject.title), "project-pager__link", false);
      prevLink.appendChild(element("span", "project-pager__label", site.t("project.prev", "Previous project")));
    }
    if (projectIndex < projects.length - 1) {
      var nextProject = projects[projectIndex + 1];
      var nextLink = addAnchor(pager, projectHref(nextProject.slug), site.pick(nextProject.title) + " →", "project-pager__link project-pager__link--next", false);
      nextLink.appendChild(element("span", "project-pager__label", site.t("project.next", "Next project")));
    }
    if (pager.children.length) root.appendChild(pager);
  }

  function render() {
    var openDialog = root.querySelector("dialog[open]");
    if (openDialog && typeof openDialog.close === "function") openDialog.close();
    while (root.firstChild) root.removeChild(root.firstChild);
    if (project) {
      renderProject();
    } else {
      renderNotFound();
    }
  }

  render();
  site.onLanguageChange(render);
}());
