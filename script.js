/* ═══════════════════════════════════════════════════════════
   THE SENSE HAT — script.js
   Handles: mobile nav toggle, active nav highlighting,
            scroll-reveal animations, nav scroll shadow.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Mobile nav toggle ─────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when a link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function setActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY + 80; // offset for sticky nav height

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ── Scroll-reveal ─────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.section-title, .subsection-title, .prose, .card-grid, ' +
    '.img-block, .img-row, .table-wrap, .code-block, ' +
    '.challenge-list, .team-grid, .tag-list, .acknowledgement, ' +
    '.hero-inner, .hero-image-wrap'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ── Smooth scroll offset for sticky nav ──────────────── */
  // Adjusts anchor scroll so content isn't hidden under navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight ?? 56;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
