(function () {
  "use strict";

  var data = window.PORTFOLIO;
  var site = window.PortfolioSite;
  if (!data || !site) return;

  function makeElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }

  function makeExternalLink(href, label, className) {
    var link = makeElement("a", className, label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function clearRenderedChildren(parent, selector) {
    if (!parent) return;
    parent.querySelectorAll(selector).forEach(function (child) {
      child.remove();
    });
  }

  function render() {
    var projectGrid = document.getElementById("project-grid");
    var skillsGrid = document.getElementById("skills-grid");
    clearRenderedChildren(projectGrid, ".project-card");
    clearRenderedChildren(skillsGrid, ".skill-group");

    if (projectGrid && Array.isArray(data.projects)) {
      data.projects.forEach(function (project) {
        var card = makeElement("article", "project-card");
        var top = makeElement("div", "project-card__top");
        var status = makeElement("span", "status-label", site.pick(project.status));
        var heading = makeElement("h3", "", site.pick(project.title));
        var summary = makeElement("p", "project-card__summary", site.pick(project.summary));
        var tags = makeElement("ul", "tag-list");
        var actions = makeElement("div", "project-card__actions");
        var details = makeElement("a", "text-link", site.t("proj.viewDetails", "View details"));

        top.appendChild(status);
        card.appendChild(top);
        card.appendChild(heading);
        card.appendChild(summary);
        (project.tags || []).forEach(function (tag) {
          tags.appendChild(makeElement("li", "tag", tag));
        });
        card.appendChild(tags);
        details.href = "project.html?id=" + encodeURIComponent(project.slug) + "&lang=" + encodeURIComponent(site.getLang());
        actions.appendChild(details);
        if (project.links && project.links.repo) {
          var repoLabel = site.pick(project.links.repoLabel) || site.t("project.repo", "Repository");
          actions.appendChild(makeExternalLink(project.links.repo, repoLabel, "text-link"));
        }
        card.appendChild(actions);
        projectGrid.appendChild(card);
      });
    }

    if (skillsGrid && Array.isArray(data.skills)) {
      data.skills.forEach(function (group) {
        var card = makeElement("section", "skill-group");
        var heading = makeElement("h3", "", site.pick(group.group));
        var list = makeElement("ul", "skill-list");
        (group.items || []).forEach(function (skill) {
          list.appendChild(makeElement("li", "", skill));
        });
        card.appendChild(heading);
        card.appendChild(list);
        skillsGrid.appendChild(card);
      });
    }
  }

  render();
  site.onLanguageChange(render);
}());
