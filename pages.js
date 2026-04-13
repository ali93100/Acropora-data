// Pages JavaScript - Fonctionnalités spécifiques aux pages internes

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for coral background
window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 30;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 30;
    
    document.querySelectorAll('.page-section::before').forEach(section => {
        const coral = section;
        if (coral) {
            coral.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});

// Parallax scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('.page-section');
    
    sections.forEach((section, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed / 10);
        section.style.backgroundPositionY = `${yPos}px`;
    });
});

// Intersection Observer for fade-in animations
const pageObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, pageObserverOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    pageObserver.observe(el);
});

// Active section highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('.page-section[id]');
    const navLinks = document.querySelectorAll('.dropdown-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(current)) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveSection);

console.log('%c Page loaded successfully', 'color: #4a9fa8; font-size: 14px;');