// Advanced Animations for BDSI Website
document.addEventListener('DOMContentLoaded', function() {
    initTypewriterEffect();
    initMoroccanPatternAnimation();
    initFloatingElements();
    initParticleBackground();
    initCardHoverEffects();
    initSmoothScrolling();
    initScrollAnimations();
    initParallaxEffects();
    initScrollProgress();
});

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.animate, .section-title, .coordinator-showcase, .skill-track, .module-card, .student-card, .stat').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Parallax effects on scroll
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero__shapes, .hero-particles');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = 0.3;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Header background opacity on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrolled > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Hide scroll indicator when scrolled
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrolled > 100 ? '0' : '1';
            scrollIndicator.style.pointerEvents = scrolled > 100 ? 'none' : 'auto';
        }
    });
}

// Scroll progress indicator
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

// Typewriter Effect for Hero Title
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');

    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--text-headers)';

        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight ? '' : '2px solid var(--text-headers)';
                }, 500);
            }
        }, 100);
    });
}

// Animated Moroccan Pattern Background
function initMoroccanPatternAnimation() {
    const patternContainers = document.querySelectorAll('.moroccan-pattern-animated');

    patternContainers.forEach(container => {
        const canvas = document.createElement('canvas');
        canvas.classList.add('pattern-canvas');
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let animationFrame;

        function resizeCanvas() {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }

        function drawPattern(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const tileSize = 60;
            const cols = Math.ceil(canvas.width / tileSize) + 1;
            const rows = Math.ceil(canvas.height / tileSize) + 1;

            ctx.strokeStyle = 'rgba(117, 26, 32, 0.05)';
            ctx.lineWidth = 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * tileSize;
                    const y = j * tileSize;
                    const offset = Math.sin(time / 2000 + i + j) * 5;

                    ctx.save();
                    ctx.translate(x + tileSize / 2, y + tileSize / 2);
                    ctx.rotate((time / 5000) + (i + j) * 0.1);

                    // Draw 8-pointed star
                    drawStar(ctx, 0, 0, 20 + offset, 10 + offset / 2, 8);

                    ctx.restore();
                }
            }

            animationFrame = requestAnimationFrame(() => drawPattern(performance.now()));
        }

        function drawStar(ctx, cx, cy, outerRadius, innerRadius, points) {
            ctx.beginPath();
            for (let i = 0; i < points * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        drawPattern(0);
    });
}

// Floating Decorative Elements
function initFloatingElements() {
    const floatingContainers = document.querySelectorAll('.floating-container');

    floatingContainers.forEach(container => {
        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-shape');
            element.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: ${Math.random() > 0.5 ? 'var(--text-headers)' : 'var(--accent-gold)'};
                opacity: 0.1;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatRandom ${5 + Math.random() * 5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(element);
        }
    });

    // Add floating animation keyframes
    if (!document.querySelector('#floating-keyframes')) {
        const style = document.createElement('style');
        style.id = 'floating-keyframes';
        style.textContent = `
            @keyframes floatRandom {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                }
                25% {
                    transform: translate(20px, -30px) rotate(90deg);
                }
                50% {
                    transform: translate(-10px, -50px) rotate(180deg);
                }
                75% {
                    transform: translate(-30px, -20px) rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Particle Background Effect
function initParticleBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
        z-index: 0;
    `;

    heroSection.style.position = 'relative';
    heroSection.insertBefore(particleContainer, heroSection.firstChild);

    // Create particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = 2 + Math.random() * 4;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? 'var(--accent-gold)' : 'var(--text-headers)'};
            opacity: ${0.1 + Math.random() * 0.2};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${10 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        particleContainer.appendChild(particle);
    }

    // Add particle animation keyframes
    if (!document.querySelector('#particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced Card Hover Effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.student-card, .program-card, .module-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn--primary');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize magnetic buttons
document.addEventListener('DOMContentLoaded', initMagneticButtons);

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.classList.add('scroll-progress');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-moroccan);
        z-index: 9999;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

document.addEventListener('DOMContentLoaded', initScrollProgress);

// Staggered Animation for Grid Items
function initStaggeredAnimations() {
    const grids = document.querySelectorAll('.students-grid, .modules-grid, .grid');

    grids.forEach(grid => {
        const items = grid.children;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(items).forEach((item, index) => {
                        item.style.animationDelay = `${index * 0.1}s`;
                        item.classList.add('animate-stagger');
                    });
                    observer.unobserve(grid);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(grid);
    });

    // Add stagger animation keyframes
    if (!document.querySelector('#stagger-keyframes')) {
        const style = document.createElement('style');
        style.id = 'stagger-keyframes';
        style.textContent = `
            .animate-stagger {
                animation: staggerIn 0.6s ease forwards;
                opacity: 0;
            }
            
            @keyframes staggerIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initStaggeredAnimations);

// Reveal Animation for Text
function initTextReveal() {
    const revealTexts = document.querySelectorAll('.reveal-text');

    revealTexts.forEach(text => {
        const wrapper = document.createElement('span');
        wrapper.classList.add('reveal-wrapper');
        wrapper.style.cssText = `
            display: inline-block;
            overflow: hidden;
        `;

        const inner = document.createElement('span');
        inner.classList.add('reveal-inner');
        inner.style.cssText = `
            display: inline-block;
            transform: translateY(100%);
            transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
        `;

        inner.textContent = text.textContent;
        text.textContent = '';
        wrapper.appendChild(inner);
        text.appendChild(wrapper);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    inner.style.transform = 'translateY(0)';
                    observer.unobserve(text);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(text);
    });
}

document.addEventListener('DOMContentLoaded', initTextReveal);

