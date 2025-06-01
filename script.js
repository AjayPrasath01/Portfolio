// Three.js 3D Background Animation
let scene, camera, renderer, particles, geometries;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let floatingGeometries = [];
let particleInteractionRadius = 100;

// Glass 3D Object variables
let glassScene, glassCamera, glassRenderer, glassObject;

// 3D Shapes variables
let shape1Scene, shape1Camera, shape1Renderer, shape1Object;
let shape2Scene, shape2Camera, shape2Renderer, shape2Object;
let shape3Scene, shape3Camera, shape3Renderer, shape3Object;

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
        geometries = new THREE.BufferGeometry();
        
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
        
        geometries.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometries.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometries.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometries.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        // Enhanced particle material with better visual effects
        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            sizeAttenuation: true
        });
        
        particles = new THREE.Points(geometries, particleMaterial);
        scene.add(particles);
        
        console.log(`Created ${particleCount} particles`);
        
    } catch (error) {
        console.error('Error creating particles:', error);
    }
}

// Enhanced Floating Geometries with vibrant colors and glowing trails
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
        
        // Vibrant color palette
        const colorPalette = [
            0xff6b6b, // Red
            0x4ecdc4, // Teal
            0x45b7d1, // Blue
            0x96ceb4, // Green
            0xffeaa7, // Yellow
            0xdda0dd, // Plum
            0xff9ff3, // Pink
            0x74b9ff, // Light Blue
            0xfd79a8, // Hot Pink
            0x6c5ce7, // Purple
            0xa29bfe, // Lavender
            0xfab1a0  // Peach
        ];
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            
            // Create glowing wireframe material
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.8,
                wireframe: true
            });
            
            // Create glowing solid material with emission
            const solidMaterial = new THREE.MeshStandardMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.4,
                emissive: baseColor,
                emissiveIntensity: 0.3,
                roughness: 0.1,
                metalness: 0.2
            });
            
            // Create inner glow material
            const innerGlowMaterial = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            
            const wireframeMesh = new THREE.Mesh(geometry.clone(), wireframeMaterial);
            const solidMesh = new THREE.Mesh(geometry.clone(), solidMaterial);
            const innerGlowMesh = new THREE.Mesh(geometry.clone(), innerGlowMaterial);
            
            // Position all meshes
            const x = (Math.random() - 0.5) * 3000;
            const y = (Math.random() - 0.5) * 3000;
            const z = (Math.random() - 0.5) * 1500;
            
            wireframeMesh.position.set(x, y, z);
            solidMesh.position.set(x, y, z);
            innerGlowMesh.position.set(x, y, z);
            
            // Random initial rotation
            const rotation = {
                x: Math.random() * Math.PI,
                y: Math.random() * Math.PI,
                z: Math.random() * Math.PI
            };
            
            wireframeMesh.rotation.set(rotation.x, rotation.y, rotation.z);
            solidMesh.rotation.copy(wireframeMesh.rotation);
            innerGlowMesh.rotation.copy(wireframeMesh.rotation);
            
            // Add rotation animation data
            const rotationSpeed = {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03,
                z: (Math.random() - 0.5) * 0.03
            };
            
            // Store additional data for trail effects
            wireframeMesh.userData = { 
                rotationSpeed,
                baseColor,
                trail: [],
                maxTrailLength: 8
            };
            solidMesh.userData = { rotationSpeed, baseColor };
            innerGlowMesh.userData = { rotationSpeed, baseColor };
            
            // Create trailing effect particles
            const trailGeometry = new THREE.BufferGeometry();
            const trailPositions = new Float32Array(24 * 3); // 8 trail points * 3 coordinates
            const trailColors = new Float32Array(24 * 3);
            const trailSizes = new Float32Array(24);
            
            for (let j = 0; j < 24; j++) {
                trailPositions[j] = 0;
                const color = new THREE.Color(baseColor);
                trailColors[j * 3] = color.r;
                trailColors[j * 3 + 1] = color.g;
                trailColors[j * 3 + 2] = color.b;
                trailSizes[j] = Math.max(0.1, 1.0 - (j / 24));
            }
            
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
            trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
            trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1));
            
            const trailMaterial = new THREE.PointsMaterial({
                size: 8,
                transparent: true,
                opacity: 0.7,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });
            
            const trailPoints = new THREE.Points(trailGeometry, trailMaterial);
            wireframeMesh.userData.trailPoints = trailPoints;
            
            scene.add(wireframeMesh);
            scene.add(solidMesh);
            scene.add(innerGlowMesh);
            scene.add(trailPoints);
            
            floatingGeometries.push(wireframeMesh, solidMesh, innerGlowMesh);
        }
        
        console.log('Created enhanced floating geometries with glowing trails');
        
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

// Create Glass 3D Object for About Section
function createGlass3DObject() {
    try {
        console.log('Creating glass 3D object...');
        
        // Get the glass canvas element
        const glassCanvas = document.getElementById('glass-canvas');
        if (!glassCanvas) {
            console.error('Glass canvas element not found!');
            return;
        }
        
        // Create separate scene for glass object
        glassScene = new THREE.Scene();
        
        // Create camera for glass object
        glassCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        glassCamera.position.z = 150;
        
        // Create renderer for glass object
        glassRenderer = new THREE.WebGLRenderer({ 
            canvas: glassCanvas,
            alpha: true,
            antialias: true
        });
        
        // Adjust size for mobile devices
        const isMobile = window.innerWidth <= 768;
        const canvasSize = isMobile ? 150 : 200;
        glassRenderer.setSize(canvasSize, canvasSize);
        glassRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        glassRenderer.setClearColor(0x000000, 0);
        
        // Create glass torus geometry
        const glassGeometry = new THREE.TorusGeometry(40, 15, 16, 100);
        
        // Create glass material with transparency and refraction
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x667eea,
            transparent: true,
            opacity: 0.3,
            roughness: 0,
            metalness: 0,
            transmission: 0.9,
            thickness: 10,
            envMapIntensity: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0,
            ior: 1.5,
            side: THREE.DoubleSide
        });
        
        // Create glass mesh
        glassObject = new THREE.Mesh(glassGeometry, glassMaterial);
        glassScene.add(glassObject);
        
        // Add lighting for glass object
        const glassAmbientLight = new THREE.AmbientLight(0x404040, 0.4);
        glassScene.add(glassAmbientLight);
        
        const glassPointLight = new THREE.PointLight(0x667eea, 1, 200);
        glassPointLight.position.set(50, 50, 50);
        glassScene.add(glassPointLight);
        
        const glassPointLight2 = new THREE.PointLight(0x764ba2, 0.8, 200);
        glassPointLight2.position.set(-50, -50, 50);
        glassScene.add(glassPointLight2);
        
        // Start glass animation
        animateGlassObject();
        
        console.log('Glass 3D object created successfully');
        
    } catch (error) {
        console.error('Error creating glass 3D object:', error);
    }
}

// Animate Glass 3D Object
function animateGlassObject() {
    if (!glassRenderer || !glassScene || !glassCamera || !glassObject) return;
    
    requestAnimationFrame(animateGlassObject);
    
    try {
        const time = Date.now() * 0.001;
        
        // Smooth rotation animation
        glassObject.rotation.x = time * 0.5;
        glassObject.rotation.y = time * 0.3;
        glassObject.rotation.z = time * 0.1;
        
        // Subtle floating motion
        glassObject.position.y = Math.sin(time * 2) * 5;
        glassObject.position.x = Math.cos(time * 1.5) * 3;
        
        // Scale pulsing effect
        const scale = 1 + Math.sin(time * 3) * 0.1;
        glassObject.scale.setScalar(scale);
        
        // Update material opacity based on time for breathing effect
        if (glassObject.material) {
            glassObject.material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
        }
        
        glassRenderer.render(glassScene, glassCamera);
        
    } catch (error) {
        console.error('Error in glass animation loop:', error);
    }
}

// Enhanced Animation Loop with particle interactions
function animate() {
    if (!renderer || !scene || !camera) return;
    
    requestAnimationFrame(animate);
    
    try {
        const time = Date.now() * 0.0005;
        
        // Enhanced particle animation with mouse interaction
        if (particles && particles.geometry && particles.geometry.attributes) {
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
        animateFloatingGeometries();
        
        // Enhanced camera movement
        camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.01;
        camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        // Camera oscillation
        camera.position.z = 1000 + Math.sin(time) * 50;
        
        // Render the scene
        renderer.render(scene, camera);
        
        // Render Glass 3D Object if it exists
        if (glassRenderer && glassScene && glassCamera) {
            glassRenderer.render(glassScene, glassCamera);
        }
        
        // Render 3D Shapes if they exist
        if (shape1Renderer && shape1Scene && shape1Camera) {
            shape1Renderer.render(shape1Scene, shape1Camera);
        }
        
        if (shape2Renderer && shape2Scene && shape2Camera) {
            shape2Renderer.render(shape2Scene, shape2Camera);
        }
        
        if (shape3Renderer && shape3Scene && shape3Camera) {
            shape3Renderer.render(shape3Scene, shape3Camera);
        }
        
    } catch (error) {
        console.error('Error in animation loop:', error);
    }
}

// Enhanced animation for floating geometries with glowing trails
function animateFloatingGeometries() {
    try {
        floatingGeometries.forEach((mesh, index) => {
            if (!mesh || !mesh.userData) return;
            
            const userData = mesh.userData;
            const time = Date.now() * 0.001;
            
            // Smooth floating motion
            const floatAmplitude = 30;
            const floatSpeed = 0.8;
            mesh.position.y += Math.sin(time * floatSpeed + index) * floatAmplitude * 0.01;
            mesh.position.x += Math.cos(time * floatSpeed * 0.7 + index) * floatAmplitude * 0.005;
            
            // Enhanced rotation with userData
            if (userData.rotationSpeed) {
                mesh.rotation.x += userData.rotationSpeed.x;
                mesh.rotation.y += userData.rotationSpeed.y;
                mesh.rotation.z += userData.rotationSpeed.z;
            }
            
            // Color pulsing effect for glowing
            if (mesh.material && userData.baseColor) {
                const pulseFactor = (Math.sin(time * 2 + index) + 1) / 2;
                const color = new THREE.Color(userData.baseColor);
                
                if (mesh.material.emissive) {
                    mesh.material.emissive.copy(color);
                    mesh.material.emissiveIntensity = 0.2 + pulseFactor * 0.3;
                }
                
                // Update opacity for breathing effect
                mesh.material.opacity = mesh.material.wireframe ? 
                    0.6 + pulseFactor * 0.3 : 
                    0.3 + pulseFactor * 0.2;
            }
            
            // Update trailing effect
            if (userData.trailPoints && userData.trail !== undefined) {
                // Store current position in trail
                userData.trail.unshift({
                    x: mesh.position.x,
                    y: mesh.position.y,
                    z: mesh.position.z
                });
                
                // Limit trail length
                if (userData.trail.length > userData.maxTrailLength) {
                    userData.trail.pop();
                }
                
                // Update trail points positions
                const positions = userData.trailPoints.geometry.attributes.position.array;
                const colors = userData.trailPoints.geometry.attributes.color.array;
                const sizes = userData.trailPoints.geometry.attributes.size.array;
                
                for (let i = 0; i < userData.trail.length; i++) {
                    const point = userData.trail[i];
                    const idx = i * 3;
                    
                    if (point) {
                        positions[idx] = point.x;
                        positions[idx + 1] = point.y;
                        positions[idx + 2] = point.z;
                        
                        // Fade trail
                        const alpha = 1.0 - (i / userData.maxTrailLength);
                        const color = new THREE.Color(userData.baseColor);
                        colors[idx] = color.r;
                        colors[idx + 1] = color.g;
                        colors[idx + 2] = color.b;
                        
                        sizes[i] = alpha * 15 * (1 + pulseFactor * 0.5);
                    }
                }
                
                userData.trailPoints.geometry.attributes.position.needsUpdate = true;
                userData.trailPoints.geometry.attributes.color.needsUpdate = true;
                userData.trailPoints.geometry.attributes.size.needsUpdate = true;
                
                // Update trail material opacity
                userData.trailPoints.material.opacity = 0.5 + pulseFactor * 0.3;
            }
            
            // Boundary check with wrapping
            const boundary = 1500;
            if (Math.abs(mesh.position.x) > boundary) {
                mesh.position.x = -Math.sign(mesh.position.x) * boundary;
                if (userData.trail) userData.trail.length = 0; // Clear trail on wrap
            }
            if (Math.abs(mesh.position.y) > boundary) {
                mesh.position.y = -Math.sign(mesh.position.y) * boundary;
                if (userData.trail) userData.trail.length = 0;
            }
            if (Math.abs(mesh.position.z) > 750) {
                mesh.position.z = -Math.sign(mesh.position.z) * 750;
                if (userData.trail) userData.trail.length = 0;
            }
        });
    } catch (error) {
        console.error('Error animating floating geometries:', error);
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
    
    // Update glass object canvas if needed
    if (glassRenderer && glassCamera) {
        const isMobile = window.innerWidth <= 768;
        const canvasSize = isMobile ? 150 : 200;
        glassRenderer.setSize(canvasSize, canvasSize);
        glassCamera.aspect = 1;
        glassCamera.updateProjectionMatrix();
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
            
            // Create Glass 3D Object for About Section
            setTimeout(() => {
                createGlass3DObject();
            }, 500);
            
            // Create 3D Shapes for About Section
            setTimeout(() => {
                create3DShapes();
                add3DShapeInteraction();
            }, 700);
            
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
            resize3DShapes();
            
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

// Create 3D Shapes - Simplified and Reliable Version
function create3DShapes() {
    try {
        console.log('Creating 3D Shapes...');
        
        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
            window.addEventListener('load', create3DShapes);
            return;
        }
        
        // Create shapes one by one with error handling
        createShape1(); // Sphere
        createShape2(); // Cube  
        createShape3(); // Pyramid
        
        // Start the animation
        animate3DShapes();
        
        console.log('3D Shapes created successfully');
        
    } catch (error) {
        console.error('Error creating 3D shapes:', error);
    }
}

// Shape 1: Glowing Sphere
function createShape1() {
    try {
        const canvas = document.getElementById('shape-1-canvas');
        if (!canvas) {
            console.warn('Shape 1 canvas not found');
            return;
        }
        
        console.log('Creating Shape 1 - Sphere');
        
        // Set canvas size explicitly
        canvas.width = 220;
        canvas.height = 220;
        canvas.style.width = '220px';
        canvas.style.height = '220px';
        
        // Scene setup
        shape1Scene = new THREE.Scene();
        shape1Camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        shape1Camera.position.z = 3;
        
        shape1Renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true
        });
        shape1Renderer.setSize(220, 220);
        shape1Renderer.setClearColor(0x000000, 0);
        
        // Create a simple glowing sphere
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4169E1,
            transparent: true,
            opacity: 0.8
        });
        
        shape1Object = new THREE.Mesh(geometry, material);
        shape1Scene.add(shape1Object);
        
        // Add some lighting
        const light = new THREE.PointLight(0x4169E1, 2, 100);
        light.position.set(2, 2, 2);
        shape1Scene.add(light);
        
        // Initial render
        shape1Renderer.render(shape1Scene, shape1Camera);
        
        console.log('Shape 1 created successfully');
        
    } catch (error) {
        console.error('Error creating Shape 1:', error);
    }
}

// Shape 2: Rotating Cube
function createShape2() {
    try {
        const canvas = document.getElementById('shape-2-canvas');
        if (!canvas) {
            console.warn('Shape 2 canvas not found');
            return;
        }
        
        console.log('Creating Shape 2 - Cube');
        
        // Set canvas size explicitly
        canvas.width = 180;
        canvas.height = 180;
        canvas.style.width = '180px';
        canvas.style.height = '180px';
        
        // Scene setup
        shape2Scene = new THREE.Scene();
        shape2Camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        shape2Camera.position.z = 3;
        
        shape2Renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true
        });
        shape2Renderer.setSize(180, 180);
        shape2Renderer.setClearColor(0x000000, 0);
        
        // Create a wireframe cube
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        shape2Object = new THREE.Mesh(geometry, material);
        shape2Scene.add(shape2Object);
        
        // Add inner solid cube
        const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.3
        });
        
        const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
        shape2Object.add(innerCube);
        
        // Initial render
        shape2Renderer.render(shape2Scene, shape2Camera);
        
        console.log('Shape 2 created successfully');
        
    } catch (error) {
        console.error('Error creating Shape 2:', error);
    }
}

// Shape 3: Crystal Pyramid
function createShape3() {
    try {
        const canvas = document.getElementById('shape-3-canvas');
        if (!canvas) {
            console.warn('Shape 3 canvas not found');
            return;
        }
        
        console.log('Creating Shape 3 - Pyramid');
        
        // Set canvas size explicitly
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.width = '200px';
        canvas.style.height = '200px';
        
        // Scene setup
        shape3Scene = new THREE.Scene();
        shape3Camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        shape3Camera.position.z = 3;
        
        shape3Renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            alpha: true, 
            antialias: true
        });
        shape3Renderer.setSize(200, 200);
        shape3Renderer.setClearColor(0x000000, 0);
        
        // Create a pyramid using cone geometry
        const geometry = new THREE.ConeGeometry(1, 2, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8
        });
        
        shape3Object = new THREE.Mesh(geometry, material);
        shape3Scene.add(shape3Object);
        
        // Add wireframe overlay
        const wireframeGeometry = new THREE.ConeGeometry(1.1, 2.1, 4);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        shape3Object.add(wireframe);
        
        // Initial render
        shape3Renderer.render(shape3Scene, shape3Camera);
        
        console.log('Shape 3 created successfully');
        
    } catch (error) {
        console.error('Error creating Shape 3:', error);
    }
}

// Animation function for all 3D shapes
function animate3DShapes() {
    requestAnimationFrame(animate3DShapes);
    
    const time = Date.now() * 0.001;
    
    try {
        // Animate Shape 1 (Sphere)
        if (shape1Object && shape1Renderer && shape1Scene && shape1Camera) {
            shape1Object.rotation.x = time * 0.5;
            shape1Object.rotation.y = time * 0.3;
            
            // Floating motion
            shape1Object.position.y = Math.sin(time) * 0.3;
            
            shape1Renderer.render(shape1Scene, shape1Camera);
        }
        
        // Animate Shape 2 (Cube)
        if (shape2Object && shape2Renderer && shape2Scene && shape2Camera) {
            shape2Object.rotation.x = time * 0.4;
            shape2Object.rotation.y = time * 0.6;
            
            // Floating motion
            shape2Object.position.y = Math.sin(time + 1) * 0.2;
            
            shape2Renderer.render(shape2Scene, shape2Camera);
        }
        
        // Animate Shape 3 (Pyramid)
        if (shape3Object && shape3Renderer && shape3Scene && shape3Camera) {
            shape3Object.rotation.x = time * 0.3;
            shape3Object.rotation.y = time * 0.8;
            
            // Floating motion
            shape3Object.position.y = Math.sin(time + 2) * 0.25;
            
            shape3Renderer.render(shape3Scene, shape3Camera);
        }
        
    } catch (error) {
        console.error('Error in 3D shapes animation:', error);
    }
}

// Resize function for 3D shapes
function resize3DShapes() {
    const isMobile = window.innerWidth <= 768;
    const isVerySmall = window.innerWidth <= 480;
    
    // Resize Shape 1 (Sphere)
    if (shape1Renderer && shape1Camera) {
        const size1 = isVerySmall ? 150 : isMobile ? 180 : 220;
        shape1Renderer.setSize(size1, size1);
        shape1Camera.aspect = 1;
        shape1Camera.updateProjectionMatrix();
        
        const canvas1 = document.getElementById('shape-1-canvas');
        if (canvas1) {
            canvas1.style.width = size1 + 'px';
            canvas1.style.height = size1 + 'px';
        }
    }
    
    // Resize Shape 2 (Cube)
    if (shape2Renderer && shape2Camera) {
        const size2 = isVerySmall ? 120 : isMobile ? 150 : 180;
        shape2Renderer.setSize(size2, size2);
        shape2Camera.aspect = 1;
        shape2Camera.updateProjectionMatrix();
        
        const canvas2 = document.getElementById('shape-2-canvas');
        if (canvas2) {
            canvas2.style.width = size2 + 'px';
            canvas2.style.height = size2 + 'px';
        }
    }
    
    // Resize Shape 3 (Pyramid)
    if (shape3Renderer && shape3Camera) {
        const size3 = isVerySmall ? 130 : isMobile ? 160 : 200;
        shape3Renderer.setSize(size3, size3);
        shape3Camera.aspect = 1;
        shape3Camera.updateProjectionMatrix();
        
        const canvas3 = document.getElementById('shape-3-canvas');
        if (canvas3) {
            canvas3.style.width = size3 + 'px';
            canvas3.style.height = size3 + 'px';
        }
    }
}

// Add 3D shape interaction
function add3DShapeInteraction() {
    const canvases = [
        document.getElementById('shape-1-canvas'),
        document.getElementById('shape-2-canvas'),
        document.getElementById('shape-3-canvas')
    ];
    
    canvases.forEach((canvas, index) => {
        if (canvas) {
            canvas.addEventListener('mouseenter', () => {
                canvas.style.transform = 'scale(1.1)';
                canvas.style.transition = 'transform 0.3s ease';
            });
            
            canvas.addEventListener('mouseleave', () => {
                canvas.style.transform = 'scale(1.0)';
            });
        }
    });
} 