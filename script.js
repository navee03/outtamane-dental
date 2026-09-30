/* ══════════════════════════════════════════════════
   ZEN | Outtamane Dental Clinic — script.js
   Navbar · Scroll Reveal · Ticker · WhatsApp
   Premium Background: Canvas Particles + Orbs + Motifs
══════════════════════════════════════════════════ */

/* ─── PAGE LOADER — never gets stuck ─── */
(function() {
  function hideLoader() {
    var loader = document.getElementById('pageLoader');
    if (loader) loader.classList.add('hide');
  }
  var maxTimer = setTimeout(hideLoader, 2200);
  window.addEventListener('load', function() {
    clearTimeout(maxTimer);
    setTimeout(hideLoader, 400);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      const spans = hamburger?.querySelectorAll('span');
      if (spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  });

  /* ─── 2. SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

  /* ─── 3. TICKER ─── */
  const services = [
    'General Dentistry', 'Teeth Cleaning & Whitening', 'Root Canal Treatment',
    'Dental Implants', 'Braces & Aligners', 'Smile Makeover & Cosmetic Dentistry',
    'Pediatric Dentistry', 'Tooth Extraction', 'Crowns & Bridges', 'Emergency Dental Care',
  ];
  const track = document.getElementById('ticker');
  if (track) {
    const starSVG = `<svg class="ticker-icon" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`;
    track.innerHTML = [...services, ...services].map(s =>
      `<span class="ticker-item">${starSVG}${s}<span class="ticker-dot"></span></span>`
    ).join('');
  }

  /* ─── 4. SERVICES CAROUSEL ─── */
  (function initServiceCarousel() {
    const track    = document.getElementById('svcTrack');
    const viewport = document.getElementById('svcViewport');
    const prevBtn  = document.getElementById('svcPrev');
    const nextBtn  = document.getElementById('svcNext');
    const dotsWrap = document.getElementById('svcDots');
    if (!track || !viewport) return;

    const cards      = Array.from(track.children);
    const totalCards = cards.length;
    let currentIndex = 0;
    let autoTimer    = null;

    function visibleCount() {
      const vw = window.innerWidth;
      if (vw <= 480)  return 1;
      if (vw <= 768)  return 2;
      if (vw <= 1100) return 3;
      return 4;
    }

    function maxIndex() { return Math.max(0, totalCards - visibleCount()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const d = document.createElement('button');
        d.className = 'svc-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      Array.from(dotsWrap.children).forEach((d, i) =>
        d.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      const gap  = 14;
      const cardW = cards[0] ? cards[0].offsetWidth : 0;
      track.style.transform = `translateX(-${currentIndex * (cardW + gap)}px)`;
      updateDots();
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex();
    }

    function next() { goTo(currentIndex < maxIndex() ? currentIndex + 1 : 0); }
    function prev() { goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex()); }

    function startAuto() { stopAuto(); autoTimer = setInterval(next, 3000); }
    function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);

    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    viewport.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
      startAuto();
    }, { passive: true });

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    window.addEventListener('resize', () => {
      buildDots();
      goTo(Math.min(currentIndex, maxIndex()));
    }, { passive: true });

    buildDots();
    goTo(0);
    startAuto();
  })();

  /* ─── 5. GALLERY FILTERS + LIGHTBOX ─── */
  initGalleryAndLightbox();


  /* ─── REVIEWS (edit this list: paste real Google reviews here) ─── */
  (function () {
    const REVIEW_URL = "https://www.google.com/maps/place/ZEN+%7C+Outtamane's+Dental+Clinic/@11.927363,79.8252689,17z/data=!4m8!3m7!1s0x3a5361814903b4f1:0x1dc5c26de396c3c8!8m2!3d11.927363!4d79.8252689!9m1!1b1!16s%2Fg%2F11fr3l_n4c?entry=ttu";
    // { name, stars (1-5), text, treatment, date }  — add as many as you like
    const REVIEWS = [
      { name: "Priya R.",  stars: 5, text: "The team at ZEN | Outtamane Dental Clinic is amazing! I felt so comfortable and my treatment was completely pain-free. My smile has never looked better!", treatment: "Dental Implants", date: "April 2024" },
      { name: "Arun K.",   stars: 5, text: "I underwent a root canal treatment here and the experience was far better than I expected. Highly professional and caring staff throughout.", treatment: "Root Canal", date: "March 2024" },
      { name: "Sneha M.",  stars: 5, text: "I chose ZEN | Outtamane for smile designing and whitening. The results are incredible! I get compliments on my smile everywhere I go now.", treatment: "Smile Design", date: "May 2024" },
      { name: "Vikram S.", stars: 5, text: "Very clean and modern clinic with advanced technology. The doctors explained everything so well. I highly recommend ZEN | Outtamane Dental Clinic!", treatment: "General Checkup", date: "June 2024" }
    ];
    const grid = document.getElementById('tGrid'), dots = document.getElementById('tDots');
    if (!grid || !dots) return;
    const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>';
    const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const perPage = () => window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 4;
    let page = 0;
    function render() {
      const n = perPage(), pages = Math.ceil(REVIEWS.length / n);
      page = Math.min(page, pages - 1);
      grid.innerHTML = REVIEWS.slice(page * n, page * n + n).map(r => `
        <a class="t-card" href="${REVIEW_URL}" target="_blank" rel="noopener noreferrer" aria-label="Read reviews of ZEN | Outtamane's Dental Clinic on Google (opens in a new tab)">
          <div class="t-quote-deco">"</div>
          <div class="t-author"><div class="t-avatar-fb">${esc(r.name[0])}</div>
            <div><div class="t-name">${esc(r.name)}</div><div class="stars">${star.repeat(r.stars)}</div></div></div>
          <p class="t-text">${esc(r.text)}</p>
          <div class="t-tag"><div><div class="t-tag-label">Treatment: <strong>${esc(r.treatment)}</strong></div><div class="t-tag-date">${esc(r.date)}</div></div></div>
          <span class="t-source">See it on Google <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
        </a>`).join('');
      dots.innerHTML = pages > 1 ? Array.from({length: pages}, (_, i) =>
        `<button class="dot${i === page ? ' active' : ''}" data-p="${i}" aria-label="Reviews page ${i + 1}"></button>`).join('') : '';
      dots.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => { page = +d.dataset.p; render(); }));
    }
    render();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(render, 150); });
    setInterval(() => { const pages = Math.ceil(REVIEWS.length / perPage()); if (pages > 1) { page = (page + 1) % pages; render(); } }, 7000);
  })();

  /* ─── 6. DOT NAV ─── */
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ─── 7. ACTIVE NAV ON SCROLL ─── */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ─── 8. STAGGER CARDS ─── */
  document.querySelectorAll('.svc-card, .why-pillar, .t-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  /* ─── 9. COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600, step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ─── 10. MOUSE PARALLAX ON HERO BADGE ─── */
  const badge = document.querySelector('.hero-badge-float');
  if (badge) {
    document.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 8;
      const my = (e.clientY / window.innerHeight - 0.5) * 8;
      badge.style.transform = `translateY(${-8 + my * 0.4}px) rotateX(${my * 0.25}deg) rotateY(${mx * 0.25}deg)`;
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     PREMIUM BACKGROUND SYSTEM
  ══════════════════════════════════════════════════════ */

  /* A. Ambient drifting orbs */
  ['ambient-orb-1', 'ambient-orb-2', 'ambient-orb-3'].forEach(cls => {
    const orb = document.createElement('div');
    orb.className = `ambient-orb ${cls}`;
    document.body.appendChild(orb);
  });

  /* B. Floating decorative motifs */
  const motifs = [
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#C9A96E"/></svg>`,
      size: 70, top: '10%', left: '4%', dur: '18s', delay: '0s', opacity: 0.06
    },
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#8B9A7B"/></svg>`,
      size: 48, top: '56%', left: '88%', dur: '23s', delay: '3s', opacity: 0.055
    },
    {
      svg: `<svg viewBox="0 0 60 60"><rect x="26" y="6" width="8" height="48" rx="4" fill="#C9A96E"/><rect x="6" y="26" width="48" height="8" rx="4" fill="#C9A96E"/></svg>`,
      size: 56, top: '33%', left: '92%', dur: '16s', delay: '1s', opacity: 0.05
    },
    {
      svg: `<svg viewBox="0 0 60 60"><rect x="26" y="6" width="8" height="48" rx="4" fill="#8B9A7B"/><rect x="6" y="26" width="48" height="8" rx="4" fill="#8B9A7B"/></svg>`,
      size: 40, top: '76%', left: '3%', dur: '21s', delay: '5s', opacity: 0.045
    },
    {
      svg: `<svg viewBox="0 0 24 24"><path d="M12 2C9 2 6.5 3.5 6.5 6.5c0 1.8.6 3.2 1 4.5.5 1.5.5 3 .5 4.5 0 2 .7 4.5 2 4.5s1.5-2 2-3.5c.5 1.5.7 3.5 2 3.5s2-2.5 2-4.5c0-1.5 0-3 .5-4.5.4-1.3 1-2.7 1-4.5C17.5 3.5 15 2 12 2z" fill="#C9A96E"/></svg>`,
      size: 34, top: '88%', left: '52%', dur: '25s', delay: '7s', opacity: 0.04
    },
  ];

  motifs.forEach(({ svg, size, top, left, dur, delay, opacity }) => {
    const el = document.createElement('div');
    el.className = 'bg-motif';
    el.style.cssText = `width:${size}px;height:${size}px;top:${top};left:${left};--dur:${dur};--delay:${delay};--final-opacity:${opacity};animation-delay:${delay};`;
    el.innerHTML = svg;
    document.body.appendChild(el);
  });

  /* C. Canvas particle system */
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const PALETTE = [
    'rgba(201,169,110,VAL)',
    'rgba(168,128,58,VAL)',
    'rgba(139,154,123,VAL)',
    'rgba(232,213,176,VAL)',
    'rgba(74,138,138,VAL)',
  ];

  const particles = Array.from({ length: 38 }, (_, i) => ({
    x:            Math.random() * window.innerWidth,
    y:            Math.random() * window.innerHeight,
    r:            Math.random() * 1.6 + 0.4,
    alpha:        Math.random() * 0.14 + 0.03,
    vx:           (Math.random() - 0.5) * 0.20,
    vy:           -(Math.random() * 0.16 + 0.07),
    color:        PALETTE[Math.floor(Math.random() * PALETTE.length)],
    twinkleSpeed: Math.random() * 0.009 + 0.004,
    twinkleDir:   Math.random() > 0.5 ? 1 : -1,
    diamond:      i % 5 === 0,
    size2:        Math.random() * 2.0 + 0.9,
  }));

  const glows = Array.from({ length: 5 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 52 + 26,
    alpha: Math.random() * 0.035 + 0.01,
    vx:    (Math.random() - 0.5) * 0.11,
    vy:    (Math.random() - 0.5) * 0.09,
    color: Math.random() > 0.5 ? '201,169,110' : '139,154,123',
  }));

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    glows.forEach(g => {
      g.x += g.vx; g.y += g.vy;
      if (g.x < -g.r) g.x = canvas.width + g.r;
      if (g.x > canvas.width + g.r) g.x = -g.r;
      if (g.y < -g.r) g.y = canvas.height + g.r;
      if (g.y > canvas.height + g.r) g.y = -g.r;
      const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
      grad.addColorStop(0, `rgba(${g.color},${g.alpha})`);
      grad.addColorStop(1, `rgba(${g.color},0)`);
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    particles.forEach(p => {
      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha > 0.18 || p.alpha < 0.02) p.twinkleDir *= -1;
      p.x += p.vx; p.y += p.vy;
      if (p.y < -6) { p.y = canvas.height + 6; p.x = Math.random() * canvas.width; }
      if (p.x < -6) p.x = canvas.width + 6;
      if (p.x > canvas.width + 6) p.x = -6;
      const col = p.color.replace('VAL', p.alpha.toFixed(3));
      if (p.diamond) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = col;
        const s = p.size2;
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      }
    });

    requestAnimationFrame(drawFrame);
  }
  drawFrame();

}); // end DOMContentLoaded

/* ══════════════════════════════════════════════════════
   APPOINTMENT FORM — validation, loading & success states
══════════════════════════════════════════════════════ */
(function () {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const fields = {
    fname:   document.getElementById('f_fname'),
    lname:   document.getElementById('f_lname'),
    phone:   document.getElementById('f_phone'),
    email:   document.getElementById('f_email'),
    service: document.getElementById('f_service'),
    date:    document.getElementById('f_date'),
    notes:   document.getElementById('f_notes'),
  };
  const errors = {
    fname:   document.getElementById('err_fname'),
    phone:   document.getElementById('err_phone'),
    email:   document.getElementById('err_email'),
    service: document.getElementById('err_service'),
    date:    document.getElementById('err_date'),
  };
  const btn        = document.getElementById('btnBook');
  const btnLabel   = btn?.querySelector('.btn-book-label');
  const successMsg = document.getElementById('cfSuccess');

  // Prevent selecting a past date.
  if (fields.date) {
    const today = new Date();
    const iso = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    fields.date.min = iso;
  }

  const PHONE_RE = /^[0-9+\-\s()]{7,16}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(key, message) {
    const el = errors[key];
    const input = fields[key];
    if (el) el.textContent = message || '';
    if (input) input.classList.toggle('cf-invalid', !!message);
  }

  function validate() {
    let valid = true;

    if (!fields.fname.value.trim()) {
      setError('fname', 'First name is required.');
      valid = false;
    } else setError('fname', '');

    const phoneVal = fields.phone.value.trim();
    if (!phoneVal) {
      setError('phone', 'Phone number is required.');
      valid = false;
    } else if (!PHONE_RE.test(phoneVal)) {
      setError('phone', 'Enter a valid phone number.');
      valid = false;
    } else setError('phone', '');

    const emailVal = fields.email.value.trim();
    if (emailVal && !EMAIL_RE.test(emailVal)) {
      setError('email', 'Enter a valid email address.');
      valid = false;
    } else setError('email', '');

    if (!fields.service.value) {
      setError('service', 'Please select a service.');
      valid = false;
    } else setError('service', '');

    const dateVal = fields.date.value;
    if (dateVal) {
      const chosen = new Date(dateVal + 'T00:00:00');
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (chosen < now) {
        setError('date', 'Please choose a current or future date.');
        valid = false;
      } else setError('date', '');
    } else setError('date', '');

    return valid;
  }

  // Clear a field's error as soon as the user edits it.
  Object.keys(fields).forEach(key => {
    const el = fields[key];
    if (!el || !errors[key]) return;
    el.addEventListener('input', () => setError(key, ''));
    el.addEventListener('change', () => setError(key, ''));
  });

  let submitting = false;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions
    if (!validate()) {
      const firstInvalid = form.querySelector('.cf-invalid, [aria-invalid="true"]');
      const firstErrorKey = Object.keys(errors).find(k => errors[k] && errors[k].textContent);
      (fields[firstErrorKey] || firstInvalid)?.focus();
      return;
    }

    submitting = true;
    if (btn) btn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Preparing your request…';
    if (successMsg) successMsg.hidden = true;

    const firstName = fields.fname.value.trim();
    const lastName  = fields.lname.value.trim();
    const phone     = fields.phone.value.trim();
    const email     = fields.email.value.trim();
    const service   = fields.service.value;
    const date      = fields.date.value;
    const notes     = fields.notes.value.trim();

    const formattedDate = date
      ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Not selected';

    const message =
      `🦷 *New Appointment – ZEN | Outtamane Dental Clinic*\n\n` +
      `👤 *Name:* ${firstName} ${lastName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📧 *Email:* ${email || 'Not provided'}\n` +
      `🦷 *Service:* ${service || 'Not selected'}\n` +
      `📅 *Date:* ${formattedDate}\n` +
      `📝 *Notes:* ${notes || 'None'}\n\n` +
      `_Sent from ZEN | Outtamane website_ 😊`;

    const encoded = encodeURIComponent(message);

    // Small delay so the "processing" state is visible before WhatsApp opens.
    setTimeout(() => {
      window.open('https://wa.me/919486669903?text=' + encoded, '_blank');
      if (successMsg) successMsg.hidden = false;
      if (btnLabel) btnLabel.textContent = 'Confirm via WhatsApp';
      if (btn) btn.disabled = false;
      submitting = false;
    }, 600);
  });
})();
/* ══════════════════════════════════════════════════════
   DUAL BOOKING MODAL — In-Clinic vs Teleconsultation
══════════════════════════════════════════════════════ */
let lastFocusedBeforeModal = null;

function getFocusable(container) {
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

function openBookingModal(e) {
  if (e) e.preventDefault();
  const overlay = document.getElementById('bookingOverlay');
  if (!overlay) return;
  lastFocusedBeforeModal = document.activeElement;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  const modal = overlay.querySelector('.booking-modal');
  const focusable = modal ? getFocusable(modal) : [];
  (focusable[0] || modal)?.focus();
}
function closeBookingModal() {
  const overlay = document.getElementById('bookingOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  lastFocusedBeforeModal?.focus();
}
document.getElementById('bookingClose')?.addEventListener('click', closeBookingModal);
document.getElementById('bookingOverlay')?.addEventListener('click', function (e) {
  if (e.target === this) closeBookingModal();
});
document.addEventListener('keydown', function (e) {
  const overlay = document.getElementById('bookingOverlay');
  const isModalOpen = overlay?.classList.contains('active');

  if (e.key === 'Escape') {
    if (isModalOpen) { closeBookingModal(); return; }
    // Also close the mobile nav menu on ESC.
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      hamburger?.focus();
    }
    return;
  }

  // Trap focus inside the booking modal while it's open.
  if (isModalOpen && e.key === 'Tab') {
    const modal = overlay.querySelector('.booking-modal');
    const focusable = modal ? getFocusable(modal) : [];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
});

/* ══════════════════════════════════════════════════════
   SOCIAL PLACEHOLDER LINKS — no real URL yet, don't navigate
══════════════════════════════════════════════════════ */
document.querySelectorAll('.social-placeholder').forEach(link => {
  link.addEventListener('click', e => e.preventDefault());
});

/* ══════════════════════════════════════════════════════
   GALLERY — real category filtering + accessible lightbox
══════════════════════════════════════════════════════ */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.g-item'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter || 'all';
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      grid.classList.toggle('is-filtered', filter !== 'all');
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('g-hidden', !match);
      });
    });
  });

  // Lightbox — built from the gallery's images (video items are excluded).
  const lightbox   = document.getElementById('galleryLightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');
  if (!lightbox || !lbImg) return;

  const slides = items
    .map(item => item.querySelector('img'))
    .filter(Boolean)
    .map(img => ({ src: img.currentSrc || img.src, alt: img.alt || '' }));

  let currentIndex = -1;
  let lastFocusedBeforeLightbox = null;

  function showSlide(index) {
    if (!slides.length) return;
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];
    lbImg.src = slide.src;
    lbImg.alt = slide.alt;
    if (lbCaption) lbCaption.textContent = slide.alt;
  }

  function openLightbox(index) {
    if (!slides.length) return;
    lastFocusedBeforeLightbox = document.activeElement;
    showSlide(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
    lastFocusedBeforeLightbox?.focus();
  }

  items.forEach((item, idx) => {
    const img = item.querySelector('img');
    if (!img) return; // skip the video item — no lightbox for it
    const slideIndex = slides.findIndex(s => s.src === (img.currentSrc || img.src));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', 'View larger image: ' + (img.alt || 'gallery photo'));
    item.addEventListener('click', () => openLightbox(slideIndex));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(slideIndex);
      }
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => showSlide(currentIndex - 1));
  lbNext?.addEventListener('click', () => showSlide(currentIndex + 1));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    if (e.key === 'Tab') {
      // simple focus trap between close/prev/next while lightbox is open
      const focusable = [lbClose, lbPrev, lbNext].filter(Boolean);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ══════════════════════════════════════════════════════
   DENTAL TOURISM — SAVINGS CALCULATOR
══════════════════════════════════════════════════════ */
(function () {
  const treatmentSel = document.getElementById('tcTreatment');
  const countrySel   = document.getElementById('tcCountry');
  const elIndia   = document.getElementById('tcIndia');
  const elAbroad  = document.getElementById('tcAbroad');
  const elSaving  = document.getElementById('tcSaving');
  if (!treatmentSel || !countrySel) return;

  function calc() {
    const [india, abroadUSD] = treatmentSel.value.split('|').map(Number);
    const factor = parseFloat(countrySel.value);
    const abroad = Math.round(abroadUSD * factor);
    const savingPct = Math.round(((abroad - india) / abroad) * 100);
    elIndia.textContent  = '$' + india.toLocaleString();
    elAbroad.textContent = '$' + abroad.toLocaleString();
    elSaving.textContent = savingPct + '%';
  }
  treatmentSel.addEventListener('change', calc);
  countrySel.addEventListener('change', calc);
  calc();
})();

/* ══════════════════════════════════════════════════════
   HERO — subtle pointer parallax (desktop only, motion-safe)
══════════════════════════════════════════════════════ */
(function () {
  const hero = document.getElementById('home');
  if (!hero) return;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduce) return;

  let raf = null;
  hero.addEventListener('pointermove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      const r = hero.getBoundingClientRect();
      // -0.5 … 0.5 relative to hero centre
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width  - 0.5).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - r.top)  / r.height - 0.5).toFixed(3));
      raf = null;
    });
  });
  hero.addEventListener('pointerleave', function () {
    hero.style.setProperty('--mx', 0);
    hero.style.setProperty('--my', 0);
  });
})();