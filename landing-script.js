// ===========================
// LANDING PAGE JAVASCRIPT
// ===========================

// Active Navigation Link on Scroll
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
});

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.style.display = 'none';
      });
    });
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      const offsetTop = target.offsetTop - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Intersection Observer for Fade-in Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .project-card, .stat-item, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// Animate Numbers on Scroll
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const h4 = entry.target.querySelector('h4');
      const targetValue = parseInt(h4.textContent);
      
      if (!isNaN(targetValue)) {
        animateCounter(h4, targetValue);
        entry.target.dataset.animated = 'true';
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => {
  statsObserver.observe(el);
});

// Parallax Effect on Mouse Move
document.addEventListener('mousemove', function(e) {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotateX = (y - 0.5) * 10;
    const rotateY = (x - 0.5) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
});

// Reset transform on mouse leave
document.addEventListener('mouseleave', function() {
  document.querySelectorAll('.stat-card').forEach(card => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// Mobile Responsive Menu
function handleResize() {
  const navMenu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.hamburger');
  
  if (window.innerWidth >= 768) {
    if (navMenu) navMenu.style.display = 'flex';
    if (hamburger) hamburger.style.display = 'none';
  } else {
    if (hamburger) hamburger.style.display = 'flex';
  }
}

window.addEventListener('resize', handleResize);
handleResize();

// Scroll Progress Bar
const progressBar = document.createElement('div');
progressBar.style.position = 'fixed';
progressBar.style.top = '0';
progressBar.style.left = '0';
progressBar.style.height = '3px';
progressBar.style.background = 'linear-gradient(90deg, #00f5ff, #00ff88)';
progressBar.style.zIndex = '999';
progressBar.style.width = '0%';
progressBar.style.transition = 'width 0.1s ease';
document.body.appendChild(progressBar);

window.addEventListener('scroll', function() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
});

// Form Validation Example (if you add a contact form)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && window.innerWidth < 768) {
      navMenu.style.display = 'none';
    }
  }
});

console.log('Landing page loaded successfully!');
