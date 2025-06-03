// Global variables
let scene, camera, renderer, particles, cube, wireframe;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Ensure page starts at top and loading screen is visible immediately
(function() {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Prevent scroll during loading
    document.documentElement.classList.add('loading');
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('loading');
    document.body.style.overflow = 'hidden';
    
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        loadingScreen.style.visibility = 'visible';
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100%';
        loadingScreen.style.height = '100%';
        loadingScreen.style.zIndex = '9999';
    }
})();

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Start loading progress immediately
    startLoadingProgress();

    // Initialize Three.js scenes
    initHeroScene();
    initAboutScene();
    initProjectsScene();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize mobile navigation
    initMobileNav();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize navigation highlighting
    initNavHighlighting();

    // Add mouse movement tracking
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Animate
    animate();
});

// Loading progress system
function startLoadingProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!progressFill || !progressText) {
        console.error('Progress elements not found');
        // Fallback: hide loading screen after delay
        setTimeout(() => {
            hideLoadingScreen();
        }, 3000);
        return;
    }
    
    let progress = 0;
    
    const loadingSteps = [
        { progress: 15, message: 'Initializing...', delay: 500 },
        { progress: 30, message: 'Loading Assets...', delay: 600 },
        { progress: 50, message: 'Setting up 3D Scenes...', delay: 700 },
        { progress: 70, message: 'Configuring Animations...', delay: 600 },
        { progress: 85, message: 'Preparing Interface...', delay: 500 },
        { progress: 100, message: 'Complete!', delay: 700 }
    ];
    
    let currentStep = 0;
    
    function updateProgress() {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            progress = step.progress;
            
            // Update progress bar
            progressFill.style.width = progress + '%';
            progressText.textContent = progress + '%';
            
            // Update loading message
            const loadingText = document.querySelector('.loader p');
            if (loadingText) {
                loadingText.textContent = step.message;
            }
            
            currentStep++;
            
            setTimeout(updateProgress, step.delay);
        } else {
            // Hide loading screen after completion
            setTimeout(() => {
                hideLoadingScreen();
            }, 1000);
        }
    }
    
    // Start the progress sequence immediately
    updateProgress();
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // Properly restore scrolling
            document.documentElement.classList.remove('loading');
            document.documentElement.style.overflow = '';
            document.body.classList.remove('loading');
            document.body.style.overflow = '';
            
            // Force scroll position reset
            window.scrollTo(0, 0);
            
            // Ensure body can scroll properly
            document.body.style.height = '';
            document.documentElement.style.height = '';
        }, 500);
    }
}

// Initialize Hero Scene
function initHeroScene() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create particle system
    createParticleSystem();

    // Create floating geometries
    createFloatingGeometries();

    // Position camera
    camera.position.z = 50;
}

// Create particle system
function createParticleSystem() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;

        velocities[i] = (Math.random() - 0.5) * 0.02;
        velocities[i + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00f5ff,
        size: 1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create floating geometries
function createFloatingGeometries() {
    // Create wireframe cube
    const cubeGeometry = new THREE.BoxGeometry(8, 8, 8);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(30, 10, -20);
    scene.add(cube);

    // Create wireframe torus
    const torusGeometry = new THREE.TorusGeometry(6, 2, 8, 16);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-30, -10, -15);
    scene.add(torus);

    // Create wireframe sphere
    const sphereGeometry = new THREE.SphereGeometry(5, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    wireframe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    wireframe.position.set(0, 20, -25);
    scene.add(wireframe);
}

// Initialize About Scene
function initAboutScene() {
    const container = document.getElementById('about-canvas');
    if (!container) return;

    const aboutScene = new THREE.Scene();
    const aboutCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 1000);
    const aboutRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    aboutRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(aboutRenderer.domElement);

    // Create DNA helix
    createDNAHelix(aboutScene);

    aboutCamera.position.z = 30;

    // Animate about scene
    function animateAbout() {
        requestAnimationFrame(animateAbout);
        
        aboutScene.children.forEach((child, index) => {
            if (child.rotation) {
                child.rotation.y += 0.01;
                child.rotation.x += 0.005;
            }
        });

        aboutRenderer.render(aboutScene, aboutCamera);
    }
    animateAbout();
}

// Create DNA helix
function createDNAHelix(scene) {
    const points = [];
    const points2 = [];
    
    for (let i = 0; i < 100; i++) {
        const y = (i - 50) * 0.5;
        const angle = i * 0.3;
        const radius = 8;
        
        points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
        ));
        
        points2.push(new THREE.Vector3(
            Math.cos(angle + Math.PI) * radius,
            y,
            Math.sin(angle + Math.PI) * radius
        ));
    }

    const geometry1 = new THREE.BufferGeometry().setFromPoints(points);
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    
    const material = new THREE.LineBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.8
    });

    const helix1 = new THREE.Line(geometry1, material);
    const helix2 = new THREE.Line(geometry2, material);
    
    scene.add(helix1);
    scene.add(helix2);

    // Add connecting lines
    for (let i = 0; i < points.length; i += 5) {
        const connectGeometry = new THREE.BufferGeometry().setFromPoints([points[i], points2[i]]);
        const connectMaterial = new THREE.LineBasicMaterial({
            color: 0xff006e,
            transparent: true,
            opacity: 0.5
        });
        const connect = new THREE.Line(connectGeometry, connectMaterial);
        scene.add(connect);
    }
}

// Initialize Projects Scene
function initProjectsScene() {
    const container = document.getElementById('projects-canvas');
    if (!container) return;

    const projectsScene = new THREE.Scene();
    const projectsCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 1000);
    const projectsRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    projectsRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(projectsRenderer.domElement);

    // Create network visualization
    createNetworkVisualization(projectsScene);

    projectsCamera.position.z = 50;

    // Animate projects scene
    function animateProjects() {
        requestAnimationFrame(animateProjects);
        
        projectsScene.children.forEach((child) => {
            if (child.rotation) {
                child.rotation.y += 0.002;
            }
        });

        projectsRenderer.render(projectsScene, projectsCamera);
    }
    animateProjects();
}

// Create network visualization
function createNetworkVisualization(scene) {
    const nodes = [];
    const nodeCount = 30;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00f5ff : 0x8338ec,
            transparent: true,
            opacity: 0.8
        });
        
        const node = new THREE.Mesh(geometry, material);
        node.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 40
        );
        
        nodes.push(node);
        scene.add(node);
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            
            if (distance < 25) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                
                const material = new THREE.LineBasicMaterial({
                    color: 0xff006e,
                    transparent: true,
                    opacity: 0.2
                });
                
                const line = new THREE.Line(geometry, material);
                scene.add(line);
            }
        }
    }
}

// Smooth scrolling
function initSmoothScroll() {
    // Select both nav links and hero buttons
    const smoothScrollElements = document.querySelectorAll('.nav-link, .hero-buttons .btn');
    
    smoothScrollElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Mobile navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay for multiple elements
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : index * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // Clean up will-change after animation completes
                    setTimeout(() => {
                        entry.target.style.willChange = 'auto';
                    }, 800);
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all major elements with appropriate animation classes
    
    // Section headers
    document.querySelectorAll('.section-header').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-down');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Section titles
    document.querySelectorAll('.section-title').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 200;
        observer.observe(el);
    });

    // Timeline items with alternating animations
    document.querySelectorAll('.timeline-item').forEach((el, index) => {
        const animationClass = index % 2 === 0 ? 'fade-in-left' : 'fade-in-right';
        el.classList.add('scroll-animate', animationClass);
        el.dataset.delay = index * 200;
        observer.observe(el);
    });

    // Project cards
    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.classList.add('scroll-animate', 'scale-in');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Skill tags
    document.querySelectorAll('.skill-tag').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 50;
        observer.observe(el);
    });

    // About text paragraphs
    document.querySelectorAll('.about-text p').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-left');
        el.dataset.delay = index * 200;
        observer.observe(el);
    });

    // Skills categories
    document.querySelectorAll('.skills-category').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-right');
        el.dataset.delay = index * 300;
        observer.observe(el);
    });

    // Contact items
    document.querySelectorAll('.contact-item').forEach((el, index) => {
        el.classList.add('scroll-animate', 'scale-in');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Education and certifications
    document.querySelectorAll('.education, .certifications').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 200;
        observer.observe(el);
    });

    // Navigation items (animate on load)
    document.querySelectorAll('.nav-item').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-down');
        el.dataset.delay = index * 100;
        observer.observe(el);
    });

    // Hero buttons
    document.querySelectorAll('.hero-buttons .btn').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Project icons
    document.querySelectorAll('.project-icon').forEach((el, index) => {
        el.classList.add('scroll-animate', 'rotate-in');
        el.dataset.delay = index * 100;
        observer.observe(el);
    });

    // Job headers
    document.querySelectorAll('.job-header').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-right');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Job highlights
    document.querySelectorAll('.job-highlights').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 200;
        observer.observe(el);
    });

    // Education items
    document.querySelectorAll('.education-item').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-left');
        el.dataset.delay = index * 150;
        observer.observe(el);
    });

    // Certification list items
    document.querySelectorAll('.certifications li').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-right');
        el.dataset.delay = index * 100;
        observer.observe(el);
    });

    // Timeline dots
    document.querySelectorAll('.timeline-dot').forEach((el, index) => {
        el.classList.add('scroll-animate', 'scale-in');
        el.dataset.delay = index * 250;
        observer.observe(el);
    });

    // Footer
    document.querySelectorAll('.footer').forEach((el, index) => {
        el.classList.add('scroll-animate', 'fade-in-up');
        el.dataset.delay = index * 100;
        observer.observe(el);
    });

    // Generic elements with scroll-animate class
    document.querySelectorAll('.scroll-animate:not([class*="fade-"]):not([class*="scale-"]):not([class*="rotate-"])').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.dataset.delay = index * 100;
        observer.observe(el);
    });
}

// Mouse movement handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (scene && camera && renderer) {
        // Animate particles
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Wrap around
                if (positions[i] > 100) positions[i] = -100;
                if (positions[i] < -100) positions[i] = 100;
                if (positions[i + 1] > 100) positions[i + 1] = -100;
                if (positions[i + 1] < -100) positions[i + 1] = 100;
                if (positions[i + 2] > 100) positions[i + 2] = -100;
                if (positions[i + 2] < -100) positions[i + 2] = 100;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.rotation.y += 0.001;
        }

        // Animate geometries
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        if (wireframe) {
            wireframe.rotation.x += 0.005;
            wireframe.rotation.y += 0.008;
        }

        // Mouse interaction
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
}

// Optimized parallax scroll effect
const parallaxEffect = debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.hero-content');
    
    // Only apply parallax in hero section
    if (scrolled < window.innerHeight) {
        parallax.forEach(element => {
            const speed = 0.3; // Reduced speed for smoother effect
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}, 16);

window.addEventListener('scroll', parallaxEffect);

// Skill tags animation on hover
document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Project cards 3D tilt effect
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
});

// Typing effect for hero title
document.addEventListener('DOMContentLoaded', function() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            typeWriter();
        }, index * 500);
    });
});

// Performance optimization
function debounce(func, wait) {
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

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Scroll-based animations
    const scrolled = window.pageYOffset;
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        
        if (scrolled > sectionTop - windowHeight + 200) {
            if (!section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        }
    });
}, 16); // Reduced to ~60fps for smoother performance

window.addEventListener('scroll', optimizedScroll);

// Navigation highlighting based on scroll position
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightNavigation = debounce(() => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Offset for better UX
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, 16); // Match the scroll handler frequency
    
    // Run on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Run initially to set correct active state
    highlightNavigation();
} 