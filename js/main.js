/* main.js v3 — Dark mode, FAQ accordion, Portfolio dropdown */
document.addEventListener('DOMContentLoaded', () => {

  /* ── DARK MODE ─────────────────────────────────────────────── */
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ── STICKY NAV ────────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE NAV ────────────────────────────────────────────── */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── ACTIVE NAV LINK ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
  // Also mark portfolio parent as active on portfolio pages
  if (currentPage.startsWith('portfolio')) {
    document.querySelectorAll('.nav__item .nav__item-label').forEach(el => el.classList.add('active'));
  }

  /* ── BACK TO TOP ───────────────────────────────────────────── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── TYPING ROLE CYCLER ────────────────────────────────────── */
  const roleEl = document.querySelector('.hero__role-text');
  if (roleEl) {
    const roles = ['SEO Content Specialist', 'AI Content Editor', 'Website Operations', 'On-Page SEO Expert'];
    let roleIndex = 0, charIndex = 0, deleting = false, paused = false;
    const type = () => {
      if (paused) return;
      const current = roles[roleIndex];
      if (!deleting) {
        roleEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) { deleting = true; paused = true; setTimeout(() => { paused = false; }, 2200); }
      } else {
        roleEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      }
      setTimeout(type, deleting ? 48 : 88);
    };
    setTimeout(type, 900);
  }

  /* ── ANIMATED COUNTERS ─────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / (1800 / 16);
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

  /* ── FAQ ACCORDION ─────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ── PORTFOLIO FILTER ──────────────────────────────────────── */
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

  /* WRITING SAMPLES FILTER */
  const writingFilterTabs = document.querySelectorAll('[data-writing-filter]');
  const writingSections = document.querySelectorAll('[data-writing-category]');
  if (writingFilterTabs.length && writingSections.length) {
    writingFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        writingFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.writingFilter;
        writingSections.forEach(section => {
          const show = filter === 'all' || section.dataset.writingCategory === filter;
          section.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ── CONTACT FORM (Formspree) ──────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = document.querySelector('.form-success');
      const btnSpan = btn.querySelector('span') || btn;

      // Basic client-side validation
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        [name, email, message].forEach(field => {
          if (!field.value.trim()) field.style.borderColor = 'var(--accent)';
        });
        return;
      }

      btnSpan.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          btnSpan.textContent = 'Sent!';
          if (success) success.style.display = 'block';
          form.reset();
          // Scroll success message into view
          if (success) success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => {
            btnSpan.textContent = 'Send Message';
            btn.disabled = false;
            if (success) success.style.display = 'none';
          }, 6000);
        } else {
          const data = await res.json();
          btnSpan.textContent = 'Try Again';
          btn.disabled = false;
          if (data && data.errors) {
            console.error('Formspree errors:', data.errors.map(e => e.message).join(', '));
          }
        }
      } catch (err) {
        btnSpan.textContent = 'Try Again';
        btn.disabled = false;
        console.error('Form submission error:', err);
      }
    });

    // Clear red borders on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ── SMOOTH ANCHOR ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

});
