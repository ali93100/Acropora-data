document.addEventListener('DOMContentLoaded', () => {
    // Configuration de l'observer
    const observerOptions = {
        threshold: 0.2, // Déclenchement à 20% de visibilité
        rootMargin: "0px 0px -50px 0px"
    };

    // ==========================================
    // 1. Auto-injection des classes d'animation
    // ==========================================
    
    // Titres de section
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal', 'reveal-left');
    });

    // Timeline
    // (Les classes sont gérées par le CSS via :nth-child, on ajoute juste la logique d'observer)

    // Cartes Hub & Solutions (Stagger effect automatique)
    document.querySelectorAll('.hub-cards-row, .resources-grid, .solutions-grid').forEach(row => {
        const children = row.querySelectorAll('.hub-card, .resource-card, .solution-card');
        children.forEach((child, index) => {
            child.classList.add('reveal', 'reveal-up');
            // Délai progressif : 150ms entre chaque carte
            child.style.transitionDelay = `${index * 150}ms`;
        });
    });

    // ==========================================
    // 2. Observer de Révélation (Scroll Reveal)
    // ==========================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Jouer une seule fois
            }
        });
    }, observerOptions);

    // Observer les éléments standards
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Initialiser les éléments avec data-animate (Fix pour éviter le contenu invisible si JS plante)
    document.querySelectorAll('[data-animate]').forEach(el => {
        // Désactiver temporairement la transition pour éviter le "fade-out" visible au chargement
        el.style.transition = 'none';
        
        const classes = el.getAttribute('data-animate').split(' ').filter(c => c.length > 0);
        
        // Forcer le navigateur à appliquer le changement immédiatement
        void el.offsetHeight; 
        // Réactiver les transitions CSS
        el.style.removeProperty('transition');
        
        revealObserver.observe(el);
    });

    // Observer les items de timeline
    document.querySelectorAll('.timeline-item').forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 3. Animation des Compteurs (Statistiques)
    // ==========================================
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target.querySelector('.hub-num');
                if (statElement) {
                    animateCounter(statElement);
                }
                // Animation d'entrée pour le bloc stat
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hub-stat').forEach((el, index) => {
        // Préparation CSS inline pour l'apparition
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        el.style.transitionDelay = `${index * 100}ms`;
        counterObserver.observe(el);
    });

    function animateCounter(el) {
        // Gestion intelligente du texte (ex: "120+" ou "99.9%")
        let originalText = el.innerText;
        let numberValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
        let suffix = originalText.replace(/[0-9.]/g, ''); // Récupère %, +, etc.
        
        // Si structure complexe HTML (ex: <span class="sup"></span>), on essaye de préserver
        let hasSup = el.querySelector('.sup');
        if(hasSup) suffix = ''; // Le span sup gère l'affichage

        let startTimestamp = null;
        const duration = 2000; // 2 secondes

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            let currentVal = numberValue * easeProgress;
            
            // Formatage (décimales ou entier)
            let displayVal = Number.isInteger(numberValue) 
                ? Math.floor(currentVal) 
                : currentVal.toFixed(1);

            // Mise à jour du DOM
            if (hasSup) {
                // Conserve la structure HTML interne
                el.innerHTML = `${displayVal}<span class="sup">${hasSup.innerText}</span>`;
            } else {
                el.innerText = displayVal + suffix;
            }

            if (progress < 1) window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);
    }

    // ==========================================
    // 4. Scrollytelling pour la section Équipe
    // ==========================================
    const lockedGrid = document.querySelector('.team-grid.scroll-locked');
    if (lockedGrid) {
        const textCol = lockedGrid.querySelector('.team-info-col');
        const photoCol = lockedGrid.querySelector('.team-photo-col');

        if (textCol && photoCol) {
            const setPhotoHeight = () => {
                // On s'assure que la colonne photo a la même hauteur que la colonne texte
                // pour que l'animation de scroll se termine au bon endroit.
                const textHeight = textCol.getBoundingClientRect().height;
                photoCol.style.height = `${textHeight}px`; // Hauteur strictement égale
            };

            // On le fait au chargement et au redimensionnement de la fenêtre
            setPhotoHeight();
            window.addEventListener('resize', setPhotoHeight);
            window.addEventListener('load', setPhotoHeight); // Sécurité supplémentaire
            // Force un recalcul après un court délai pour être sûr
            setTimeout(setPhotoHeight, 500);
        }
    }

    // ==========================================
    // 5. Effet Lighthouse (Approche Données)
    // ==========================================
    const approcheContainer = document.querySelector('.approche-flow');
    if (approcheContainer) {
        const nums = approcheContainer.querySelectorAll('.approche-step-num');
        let activeIdx = 0;
        let intervalId = null;

        const startLighthouse = () => {
            if (!intervalId) {
                nums.forEach(n => n.classList.remove('lighthouse'));
                nums[activeIdx].classList.add('lighthouse');
                activeIdx = (activeIdx + 1) % nums.length;

                intervalId = setInterval(() => {
                    nums.forEach(n => n.classList.remove('lighthouse'));
                    nums[activeIdx].classList.add('lighthouse');
                    activeIdx = (activeIdx + 1) % nums.length;
                }, 1500);
            }
        };

        const stopLighthouse = () => {
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            nums.forEach(n => n.classList.remove('lighthouse'));
            activeIdx = 0;
        };

        const obsLighthouse = new IntersectionObserver(e => e.forEach(entry => entry.isIntersecting ? startLighthouse() : stopLighthouse()), { threshold: 0.4 });
        obsLighthouse.observe(approcheContainer);
    }

    // ==========================================
    // 6. Effet Lighthouse Texte (Agile)
    // ==========================================
    const agileTextContainer = document.querySelector('.reveal-text-lighthouse');
    if (agileTextContainer) {
        const lines = agileTextContainer.querySelectorAll('span');
        let activeLineIdx = 0;
        let agileIntervalId = null;

        const startAgileLighthouse = () => {
            if (!agileIntervalId) {
                const cycle = () => {
                    lines.forEach(l => l.classList.remove('active'));
                    lines[activeLineIdx].classList.add('active');
                    activeLineIdx = (activeLineIdx + 1) % lines.length;
                };
                cycle();
                agileIntervalId = setInterval(cycle, 1400);
            }
        };

        const stopAgileLighthouse = () => {
            if (agileIntervalId) { clearInterval(agileIntervalId); agileIntervalId = null; }
            lines.forEach(l => l.classList.remove('active'));
            activeLineIdx = 0;
        };

        const obsAgile = new IntersectionObserver(e => e.forEach(entry => entry.isIntersecting ? startAgileLighthouse() : stopAgileLighthouse()), { threshold: 0.5 });
        obsAgile.observe(agileTextContainer);
    }
});