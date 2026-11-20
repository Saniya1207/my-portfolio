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

  /* If the person hasn't manually chosen a theme on this site yet, keep
     following their phone/OS theme live (e.g. if it auto-switches at
     sunset) instead of only checking it once on page load. */
  try {
    if (!localStorage.getItem("theme") && window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) {
          if (e.matches) {
            document.documentElement.setAttribute("data-theme", "dark");
          } else {
            document.documentElement.removeAttribute("data-theme");
          }
        }
      });
    }
  } catch (e) {}

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

  /* ---- Interactive Custom Cursor (Inner Pages) ---- */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = document.createElement("div");
    dot.className = "custom-cursor-dot";
    var ring = document.createElement("div");
    ring.className = "custom-cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;
    var isMoving = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      if (!isMoving) {
        isMoving = true;
        dot.style.opacity = "1";
        ring.style.opacity = "0.8";
      }
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    document.addEventListener("mousedown", function () {
      ring.classList.add("cursor-click");
    });
    document.addEventListener("mouseup", function () {
      ring.classList.remove("cursor-click");
    });

    document.querySelectorAll("a, button, input, textarea, select, .entity-card, .resume-block, .project-card").forEach(function (target) {
      target.addEventListener("mouseenter", function () {
        ring.classList.add("cursor-hover");
        dot.style.transform = "translate(-50%, -50%) scale(1.5)";
      });
      target.addEventListener("mouseleave", function () {
        ring.classList.remove("cursor-hover");
        dot.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });
  }
})();
