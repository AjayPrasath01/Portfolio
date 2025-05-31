// Three.js 3D Background Animation
let scene, camera, renderer, particles, particleGeometry, particleMaterial;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let floatingGeometries = [];
let particleInteractionRadius = 100;

// Initialize Three.js Scene
function initThreeJS() {
    try {
        console.log('Initializing Three.js...');
        
        // Create scene
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 3000);
        
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
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        console.log('Three.js renderer created successfully');
        
        // Create particle system
        createParticles();
        
        // Create floating geometries
        createFloatingGeometries();
        
        // Create ambient lighting
        createLighting();
        
        // Start animation loop
        animate();
        
        console.log('Three.js initialization complete');
        
    } catch (error) {
        console.error('Error initializing Three.js:', error);
        // Fallback: create a simple CSS-based background
        createFallbackBackground();
    }
}

// Enhanced Particle System with interactions
function createParticles() {
    try {
        const particleCount = window.innerWidth < 768 ? 1000 : 3000;
        particleGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 4000;
            positions[i3 + 1] = (Math.random() - 0.5) * 4000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            // Velocities
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
            
            // Colors with dynamic gradient
            const distance = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 1] * positions[i3 + 1]);
            const normalizedDistance = Math.min(distance / 2000, 1);
            
            colors[i3] = 0.4 + normalizedDistance * 0.2; // Red
            colors[i3 + 1] = 0.5 + normalizedDistance * 0.3; // Green
            colors[i3 + 2] = 0.9 - normalizedDistance * 0.1; // Blue
            
            // Sizes
            sizes[i] = Math.random() * 4 + 1;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        // Enhanced particle material with better visual effects
        particleMaterial = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            sizeAttenuation: true
        });
        
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        
        console.log(`Created ${particleCount} particles`);
        
    } catch (error) {
        console.error('Error creating particles:', error);
    }
}

// Enhanced Floating Geometries with more complex shapes
function createFloatingGeometries() {
    try {
        const geometries = [
            new THREE.TetrahedronGeometry(25, 1),
            new THREE.OctahedronGeometry(20, 1),
            new THREE.IcosahedronGeometry(22, 1),
            new THREE.DodecahedronGeometry(18, 0),
            new THREE.TorusGeometry(20, 8, 8, 16),
            new THREE.TorusKnotGeometry(15, 5, 64, 8),
            new THREE.ConeGeometry(15, 30, 8)
        ];
        
        for (let i = 0; i < 12; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            
            // Create wireframe and solid versions
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.7, 0.5),
                transparent: true,
                opacity: 0.2,
                wireframe: true
            });
            
            const solidMaterial = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.5, 0.3),
                transparent: true,
                opacity: 0.1
            });
            
            const wireframeMesh = new THREE.Mesh(geometry.clone(), wireframeMaterial);
            const solidMesh = new THREE.Mesh(geometry.clone(), solidMaterial);
            
            // Position both meshes
            const x = (Math.random() - 0.5) * 3000;
            const y = (Math.random() - 0.5) * 3000;
            const z = (Math.random() - 0.5) * 1500;
            
            wireframeMesh.position.set(x, y, z);
            solidMesh.position.set(x, y, z);
            
            // Random initial rotation
            wireframeMesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            solidMesh.rotation.copy(wireframeMesh.rotation);
            
            // Add rotation animation data
            const rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            };
            
            wireframeMesh.userData = { rotationSpeed };
            solidMesh.userData = { rotationSpeed };
            
            scene.add(wireframeMesh);
            scene.add(solidMesh);
            
            floatingGeometries.push(wireframeMesh, solidMesh);
        }
        
        console.log('Created enhanced floating geometries');
        
    } catch (error) {
        console.error('Error creating floating geometries:', error);
    }
}

// Add lighting for better 3D effects
function createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Point lights
    const pointLight1 = new THREE.PointLight(0x667eea, 1, 1000);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x764ba2, 0.8, 1000);
    pointLight2.position.set(-500, -500, 500);
    scene.add(pointLight2);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0x667eea, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
}

// Enhanced Animation Loop with particle interactions
function animate() {
    if (!renderer || !scene || !camera) return;
    
    requestAnimationFrame(animate);
    
    try {
        const time = Date.now() * 0.0005;
        
        // Enhanced particle animation with mouse interaction
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;
            const colors = particles.geometry.attributes.color.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Apply velocities
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Mouse interaction
                const dx = mouseX - positions[i];
                const dy = mouseY - positions[i + 1];
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particleInteractionRadius) {
                    const force = (particleInteractionRadius - distance) / particleInteractionRadius;
                    velocities[i] += dx * force * 0.001;
                    velocities[i + 1] += dy * force * 0.001;
                    
                    // Color change on interaction
                    colors[i] = Math.min(colors[i] + force * 0.1, 1);
                    colors[i + 1] = Math.min(colors[i + 1] + force * 0.05, 1);
                }
                
                // Boundary checks
                if (positions[i] > 2000 || positions[i] < -2000) velocities[i] *= -0.5;
                if (positions[i + 1] > 2000 || positions[i + 1] < -2000) velocities[i + 1] *= -0.5;
                if (positions[i + 2] > 1000 || positions[i + 2] < -1000) velocities[i + 2] *= -0.5;
                
                // Apply damping
                velocities[i] *= 0.999;
                velocities[i + 1] *= 0.999;
                velocities[i + 2] *= 0.999;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;
            
            // Overall particle rotation
            particles.rotation.x += (mouseY * 0.00002 - particles.rotation.x) * 0.05;
            particles.rotation.y += (mouseX * 0.00002 - particles.rotation.y) * 0.05;
        }
        
        // Enhanced floating geometries animation
        floatingGeometries.forEach((mesh, index) => {
            if (mesh.userData && mesh.userData.rotationSpeed) {
                mesh.rotation.x += mesh.userData.rotationSpeed.x;
                mesh.rotation.y += mesh.userData.rotationSpeed.y;
                mesh.rotation.z += mesh.userData.rotationSpeed.z;
                
                // Add floating motion
                mesh.position.y += Math.sin(time + index) * 0.5;
                mesh.position.x += Math.cos(time + index * 0.5) * 0.3;
                
                // Scale animation
                const scale = 1 + Math.sin(time + index) * 0.1;
                mesh.scale.setScalar(scale);
            }
        });
        
        // Enhanced camera movement
        camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.01;
        camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        // Camera oscillation
        camera.position.z = 1000 + Math.sin(time) * 50;
        
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
    const particleCount = 150;
    
    // Create fallback particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            color: `rgba(102, 126, 234, ${Math.random() * 0.5 + 0.3})`
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
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        requestAnimationFrame(animateFallback);
    }
    
    animateFallback();
}

// Enhanced mouse movement tracking
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 2;
    mouseY = (event.clientY - windowHalfY) * 2;
    
    // Update custom cursor
    updateCustomCursor(event.clientX, event.clientY);
}

// Enhanced window resize handling
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update fallback canvas if needed
    const canvas = document.getElementById('bg-canvas');
    if (canvas && canvas.getContext && !renderer) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// Disabled custom cursor - using normal system cursor
function initCustomCursor() {
    // Custom cursor disabled - using normal system cursor for better compatibility
    console.log('Custom cursor disabled - using normal system cursor');
    
    // Ensure normal cursor is visible everywhere
    const normalCursorCSS = document.createElement('style');
    normalCursorCSS.innerHTML = `
        /* Ensure normal cursor is visible on all elements */
        *, *:before, *:after, 
        html, body, div, section, nav, a, button, input, textarea, 
        .hero, .about, .skills, .experience, .projects, .education, .contact,
        .nav-link, .btn, .project-card, .skill-item, .timeline-item, .contact-card {
            cursor: auto !important;
        }
        
        /* Specific cursor styles for interactive elements */
        a, button, .btn, .nav-link, .hamburger,
        .project-card, .skill-item, .timeline-item, .contact-card,
        .stat, .cert-item, .education-item, .contact-item a,
        input, textarea, select {
            cursor: pointer !important;
        }
        
        /* Text cursor for text inputs */
        input[type="text"], input[type="email"], textarea {
            cursor: text !important;
        }
        
        /* Remove any existing custom cursor elements */
        .cursor, .cursor-follower, .custom-cursor, .custom-cursor-follower {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.head.appendChild(normalCursorCSS);
    
    // Remove any existing custom cursor elements
    document.querySelectorAll('.cursor, .cursor-follower, .custom-cursor, .custom-cursor-follower').forEach(el => {
        el.remove();
    });
    
    // Force normal cursor on body and html
    document.body.style.cursor = 'auto';
    document.documentElement.style.cursor = 'auto';
    
    console.log('Normal system cursor enabled for all sections');
}

function updateCustomCursor(x, y) {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (cursor) {
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    }
}

// Enhanced Navigation with 3D effects
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.scrolled = false;
    }
    
    init() {
        this.setupScrollEffect();
        this.setupActiveLinks();
        this.setupMobileMenu();
        this.setup3DEffects();
    }
    
    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50 && !this.scrolled) {
                // Remove transform that interferes with fixed positioning
                // Instead, enhance backdrop blur and shadow for scroll effect
                this.navbar.style.backdropFilter = 'blur(25px)';
                this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                this.navbar.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.15)';
                this.navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.15)';
                this.scrolled = true;
            } else if (scrollY <= 50 && this.scrolled) {
                // Reset to original state
                this.navbar.style.backdropFilter = 'blur(20px)';
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                this.navbar.style.boxShadow = 'none';
                this.navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                this.scrolled = false;
            }
        });
    }
    
    setup3DEffects() {
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px) rotateX(10deg)';
            });
            
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) rotateX(0)';
            });
        });
    }
    
    setupActiveLinks() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        });
    }
    
    setupMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
            
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.navMenu.classList.remove('active');
                });
            });
        }
    }
}

// Enhanced Smooth Scrolling with easing
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

// Enhanced Scroll Animations with 3D effects
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('project-card')) {
                    element.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                    element.style.opacity = '1';
                } else if (element.classList.contains('skill-item')) {
                    element.style.transform = 'translateY(0) rotateX(0)';
                    element.style.opacity = '1';
                } else if (element.classList.contains('timeline-item')) {
                    element.style.transform = 'translateX(0) rotateY(0)';
                    element.style.opacity = '1';
                } else if (element.classList.contains('contact-card')) {
                    // Handle contact cards with their specific rotations
                    const contactCards = document.querySelectorAll('.contact-card');
                    const cardIndex = Array.from(contactCards).indexOf(element);
                    
                    if (cardIndex === 0) {
                        // First card: -10deg rotation with translateY(12px)
                        element.style.transform = 'translateY(12px) rotate(-10deg)';
                    } else if (cardIndex === 1) {
                        // Second card: +8deg rotation with translateY(-8px)
                        element.style.transform = 'translateY(-8px) rotate(8deg)';
                    } else if (cardIndex === 2) {
                        // Third card: -6deg rotation with translateY(10px)
                        element.style.transform = 'translateY(10px) rotate(-6deg)';
                    } else {
                        // Fallback for any additional cards
                        element.style.transform = 'translateY(0) rotate(-3deg)';
                    }
                    element.style.opacity = '1';
                } else {
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.project-card, .skill-item, .timeline-item, .contact-card, .cert-item').forEach(el => {
        el.style.transform = 'translateY(50px) rotateX(15deg)';
        el.style.opacity = '0';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

// Enhanced Stats Counter with easing
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/\d/g, '');
                
                animateNumber(target, 0, numericValue, suffix, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        const current = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Enhanced Parallax Effects
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for floating shapes
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.5 + index * 0.2;
            shape.style.transform = `translateY(${scrolled * speed}px) rotateX(${scrolled * 0.01}deg) rotateY(${scrolled * 0.02}deg)`;
        });
        
        // Parallax for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Enhanced Portfolio Loading System
function initPortfolioLoader() {
    const loader = document.getElementById('portfolio-loader');
    const progressFill = document.querySelector('.progress-fill');
    const loadingText = document.getElementById('loading-text');
    const loadingPercent = document.getElementById('loading-percent');
    
    if (!loader) return;
    
    // Add loading class to body to hide content
    document.body.classList.add('loading');
    
    // Loading steps with realistic timing
    const loadingSteps = [
        { text: 'Initializing...', duration: 300, progress: 10 },
        { text: 'Loading 3D Environment...', duration: 800, progress: 25 },
        { text: 'Preparing Assets...', duration: 600, progress: 45 },
        { text: 'Setting up Navigation...', duration: 400, progress: 60 },
        { text: 'Loading Content...', duration: 500, progress: 75 },
        { text: 'Optimizing Performance...', duration: 400, progress: 90 },
        { text: 'Ready!', duration: 200, progress: 100 }
    ];
    
    let currentStep = 0;
    let currentProgress = 0;
    
    function updateProgress(targetProgress, text) {
        return new Promise((resolve) => {
            const startProgress = currentProgress;
            const progressDiff = targetProgress - startProgress;
            const duration = 300;
            const startTime = performance.now();
            
            if (loadingText) loadingText.textContent = text;
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth easing function
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                currentProgress = startProgress + (progressDiff * easeProgress);
                
                if (progressFill) {
                    progressFill.style.width = `${currentProgress}%`;
                }
                if (loadingPercent) {
                    loadingPercent.textContent = `${Math.round(currentProgress)}%`;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(animate);
        });
    }
    
    async function runLoadingSequence() {
        // Wait for initial DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Run through all loading steps
        for (const step of loadingSteps) {
            await updateProgress(step.progress, step.text);
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }
        
        // Final completion step
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Trigger completion
        completeLoading();
    }
    
    function completeLoading() {
        // Add exit animation to loader content
        const loaderContent = document.querySelector('.loader-content');
        if (loaderContent) {
            loaderContent.classList.add('exit');
        }
        
        // Start fade-out sequence
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 400);
        
        // Remove loading class from body to prepare for reveal
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('portfolio-reveal');
        }, 800);
        
        // Remove the loader from DOM after transition
        setTimeout(() => {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
            
            // Initialize portfolio components after loading screen is removed
            initializePortfolioComponents();
        }, 1200);
    }
    
    function initializePortfolioComponents() {
        // Initialize all portfolio components in sequence
        try {
            console.log('Portfolio loading complete - initializing components...');
            
            // Initialize Three.js background
            initThreeJS();
            
            // Initialize other components with staggered timing for better performance
            setTimeout(() => {
                initSmoothScrolling();
                initScrollAnimations();
                initStatsCounter();
                initParallaxEffect();
                
                // Initialize navigation
                const nav = new Navigation();
                nav.init();
                
                console.log('All portfolio components initialized successfully');
                
                // Clean up reveal class after all animations complete
                setTimeout(() => {
                    document.body.classList.remove('portfolio-reveal');
                }, 2000);
                
            }, 200);
            
        } catch (error) {
            console.error('Error initializing portfolio components:', error);
        }
    }
    
    // Start the loading sequence
    runLoadingSequence();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing portfolio...');
    
    // Detect mobile device
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
    } else {
        document.body.classList.remove('mobile-device');
        // Initialize custom cursor only on desktop - delayed until after loading
        setTimeout(() => {
            initCustomCursor();
        }, 1500);
    }
    
    // Start the enhanced portfolio loader
    initPortfolioLoader();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            onWindowResize();
            
            // Reinitialize cursor if switching between mobile/desktop
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Simple way to handle device type change
            }
        }, 250);
    });
});

// CSS Animation keyframes (add to document head)
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
        50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
    }
    
    .nav-link.active {
        color: #667eea !important;
        text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    }
    
    .nav-link.active::before {
        width: 100% !important;
    }
`;
document.head.appendChild(style); 