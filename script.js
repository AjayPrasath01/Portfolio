// Global variables
let scene, camera, renderer, backgroundScene, backgroundRenderer;
let heroScene, heroCamera, heroRenderer;
let aboutScene, aboutCamera, aboutRenderer;
let contactScene, contactCamera, contactRenderer;

// Loading management
let loadingComplete = false;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen initially
    setTimeout(() => {
        hideLoadingScreen();
        initializeAllScenes();
        startAnimations();
        setupNavigation();
        setupScrollEffects();
    }, 2000);
});

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        loadingComplete = true;
    }, 500);
}

// Initialize all Three.js scenes
function initializeAllScenes() {
    initBackgroundScene();
    initHeroScene();
    initAboutScene();
    initContactScene();
}

// Background floating particles scene
function initBackgroundScene() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    backgroundScene = new THREE.Scene();
    backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    backgroundRenderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRenderer.setPixelRatio(window.devicePixelRatio);

    // Create floating particles
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;

        // Random colors between primary and accent
        const colorChoice = Math.random();
        if (colorChoice < 0.5) {
            colors[i] = 0.39; // r for #6366f1
            colors[i + 1] = 0.4; // g
            colors[i + 2] = 0.95; // b
        } else {
            colors[i] = 0.02; // r for #06d6a0
            colors[i + 1] = 0.84; // g
            colors[i + 2] = 0.63; // b
        }

        sizes[i / 3] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec3 pos = position;
                
                // Add gentle floating animation
                pos.y += sin(time + position.x * 0.01) * 2.0;
                pos.x += cos(time + position.y * 0.01) * 1.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
                if (distanceFromCenter > 0.5) discard;
                
                float alpha = 1.0 - (distanceFromCenter * 2.0);
                alpha = pow(alpha, 2.0);
                
                gl_FragColor = vec4(vColor, alpha * 0.6);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    backgroundScene.add(particles);

    backgroundCamera.position.z = 30;

    // Store reference for animation
    backgroundScene.userData = { particles, material };
}

// Hero section 3D scene
function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    heroRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);

    // Create geometric shapes
    const group = new THREE.Group();

    // Main cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    group.add(cube);

    // Wireframe cube
    const wireframeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x06d6a0, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframeCube = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    group.add(wireframeCube);

    // Floating spheres
    for (let i = 0; i < 8; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const sphereMaterial = new THREE.MeshLambertMaterial({ 
            color: i % 2 === 0 ? 0x8b5cf6 : 0x06d6a0
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        sphere.position.set(
            Math.cos(angle) * 4,
            Math.sin(angle * 2) * 2,
            Math.sin(angle) * 4
        );
        group.add(sphere);
    }

    heroScene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    heroScene.add(directionalLight);

    heroCamera.position.set(0, 0, 8);

    // Store reference for animation
    heroScene.userData = { group, cube, wireframeCube };
}

// About section 3D scene
function initAboutScene() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;

    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    aboutRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    aboutRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    aboutRenderer.setPixelRatio(window.devicePixelRatio);

    // Create a DNA-like helix structure
    const helixGroup = new THREE.Group();

    // Create helix points
    const helixPoints = [];
    const helixColors = [];
    const pointCount = 100;

    for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 8;
        const y = (i / pointCount) * 10 - 5;
        const radius = 2;

        // Double helix
        helixPoints.push(
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius
        );
        
        helixPoints.push(
            Math.cos(angle + Math.PI) * radius,
            y,
            Math.sin(angle + Math.PI) * radius
        );

        // Colors
        helixColors.push(0.39, 0.4, 0.95); // Primary color
        helixColors.push(0.02, 0.84, 0.63); // Accent color
    }

    const helixGeometry = new THREE.BufferGeometry();
    helixGeometry.setAttribute('position', new THREE.Float32BufferAttribute(helixPoints, 3));
    helixGeometry.setAttribute('color', new THREE.Float32BufferAttribute(helixColors, 3));

    const helixMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const helix = new THREE.Points(helixGeometry, helixMaterial);
    helixGroup.add(helix);

    // Add connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePoints = [];

    for (let i = 0; i < pointCount - 1; i++) {
        const angle1 = (i / pointCount) * Math.PI * 8;
        const angle2 = ((i + 1) / pointCount) * Math.PI * 8;
        const y1 = (i / pointCount) * 10 - 5;
        const y2 = ((i + 1) / pointCount) * 10 - 5;
        const radius = 2;

        linePoints.push(
            Math.cos(angle1) * radius, y1, Math.sin(angle1) * radius,
            Math.cos(angle2) * radius, y2, Math.sin(angle2) * radius
        );
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x6366f1, 
        transparent: true, 
        opacity: 0.3 
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    helixGroup.add(lines);

    aboutScene.add(helixGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    aboutScene.add(ambientLight);

    aboutCamera.position.set(0, 0, 8);

    // Store reference for animation
    aboutScene.userData = { helixGroup };
}

// Contact section 3D scene
function initContactScene() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;

    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    contactRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    contactRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    contactRenderer.setPixelRatio(window.devicePixelRatio);

    // Create network nodes
    const networkGroup = new THREE.Group();
    const nodes = [];
    const nodeCount = 20;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const nodeMaterial = new THREE.MeshLambertMaterial({ 
            color: i % 3 === 0 ? 0x6366f1 : (i % 3 === 1 ? 0x8b5cf6 : 0x06d6a0),
            transparent: true,
            opacity: 0.9
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        // Random position in sphere
        const phi = Math.acos(-1 + (2 * i) / nodeCount);
        const theta = Math.sqrt(nodeCount * Math.PI) * phi;
        const radius = 3;
        
        node.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );
        
        nodes.push(node);
        networkGroup.add(node);
    }

    // Create connections between nearby nodes
    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            if (distance < 3) {
                const lineGeometry = new THREE.BufferGeometry();
                const points = [
                    nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                    nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                ];
                lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
                
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: 0x6366f1, 
                    transparent: true, 
                    opacity: 0.2 
                });
                const line = new THREE.Line(lineGeometry, lineMaterial);
                connections.push(line);
                networkGroup.add(line);
            }
        }
    }

    contactScene.add(networkGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    contactScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    contactScene.add(directionalLight);

    contactCamera.position.set(0, 0, 8);

    // Store reference for animation
    contactScene.userData = { networkGroup, nodes };
}

// Animation loop
function startAnimations() {
    function animate() {
        requestAnimationFrame(animate);

        if (!loadingComplete) return;

        const time = Date.now() * 0.001;

        // Animate background particles
        if (backgroundScene && backgroundScene.userData.material) {
            backgroundScene.userData.material.uniforms.time.value = time;
            backgroundScene.userData.particles.rotation.y += 0.002;
            backgroundRenderer.render(backgroundScene, backgroundCamera);
        }

        // Animate hero scene
        if (heroScene && heroScene.userData.group) {
            const { group, cube, wireframeCube } = heroScene.userData;
            
            group.rotation.y += 0.01;
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.01;
            wireframeCube.rotation.x -= 0.01;
            wireframeCube.rotation.y -= 0.005;

            // Animate floating spheres
            group.children.forEach((child, index) => {
                if (child.geometry instanceof THREE.SphereGeometry) {
                    const angle = time + (index * 0.5);
                    child.position.y += Math.sin(angle) * 0.002;
                }
            });

            heroRenderer.render(heroScene, heroCamera);
        }

        // Animate about scene
        if (aboutScene && aboutScene.userData.helixGroup) {
            aboutScene.userData.helixGroup.rotation.y += 0.01;
            aboutRenderer.render(aboutScene, aboutCamera);
        }

        // Animate contact scene
        if (contactScene && contactScene.userData.networkGroup) {
            const { networkGroup, nodes } = contactScene.userData;
            networkGroup.rotation.y += 0.005;
            
            // Pulse nodes
            nodes.forEach((node, index) => {
                const scale = 1 + Math.sin(time * 2 + index) * 0.2;
                node.scale.setScalar(scale);
            });

            contactRenderer.render(contactScene, contactCamera);
        }
    }

    animate();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', () => {
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
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Scroll effects
function setupScrollEffects() {
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (!loadingComplete) return;

    // Update background scene
    if (backgroundCamera && backgroundRenderer) {
        backgroundCamera.aspect = window.innerWidth / window.innerHeight;
        backgroundCamera.updateProjectionMatrix();
        backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Update hero scene
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCamera && heroRenderer && heroCanvas) {
        heroCamera.aspect = heroCanvas.offsetWidth / heroCanvas.offsetHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);
    }

    // Update about scene
    const aboutCanvas = document.getElementById('about-canvas');
    if (aboutCamera && aboutRenderer && aboutCanvas) {
        aboutCamera.aspect = aboutCanvas.offsetWidth / aboutCanvas.offsetHeight;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(aboutCanvas.offsetWidth, aboutCanvas.offsetHeight);
    }

    // Update contact scene
    const contactCanvas = document.getElementById('contact-canvas');
    if (contactCamera && contactRenderer && contactCanvas) {
        contactCamera.aspect = contactCanvas.offsetWidth / contactCanvas.offsetHeight;
        contactCamera.updateProjectionMatrix();
        contactRenderer.setSize(contactCanvas.offsetWidth, contactCanvas.offsetHeight);
    }
});

// Add mouse interaction for hero scene
document.addEventListener('mousemove', (event) => {
    if (!heroScene || !heroScene.userData.group) return;

    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    heroScene.userData.group.rotation.x = mouseY * 0.1;
    heroScene.userData.group.rotation.y = mouseX * 0.1;
});

// Smooth skill tag hover effects
document.addEventListener('DOMContentLoaded', () => {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Performance optimization
function optimizePerformance() {
    // Reduce animation quality on mobile
    if (window.innerWidth < 768) {
        if (backgroundScene && backgroundScene.userData.particles) {
            const geometry = backgroundScene.userData.particles.geometry;
            const positions = geometry.attributes.position.array;
            
            // Reduce particle count for mobile
            const reducedPositions = new Float32Array(positions.length / 2);
            for (let i = 0; i < reducedPositions.length; i++) {
                reducedPositions[i] = positions[i * 2];
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(reducedPositions, 3));
        }
    }
}

// Call performance optimization
optimizePerformance(); 