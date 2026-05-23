/* ═══════════════════════════════════════════════════════════
   THE SENSE HAT — script.js
   Handles: mobile nav toggle, active nav highlighting,
            scroll-reveal animations, nav scroll shadow.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const motionVideos = document.querySelectorAll('.motion-video');
  const introScreen = document.getElementById('introScreen');

  if (motionVideos.length) {
    const videoObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.45 }
    );

    motionVideos.forEach(video => {
      video.pause();
      videoObserver.observe(video);
    });
  }

  if (introScreen) {
    document.body.classList.add('intro-active');
    introScreen.addEventListener('animationend', event => {
      if (event.animationName !== 'intro-fade-away') return;
      document.body.classList.remove('intro-active');
      introScreen.remove();
    });
  }

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

  document.querySelectorAll('.diagram-popout').forEach(diagramFigure => {
    const diagramFrame = diagramFigure.querySelector('.diagram-frame');
    const modalId = diagramFigure.getAttribute('data-modal-target');
    const diagramModal = modalId ? document.getElementById(modalId) : null;
    const diagramClose = diagramModal?.querySelector('.diagram-modal-close');

    if (!diagramFrame || !diagramModal || !diagramClose) return;

    diagramFigure.addEventListener('pointermove', event => {
      const rect = diagramFigure.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      diagramFrame.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      diagramFrame.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      diagramFrame.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      diagramFrame.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    });

    diagramFigure.addEventListener('pointerleave', () => {
      diagramFrame.style.removeProperty('--rx');
      diagramFrame.style.removeProperty('--ry');
      diagramFrame.style.removeProperty('--mx');
      diagramFrame.style.removeProperty('--my');
    });

    const openDiagram = () => {
      diagramModal.classList.add('open');
      diagramModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      diagramClose.focus();
    };

    const closeDiagram = () => {
      diagramModal.classList.remove('open');
      diagramModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      diagramFigure.focus();
    };

    diagramFigure.addEventListener('click', openDiagram);
    diagramFigure.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDiagram();
      }
    });

    diagramClose.addEventListener('click', closeDiagram);
    diagramModal.addEventListener('click', event => {
      if (event.target === diagramModal) closeDiagram();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && diagramModal.classList.contains('open')) {
        closeDiagram();
      }
    });
  });

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
