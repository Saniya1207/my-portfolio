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


  // ==========================================
  // Interactive Hero Code Editor Tabs Switcher
  // ==========================================
  window.switchHeroTab = function(tabName) {
    var codeK = document.getElementById('codeKisanX');
    var codeS = document.getElementById('codeSellMart');
    var codeP = document.getElementById('codePharma');

    if (codeK) codeK.style.display = (tabName === 'kisanx') ? 'inline' : 'none';
    if (codeS) codeS.style.display = (tabName === 'sellmart') ? 'inline' : 'none';
    if (codeP) codeP.style.display = (tabName === 'pharma') ? 'inline' : 'none';

    var tabs = {
      kisanx: {
        bgId: 'tabBgKisanX', lineId: 'tabLineKisanX', textId: 'tabTextKisanX', color: '#f472b6',
        statusL: '🌿 main*  ·  TypeScript React  ·  UTF-8',
        statusR: '✓ 0 Errors  ·  100% Tests', statusRColor: '#4ade80',
        badge1: '⚡ RAZORPAYX FINTECH', badge1Color: '#38bdf8',
        badge2: '🌾 KISANX · D2C AGRI', badge2Color: '#4ade80',
        badge3: '🔒 HMAC-SHA256 VERIFIED', badge3Color: '#f472b6'
      },
      sellmart: {
        bgId: 'tabBgSellMart', lineId: 'tabLineSellMart', textId: 'tabTextSellMart', color: '#f97316',
        statusL: '⚡ production  ·  PHP 8.2 & MySQL  ·  UTF-8',
        statusR: '✓ 200 OK  ·  Live Webhook', statusRColor: '#4ade80',
        badge1: '⚡ 2-HR DOORSTEP PICKUP', badge1Color: '#f97316',
        badge2: '💳 RAZORPAYX INSTANT PAYOUT', badge2Color: '#38bdf8',
        badge3: '🔒 HMAC-SHA256 SIGNED', badge3Color: '#4ade80'
      },
      pharma: {
        bgId: 'tabBgPharma', lineId: 'tabLinePharma', textId: 'tabTextPharma', color: '#38bdf8',
        statusL: '💊 live-catalog  ·  ES6+ & Firestore  ·  UTF-8',
        statusR: '✓ Synced  ·  Security.js Active', statusRColor: '#38bdf8',
        badge1: '💊 20+ MEDICAL DOMAINS', badge1Color: '#38bdf8',
        badge2: '📦 ATOMIC STOCK DECREMENT', badge2Color: '#4ade80',
        badge3: '⚡ 1-CLICK WHATSAPP EXPRESS', badge3Color: '#25d366'
      }
    };

    ['kisanx', 'sellmart', 'pharma'].forEach(function(k) {
      var item = tabs[k];
      var bg = document.getElementById(item.bgId);
      var line = document.getElementById(item.lineId);
      var text = document.getElementById(item.textId);

      if (k === tabName) {
        if (bg) {
          bg.setAttribute('fill', 'url(#tabActiveBg)');
          bg.setAttribute('stroke', 'rgba(244,114,182,0.4)');
        }
        if (line) line.setAttribute('fill', item.color);
        if (text) {
          text.setAttribute('opacity', '1');
          text.setAttribute('font-weight', '600');
          text.setAttribute('fill', '#fdedf3');
        }
      } else {
        if (bg) {
          bg.setAttribute('fill', 'transparent');
          bg.setAttribute('stroke', 'transparent');
        }
        if (line) line.setAttribute('fill', 'transparent');
        if (text) {
          text.setAttribute('opacity', '0.6');
          text.setAttribute('font-weight', '400');
          text.setAttribute('fill', '#e8a0bb');
        }
      }
    });

    var sL = document.getElementById('heroStatusLeft');
    var sR = document.getElementById('heroStatusRight');
    var target = tabs[tabName];
    if (sL && target) sL.textContent = target.statusL;
    if (sR && target) {
      sR.textContent = target.statusR;
      sR.setAttribute('fill', target.statusRColor);
    }

    var b1 = document.getElementById('heroBadge1Text');
    var b2 = document.getElementById('heroBadge2Text');
    var b3 = document.getElementById('heroBadge3Text');
    if (b1 && target) {
      b1.textContent = target.badge1;
      b1.setAttribute('fill', target.badge1Color);
    }
    if (b2 && target) {
      b2.textContent = target.badge2;
      b2.setAttribute('fill', target.badge2Color);
    }
    if (b3 && target) {
      b3.textContent = target.badge3;
      b3.setAttribute('fill', target.badge3Color);
    }
  };
