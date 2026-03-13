// =======================
// Mouse & Touch Particle Effect
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
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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
    this.size = Math.random() * (isMobile ? 1.5 : 2) + 1;
    this.speedX = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5);
    this.speedY = (Math.random() * 0.5 - 0.25) * (isMobile ? 0.6 : 1);
    this.life = 0.55;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.005;
  }
  draw() {
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

const handleInteraction = (x, y) => {
  const count = isMobile ? 2 : 6;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
};

window.addEventListener('mousemove', e => handleInteraction(e.clientX, e.clientY));
window.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  handleInteraction(touch.clientX, touch.clientY);
}, { passive: true });


// =======================
// 3D Parallax Tilt Engine (Mouse + Touch)
// =======================
document.querySelectorAll('.jsm-project-card, .company-card').forEach(card => {
  if (!card.querySelector('.card-glare')) {
    const glare = document.createElement('div');
    glare.classList.add('card-glare');
    card.appendChild(glare);
  }

  const handleMove = (clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let rotateX = ((y - centerY) / centerY) * -5;
    let rotateY = ((x - centerX) / centerX) * 5;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const resetTilt = () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
  };

  card.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
  card.addEventListener('mouseleave', resetTilt);

  // Touch Support
  card.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, { passive: true });
  card.addEventListener('touchend', resetTilt);
});


// =======================
// Smooth Scroll
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    e.preventDefault();
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  });
});


// =======================
// Certifications & Resume Modals
// =======================
const certBtn = document.getElementById('certBtn');
const certModal = document.getElementById('certModal');
const closeBtn = document.querySelector('.close-modal');

const certData = {
  "AWS": [{ name: "AWS Academy Graduate", file: "certificates/aws_real.pdf" }],
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
  "Arduino": [{ name: "Participant Certificate", file: "certificates/arduino_real.pdf" }],
  "Internshala": [{ name: "Web Development", file: "certificates/internshala_real.pdf" }]
};

if (certBtn) certBtn.addEventListener('click', e => { e.preventDefault(); certModal.classList.add('active'); });
if (closeBtn) closeBtn.addEventListener('click', () => certModal.classList.remove('active'));
if (certModal) certModal.addEventListener('click', e => { if (e.target === certModal) certModal.classList.remove('active'); });

const certParallaxOverlay = document.getElementById('certParallaxOverlay');
const parallaxContent = document.getElementById('parallaxContent');
const closeParallaxBtn = document.getElementById('closeParallaxBtn');

function openParallaxView(companyName) {
  const certs = certData[companyName] || [];
  if (certs.length === 0) return;
  parallaxContent.innerHTML = '';
  certParallaxOverlay.classList.add('active');
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  certs.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'p-cert-card';
    card.style.animationDelay = `${index * 0.1}s`;
    const canvasId = `pdf-canvas-${companyName.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
    const fileUrl = cert.file.split('#')[0];
    card.innerHTML = `
      <canvas id="${canvasId}" style="width: 100%; height: 100%; object-fit: cover; background: #fff;"></canvas>
      <div class="cert-bento-label">
        <span class="cert-index">${index + 1} / ${certs.length}</span>
        <span class="cert-name">${cert.name}</span>
        <a href="${fileUrl}" download class="cert-download-btn"><svg ...></svg></a>
      </div>
    `;
    parallaxContent.appendChild(card);
    if (typeof pdfjsLib !== 'undefined') {
      const pageNum = parseInt(cert.file.split('#page=')[1] || "1");
      pdfjsLib.getDocument(fileUrl).promise.then(pdf => pdf.getPage(pageNum)).then(page => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: context, viewport: viewport });
      });
    }
  });
}

if (closeParallaxBtn) closeParallaxBtn.addEventListener('click', () => certParallaxOverlay.classList.remove('active'));
document.querySelectorAll('.company-card').forEach(card => card.addEventListener('click', () => openParallaxView(card.getAttribute('data-company'))));

const resumeBtn = document.getElementById('resumeTriggerBtn');
const resumeModal = document.getElementById('resumeModal');
const closeResumeBtn = document.querySelector('.close-resume');
const viewResumeCard = document.getElementById('viewResumeCard');
const resumeFrame = document.getElementById('resumeFrame');
const resumeViewerModal = document.getElementById('resumeViewerModal');

if (resumeBtn) resumeBtn.addEventListener('click', e => { e.preventDefault(); resumeModal.classList.add('active'); });
if (closeResumeBtn) closeResumeBtn.addEventListener('click', () => resumeModal.classList.remove('active'));
if (viewResumeCard) viewResumeCard.addEventListener('click', () => {
  resumeModal.classList.remove('active');
  resumeViewerModal.classList.add('active');
  resumeFrame.src = "certificates/Sriram_Resume.pdf";
});

// Runaway toggle logic
const rejectBtn = document.getElementById('rejectBtn');
if (rejectBtn) {
  rejectBtn.addEventListener('mouseover', function() {
    this.style.transform = `translate(${Math.random()*200-100}px, ${Math.random()*150-75}px)`;
  });
}

// Stats & Skill Bars logic
(function() {
  const startCounters = () => {
    document.querySelectorAll('.stat-num, .lc-total-num, .lc-meta-val[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 16);
    });
  };
  const startBars = () => document.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.width + '%');
  const about = document.getElementById('about');
  if (about) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { startCounters(); startBars(); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(about);
  }
})();

// Mobile Menu improvements
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }));
}

// PROFILE CARD 3D TILT ENGINE (Enabling Mobile)
(function initProfileCard() {
  const wrapper = document.getElementById('profileCardWrapper');
  const shell = document.getElementById('profileCardShell');
  if (!wrapper || !shell) return;

  let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
  let running = false;

  const setVars = (x, y) => {
    const w = shell.clientWidth || 1, h = shell.clientHeight || 1;
    const px = (x/w)*100, py = (y/h)*100;
    wrapper.style.setProperty('--pointer-x', px + '%');
    wrapper.style.setProperty('--pointer-y', py + '%');
    wrapper.style.setProperty('--rotate-x', (-(px-50)/20) + 'deg');
    wrapper.style.setProperty('--rotate-y', ((py-50)/15) + 'deg');
    wrapper.style.setProperty('--card-opacity', '1');
  };

  const step = () => {
    if (!running) return;
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    setVars(currentX, currentY);
    if (Math.abs(targetX - currentX) > 0.1) requestAnimationFrame(step);
    else running = false;
  };

  const handleInput = (clientX, clientY) => {
    const r = shell.getBoundingClientRect();
    targetX = clientX - r.left; targetY = clientY - r.top;
    if (!running) { running = true; requestAnimationFrame(step); }
  };

  shell.addEventListener('mousemove', e => handleInput(e.clientX, e.clientY));
  shell.addEventListener('touchmove', e => handleInput(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  shell.addEventListener('mouseleave', () => { targetX = shell.clientWidth/2; targetY = shell.clientHeight/2; });
  shell.addEventListener('touchend', () => { targetX = shell.clientWidth/2; targetY = shell.clientHeight/2; });
})();