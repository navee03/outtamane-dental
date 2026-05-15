/* ══════════════════════════════════════════════════
   EVER SMILE DENTAL CLINIC — script.js
   Navbar · Scroll Reveal · Ticker · WhatsApp · Nav Active
══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR scroll effect ─── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* hamburger toggle */
  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  /* close mobile menu on link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  /* ─── 2. SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  /* ─── 3. TICKER ─── */
  const services = [
    'General Dentistry',
    'Teeth Cleaning & Whitening',
    'Root Canal Treatment',
    'Dental Implants',
    'Braces & Aligners',
    'Smile Makeover & Cosmetic Dentistry',
    'Pediatric Dentistry',
    'Tooth Extraction',
    'Crowns & Bridges',
    'Emergency Dental Care',
  ];

  const tickerTrack = document.getElementById('ticker');
  if (tickerTrack) {
    const starSVG = `<svg class="ticker-icon" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`;
    const html = [...services, ...services]   // duplicate for seamless loop
      .map(s => `<span class="ticker-item">${starSVG}${s}<span class="ticker-dot"></span></span>`)
      .join('');
    tickerTrack.innerHTML = html;
  }

  /* ─── 4. GALLERY FILTER TABS ─── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ─── 5. TESTIMONIAL DOT NAV ─── */
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ─── 6. ACTIVE NAV LINK on scroll ─── */
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  /* ─── 7. STAGGER card animations ─── */
  document.querySelectorAll('.svc-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.why-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
  document.querySelectorAll('.t-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });

  /* ─── 8. COUNTER ANIMATION (stats) ─── */
  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const step    = 16;
    const inc     = target / (dur / step);
    let   current = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ─── 9. WHATSAPP FORM SUBMIT ─── */
  window.sendWhatsApp = function () {
    const name      = (document.getElementById('name')      ?.value || '').trim();
    const phone     = (document.getElementById('phone')     ?.value || '').trim();
    const email     = (document.getElementById('email')     ?.value || '').trim();
    const date      = (document.getElementById('date')      ?.value || '');
    const treatment = (document.getElementById('treatment') ?.value || '');
    const concern   = (document.getElementById('concern')   ?.value || '').trim();

    if (!name || !phone || !treatment) {
      alert('Please fill in your Name, Phone number, and select a Treatment.');
      return;
    }

    const message =
      `Hello Ever Smile Dental Clinic! 😊%0A%0A` +
      `*New Appointment Request*%0A%0A` +
      `👤 Name: ${name}%0A` +
      `📞 Phone: ${phone}%0A` +
      `📧 Email: ${email || 'Not provided'}%0A` +
      `📅 Preferred Date: ${date || 'Flexible'}%0A` +
      `🦷 Treatment: ${treatment}%0A` +
      `📝 Concern: ${concern || 'N/A'}`;

    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');

    /* simple toast */
    showToast('Redirecting to WhatsApp…', '#25d366');
  };

  /* ─── 10. TOAST helper ─── */
  function showToast(msg, bg = var_gold) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:28px;right:28px;z-index:9999;
      background:${bg};color:#fff;padding:13px 20px;
      border-radius:12px;font-size:14px;font-weight:600;
      box-shadow:0 4px 20px rgba(0,0,0,0.22);
      display:flex;align-items:center;gap:9px;
      transform:translateY(80px);opacity:0;
      transition:all 0.4s cubic-bezier(.22,1,.36,1);
    `;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateY(80px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3200);
  }

  const var_gold = '#C9A96E';

});