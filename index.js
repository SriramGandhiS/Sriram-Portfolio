// =======================
// Mouse Particle Effect (Standard)
// =======================
const canvas = document.createElement('canvas');
canvas.id = 'mouseParticles';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.life = 0.55;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.005;
  }
  draw() {
    // PINK PARTICLES
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
    gradient.addColorStop(0, `rgba(255, 0, 127, ${this.life})`);
    gradient.addColorStop(1, `rgba(255, 0, 127, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.life <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('mousemove', e => {
  for (let i = 0; i < 6; i++) {
    particles.push(new Particle(e.x, e.y));
  }
});


// =======================
// 3D Parallax Tilt Engine
// =======================
document.querySelectorAll('.project-card, .company-card, .contact-3d-card').forEach(card => {
  // Add glare element if missing
  if (!card.querySelector('.card-glare')) {
    const glare = document.createElement('div');
    glare.classList.add('card-glare');
    card.appendChild(glare);
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Moderate Tilt (Not too aggressive, not too subtle)
    let rotateX = ((y - centerY) / centerY) * -15;
    let rotateY = ((x - centerX) / centerX) * 15;

    // Slightly less tilt for the big contact card
    if (card.classList.contains('contact-3d-card')) {
      rotateX *= 0.5;
      rotateY *= 0.5;
    }

    // Glare Position
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  });
});


// =======================
// Smooth Scroll
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});


// =======================
// Certifications & Resume Modals
// =======================
const certBtn = document.getElementById('certBtn');
const certModal = document.getElementById('certModal');
const closeBtn = document.querySelector('.close-modal');

// Data
const certData = {
  "AWS": [
    { name: "AWS Academy Graduate", file: "certificates/aws_real.pdf" }
  ],
  "MongoDB": [
    { name: "MongoDB Basics", file: "certificates/Mango Db.pdf#page=1" },
    { name: "MongoDB Aggregation", file: "certificates/Mango Db.pdf#page=2" },
    { name: "Node.js (Developer Path)", file: "certificates/Mango Db.pdf#page=3" },
    { name: "Data Modeling", file: "certificates/Mango Db.pdf#page=4" },
    { name: "Performance & Indexes", file: "certificates/Mango Db.pdf#page=5" },
    { name: "Atlas Search", file: "certificates/Mango Db.pdf#page=6" },
    { name: "Security", file: "certificates/Mango Db.pdf#page=7" },
    { name: "MongoDB DBA", file: "certificates/Mango Db.pdf#page=8" },
    { name: "MongoDB Architecture", file: "certificates/Mango Db.pdf#page=9" },
    { name: "MongoDB CRUD", file: "certificates/Mango Db.pdf#page=10" },
    { name: "MongoDB Transactions", file: "certificates/Mango Db.pdf#page=11" },
    { name: "MongoDB Scale", file: "certificates/Mango Db.pdf#page=12" }
  ],
  "HackerRank": [
    { name: "Python (Basic)", file: "certificates/Hacker ranker.pdf#page=1" },
    { name: "Java (Basic)", file: "certificates/Hacker ranker.pdf#page=2" },
    { name: "SQL (Basic)", file: "certificates/Hacker ranker.pdf#page=3" },
    { name: "Problem Solving", file: "certificates/Hacker ranker.pdf#page=4" },
    { name: "CSS (Basic)", file: "certificates/Hacker ranker.pdf#page=5" },
    { name: "JavaScript (Basic)", file: "certificates/Hacker ranker.pdf#page=6" },
    { name: "Node.js (Basic)", file: "certificates/Hacker ranker.pdf#page=7" }
  ],
  "Arduino": [
    { name: "Participant Certificate", file: "certificates/arduino_real.pdf" }
  ],
  "Internshala": [
    { name: "Web Development", file: "certificates/internshala_real.pdf" }
  ]
};
// Open/Close Cert Modal
if (certBtn) {
  certBtn.addEventListener('click', (e) => {
    e.preventDefault();
    certModal.classList.add('active');
  });
}
if (closeBtn) closeBtn.addEventListener('click', () => { certModal.classList.remove('active'); });
if (certModal) certModal.addEventListener('click', (e) => { if (e.target === certModal) certModal.classList.remove('active'); });


// =======================
// NEW Interactive Parallax Certificates
// =======================
const certParallaxOverlay = document.getElementById('certParallaxOverlay');
const parallaxContent = document.getElementById('parallaxContent');
const closeParallaxBtn = document.getElementById('closeParallaxBtn');

function openParallaxView(companyName) {
  const certs = certData[companyName] || [];
  if (certs.length === 0) return;

  // Clear previous
  parallaxContent.innerHTML = '';

  // Show overlay
  certParallaxOverlay.classList.add('active');

  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  certs.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'p-cert-card p-cert-iframe-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const canvasId = `pdf-canvas-${companyName.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
    const fileUrl = cert.file.split('#')[0];

    card.innerHTML = `
      <canvas id="${canvasId}" style="width: 100%; height: 100%; object-fit: cover; background: #fff;"></canvas>
      <div class="cert-bento-label">
        <span class="cert-index">${index + 1} / ${certs.length}</span>
        <span class="cert-name">${cert.name}</span>
        <a href="${fileUrl}" download class="cert-download-btn" title="Download">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
    `;

    parallaxContent.appendChild(card);

    // Render PDF to Canvas
    if (typeof pdfjsLib !== 'undefined') {
      const pageNum = parseInt(cert.file.split('#page=')[1] || "1");

      pdfjsLib.getDocument(fileUrl).promise.then(pdf => {
        return pdf.getPage(pageNum);
      }).then(page => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return; // In case user closed modal before render
        const context = canvas.getContext('2d');

        // Scale for high DPI display rendering quality
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      }).catch(err => {
        console.error("Error rendering PDF:", err);
      });
    }
  });
}

if (closeParallaxBtn) {
  closeParallaxBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    certParallaxOverlay.classList.remove('active');
    // Remove classes to trigger reverse animation before clearing
    const cards = parallaxContent.querySelectorAll('.p-cert-card');
    cards.forEach(card => card.className = 'p-cert-card');
  });
}

// Company Card Click -> Trigger Parallax directly
document.querySelectorAll('.company-card').forEach(card => {
  card.addEventListener('click', () => {
    openParallaxView(card.getAttribute('data-company'));
  });
});


// Resume Logic
const resumeBtn = document.getElementById('resumeTriggerBtn');
const resumeModal = document.getElementById('resumeModal');
const closeResumeBtn = document.querySelector('.close-resume');
const viewResumeCard = document.getElementById('viewResumeCard');
const resumeViewerModal = document.getElementById('resumeViewerModal');
const closeResumeViewerBtn = document.querySelector('.close-resume-viewer');
const resumeFrame = document.getElementById('resumeFrame');

if (resumeBtn) resumeBtn.addEventListener('click', (e) => { e.preventDefault(); resumeModal.classList.add('active'); });
if (closeResumeBtn) closeResumeBtn.addEventListener('click', () => resumeModal.classList.remove('active'));
if (resumeModal) resumeModal.addEventListener('click', (e) => { if (e.target === resumeModal) resumeModal.classList.remove('active'); });

if (viewResumeCard) {
  viewResumeCard.addEventListener('click', () => {
    resumeModal.classList.remove('active');
    resumeViewerModal.classList.add('active');
    resumeFrame.src = "certificates/Sriram_Resume.pdf";
  });
}

if (closeResumeViewerBtn) {
  closeResumeViewerBtn.addEventListener('click', () => {
    resumeViewerModal.classList.remove('active');
    resumeFrame.src = "";
  });
}

// =======================
// Reject Button Runaway Logic
// =======================
function addRunawayBehavior(btnEl) {
  if (!btnEl) return;

  btnEl.addEventListener('mouseover', function (e) {
    // Randomize movement on hover
    const x = Math.random() * 300 - 150; // -150 to 150 px
    const y = Math.random() * 200 - 100; // -100 to 100 px

    // Apply the transform
    this.style.transition = 'transform 0.2s ease-out';
    this.style.transform = `translate(${x}px, ${y}px) translateZ(60px)`;
  });

  btnEl.addEventListener('click', function (e) {
    // In the rare case they catch it!
    alert("You're fast! But I'd still love to work with you 😉");
    this.innerText = "Okay, maybe not 😅";
  });
}

const rejectBtn = document.getElementById('rejectBtn');
addRunawayBehavior(rejectBtn);

// =======================
// About Section: Stat Counters + Skill Bars + Parallax Blobs
// =======================
(function () {
  // --- Stat counter ---
  function startCounters() {
    document.querySelectorAll('.stat-num, .lc-total-num, .lc-meta-val[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      if (isNaN(target)) return;
      const duration = 1400;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 16);
    });
  }

  // --- Skill bars ---
  function startSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }

  // Trigger once on scroll into view
  let triggered = false;
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        startCounters();
        startSkillBars();
        obs.disconnect();
      }
    }, { threshold: 0.25 });
    obs.observe(aboutSection);
  }

  // --- Parallax blobs on scroll ---
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  window.addEventListener('scroll', () => {
    if (!aboutSection || !blob1 || !blob2) return;
    const rect = aboutSection.getBoundingClientRect();
    const rel = -rect.top;
    blob1.style.transform = `translateY(${rel * 0.18}px)`;
    blob2.style.transform = `translateY(${rel * -0.12}px)`;
  }, { passive: true });
})();

// =======================
// Mobile Menu Toggle
// =======================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Lock/Unlock body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
  });

  // Close menu when a link is clicked
  navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
}

// =======================
// JS Mastery Project Cards: Mouse Spotlight Effect
// =======================
document.querySelectorAll('.jsm-project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// =======================
// PROFILE CARD 3D TILT ENGINE & LOGIC (Vanilla JS)
// =======================
(function initProfileCard() {
  const wrapper = document.getElementById('profileCardWrapper');
  const shell = document.getElementById('profileCardShell');
  const contactBtn = document.getElementById('profileContactBtn');

  if (!wrapper || !shell) return;

  const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180
  };

  const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
  const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
  const adjust = (v, fMin, fMax, tMin, tMax) => round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

  let enterTimer = null;
  let leaveRaf = null;

  // Tilt Engine State
  let rafId = null;
  let running = false;
  let lastTs = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;
  let initialUntil = 0;

  // Device Orientation State
  // Disabled by default on mobile in this version per config: `enableMobileTilt={false}`
  const enableMobileTilt = false;

  const setVarsFromXY = (x, y) => {
    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;

    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    wrapper.style.setProperty('--pointer-x', `${percentX}%`);
    wrapper.style.setProperty('--pointer-y', `${percentY}%`);
    wrapper.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
    wrapper.style.setProperty('--pointer-from-center', `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`);
    wrapper.style.setProperty('--pointer-from-top', `${percentY / 100}`);
    wrapper.style.setProperty('--pointer-from-left', `${percentX / 100}`);
    wrapper.style.setProperty('--rotate-x', `${round(-(centerX / 10))}deg`);
    wrapper.style.setProperty('--rotate-y', `${round(centerY / 8)}deg`);
  };

  const step = ts => {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;

    setVarsFromXY(currentX, currentY);

    const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

    if (stillFar || document.hasFocus()) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  const startEngine = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  const setTarget = (x, y) => {
    targetX = x;
    targetY = y;
    startEngine();
  };

  const toCenter = () => {
    setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
  };

  const getOffsets = (evt) => {
    const rect = shell.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  // Event Listeners
  shell.addEventListener('pointerenter', (e) => {
    shell.classList.add('active');
    wrapper.classList.add('active');
    shell.classList.add('entering');

    if (enterTimer) clearTimeout(enterTimer);
    enterTimer = setTimeout(() => {
      shell.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

    const { x, y } = getOffsets(e);
    setTarget(x, y);
  });

  shell.addEventListener('pointermove', (e) => {
    const { x, y } = getOffsets(e);
    setTarget(x, y);
  });

  shell.addEventListener('pointerleave', () => {
    toCenter();

    const checkSettle = () => {
      const settled = Math.hypot(targetX - currentX, targetY - currentY) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        wrapper.classList.remove('active');
        leaveRaf = null;
      } else {
        leaveRaf = requestAnimationFrame(checkSettle);
      }
    };

    if (leaveRaf) cancelAnimationFrame(leaveRaf);
    leaveRaf = requestAnimationFrame(checkSettle);
  });

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to contact section
      document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initial Entry Animation
  const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
  const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
  currentX = initialX;
  currentY = initialY;
  setVarsFromXY(currentX, currentY);
  toCenter();

  initialUntil = performance.now() + ANIMATION_CONFIG.INITIAL_DURATION;
  startEngine();

})();