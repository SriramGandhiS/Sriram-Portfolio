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
    { name: "Node.js (Basic)", file: "certificates/Hacker ranker.pdf#page=7" },
    { name: "React (Basic)", file: "certificates/Hacker ranker.pdf#page=8" },
    { name: "Problem Solving (Intermediate)", file: "certificates/Hacker ranker.pdf#page=9" },
    { name: "Java (Intermediate)", file: "certificates/Hacker ranker.pdf#page=10" },
    { name: "SQL (Intermediate)", file: "certificates/Hacker ranker.pdf#page=11" },
    { name: "Python (Intermediate)", file: "certificates/Hacker ranker.pdf#page=12" }
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

  // We assign specific fan-out classes based on how many certs there are.
  certs.forEach((cert, index) => {
    const card = document.createElement('div');
    card.className = 'p-cert-card p-cert-iframe-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="iframe-glass-cover" style="position: absolute; inset: 0; z-index: 5;"></div>
      <embed src="${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=Fit" type="application/pdf" style="width: 100%; height: 350px; border: none; pointer-events: none; display: block; background: #fff;"></embed>
      <div class="cert-bento-label">
        <span class="cert-index">${index + 1} / ${certs.length}</span>
        <span class="cert-name">${cert.name}</span>
      </div>
    `;

    parallaxContent.appendChild(card);
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
    resumeFrame.src = "Sriram_Resume.pdf";
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