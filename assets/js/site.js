(function () {
  "use strict";

  var language = "en";
  var savedTheme = null;
  var textOriginals = new WeakMap();
  var attributeOriginals = new WeakMap();
  var languageQuery = new URLSearchParams(window.location.search).get("lang");

  function readLanguage() {
    try {
      var stored = window.localStorage.getItem("lang");
      return stored === "en" || stored === "tr" ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function saveLanguage(value) {
    try {
      window.localStorage.setItem("lang", value);
    } catch (error) {
      /* The page still works when storage is blocked. */
    }
  }

  function readTheme() {
    try {
      var stored = window.localStorage.getItem("theme");
      return stored === "light" || stored === "dark" ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(value) {
    try {
      window.localStorage.setItem("theme", value);
    } catch (error) {
      /* The theme can still change for this page view. */
    }
  }

  if (languageQuery === "en" || languageQuery === "tr") {
    language = languageQuery;
    saveLanguage(language);
  } else {
    language = readLanguage() || "en";
  }

  savedTheme = readTheme();

  function t(key, englishFallback) {
    if (language === "tr" && window.PORTFOLIO_TR) {
      var translated = window.PORTFOLIO_TR[key];
      if (typeof translated === "string" && translated.length > 0) return translated;
    }
    return englishFallback;
  }

  function pick(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && ("en" in value || "tr" in value)) {
      if (language === "tr") {
        if (typeof value.tr === "string" && value.tr.length > 0) return value.tr;
        return typeof value.en === "string" ? value.en : "";
      }
      return typeof value.en === "string" ? value.en : "";
    }
    return "";
  }

  function translateAttributes(element) {
    var specification = element.getAttribute("data-i18n-attr");
    if (!specification) return;
    var originals = attributeOriginals.get(element);
    if (!originals) {
      originals = Object.create(null);
      attributeOriginals.set(element, originals);
    }
    specification.split(";").forEach(function (part) {
      var separator = part.indexOf(":");
      if (separator < 1) return;
      var name = part.slice(0, separator).trim();
      var key = part.slice(separator + 1).trim();
      if (!name || !key) return;
      if (!Object.prototype.hasOwnProperty.call(originals, name)) {
        originals[name] = element.getAttribute(name);
      }
      var english = originals[name];
      var value = language === "tr" ? t(key, english || "") : english;
      if (value === null) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value);
      }
    });
  }

  function withLanguageQuery(href) {
    var hashPosition = href.indexOf("#");
    var hash = hashPosition < 0 ? "" : href.slice(hashPosition);
    var address = hashPosition < 0 ? href : href.slice(0, hashPosition);
    var queryPosition = address.indexOf("?");
    var path = queryPosition < 0 ? address : address.slice(0, queryPosition);
    var query = queryPosition < 0 ? "" : address.slice(queryPosition + 1);
    var parameters = new URLSearchParams(query);
    parameters.set("lang", language);
    return path + "?" + parameters.toString() + hash;
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      if (!textOriginals.has(element)) textOriginals.set(element, element.textContent);
      var english = textOriginals.get(element);
      element.textContent = language === "tr" ? t(element.getAttribute("data-i18n"), english) : english;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(translateAttributes);
    document.querySelectorAll("a[data-cv-link]").forEach(function (link) {
      var kind = link.getAttribute("data-cv-link");
      if (kind === "page") link.setAttribute("href", language === "tr" ? "cv-tr.html" : "cv.html");
      if (kind === "pdf") {
        link.setAttribute("href", language === "tr"
          ? "assets/cv/Huseyin_Oguz_Cetin_CV_TR.pdf"
          : "assets/cv/Huseyin_Oguz_Cetin_CV.pdf");
      }
    });
    document.querySelectorAll('a[href^="index.html"], a[href^="project.html"]').forEach(function (link) {
      link.setAttribute("href", withLanguageQuery(link.getAttribute("href")));
    });
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === language));
    });
    updateThemeButton();
    document.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { lang: language } }));
  }

  function getTheme() {
    if (savedTheme) return savedTheme;
    return colorSchemeQuery && colorSchemeQuery.matches ? "dark" : "light";
  }

  function updateThemeButton() {
    if (!themeButton) return;
    var darkIsActive = getTheme() === "dark";
    themeButton.setAttribute("aria-pressed", String(darkIsActive));
    themeButton.setAttribute("aria-label", darkIsActive
      ? t("controls.themeToLight", "Switch to light theme")
      : t("controls.themeToDark", "Switch to dark theme"));
  }

  function applyTheme() {
    if (savedTheme) {
      document.documentElement.dataset.theme = savedTheme;
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var darkIsActive = getTheme() === "dark";
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", darkIsActive ? "#101b20" : "#f4f7f9");
    updateThemeButton();
  }

  function setLang(value) {
    if (value !== "en" && value !== "tr") return;
    language = value;
    saveLanguage(language);
    applyLanguage();
  }

  function pickLanguageFromButton(value) {
    setLang(value);
    if (window.location.protocol === "file:") return;
    try {
      var address = new URL(window.location.href);
      if (!address.searchParams.has("lang")) return;
      address.searchParams.delete("lang");
      window.history.replaceState(window.history.state, "", address.pathname + address.search + address.hash);
    } catch (error) {
      /* Some static hosts do not allow address-bar updates. */
    }
  }

  function onLanguageChange(callback) {
    document.addEventListener("portfolio:languagechange", callback);
  }

  var controls = document.querySelector(".site-controls");
  var themeButton = document.querySelector(".theme-toggle");
  var colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  document.querySelectorAll(".lang-switch [data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      pickLanguageFromButton(button.getAttribute("data-lang"));
    });
  });

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      savedTheme = getTheme() === "dark" ? "light" : "dark";
      saveTheme(savedTheme);
      applyTheme();
    });
  }

  if (typeof colorSchemeQuery.addEventListener === "function") {
    colorSchemeQuery.addEventListener("change", function () {
      if (!savedTheme) applyTheme();
    });
  } else if (typeof colorSchemeQuery.addListener === "function") {
    colorSchemeQuery.addListener(function () {
      if (!savedTheme) applyTheme();
    });
  }

  if (controls) controls.removeAttribute("hidden");
  applyTheme();
  applyLanguage();

  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.getElementById("site-nav");
  var narrowScreen = window.matchMedia("(max-width: 68rem)");

  if (menuButton && navigation) {
    function setMenuMode() {
      if (narrowScreen.matches) {
        menuButton.hidden = false;
        menuButton.setAttribute("aria-expanded", "false");
        navigation.hidden = true;
      } else {
        menuButton.hidden = true;
        menuButton.setAttribute("aria-expanded", "true");
        navigation.hidden = false;
      }
    }

    function closeMenu() {
      if (!narrowScreen.matches) return;
      menuButton.setAttribute("aria-expanded", "false");
      navigation.hidden = true;
    }

    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      navigation.hidden = expanded;
    });
    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !narrowScreen.matches) return;
      var wasOpen = menuButton.getAttribute("aria-expanded") === "true";
      closeMenu();
      if (wasOpen) menuButton.focus();
    });
    if (typeof narrowScreen.addEventListener === "function") {
      narrowScreen.addEventListener("change", setMenuMode);
    } else {
      narrowScreen.addListener(setMenuMode);
    }
    setMenuMode();
  }

  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  window.PortfolioSite = {
    getLang: function () { return language; },
    setLang: setLang,
    t: t,
    pick: pick,
    onLanguageChange: onLanguageChange
  };
}());
