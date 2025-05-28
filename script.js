// Global variables
let scene, camera, renderer, particles, cube, wireframe;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);

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

    // Add mouse movement tracking
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    // Animate
    animate();
});

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
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
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.timeline-item, .project-card, .skill-tag').forEach(el => {
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

// Parallax scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.hero-content');
    
    parallax.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

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

// Add loading progress
let loadProgress = 0;
const progressInterval = setInterval(() => {
    loadProgress += Math.random() * 30;
    if (loadProgress >= 100) {
        loadProgress = 100;
        clearInterval(progressInterval);
    }
}, 100);

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
            section.classList.add('visible');
        }
    });
}, 10);

window.addEventListener('scroll', optimizedScroll); 