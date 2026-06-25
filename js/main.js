/* ============================================================
   OCEAN ACADEMIC — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Navigation ──────────────────────────────────────────────

  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const hero       = document.querySelector('.hero');

  const updateHeroPhotoFade = () => {
    if (!hero) return;
    const progress = Math.min(window.scrollY / Math.max(window.innerHeight * 0.8, 1), 1);
    const opacity = 0.32 * (1 - progress);
    document.documentElement.style.setProperty('--hero-photo-opacity', opacity.toFixed(3));
  };

  // Sticky nav shadow on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    updateHeroPhotoFade();
  });
  updateHeroPhotoFade();

  // Mobile hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // Close nav when a link is clicked (mobile)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Highlight active nav link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    }
  });

  // ── Contact Form ────────────────────────────────────────────

  const contactForm    = document.getElementById('contactForm');
  const formSuccess    = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(contactForm);
      const name = [data.get('firstName'), data.get('lastName')].filter(Boolean).join(' ');
      const email = data.get('email') || '';
      const affiliation = data.get('affiliation') || '';
      const subject = data.get('subject') || 'Website inquiry';
      const message = data.get('message') || '';

      const body = [
        message,
        '',
        '---',
        name ? `From: ${name}` : '',
        email ? `Reply-to: ${email}` : '',
        affiliation ? `Affiliation: ${affiliation}` : '',
      ].filter(Boolean).join('\n');

      const mailto = `mailto:jonasd@uw.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });
  }

  // ── Publication Filters ─────────────────────────────────────

  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  const pubEntries = document.querySelectorAll('.pub-entry');

  if (filterBtns.length && pubEntries.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        pubEntries.forEach(entry => {
          const show = filter === 'all' || entry.dataset.type === filter;
          entry.style.display = show ? '' : 'none';
        });

        // Hide year headings that have no visible children
        document.querySelectorAll('.pub-year-group').forEach(group => {
          const visible = group.querySelectorAll('.pub-entry:not([style*="none"])');
          group.style.display = visible.length ? '' : 'none';
        });
      });
    });
  }

  // ── Smooth reveal on scroll ─────────────────────────────────
  // Simple intersection observer for fade-in cards

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in base styles dynamically (avoids FOUC if CSS loads late)
  const style = document.createElement('style');
  style.textContent = `
    .card, .research-card, .pub-entry, .education-item, .fieldwork-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card.visible, .research-card.visible, .pub-entry.visible,
    .education-item.visible, .fieldwork-item.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.card, .research-card, .pub-entry, .education-item, .fieldwork-item')
    .forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      observer.observe(el);
    });

  // ── Current year in footer ──────────────────────────────────
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
