(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function closest(element, selector) {
    return element && element.closest ? element.closest(selector) : null;
  }

  function parseData(element, attr) {
    try {
      return JSON.parse(element.getAttribute(attr) || "{}");
    } catch (error) {
      return {};
    }
  }

  function getScreenConfig(data) {
    return data.screen || data["(max-width: 991px)"] || {};
  }

  function setupPageClass() {
    var page = window.location.pathname.split("/").pop() || "index.html";

    if (/^(novosti|[123])\.html$/.test(page)) {
      document.body.classList.add("vetnas-page-news");
    }

    if (page === "uslugi-i-tseny.html") {
      document.body.classList.add("vetnas-page-services");
    }

    document.querySelectorAll(".localaboutus__price-title, .localaboutus__price").forEach(function (element) {
      element.remove();
    });
  }

  function openPanel() {
    document.body.classList.add("vetnas-panel-open");
  }

  function closePanel() {
    document.body.classList.remove("vetnas-panel-open");
  }

  function setupPanel() {
    document.addEventListener("click", function (event) {
      if (closest(event.target, '[class*="side-panel__button-open"]')) {
        event.preventDefault();
        openPanel();
      }

      if (
        closest(event.target, '[class*="side-panel__button-close"]') ||
        closest(event.target, '[class*="side-panel__mask"]')
      ) {
        event.preventDefault();
        closePanel();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePanel();
        closePopups();
      }
    });
  }

  function setupDropdowns() {
    document.addEventListener("click", function (event) {
      var button = closest(event.target, '[class*="dropdown__button"]');
      if (!button) {
        document.querySelectorAll(".dropdown.vetnas-open, [class*='dropdown--'].vetnas-open").forEach(function (item) {
          item.classList.remove("vetnas-open");
        });
        return;
      }

      var dropdown = closest(button, ".dropdown, [class*='dropdown--']");
      if (!dropdown) {
        return;
      }

      event.preventDefault();
      var wasOpen = dropdown.classList.contains("vetnas-open");
      document.querySelectorAll(".dropdown.vetnas-open, [class*='dropdown--'].vetnas-open").forEach(function (item) {
        item.classList.remove("vetnas-open");
      });
      dropdown.classList.toggle("vetnas-open", !wasOpen);
      button.setAttribute("aria-expanded", String(!wasOpen));
    });
  }

  function closePopups() {
    document.querySelectorAll(".mosaic-popup.vetnas-popup-open").forEach(function (popup) {
      popup.classList.remove("vetnas-popup-open");
    });
  }

  function openPopup(id) {
    if (!id || id === "none") {
      return false;
    }

    var popup = document.getElementById(id);
    if (!popup) {
      return false;
    }

    popup.classList.add("vetnas-popup-open");
    return true;
  }

  function setupPopupButtons() {
    document.addEventListener("click", function (event) {
      var trigger = closest(event.target, "[data-do-link_universal]");
      if (!trigger) {
        return;
      }

      var data = parseData(trigger, "data-do-link_universal");
      var config = getScreenConfig(data);
      if (config.popup && config.popup !== "none") {
        if (openPopup(config.popup)) {
          event.preventDefault();
        }
      }
    });

    document.addEventListener("click", function (event) {
      if (
        closest(event.target, '[class*="mosaic-popup__close"]') ||
        closest(event.target, '[class*="mosaic-popup__inner-bg"]') === event.target
      ) {
        event.preventDefault();
        closePopups();
      }
    });
  }

  function setupAnimations() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-do-animation]"));

    function applyAnimation(element) {
      if (element.dataset.vetnasAnimated === "1") {
        return;
      }

      var items = parseData(element, "data-do-animation");
      var item = Array.isArray(items) ? items[0] : null;
      var animation = item && item.animation ? item.animation : {};
      var name = animation.name || "fadeIn";
      var duration = Math.max(1, Math.min(10, Math.round(Number(animation.duration) || 1)));
      var delay = Math.max(0, Math.min(10, Math.round(Number(animation.delay) || 0)));

      element.classList.add("ms-animator", "ms-animator-" + name, "ms-animator-d" + duration);
      if (delay) {
        element.classList.add("ms-animator-s" + delay);
      }
      if (animation.infinite || animation.loop) {
        element.classList.add("ms-animator-i");
      }
      element.classList.add("ms-animator-visible");
      element.dataset.vetnasAnimated = "1";
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            applyAnimation(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      nodes.forEach(function (node) {
        observer.observe(node);
      });
    } else {
      nodes.forEach(applyAnimation);
    }
  }

  function setupMaps() {
    document.querySelectorAll("[data-do-map]").forEach(function (map) {
      if (map.querySelector("iframe")) {
        return;
      }

      var data = parseData(map, "data-do-map");
      var config = getScreenConfig(data);
      var center = String(config.center || "55.572556, 38.233634").split(",");
      var lat = parseFloat(center[0]);
      var lon = parseFloat(center[1]);
      var zoom = parseInt(config.zoom || "18", 10);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        lat = 55.572556;
        lon = 38.233634;
      }

      var iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = "https://yandex.ru/map-widget/v1/?ll=" + encodeURIComponent(lon + "," + lat) +
        "&z=" + encodeURIComponent(zoom) +
        "&pt=" + encodeURIComponent(lon + "," + lat + ",pm2rdm");
      iframe.title = "Yandex map";
      map.appendChild(iframe);
    });
  }

  function setupStaticForms() {
    document.addEventListener("submit", function (event) {
      var form = event.target;
      if (!form || !form.classList || !form.classList.contains("mosaic-form__form")) {
        return;
      }

      event.preventDefault();
      var message = form.querySelector(".vetnas-form-message");
      if (!message) {
        message = document.createElement("div");
        message.className = "vetnas-form-message";
        message.textContent = "Спасибо! Заявка визуально принята. Для реальной отправки формы нужно подключить обработчик или внешний сервис.";
        form.appendChild(message);
      }
      message.hidden = false;
    });
  }

  function setupImageZoom() {
    var lightbox = document.createElement("div");
    var image = document.createElement("img");
    var close = document.createElement("button");

    lightbox.className = "vetnas-lightbox";
    close.className = "vetnas-lightbox__close";
    close.type = "button";
    close.setAttribute("aria-label", "Закрыть");
    close.textContent = "×";

    lightbox.appendChild(image);
    lightbox.appendChild(close);
    document.body.appendChild(lightbox);

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      image.removeAttribute("src");
      image.removeAttribute("alt");
    }

    document.addEventListener("click", function (event) {
      var holder = closest(event.target, "[data-do-image]");
      if (!holder) {
        return;
      }

      var config = getScreenConfig(parseData(holder, "data-do-image"));
      if (!config.zoomOnClick) {
        return;
      }

      var img = holder.querySelector("img");
      if (!img) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      image.src = img.currentSrc || img.getAttribute("src") || img.src;
      image.alt = img.alt || "";
      lightbox.classList.add("is-open");
    }, true);

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target === close) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });
  }

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getPageTitle() {
    var heading = document.querySelector("h1, .page-title, .g-page-article__name");
    var title = cleanText(heading ? heading.textContent : "");
    if (!title || title.toUpperCase() === "ГЛАВНАЯ") {
      title = cleanText(document.title).replace(/\s*[-|]\s*.*$/, "");
    }
    return title || "Ветеринар на связи";
  }

  function getMetaContent(name) {
    var meta = document.querySelector('meta[name="' + name + '"]');
    return cleanText(meta ? meta.getAttribute("content") : "");
  }

  function addJsonLd(data) {
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function getSiteHomeUrl(url) {
    var current = new URL(url);
    var parts = current.pathname.split("/").filter(Boolean);
    var basePath = parts[0] === "vetnas" ? "/vetnas/" : "/";
    return current.origin + basePath;
  }

  function getBreadcrumbs(url, homeUrl, title) {
    var links = Array.prototype.slice.call(document.querySelectorAll(".mosaic-crumbs a, .breadcrumb a"));
    var items = links.map(function (link, index) {
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": cleanText(link.textContent) || "Главная",
        "item": new URL(link.getAttribute("href") || "./", url).href
      };
    }).filter(function (item) {
      return item.name;
    });

    if (!items.length) {
      items.push({
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": homeUrl
      });
    }

    if (items[items.length - 1].item !== url) {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": title,
        "item": url
      });
    }

    return items;
  }

  function setupStructuredData() {
    var url = window.location.href.split("#")[0];
    var homeUrl = getSiteHomeUrl(url);
    var page = window.location.pathname.split("/").pop() || "index.html";
    var title = getPageTitle();
    var description = getMetaContent("description") || "Ветеринарная клиника экстренной помощи в городе Раменское.";
    var isNewsPage = page === "novosti.html" || window.location.pathname.indexOf("/news/") !== -1 || document.querySelector(".g-page-article__body");
    var isServiceIndex = page === "uslugi-i-tseny.html";

    var graph = [
      {
        "@type": "VeterinaryCare",
        "@id": homeUrl + "#clinic",
        "name": "Ветеринар на связи",
        "url": homeUrl,
        "telephone": "+7-495-144-48-03",
        "email": "vetnasvyaz@mail.ru",
        "image": new URL("favicon.png", homeUrl).href,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "RU",
          "addressRegion": "Московская область",
          "addressLocality": "Раменское",
          "streetAddress": "ул. Красноармейская, д. 13"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 55.572556,
          "longitude": 38.233634
        },
        "areaServed": "Раменское"
      },
      {
        "@type": "WebSite",
        "@id": homeUrl + "#website",
        "name": "Ветеринар на связи",
        "url": homeUrl,
        "publisher": {
          "@id": homeUrl + "#clinic"
        },
        "inLanguage": "ru-RU"
      },
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        "url": url,
        "name": title,
        "description": description,
        "isPartOf": {
          "@id": homeUrl + "#website"
        },
        "about": {
          "@id": homeUrl + "#clinic"
        },
        "inLanguage": "ru-RU"
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumbs",
        "itemListElement": getBreadcrumbs(url, homeUrl, title)
      }
    ];

    if (isNewsPage && page !== "novosti.html") {
      graph.push({
        "@type": "Article",
        "@id": url + "#article",
        "headline": title,
        "description": description,
        "mainEntityOfPage": {
          "@id": url + "#webpage"
        },
        "publisher": {
          "@id": homeUrl + "#clinic"
        },
        "inLanguage": "ru-RU"
      });
    } else if (!isServiceIndex && page !== "index.html") {
      graph.push({
        "@type": "Service",
        "@id": url + "#service",
        "name": title,
        "description": description,
        "provider": {
          "@id": homeUrl + "#clinic"
        },
        "areaServed": "Раменское",
        "serviceType": "Ветеринарная услуга"
      });
    }

    addJsonLd({
      "@context": "https://schema.org",
      "@graph": graph
    });
  }

  ready(function () {
    setupPageClass();
    setupStructuredData();
    setupPanel();
    setupDropdowns();
    setupPopupButtons();
    setupAnimations();
    setupMaps();
    setupStaticForms();
    setupImageZoom();
  });
})();
