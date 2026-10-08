/*
 * Beginner guide: update this file to add project media or links.
 *
 * Two languages: text that visitors read is written as a pair,
 *   { en: "English text", tr: "Türkçe metin" }
 * The site shows the one that matches the selected language. If tr is missing,
 * the English text is shown. Technology names and tags stay as plain text.
 *
 * Screenshots: place each image in assets/img/projects/<slug>/, then add
 *   {
 *     src: "assets/img/projects/<slug>/screen.png",
 *     alt: { en: "What the image shows", tr: "Görselde ne olduğu" },
 *     caption: { en: "Short caption", tr: "Kısa açıklama" }
 *   }
 * to that project's images array.
 * Local MP4: place the file in assets/video/ and set
 *   video: { src: "assets/video/demo.mp4", poster: "assets/img/projects/<slug>/poster.jpg", caption: { en: "Demo caption", tr: "Video açıklaması" } }
 * Use an empty string for poster if there is no poster image.
 * External video: set video: { url: "https://...", caption: { en: "Demo caption", tr: "Video açıklaması" } }.
 * Live project: add a URL as links.live. Leave it null when no live project is available.
 * All src paths are relative to the site root folder, including when this site
 * is opened directly from disk.
 * Empty fields are simply not shown: a project with images: [] and video: null
 * has no Screenshots or Demo video block on its page.
 *
 * This file holds the skills and the projects. Name, email, education,
 * experience and activities are plain HTML in index.html (English) with their
 * Turkish versions in assets/js/tr.js. The CVs are cv.html and cv-tr.html.
 */
window.PORTFOLIO = {
  skills: [
    { group: { en: "Languages", tr: "Programlama Dilleri" }, items: ["C#", "C", "C++", "Python", "JavaScript/TypeScript", "SQL", "Assembly"] },
    { group: { en: "Web / Backend", tr: "Web / Backend" }, items: ["ASP.NET Core", "MVC", "REST APIs", "Entity Framework Core", "SignalR", "Node.js", "Express", "HTML", "CSS", "Bootstrap"] },
    { group: { en: "Mobile", tr: "Mobil" }, items: ["React Native", "Expo"] },
    { group: { en: "Databases", tr: "Veritabanları" }, items: ["MSSQL", "Firebase/Firestore"] },
    { group: { en: "Tools", tr: "Araçlar" }, items: ["Git", "GitHub", "Visual Studio", "SSMS", "Postman"] },
    { group: { en: "Integrations", tr: "Entegrasyonlar" }, items: ["MailKit", "OpenAI API"] }
  ],
  projects: [
    {
      slug: "email-analysis",
      title: {
        en: "AI-Powered Email Analysis and Automation System",
        tr: "Yapay Zekâ Destekli E-posta Analiz ve Otomasyon Sistemi"
      },
      summary: {
        en: "A corporate email workflow that reads, analyzes, categorizes, and stores messages, with AI-assisted response drafts for selected emails.",
        tr: "Kurumsal e-postaları okuyan, analiz eden, kategorilere ayıran ve kaydeden; seçilen e-postalar için yapay zekâ destekli yanıt taslağı hazırlayan bir sistem."
      },
      status: { en: "Internship project", tr: "Staj projesi" },
      tags: ["C#", "ASP.NET Core", "MSSQL", "Entity Framework Core", "MailKit", "OpenAI API"],
      highlights: [
        {
          en: "Classifies messages into ERP, CRM, HR, Finance, E-Transformation, Reporting, and General Support categories.",
          tr: "Mesajları ERP, CRM, İK, Finans, E-Dönüşüm, Raporlama ve Genel Destek kategorilerine ayırır."
        },
        {
          en: "Generates an AI-assisted response draft for a selected email.",
          tr: "Seçilen bir e-posta için yapay zekâ destekli yanıt taslağı oluşturur."
        }
      ],
      problem: {
        en: "Corporate emails need to be reviewed, categorized, and stored in a consistent way.",
        tr: "Kurumsal e-postaların tutarlı bir biçimde incelenmesi, kategorilere ayrılması ve saklanması gerekir."
      },
      solution: {
        en: "Built a system that reads and analyzes corporate emails, assigns them to the listed categories, stores them in MSSQL, and generates a response draft for a selected email.",
        tr: "Kurumsal e-postaları okuyup analiz eden, belirtilen kategorilere ayıran, MSSQL'e kaydeden ve seçilen bir e-posta için yanıt taslağı oluşturan bir sistem geliştirdim."
      },
      role: {
        en: "Individual internship project developed at Sentez Yazılım; improved based on feedback and presented in an online meeting.",
        tr: "Sentez Yazılım'da bireysel olarak geliştirdiğim staj projesi; geri bildirimler doğrultusunda iyileştirildi ve çevrim içi bir toplantıda sunuldu."
      },
      lessons: {
        en: "Combining message handling, category classification, and database storage requires clear boundaries between each step.",
        tr: "Mesaj işleme, kategori sınıflandırma ve veritabanına kaydetme adımlarını bir araya getirmek, adımlar arasında net sınırlar gerektiriyor."
      },
      links: {
        repo: "https://github.com/Houzcetin/MailAutomation",
        repoLabel: { en: "Repository", tr: "Depo" },
        live: null
      },
      images: [],
      video: null
    },
    {
      slug: "restaurant-management",
      title: {
        en: "Restaurant Management and Reservation System",
        tr: "Restoran Yönetim ve Rezervasyon Sistemi"
      },
      summary: {
        en: "A restaurant management project with separate Web API and MVC user-interface projects, CRUD features, and AI-assisted tools.",
        tr: "Ayrı Web API ve MVC kullanıcı arayüzü projelerinden oluşan, CRUD işlevleri ve yapay zekâ destekli araçlar içeren bir restoran yönetim projesi."
      },
      status: { en: "Personal project", tr: "Kişisel proje" },
      tags: ["ASP.NET Core 6", "Web API", "MVC", "EF Core", "MSSQL", "SignalR", "AutoMapper", "FluentValidation", "AI APIs"],
      highlights: [
        {
          en: "CRUD functionality for menus, products, reservations, messages, and events.",
          tr: "Menüler, ürünler, rezervasyonlar, mesajlar ve etkinlikler için CRUD işlevleri."
        },
        {
          en: "Includes a chatbot, recipe assistance, and AI-powered menu recommendations.",
          tr: "Sohbet botu, tarif yardımı ve yapay zekâ destekli menü önerileri içerir."
        }
      ],
      problem: {
        en: "Restaurant content and reservations need a structured way to be managed through an application.",
        tr: "Restoran içeriğinin ve rezervasyonların bir uygulama üzerinden düzenli biçimde yönetilmesi gerekir."
      },
      solution: {
        en: "Built separate Web API and MVC projects with CRUD functionality for restaurant content, using DTOs, dependency injection, mapping, and validation.",
        tr: "Restoran içeriği için CRUD işlevleri sunan ayrı Web API ve MVC projeleri geliştirdim; DTO'lar, bağımlılık enjeksiyonu, nesne eşleme ve doğrulama kullandım."
      },
      role: {
        en: "Individual personal project.",
        tr: "Bireysel kişisel proje."
      },
      lessons: {
        en: "Separating API endpoints from the MVC interface and using DTOs and validation helps organize application responsibilities.",
        tr: "API uç noktalarını MVC arayüzünden ayırmak ve DTO ile doğrulama kullanmak, uygulamadaki sorumlulukları düzenlemeye yardımcı oluyor."
      },
      links: {
        repo: "https://github.com/Houzcetin/APIProject6",
        repoLabel: { en: "Repository", tr: "Depo" },
        live: null
      },
      images: [],
      video: null
    },
    {
      slug: "caltrackr",
      title: {
        en: "CalTrackr — Team Mobile Application",
        tr: "CalTrackr — Ekip Mobil Uygulaması"
      },
      summary: {
        en: "A team-built mobile application for calorie tracking, weekly planning, recipes, favorites, and user account operations.",
        tr: "Kalori takibi, haftalık planlama, tarifler, favoriler ve kullanıcı hesabı işlemleri sunan, ekip olarak geliştirilen bir mobil uygulama."
      },
      status: { en: "Team project", tr: "Ekip projesi" },
      tags: ["React Native", "Expo", "TypeScript", "Node.js", "Express", "Firebase/Firestore"],
      highlights: [
        {
          en: "Team-built features include calorie tracking, weekly planning, recipes, favorites, and user account operations.",
          tr: "Ekipçe geliştirilen özellikler: kalori takibi, haftalık planlama, tarifler, favoriler ve kullanıcı hesabı işlemleri."
        }
      ],
      problem: {
        en: "The project brings calorie tracking and related planning features together in a mobile application.",
        tr: "Proje, kalori takibini ve ilgili planlama özelliklerini tek bir mobil uygulamada bir araya getiriyor."
      },
      solution: {
        en: "The project team built a mobile application with calorie tracking, weekly planning, recipes, favorites, and user account operations.",
        tr: "Proje ekibi; kalori takibi, haftalık planlama, tarifler, favoriler ve kullanıcı hesabı işlemleri içeren bir mobil uygulama geliştirdi."
      },
      role: {
        en: "Contributed to analysis, planning, development, testing, presentation, and team coordination as part of the project team.",
        tr: "Proje ekibinin bir üyesi olarak analiz, planlama, geliştirme, test, sunum ve ekip koordinasyonuna katkıda bulundum."
      },
      lessons: {
        en: "Contributing across planning, development, testing, and presentation reinforced the value of coordination within a project team.",
        tr: "Planlama, geliştirme, test ve sunum aşamalarına katkıda bulunmak, proje ekibi içinde koordinasyonun önemini pekiştirdi."
      },
      links: {
        repo: "https://github.com/denizsafak/caltrackr",
        repoLabel: { en: "Team repository", tr: "Ekip deposu" },
        live: null
      },
      images: [],
      video: null
    }
  ]
};
