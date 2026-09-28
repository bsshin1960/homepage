/* ============================================================
   행복한 시민 - script.js
   ============================================================ */

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroSlider();
  initMobileNav();
  initStats();
  initScrollReveal();
  initBackToTop();
  initGallery();
  initForm();
  initSmoothScroll();
});

// ============================================================
// HEADER - Scroll Effect & Active Link
// ============================================================
function initHeader() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// MOBILE NAV
// ============================================================
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function closeNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });
}

// ============================================================
// HERO SLIDER
// ============================================================
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    // Reset hero animations
    resetHeroAnimations();
  }

  function resetHeroAnimations() {
    const activeSlide = slides[current];
    const animEls = activeSlide.querySelectorAll('.hero-badge, .hero-title, .hero-desc, .hero-actions');
    animEls.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  document.getElementById('slider-prev').addEventListener('click', () => { goTo(current - 1); startTimer(); });
  document.getElementById('slider-next').addEventListener('click', () => { goTo(current + 1); startTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  startTimer();
}

// ============================================================
// STATS COUNTER
// ============================================================
function initStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    if (animated) return;
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      animated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2200;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current < target) {
            el.textContent = Math.floor(current).toLocaleString('ko-KR');
            requestAnimationFrame(update);
          } else {
            el.textContent = target.toLocaleString('ko-KR');
          }
        };
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initScrollReveal() {
  // Add reveal classes to elements
  const revealEls = [
    { selector: '.about-text', cls: 'reveal-left' },
    { selector: '.about-visual', cls: 'reveal-right' },
    { selector: '.activity-card', cls: 'reveal' },
    { selector: '.news-card', cls: 'reveal' },
    { selector: '.stat-item', cls: 'reveal' },
    { selector: '.gallery-item', cls: 'reveal' },
    { selector: '.join-text', cls: 'reveal-left' },
    { selector: '.join-form', cls: 'reveal-right' },
    { selector: '.section-header', cls: 'reveal' },
    { selector: '.section-badge', cls: 'reveal' },
  ];

  revealEls.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // Stagger activity cards and news cards
  document.querySelectorAll('.activity-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// GALLERY - Lightbox
// ============================================================
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  
  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  lightbox.innerHTML = `
    <button id="lightbox-close" style="position:absolute;top:24px;right:28px;color:#fff;font-size:2rem;background:none;border:none;cursor:pointer;line-height:1;">✕</button>
    <img id="lightbox-img" src="" alt="" style="max-width:90vw;max-height:90vh;border-radius:16px;object-fit:contain;box-shadow:0 20px 80px rgba(0,0,0,0.5);" />
  `;
  document.body.appendChild(lightbox);

  function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const bgImg = item.style.backgroundImage.slice(5, -2);
      openLightbox(bgImg);
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ============================================================
// FORM
// ============================================================
function initForm() {
  const form = document.getElementById('join-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name-input').value.trim();
    const email = document.getElementById('email-input').value.trim();

    if (!name) {
      showFormMessage('이름을 입력해 주세요.', 'error');
      return;
    }
    if (!email || !email.includes('@')) {
      showFormMessage('올바른 이메일을 입력해 주세요.', 'error');
      return;
    }

    const btn = document.getElementById('form-submit-btn');
    btn.textContent = '처리 중...';
    btn.disabled = true;

    setTimeout(() => {
      showFormMessage(`${name}님, 가입 신청이 완료되었습니다! 이메일을 확인해 주세요. 💚`, 'success');
      form.reset();
      btn.textContent = '가입 신청하기';
      btn.disabled = false;
    }, 1500);
  });

  function showFormMessage(msg, type) {
    let msgEl = document.getElementById('form-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.id = 'form-message';
      form.appendChild(msgEl);
    }
    msgEl.textContent = msg;
    msgEl.style.cssText = `
      margin-top: 16px;
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-align: center;
      background: ${type === 'success' ? 'rgba(29,184,126,0.2)' : 'rgba(255,80,80,0.2)'};
      color: ${type === 'success' ? '#7fffbe' : '#ffaaaa'};
      border: 1px solid ${type === 'success' ? 'rgba(29,184,126,0.4)' : 'rgba(255,80,80,0.4)'};
    `;
    setTimeout(() => { if (msgEl) msgEl.remove(); }, 6000);
  }
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
