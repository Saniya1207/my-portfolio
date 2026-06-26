/* ================================================================
   site.js — shared behaviour for inner pages
   (About, Projects, Blog, Resume, Contact, Certifications)
   Mirrors the nav + reveal-on-scroll behaviour already used on the
   homepage so the feel of the site stays identical across pages.
================================================================ */

(function () {
  "use strict";

  /* ---- Dark mode toggle ---- */
  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }
  function toggleTheme() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  }
  ["themeToggle", "themeToggleOverlay"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", toggleTheme);
  });

  /* ---- Hamburger / overlay menu ---- */
  var hamburger = document.getElementById("hamburger");
  var navOverlay = document.getElementById("navOverlay");

  function openMenu() {
    navOverlay.style.display = "block";
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    navOverlay.style.display = "none";
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (hamburger && navOverlay) {
    hamburger.addEventListener("click", function () {
      navOverlay.style.display === "block" ? closeMenu() : openMenu();
    });
    document.querySelectorAll(".ov-link").forEach(function (l) {
      l.addEventListener("click", closeMenu);
    });
  }

  /* ---- Highlight current page in nav based on path ---- */
  var here = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll("#navLinks a, .ov-link").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href) return;
    if (href === here || (href !== "/" && here.indexOf(href) === 0)) {
      link.classList.add("active");
    }
  });

  /* ---- Scroll reveal (same classes/behaviour as homepage) ---- */
  var reveals = document.querySelectorAll(
    ".reveal, .reveal-stagger, .section-divider, .entity-card, .resume-block"
  );

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  reveals.forEach(function (el) {
    observer.observe(el);
  });

  /* ---- FAQ accordion (re-used on Contact / Certifications / Blog) ---- */
  window.toggleFaq = function (btn) {
    var answer = btn.nextElementSibling;
    var isOpen = answer.classList.contains("open");
    document.querySelectorAll(".faq-answer").forEach(function (a) {
      a.classList.remove("open");
    });
    document.querySelectorAll(".faq-question").forEach(function (b) {
      b.classList.remove("active");
    });
    if (!isOpen) {
      answer.classList.add("open");
      btn.classList.add("active");
    }
  };

  /* ---- WhatsApp contact form (Contact page) ---- */
  window.sendToWhatsApp = function () {
    var nameEl = document.getElementById("f-name");
    var emailEl = document.getElementById("f-email");
    var msgEl = document.getElementById("f-msg");
    var name = nameEl ? nameEl.value.trim() : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var message = msgEl ? msgEl.value.trim() : "";

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    var whatsappNumber = "917666886033";
    var text =
      "Hello Saniya,\n\n👤 Name: " +
      name +
      "\n📧 Email: " +
      email +
      "\n\n💬 Message:\n" +
      message;

    var url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
  };
})();
