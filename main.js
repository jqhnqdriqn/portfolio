/* ================================================================
   main.js — Shared JavaScript for all pages
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Nav ────────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile Nav Toggle ─────────────────────────────────────────
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Active Nav Link ───────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Back-to-Top (UI/UX Pro Required) ─────────────────────────
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Scroll Reveal (Intersection Observer) ─────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // ── Typing / Role Cycler (Hero) ───────────────────────────────
  const roleEl = document.querySelector('.hero__role-text');
  if (roleEl) {
    const roles = [
      'SEO Content Specialist',
      'AI Content Editor',
      'Website Operations',
      'On-Page SEO Expert'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let paused = false;

    const type = () => {
      if (paused) return;
      const current = roles[roleIndex];

      if (!deleting) {
        roleEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          paused = true;
          setTimeout(() => { paused = false; }, 2000);
        }
      } else {
        roleEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      const speed = deleting ? 50 : 90;
      setTimeout(type, speed);
    };

    setTimeout(type, 800);
  }

  // ── Animated Counter (Stats) ──────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current < target) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // ── Portfolio Filter Tabs ─────────────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-cat]');
  if (filterTabs.length && portfolioCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        portfolioCards.forEach(card => {
          const show = filter === 'all' || card.dataset.cat === filter;
          card.style.opacity = show ? '1' : '0.2';
          card.style.pointerEvents = show ? 'auto' : 'none';
          card.style.transform = show ? '' : 'scale(0.97)';
          card.style.transition = 'opacity .35s, transform .35s';
        });
      });
    });
  }

  // ── Contact Form ──────────────────────────────────────────────
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = document.querySelector('.form-success');
      const originalText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Simulate send — replace with actual endpoint
      setTimeout(() => {
        btn.textContent = 'Sent ✓';
        if (success) { success.style.display = 'block'; }
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
          if (success) { success.style.display = 'none'; }
        }, 4000);
      }, 1200);
    });
  }

  // ── Smooth anchor scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

});
