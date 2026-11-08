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

