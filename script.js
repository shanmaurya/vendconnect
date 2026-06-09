/* ============================================================
   VENDCONNECT — JavaScript v2
   Forum section removed. Clean interactions only.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== STICKY HEADER ===== */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ===== MOBILE MENU ===== */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }


  /* ===== SCROLL ANIMATIONS ===== */
  const animatableSelector = [
    '.pain-point', '.solution-step', '.hiw-card',
    '.why-card', '.service-card', '.testimonial-card',
    '.trust-item', '.problem-img-wrap', '.solution-img-wrap',
    '.contact-form-wrap', '.contact-copy', '.logo-pill',
    '.machine-card', '.faq-item'
  ].join(', ');

  const animatables = document.querySelectorAll(animatableSelector);
  animatables.forEach((el) => {
    el.classList.add('fade-up');
    const siblings = Array.from(el.parentElement.children);
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(idx * 0.07, 0.36)}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  animatables.forEach(el => observer.observe(el));


  /* ===== FAQ ACCORDION ===== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ===== FORM SUBMISSION ===== */
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const form = document.getElementById('main-contact-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('form-submit-btn');

    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.72';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.classList.add('hidden');
      if (success) {
        success.classList.remove('hidden');
        success.style.opacity = '0';
        success.style.transform = 'scale(0.96)';
        requestAnimationFrame(() => {
          success.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          success.style.opacity = '1';
          success.style.transform = 'scale(1)';
        });
      }
    }, 1200);
  };


  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset - 10,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.style.color = isActive ? 'var(--blue-strong)' : '';
          link.style.fontWeight = isActive ? '700' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ===== COUNTER ANIMATION (trust bar) ===== */
  function animateCount(el, target, duration, fmt) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = fmt(val);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const trustObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.trust-num').forEach(num => {
        const t = num.textContent.trim();
        if (t === '500+') animateCount(num, 500, 1400, v => `${v}+`);
        else if (t === '48hr') animateCount(num, 48, 900, v => `${v}hr`);
        else if (t === '100%') animateCount(num, 100, 1100, v => `${v}%`);
      });
      trustObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const trustBar = document.querySelector('.hero-trust-bar');
  if (trustBar) trustObserver.observe(trustBar);


  /* ===== PARALLAX HERO ===== */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.2) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  /* ===== VIDEO LOOP DELAY ===== */
  const heroVid = document.getElementById('hero-vid');
  if (heroVid) {
    heroVid.addEventListener('ended', () => {
      setTimeout(() => {
        heroVid.play().catch(e => console.log('Autoplay blocked:', e));
      }, 4000);
    });
  }

  console.log('[VendConnect] Ready.');
});
