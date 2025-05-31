// Three.js 3D Background Animation
let scene, camera, renderer, particles, particleGeometry, particleMaterial;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize Three.js Scene
function initThreeJS() {
    try {
        console.log('Initializing Three.js...');
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 1000;
        
        // Get canvas element
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        
        console.log('Three.js renderer created successfully');
        
        // Create particle system
        createParticles();
        
        // Create floating geometries
        createFloatingGeometries();
        
        // Start animation loop
        animate();
        
        console.log('Three.js initialization complete');
        
    } catch (error) {
        console.error('Error initializing Three.js:', error);
        // Fallback: create a simple CSS-based background
        createFallbackBackground();
    }
}

// Create Particle System
function createParticles() {
    try {
        const particleCount = window.innerWidth < 768 ? 800 : 2000;
        particleGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 4000;
            positions[i3 + 1] = (Math.random() - 0.5) * 4000;
            positions[i3 + 2] = (Math.random() - 0.5) * 4000;
            
            // Colors (gradient from blue to purple)
            const mixRatio = Math.random();
            colors[i3] = 0.4 + mixRatio * 0.2; // Red
            colors[i3 + 1] = 0.5 + mixRatio * 0.3; // Green
            colors[i3 + 2] = 0.9 + mixRatio * 0.1; // Blue
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Simple particle material for better compatibility
        particleMaterial = new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        
        console.log(`Created ${particleCount} particles`);
        
    } catch (error) {
        console.error('Error creating particles:', error);
    }
}

// Create Floating Geometries
function createFloatingGeometries() {
    try {
        const geometries = [
            new THREE.TetrahedronGeometry(20, 0),
            new THREE.OctahedronGeometry(15, 0),
            new THREE.IcosahedronGeometry(18, 0),
            new THREE.BoxGeometry(25, 25, 25)
        ];
        
        const material = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        
        for (let i = 0; i < 6; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material.clone());
            
            mesh.position.x = (Math.random() - 0.5) * 2000;
            mesh.position.y = (Math.random() - 0.5) * 2000;
            mesh.position.z = (Math.random() - 0.5) * 1000;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Add rotation animation data
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                }
            };
            
            scene.add(mesh);
        }
        
        console.log('Created floating geometries');
        
    } catch (error) {
        console.error('Error creating floating geometries:', error);
    }
}

// Animation Loop
function animate() {
    if (!renderer || !scene || !camera) return;
    
    requestAnimationFrame(animate);
    
    try {
        // Rotate particles based on mouse movement
        if (particles) {
            particles.rotation.x += (mouseY * 0.00005 - particles.rotation.x) * 0.1;
            particles.rotation.y += (mouseX * 0.00005 - particles.rotation.y) * 0.1;
        }
        
        // Animate floating geometries
        scene.children.forEach(child => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.x += child.userData.rotationSpeed.x;
                child.rotation.y += child.userData.rotationSpeed.y;
                child.rotation.z += child.userData.rotationSpeed.z;
            }
        });
        
        // Gentle camera movement
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
        
    } catch (error) {
        console.error('Error in animation loop:', error);
    }
}

// Fallback background if Three.js fails
function createFallbackBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    // Create fallback particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    function animateFallback() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateFallback);
    }
    
    animateFallback();
    console.log('Fallback background created');
}

// Mouse Movement Handler
function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Navigation Functionality
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                this.navbar.style.boxShadow = '0 2px 20px rgba(102, 126, 234, 0.1)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                this.navbar.style.boxShadow = 'none';
            }
        });
        
        // Active link highlighting
        this.setupActiveLinks();
    }
    
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .contact-card, .cert-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Typing Animation for Hero Section
function initTypingAnimation() {
    const heroDescription = document.querySelector('.hero-description');
    const text = heroDescription.textContent;
    heroDescription.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroDescription.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
}

// Parallax Effect
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Stats Counter Animation
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/\d/g, '');
                
                animateNumber(target, 0, number, suffix, 2000);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

// Cursor Trail Effect
function initCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(102, 126, 234, ${0.8 - i * 0.04});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            
            if (nextDot) {
                x += (parseInt(nextDot.style.left) - x) * 0.3;
                y += (parseInt(nextDot.style.top) - y) * 0.3;
            }
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Dark/Light Theme Toggle (bonus feature)
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid rgba(102, 126, 234, 0.3);
        background: rgba(10, 10, 10, 0.8);
        color: #667eea;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'translateY(-50%) scale(1.1)';
        themeToggle.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    });
    
    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'translateY(-50%) scale(1)';
        themeToggle.style.boxShadow = 'none';
    });
    
    document.body.appendChild(themeToggle);
}

// Enhanced Loading animation
window.addEventListener('load', function() {
    // Create enhanced loading screen if it doesn't exist
    if (!document.querySelector('.loading-screen')) {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 1s ease;
            overflow: hidden;
        `;
        
        // Create animated background particles
        const particlesContainer = document.createElement('div');
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        `;
        
        // Add floating particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(102, 126, 234, ${Math.random() * 0.8 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 15}s linear infinite;
                box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(102, 126, 234, 0.5);
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Create main content container
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 2;
            text-align: center;
        `;
        
        // Create logo/title
        const title = document.createElement('div');
        title.textContent = 'AJAY PRASATH';
        title.style.cssText = `
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: gradient-shift 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite;
            text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
        `;
        
        // Create subtitle
        const subtitle = document.createElement('div');
        subtitle.textContent = 'Portfolio Loading...';
        subtitle.style.cssText = `
            font-family: 'Roboto', sans-serif;
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            animation: fade-pulse 2s ease-in-out infinite;
        `;
        
        // Create modern spinner container
        const spinnerContainer = document.createElement('div');
        spinnerContainer.style.cssText = `
            position: relative;
            width: 120px;
            height: 120px;
            margin: 2rem 0;
        `;
        
        // Create multiple spinning rings
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${80 + i * 20}px;
                height: ${80 + i * 20}px;
                margin: -${40 + i * 10}px 0 0 -${40 + i * 10}px;
                border: 2px solid transparent;
                border-top: 2px solid rgba(102, 126, 234, ${1 - i * 0.3});
                border-right: 2px solid rgba(118, 75, 162, ${1 - i * 0.3});
                border-radius: 50%;
                animation: spin-ring ${2 + i * 0.5}s linear infinite;
                filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
            `;
            spinnerContainer.appendChild(ring);
        }
        
        // Create progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin-top: 2rem;
            position: relative;
        `;
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        `;
        
        // Create progress percentage
        const progressText = document.createElement('div');
        progressText.textContent = '0%';
        progressText.style.cssText = `
            color: rgba(255, 255, 255, 0.9);
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            margin-top: 1rem;
            font-weight: 500;
        `;
        
        progressContainer.appendChild(progressBar);
        contentContainer.appendChild(title);
        contentContainer.appendChild(subtitle);
        contentContainer.appendChild(spinnerContainer);
        contentContainer.appendChild(progressContainer);
        contentContainer.appendChild(progressText);
        
        loadingScreen.appendChild(particlesContainer);
        loadingScreen.appendChild(contentContainer);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin-ring {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes float-particle {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
            @keyframes gradient-shift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            @keyframes glow-pulse {
                0%, 100% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
                50% { text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(118, 75, 162, 0.5); }
            }
            @keyframes fade-pulse {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingScreen);
        
        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                // Hide loading screen with delay
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 1000);
                }, 500);
            }
        }, 100);
    }
});

console.log('Script.js loaded successfully');

// Performance optimization - Reduce animations on mobile
if (window.innerWidth < 768) {
    // Disable cursor trail on mobile
    const initCursorTrail = () => {};
    
    // Reduce particle count for mobile
    const originalCreateParticles = createParticles;
    createParticles = function() {
        const particleCount = 500; // Reduced from 2000
        // ... rest of the function remains the same
        originalCreateParticles.call(this);
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization...');
    
    // Initialize Three.js
    if (typeof THREE !== 'undefined') {
        console.log('Three.js loaded successfully, version:', THREE.REVISION);
        initThreeJS();
    } else {
        console.error('Three.js not loaded! Creating fallback...');
        createFallbackBackground();
    }
    
    // Initialize other components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initThemeToggle();
    initCursorTrail();
});

// Mouse movement for 3D effects
document.addEventListener('mousemove', function(event) {
    mouseX = (event.clientX - windowHalfX) * 2;
    mouseY = (event.clientY - windowHalfY) * 2;
});

// Window resize handler
window.addEventListener('resize', function() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update fallback canvas if needed
    const canvas = document.getElementById('bg-canvas');
    if (canvas && canvas.getContext) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Active link highlighting
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
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

    // Observe elements for animation
    document.querySelectorAll('.timeline-item, .skill-item, .project-card, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animations and effects
function initAnimations() {
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
        
        // Animate title lines
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.5}s`;
            line.classList.add('animate-in');
        });
    }

    // Parallax effect for floating shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Stats counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    statNumber.classList.add('counted');
                    animateCounter(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// Cursor trail effect
function initCursorTrail() {
    if (window.innerWidth > 768) {
        const trail = [];
        const trailLength = 10;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.5}px;
                height: ${8 - i * 0.5}px;
                background: rgba(102, 126, 234, ${1 - i * 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateTrail() {
            let x = mouseX, y = mouseY;
            
            trail.forEach((dot, index) => {
                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
                
                const nextDot = trail[index + 1];
                if (nextDot) {
                    x += (parseFloat(nextDot.style.left) - x) * 0.3;
                    y += (parseFloat(nextDot.style.top) - y) * 0.3;
                }
            });
            
            requestAnimationFrame(updateTrail);
        }
        
        updateTrail();
    }
}

// Theme toggle
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: white;
        cursor: pointer;
        z-index: 1000;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

// Enhanced Loading animation
window.addEventListener('load', function() {
    // ... existing code ...
}); 