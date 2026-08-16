/**
 * Saniya Farooqui - Portfolio Interactive Logic & Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initFaqAccordion();
  initStackTabs();
  initScrollSpy();
  initStatsCountUp();
});

/* ==========================================================================
   THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.btn-theme-toggle');
  
  // Set initial icon
  updateThemeIcons();

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons();
    });
  });
}

function updateThemeIcons() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const themeToggles = document.querySelectorAll('.btn-theme-toggle');
  
  themeToggles.forEach(toggle => {
    toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
  });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileToggle || !mobileDrawer) return;

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      mobileDrawer.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    } else {
      mobileDrawer.classList.add('open');
      mobileToggle.innerHTML = '✕';
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    });
  });

  // Close drawer on click outside
  document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
      mobileDrawer.classList.remove('open');
      mobileToggle.innerHTML = '☰';
    }
  });
}

/* ==========================================================================
   LOCAL SEO FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Open current if wasn't active
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* ==========================================================================
   TECH STACK FILTER TABS
   ========================================================================== */
function initStackTabs() {
  const tabs = document.querySelectorAll('.stack-tab');
  const skillCards = document.querySelectorAll('.skill-pill-card');

  if (!tabs.length || !skillCards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   ACTIVE SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   NUMBER COUNT-UP ANIMATION
   ========================================================================== */
function initStatsCountUp() {
  const statNumbers = document.querySelectorAll('.metric-num[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let count = 0;
        const speed = target / 35;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            el.innerText = isDecimal ? count.toFixed(2) : Math.ceil(count) + '+';
            requestAnimationFrame(updateCount);
          } else {
            el.innerText = isDecimal ? target.toFixed(2) : target + '+';
          }
        };

        updateCount();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   DIRECT WHATSAPP INSTANT SENDER
   ========================================================================== */
function sendWhatsAppMessage(event) {
  event.preventDefault();
  
  const name = document.getElementById('wa-name').value.trim();
  const email = document.getElementById('wa-email').value.trim();
  const service = document.getElementById('wa-service').value;
  const message = document.getElementById('wa-msg').value.trim();

  if (!name || !message) {
    alert('Please enter your name and message to continue.');
    return false;
  }

  const phone = '917666886033';
  const formattedText = 
`👋 Hello Saniya! I am contacting you from your portfolio:

👤 Name: ${name}
📧 Email: ${email || 'Not provided'}
💼 Project/Service: ${service}

💬 Message:
${message}`;

  const encodedUrl = `https://wa.me/${phone}?text=${encodeURIComponent(formattedText)}`;
  window.open(encodedUrl, '_blank');
  return false;
}
