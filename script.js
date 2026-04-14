// ======================
// Mobile Menu Toggle
// ======================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Note: Le basculement du menu est géré directement par l'attribut onclick 
// dans vos fichiers HTML pour éviter les doubles déclenchements.
// Exemple: onclick="document.querySelector('.nav-menu').classList.toggle('active')"


// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ======================
// Navbar Scroll Effect
// ======================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(26, 93, 106, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(26, 93, 106, 0.08)';
    }

    lastScroll = currentScroll;
});

// ======================
// Fade-in on Scroll Animation
// ======================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ======================
// Smooth Scroll for Anchor Links
// ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ======================
// Card Hover Effects with Parallax
// ======================
document.querySelectorAll('.preview-card, .expertise-card, .solution-card, .resource-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ======================
// Animated Counter for Stats
// ======================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('h3');
            const targetValue = parseInt(statNumber.textContent.replace(/\D/g, ''));
            statNumber.dataset.suffix = statNumber.textContent.replace(/[0-9]/g, '');
            animateCounter(statNumber, targetValue);
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ======================
// Particles Animation in Hero
// ======================
function createParticle() {
    const hero = document.querySelector('.hero-particles');
    if (!hero) return;
    
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'white';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.animation = `float ${Math.random() * 3 + 3}s ease-in-out infinite`;
    
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

// Create particles periodically
setInterval(createParticle, 300);

// ======================
// Coral 3D Simple Animation
// ======================
const coral = document.getElementById('coral3d');
if (coral) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        coral.style.transform = `translateY(-50%) translateX(${x}px) translateY(${y}px)`;
    });
    
    // Add pulsing circles inside coral
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.width = `${200 - i * 50}px`;
        circle.style.height = `${200 - i * 50}px`;
        circle.style.border = '2px solid rgba(127, 196, 201, 0.3)';
        circle.style.borderRadius = '50%';
        circle.style.top = '50%';
        circle.style.left = '50%';
        circle.style.transform = 'translate(-50%, -50%)';
        circle.style.animation = `pulse ${3 + i}s ease-in-out infinite`;
        circle.style.animationDelay = `${i * 0.5}s`;
        coral.appendChild(circle);
    }
}

// ======================
// Expertise Cards Staggered Animation
// ======================
const expertiseCards = document.querySelectorAll('.expertise-card');
expertiseCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ======================
// Partner Logos Animation
// ======================
const partnerLogos = document.querySelectorAll('.partner-logo');
partnerLogos.forEach((logo, index) => {
    logo.style.animationDelay = `${index * 0.15}s`;
});

// ======================
// Resource Cards Filter Animation
// ======================
const resourceCards = document.querySelectorAll('.resource-card');
resourceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ======================
// CTA Background Animation
// ======================
const ctaBackground = document.querySelector('.cta-background');
if (ctaBackground) {
    let angle = 0;
    setInterval(() => {
        angle += 0.5;
        ctaBackground.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

// ======================
// Active Nav Link Based on Scroll Position
// ======================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section-preview');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.className.split(' ')[1]?.replace('-preview', '');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ======================
// Preloader (optional)
// ======================
window.addEventListener('load', () => {
    document.body.style.overflow = 'visible';
    document.body.style.opacity = '1';
});

// ======================
// Performance Optimization
// ======================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ======================
// Console Message
// ======================
console.log('%c🌊 Acropora Data', 'color: #1a5d6a; font-size: 24px; font-weight: bold;');
console.log('%cTransformez vos données en actifs stratégiques', 'color: #4a9fa8; font-size: 14px;');
console.log('%cSite web créé avec passion 💙', 'color: #7fc4c9; font-size: 12px;');

// ======================
// Parallax Coral Effect
// ======================
let scrollPosition = 0;

function updateParallax() {
    scrollPosition = window.pageYOffset;
    document.body.style.setProperty('--scroll', scrollPosition);
    document.body.classList.add('parallax-active');
}

// Throttle function for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', throttle(updateParallax, 10));

// Initialize parallax
updateParallax();