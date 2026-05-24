/* ============================================================
   JAZIRA ELEVATORS — script.js (Final Version)
   Features: Back4App Integration, Fixed Cursor, Fixed Navbar
   ============================================================ */

// 1. BACK4APP CONFIGURATION
const B4A_APP_ID = "FPwpCMhJBInoZ16ZhegP78tSkKnTh05sxI2KGTN8"; // Your App ID
const B4A_REST_KEY = "MpIm9H3Q5QddS9XalU1NhOKv53OnVB1O5ukHr6Um"; // Get this from Back4App Settings!

/* ── NAVBAR SCROLL FIX ── */
const navbar = document.getElementById('navbar') || document.querySelector('nav') || document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.backgroundColor = 'rgba(4, 8, 17, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.borderBottom = '1px solid rgba(0, 240, 255, 0.2)';
      navbar.classList.add('scrolled');
    } else {
      navbar.style.backgroundColor = 'transparent';
      navbar.style.backdropFilter = 'none';
      navbar.style.borderBottom = 'none';
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── CUSTOM CURSOR FIX (Crash-Proof) ── */
const cursorOuter = document.getElementById('cursorOuter') || document.getElementById('cursorRing');
const cursorInner = document.getElementById('cursorInner') || document.getElementById('cursorDot');
if (cursorOuter && cursorInner) {
  let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;
  
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorInner.style.left = mouseX + 'px';
    cursorInner.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top  = outerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .service-card, .contact-card, .btn-primary, .btn-secondary, input, select, textarea')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('particleCanvas') || document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.size   = Math.random() * 2.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.color  = Math.random() > 0.5 ? '0,229,255' : '100,180,255';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ── SMOOTH SCROLL ── */
window.scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── ELEVATOR ANIMATION ── */
const elevatorCab = document.getElementById('elevatorCab');
if (elevatorCab) {
  function triggerDoors() {
    elevatorCab.classList.add('doors-open');
    setTimeout(() => elevatorCab.classList.remove('doors-open'), 1800);
  }
  setInterval(triggerDoors, 5000);
}

const floorDisplay = document.getElementById('floorDisplay');
if (floorDisplay) {
  const floorBtns = document.querySelectorAll('.btn-floor');
  let curFloor = 5, tgtFloor = 0;
  function runElevator() {
    tgtFloor = Math.floor(Math.random() * 6);
    const tick = setInterval(() => {
      if (curFloor < tgtFloor) curFloor++;
      else if (curFloor > tgtFloor) curFloor--;
      floorDisplay.textContent = String(curFloor).padStart(2, '0');
      floorBtns.forEach((b, i) => b.classList.toggle('active', (i === 0 ? 0 : i) === curFloor));
      if (curFloor === tgtFloor) clearInterval(tick);
    }, 500);
  }
  setTimeout(runElevator, 3000);
  setInterval(runElevator, 12000);
}

/* ── SCROLL REVEAL ── */
const revealTargets = document.querySelectorAll(
  '.service-card, .why-card, .why-item, .process-step, .ab-feat, .contact-card, .quot-info, .quot-form-wrap, .section-header, .info-card'
);
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
});
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── COUNTER ANIMATION ── */
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    let v = 0;
    const step = target / (2000 / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(v);
    }, 16);
    cntObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target], .counter').forEach(el => cntObs.observe(el));

/* ── 3D CARD TILT ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height/2) / r.height) * -6;
    const ry = ((e.clientX - r.left - r.width/2)  / r.width)  * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    const glow = card.querySelector('.card-glow, .sc-glow');
    if (glow) { glow.style.left = (e.clientX - r.left) + 'px'; glow.style.top = (e.clientY - r.top) + 'px'; glow.style.opacity = '1'; }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    const glow = card.querySelector('.card-glow, .sc-glow');
    if (glow) glow.style.opacity = '0';
  });
});

/* ── CONTACT CARD GLOW ── */
document.querySelectorAll('.contact-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const bg = card.querySelector('.cc-bg');
    if (bg) bg.style.background = `radial-gradient(circle at ${((e.clientX-r.left)/r.width*100).toFixed(1)}% ${((e.clientY-r.top)/r.height*100).toFixed(1)}%, rgba(0,240,255,0.12) 0%, transparent 60%)`;
  });
});

/* ── INPUT LABEL HIGHLIGHT ── */
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
  el.addEventListener('focus', () => { const l = el.closest('.form-group')?.querySelector('label'); if (l) l.style.color = '#00f0ff'; });
  el.addEventListener('blur',  () => { const l = el.closest('.form-group')?.querySelector('label'); if (l) l.style.color = ''; });
});

/* ── MARQUEE PAUSE ── */
const mq = document.querySelector('.marquee-track');
if (mq) {
  mq.addEventListener('mouseenter', () => mq.style.animationPlayState = 'paused');
  mq.addEventListener('mouseleave', () => mq.style.animationPlayState = 'running');
}

/* ── FLOATING WHATSAPP BUTTON ── */
const floatWa = document.querySelector('.floating-wa');
if (floatWa) {
  floatWa.style.transform  = 'scale(0)';
  floatWa.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  setTimeout(() => { floatWa.style.transform = 'scale(1)'; }, 2000);
}

/* ── LOGO GLITCH ── */
const logoEl = document.querySelector('.logo-main, .logo-text');
if (logoEl) {
  setInterval(() => {
    if (Math.random() > 0.97) {
      logoEl.style.textShadow = '2px 0 #ff0080,-2px 0 #00f0ff';
      setTimeout(() => logoEl.style.textShadow = '', 80);
    }
  }, 500);
}

/* ── RIPPLE EFFECT ON BUTTONS ── */
document.querySelectorAll('.btn-primary, .form-submit').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);width:10px;height:10px;left:${e.clientX-rect.left-5}px;top:${e.clientY-rect.top-5}px;transform:scale(0);animation:ripple 0.5s linear;pointer-events:none`;
    if (!document.getElementById('rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes ripple{to{transform:scale(25);opacity:0}}';
      document.head.appendChild(s);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

/* ── SCROLL PROGRESS BAR ── */
const prog = document.createElement('div');
prog.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:9999;background:linear-gradient(90deg,#00f0ff,rgba(0,240,255,0.3));width:0;pointer-events:none;box-shadow:0 0 8px rgba(0,240,255,0.6)';
document.body.appendChild(prog);
window.addEventListener('scroll', () => {
  prog.style.width = ((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100) + '%';
}, { passive: true });

/* ── PAGE LOAD BAR ── */
const bar = document.createElement('div');
bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;z-index:99999;background:linear-gradient(90deg,#00f0ff,#00c8d4);box-shadow:0 0 10px #00f0ff;transition:width 0.3s ease;pointer-events:none';
document.body.appendChild(bar);
let pct = 0;
const barTimer = setInterval(() => {
  pct += Math.random() * 15;
  if (pct >= 100) {
    bar.style.width = '100%';
    clearInterval(barTimer);
    setTimeout(() => { bar.style.opacity = '0'; setTimeout(() => bar.remove(), 300); }, 200);
  } else bar.style.width = pct + '%';
}, 80);

/* ── PAGE LOAD FADE IN ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});

/* ── FOOTER YEAR ── */
const fyEl = document.querySelector('.footer-bottom p');
if (fyEl) fyEl.textContent = fyEl.textContent.replace(/\d{4}/, new Date().getFullYear());


/* ════════════════════════════════════════════════════
   QUOTATION FORM (BACK4APP INTEGRATION)
   ════════════════════════════════════════════════════ */

window.submitQuote = async function(e) {
  if (e) e.preventDefault();

  const form = document.getElementById('quotationForm') || document.getElementById('quoteForm') || (e && e.target);
  if (!form) return;

  const name    = (form.querySelector('#fName,#name,[name="name"],input[type="text"]')?.value || '').trim();
  const phone   = (form.querySelector('#fPhone,#phone,[name="phone"],input[type="tel"]')?.value || '').trim();
  const email   = (form.querySelector('#fEmail,#email,[name="email"],input[type="email"]')?.value || '').trim();
  const city    = (form.querySelector('#fCity,#city,[name="city"]')?.value || '').trim();
  const service = (form.querySelector('#fService,#service,[name="service"],select')?.value || '').trim();
  const floors  = (form.querySelector('#fFloors,#floors,[name="floors"]')?.value || 'Not specified').trim();
  const message = (form.querySelector('#fMessage,#message,[name="message"],textarea')?.value || '').trim();
  const building_type = (form.querySelector('input[name="buildingType"]:checked')?.value || '');

  if (!name || !phone) {
    showFormAlert(form, 'Please enter your name and phone number.', 'error');
    return;
  }

  const btn = form.querySelector('.form-submit,button[type="submit"],.btn-submit');
  const origHTML = btn?.innerHTML || '';
  if (btn) { btn.innerHTML = '<span>Sending Request…</span>'; btn.disabled = true; }

  let success = false;
  let errMsg  = '';

  try {
    const res = await fetch('https://parseapi.back4app.com/classes/Quotation', {
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': B4A_APP_ID,
        'X-Parse-REST-API-Key': B4A_REST_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        city: city || 'Not specified',
        service: service || 'Not specified',
        floors: Number(floors) || 0, // Ensure floors is saved as a number
        building_type: building_type,
        message: message,
        status: "new"
      })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      success = true;
    } else {
      errMsg = data.error || 'Something went wrong saving to the database.';
    }
  } catch (err) {
    errMsg = 'Cannot reach database. Check your internet connection.';
  }

  if (btn) { btn.innerHTML = origHTML; btn.disabled = false; }

  if (success) {
    form.style.display = 'none';
    const successEl = document.getElementById('formSuccess');
    if (successEl) {
      successEl.classList.add('show', 'active');
      const h3 = successEl.querySelector('h3');
      const p  = successEl.querySelector('p');
      if (h3) h3.textContent = 'Quotation Request Received! ✅';
      if (p)  p.textContent  = 'Thank you! Our team will review your details and contact you within 2 hours.';
    }
  } else {
    showFormAlert(form, errMsg, 'error');
  }
};

const quotationForm = document.getElementById('quotationForm');
if (quotationForm && !quotationForm.getAttribute('onsubmit')) {
  quotationForm.addEventListener('submit', window.submitQuote);
}

window.resetForm = function() {
  const form = document.getElementById('quotationForm') || document.getElementById('quoteForm');
  const succ = document.getElementById('formSuccess');
  if (form) { form.reset(); form.style.display = 'flex'; }
  if (succ) succ.classList.remove('show', 'active');
};

function showFormAlert(form, msg, type) {
  form.querySelector('.form-alert-msg')?.remove();
  const el = document.createElement('p');
  el.className = 'form-alert-msg';
  el.style.cssText = `color:${type==='error'?'#ff6b6b':'#25d366'};font-size:0.85rem;margin:0.5rem 0;padding:0.6rem 1rem;background:${type==='error'?'rgba(255,77,77,0.1)':'rgba(37,211,102,0.1)'};border:1px solid ${type==='error'?'rgba(255,77,77,0.3)':'rgba(37,211,102,0.3)'};border-radius:6px;`;
  el.textContent = msg;
  const btn = form.querySelector('.form-submit, button[type="submit"], .btn-submit');
  if (btn) form.insertBefore(el, btn);
  else form.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

console.log('%cJAZIRA ELEVATORS', 'color:#00f0ff;font-family:monospace;font-size:20px;font-weight:bold');
console.log('%c✅ Main Site Connected to Back4App', 'color:#00c8d4;font-family:monospace');