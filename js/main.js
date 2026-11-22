/**
 * DeveloperFolio-Inspired Interactive Portfolio Engine
 * Author: Nithin Pathikonda
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Functionality (Dark / Light Mode)
  initTheme();

  // 2. Dynamic Typewriter Effect for Hero
  initTypewriter();

  // 3. Mobile Navigation Toggle
  initMobileNav();

  // 4. Scroll Active Navigation Highlight
  initScrollSpy();

  // 5. Copy Email to Clipboard
  initCopyEmail();
});

/* --------------------------------------------------------------------------
   THEME TOGGLE
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Retrieve stored theme or default to system preference (or dark)
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'dark');

  root.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const typedTextSpan = document.getElementById('typedText');
  if (!typedTextSpan) return;

  const roles = [
    'Software Developer (SDE 1) @ HPE',
    'High-Throughput Go Microservices',
    'Enterprise Agentic AI & MCP Systems',
    'Distributed Systems & Cloud Engineer',
    'Kubernetes & Platform Reliability'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 80;
  const deletingSpeed = 40;
  const delayBetweenRoles = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      currentSpeed = delayBetweenRoles;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      currentSpeed = 300;
    }

    setTimeout(type, currentSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   MOBILE NAV TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   SCROLL SPY (ACTIVE NAV LINK)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   COPY EMAIL
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const icon = copyBtn.querySelector('i');
        icon.className = 'fa-solid fa-check text-green';
        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   CONTACT FORM SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('senderName').value;
  const email = document.getElementById('senderEmail').value;
  const subject = document.getElementById('senderSubject').value;
  const message = document.getElementById('senderMessage').value;

  const mailtoBody = encodeURIComponent(
    `Hi Nithin,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
  );
  const mailtoSubject = encodeURIComponent(subject);
  const mailtoLink = `mailto:nithinpathikonda360@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  const toast = document.getElementById('formSuccessToast');
  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4500);
  }

  // Open default email client
  window.location.href = mailtoLink;
}

/* --------------------------------------------------------------------------
   KANSO UI/UX SHOWCASE MODAL CONTROLLER
   -------------------------------------------------------------------------- */
const kansoSlides = [
  {
    img: 'assets/kanso/routines.png',
    badge: 'Kyoto Zen Habit Cards',
    title: 'Frictionless Daily Check-in & Golden Resets',
    desc: 'Eliminates streak shame using James Clear\'s "Never Miss Twice" psychology. Features 2-minute golden reset cards with Stoic & Zen wisdom to instantly reignite flow after an off day.',
    bullets: [
      'Pure #000000 OLED black theme turning pixels physically off and saving battery',
      '1.2px hairline borders with native iOS CoreHaptics tactile feedback',
      'Dynamic weekly momentum strip anchored to current date with real-time status'
    ]
  },
  {
    img: 'assets/kanso/matrix.png',
    badge: 'Never Miss Twice Calendar',
    title: '4×4 Visual Momentum Grid & Recovery States',
    desc: 'A glanceable, psychological adherence grid replacing arbitrary streak counters. Distinct visual indicators distinguish normal flow, 1-day pause, 2-day recovery, and critical delay warnings.',
    bullets: [
      'Four distinct color states: All Done (White), Partial, 1-Day Pause (Yellow), 2d Reset',
      'Early warning detection: Dotted ring (3d Warning) & Solid ring (4d+ Critical)',
      'Sub-segmented filtering: Switch between Month, Year Matrix, and Individual Routines'
    ]
  },
  {
    img: 'assets/kanso/analytics.png',
    badge: 'Stock-Style Velocity Engine',
    title: 'Composite Habit Index & Bullish Momentum',
    desc: 'Visualizes habit formation as an investment portfolio. Stock-market trendline charts show whether your daily consistency is trending bullish, stabilizing, or facing resistance.',
    bullets: [
      'Smooth SVG Bézier curve with animated glowing momentum gradient',
      'Peak, Dip, and Average velocity metrics calculated over 1W, 1M, and 1Y horizons',
      'Zero external charting libraries; lightweight custom SVG math rendered via Hermes'
    ]
  },
  {
    img: 'assets/kanso/widgets.png',
    badge: 'iOS Widget Studio',
    title: 'Glanceable Native iOS Home Screen Widgets',
    desc: 'Designed for iOS home launchers in Medium (4×2), Small (2×2 Spotlight), and Large (4×4 Matrix) form factors, keeping habits top-of-mind without opening the app.',
    bullets: [
      'Medium 4×2: Top priority routines with one-tap completion status',
      'Small 2×2 Spotlight: Habit spotlight with 7-day past rhythm dots',
      'Large 4×4 Matrix: Full monthly Never Miss Twice matrix on your iPhone home screen'
    ]
  }
];

let currentKansoIndex = 0;

function openKansoModal() {
  const modal = document.getElementById('kansoModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchKansoSlide(0);
  }
}

function closeKansoModal() {
  const modal = document.getElementById('kansoModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleKansoModalBackdrop(event) {
  if (event.target.id === 'kansoModal') {
    closeKansoModal();
  }
}

function switchKansoSlide(index) {
  currentKansoIndex = index;
  const slide = kansoSlides[index];
  if (!slide) return;

  const img = document.getElementById('kansoSlideImg');
  const badge = document.getElementById('kansoSlideBadge');
  const title = document.getElementById('kansoSlideTitle');
  const desc = document.getElementById('kansoSlideDesc');
  const bullets = document.getElementById('kansoSlideBullets');

  if (img) img.src = slide.img;
  if (badge) badge.textContent = slide.badge;
  if (title) title.textContent = slide.title;
  if (desc) desc.textContent = slide.desc;
  if (bullets) {
    bullets.innerHTML = slide.bullets
      .map(b => `<li><i class="fa-solid fa-circle-check"></i> ${b}</li>`)
      .join('');
  }

  for (let i = 0; i < 4; i++) {
    const tab = document.getElementById(`kansoTab${i}`);
    if (tab) {
      if (i === index) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeKansoModal();
  }
});

