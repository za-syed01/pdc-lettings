// Active nav link detection
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkHref = link.getAttribute('href').split('#')[0];
  if (linkHref === currentFile || (currentFile === '' && linkHref === 'index.html')) {
    link.classList.add('active');
  }
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  const navClose = document.getElementById('navClose');
  if (navClose) {
    navClose.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

// Contact form — sends via Formspree (replace YOUR_FORM_ID after registering at formspree.io)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch('https://formspree.io/f/mvzjbeve', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        contactForm.innerHTML = '<div class="flash flash-success" style="margin-top:0;">Thanks! We\'ll be in touch within 24 hours.</div>';
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = originalText;
      btn.disabled = false;
      const err = document.createElement('div');
      err.className = 'flash flash-error';
      err.style.marginBottom = '12px';
      err.textContent = 'Something went wrong. Please email us directly at info@propertydevelopmentscapital.com';
      contactForm.prepend(err);
    }
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ========================
// TESTIMONIALS CAROUSEL
// ========================
(function () {
  const slides  = document.querySelectorAll('.tc-slide');
  const dots    = document.querySelectorAll('.tc-dot');
  const curEl   = document.getElementById('tcCurrent');
  const totEl   = document.getElementById('tcTotal');
  const prevBtn = document.getElementById('tcPrev');
  const nextBtn = document.getElementById('tcNext');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  if (totEl) totEl.textContent = String(total).padStart(2, '0');

  function goTo(idx, dir) {
    slides[current].classList.remove('active', 'tc-anim-right', 'tc-anim-left');
    dots[current].classList.remove('active');
    current = (idx + total) % total;
    const slide = slides[current];
    slide.classList.add('active', dir === 'next' ? 'tc-anim-right' : 'tc-anim-left');
    setTimeout(() => slide.classList.remove('tc-anim-right', 'tc-anim-left'), 450);
    dots[current].classList.add('active');
    if (curEl) curEl.textContent = String(current + 1).padStart(2, '0');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1, 'prev'));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1, 'next'));
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.idx);
      goTo(idx, idx > current ? 'next' : 'prev');
    });
  });

  // Auto-advance every 6s
  let autoplay = setInterval(() => goTo(current + 1, 'next'), 6000);
  const wrap = document.querySelector('.tcarousel');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrap.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(current + 1, 'next'), 6000);
    });
  }
})();

// ========================
// SCROLL REVEAL
// ========================
(function () {
  const groups = [
    { sel: '.section-title',        anim: 'reveal' },
    { sel: '.section-subtitle',     anim: 'reveal',       delay: 1 },
    { sel: '.home-pricing-card',    anim: 'reveal',       stagger: true },
    { sel: '.process-card',         anim: 'reveal',       stagger: true },
    { sel: '.testimonial-card',     anim: 'reveal',       stagger: true },
    { sel: '.why-item',             anim: 'reveal',       stagger: true },
    { sel: '.service-card',         anim: 'reveal',       stagger: true },
    { sel: '.why-us-image',         anim: 'reveal-right' },
    { sel: '.contact-visual',       anim: 'reveal-left' },
    { sel: '.contact-form-panel',   anim: 'reveal-right' },
    { sel: '.partners-logos img',   anim: 'reveal',       stagger: true },
    { sel: '.contact-trust-item',   anim: 'reveal',       stagger: true },
    { sel: '.footer-grid > div',    anim: 'reveal',       stagger: true },
    { sel: '.values-split .values-left',  anim: 'reveal-left' },
    { sel: '.values-split .values-right', anim: 'reveal-right' },
    { sel: '.why-strip-card',        anim: 'reveal',       stagger: true },
    { sel: '.benefit-card',         anim: 'reveal',       stagger: true },
    { sel: '.prop-card',            anim: 'reveal',       stagger: true },
    { sel: '.track-record-grid > div', anim: 'reveal',   stagger: true },
  ];

  groups.forEach(({ sel, anim, stagger, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal') &&
          !el.classList.contains('reveal-left') &&
          !el.classList.contains('reveal-right')) {
        el.classList.add(anim);
        if (stagger && i > 0) el.classList.add(`delay-${Math.min(i, 5)}`);
        if (delay) el.classList.add(`delay-${delay}`);
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });

  // Hide scroll indicator when user scrolls past hero
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    window.addEventListener('scroll', () => {
      heroScroll.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }
})();
