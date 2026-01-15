/**
 * main.js - Main application logic
 * Handles UI interactions and Three.js scene management
 */

class App {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x383838);

        // Camera setup
        const width = document.getElementById('canvas-container').clientWidth;
        const height = document.getElementById('canvas-container').clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Lighting
        this.setupLights();

        // Scene generator
        this.sceneGenerator = new SceneGenerator();
        this.currentObjects = [];
        this.sceneGroup = new THREE.Group(); // Group for rotating all objects together
        this.scene.add(this.sceneGroup);

        // Mouse controls for scene rotation
        this.setupMouseControls();

        // Event listeners
        this.setupEventListeners();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation loop
        this.animate();

        // Initialize with API key from .env
        this.initializeWithEnvKey();
    }

    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(20, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
    }

    setupMouseControls() {
        this.mouse = { x: 0, y: 0, down: false };
        this.sceneRotation = { x: 0, y: 0 };

        document.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (this.mouse.down) {
                const deltaX = e.clientX - this.mouse.x;
                const deltaY = e.clientY - this.mouse.y;

                this.sceneRotation.y += deltaX * 0.005;
                this.sceneRotation.x += deltaY * 0.005;

                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateScene());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetScene());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportScene());

        // Allow generation with Ctrl+Enter
        document.getElementById('sceneDescription').addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.generateScene();
            }
        });
    }

    initializeWithEnvKey() {
        if (this.sceneGenerator.hasApiKey()) {
            this.updateStatus('API key loaded from .env file ✓', 'success');
        } else {
            this.updateStatus('⚠️ No API key found. Please add OPENAI_API_KEY to .env file', 'error');
        }
    }

    async generateScene() {
        const description = document.getElementById('sceneDescription').value;
        const generateBtn = document.getElementById('generateBtn');

        if (!description.trim()) {
            this.updateStatus('Please enter a scene description', 'error');
            return;
        }

        if (!this.sceneGenerator.apiKey) {
            this.updateStatus('Please set an OpenAI API key', 'error');
            return;
        }

        // Disable button and show loading
        generateBtn.disabled = true;
        this.updateStatus('Generating scene with AI...', 'loading');

        try {
            // Get scene data from OpenAI
            const sceneData = await this.sceneGenerator.generateSceneFromDescription(description);

            // Validate the data
            this.sceneGenerator.validateSceneData(sceneData);

            // Clear existing scene
            this.clearScene();

            // Set background color
            if (sceneData.background) {
                this.scene.background = new THREE.Color(parseInt(sceneData.background));
            }

            // Create objects from scene data
            this.createObjectsFromData(sceneData.objects);

            // Update UI
            this.displayObjectsList(sceneData.objects);
            this.updateStatus(`Scene created with ${sceneData.objects.length} objects!`, 'success');

            // Auto-fit camera
            this.fitCameraToScene();

        } catch (error) {
            console.error('Error generating scene:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        } finally {
            generateBtn.disabled = false;
        }
    }

    createObjectsFromData(objectsData) {
        for (const objData of objectsData) {
            try {
                let mesh;
                const params = objData.params;

                // Convert color string to number if needed
                if (typeof params.color === 'string') {
                    params.color = parseInt(params.color);
                }

                // Create object based on type
                switch (objData.type) {
                    case 'sphere':
                        mesh = Trees.sphere(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'cube':
                        mesh = Trees.cube(params.width || 2, params.height || 2, params.depth || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'cylinder':
                        mesh = Trees.cylinder(params.radiusTop || 2, params.radiusBottom || 2, params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'cone':
                        mesh = Trees.cone(params.radius || 2, params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'torus':
                        mesh = Trees.torus(params.radius || 3, params.tube || 1, params.color, params.x, params.y, params.z);
                        break;
                    case 'plane':
                        mesh = Trees.plane(params.width || 4, params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'pyramid':
                        mesh = Trees.pyramid(params.size || 2, params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'tetrahedron':
                        mesh = Trees.tetrahedron(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'octahedron':
                        mesh = Trees.octahedron(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'dodecahedron':
                        mesh = Trees.dodecahedron(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'icosahedron':
                        mesh = Trees.icosahedron(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'lightSphere':
                        mesh = Trees.lightSphere(params.radius || 3, params.color, params.intensity || 1, params.x, params.y, params.z);
                        if (mesh.light) {
                            this.scene.add(mesh.light);
                        }
                        break;
                    case 'ring':
                        mesh = Trees.ring(params.innerRadius || 2, params.outerRadius || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'vase':
                        mesh = Trees.vase(params.scale || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'capsule':
                        mesh = Trees.capsule(params.radius || 1, params.length || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'disk':
                        mesh = Trees.disk(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'prism':
                        mesh = Trees.prism(params.radius || 2, params.height || 4, params.sides || 6, params.color, params.x, params.y, params.z);
                        break;
                    case 'wedge':
                        mesh = Trees.wedge(params.width || 2, params.height || 2, params.depth || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'star':
                        mesh = Trees.star(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'circle':
                        mesh = Trees.circle(params.radius || 2, params.color, params.x, params.y, params.z);
                        break;
                    case 'verticalLine':
                        mesh = Trees.verticalLine(params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'horizontalLine':
                        mesh = Trees.horizontalLine(params.length || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'grid':
                        mesh = Trees.grid(params.size || 10, params.divisions || 10, params.color, params.x, params.y, params.z);
                        break;
                    case 'axes':
                        mesh = Trees.axes(params.size || 5, params.x, params.y, params.z);
                        break;
                    case 'tube':
                        mesh = Trees.tube(params.radius || 2, params.tubeRadius || 0.5, params.height || 4, params.color, params.x, params.y, params.z);
                        break;
                    case 'line':
                        const start = new THREE.Vector3(params.x1 || 0, params.y1 || 0, params.z1 || 0);
                        const end = new THREE.Vector3(params.x2 || 1, params.y2 || 1, params.z2 || 1);
                        mesh = Trees.line(start, end, params.color);
                        break;
                    default:
                        console.warn(`Unknown object type: ${objData.type}`);
                        continue;
                }

                mesh.userData.name = objData.name || objData.type;
                // Store animation data if present
                if (objData.animation) {
                    mesh.userData.animation = objData.animation;
                }
                this.sceneGroup.add(mesh);
                this.currentObjects.push(mesh);

            } catch (error) {
                console.error(`Error creating object ${objData.type}:`, error);
            }
        }
    }

    displayObjectsList(objectsData) {
        const listDiv = document.getElementById('objectsList');
        listDiv.innerHTML = '';

        for (const obj of objectsData) {
            const item = document.createElement('div');
            item.className = 'object-item';
            item.textContent = `• ${obj.name || obj.type} (${obj.type})`;
            listDiv.appendChild(item);
        }
    }

    clearScene() {
        // Remove all objects from the group
        this.sceneGroup.children = [];
        this.currentObjects = [];

        // Clear objects list
        document.getElementById('objectsList').innerHTML = '';
    }

    resetScene() {
        this.clearScene();
        this.scene.background = new THREE.Color(0x000000);
        document.getElementById('sceneDescription').value = '';
        this.updateStatus('Scene reset', 'success');
        this.camera.position.set(0, 15, 30);
        this.camera.lookAt(0, 0, 0);
    }

    fitCameraToScene() {
        if (this.currentObjects.length === 0) return;

        // Calculate bounding box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (const obj of this.currentObjects) {
            const pos = obj.position;
            const geometry = obj.geometry;

            if (geometry) {
                geometry.computeBoundingBox();
                const bbox = geometry.boundingBox;
                
                minX = Math.min(minX, pos.x - (bbox.max.x - bbox.min.x) / 2);
                maxX = Math.max(maxX, pos.x + (bbox.max.x - bbox.min.x) / 2);
                minY = Math.min(minY, pos.y - (bbox.max.y - bbox.min.y) / 2);
                maxY = Math.max(maxY, pos.y + (bbox.max.y - bbox.min.y) / 2);
                minZ = Math.min(minZ, pos.z - (bbox.max.z - bbox.min.z) / 2);
                maxZ = Math.max(maxZ, pos.z + (bbox.max.z - bbox.min.z) / 2);
            }
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        const distance = Math.max(
            maxX - minX,
            maxY - minY,
            maxZ - minZ
        ) * 1.5;

        this.camera.position.set(
            centerX + distance,
            centerY + distance * 0.5,
            centerZ + distance
        );
        this.camera.lookAt(centerX, centerY, centerZ);
    }

    exportScene() {
        if (this.currentObjects.length === 0) {
            this.updateStatus('No scene to export', 'error');
            return;
        }

        try {
            // Create a simple JSON export of the scene
            const exportData = {
                timestamp: new Date().toISOString(),
                background: '#' + this.scene.background.getHexString(),
                objects: this.currentObjects.map(obj => ({
                    name: obj.userData.name || 'object',
                    type: obj.constructor.name,
                    position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                    rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
                    scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
                }))
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `scene-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);

            this.updateStatus('Scene exported as JSON', 'success');
        } catch (error) {
            this.updateStatus('Error exporting scene: ' + error.message, 'error');
        }
    }

    updateStatus(message, status = 'normal') {
        const statusDiv = document.getElementById('status');
        statusDiv.className = status;

        if (status === 'loading') {
            statusDiv.innerHTML = `<span class="spinner"></span>${message}`;
        } else {
            statusDiv.textContent = message;
        }
    }

    onWindowResize() {
        const container = document.getElementById('canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Apply animations to each object
        for (const obj of this.currentObjects) {
            const anim = obj.userData.animation;
            
            if (anim) {
                // Apply rotation animation
                if (anim.rotation) {
                    obj.rotation.x += anim.rotation.x || 0;
                    obj.rotation.y += anim.rotation.y || 0;
                    obj.rotation.z += anim.rotation.z || 0;
                }
                
                // Apply orbit animation
                if (anim.orbit) {
                    const radius = anim.orbit.radius || 10;
                    const speed = anim.orbit.speed || 0.005;
                    const axis = anim.orbit.axis || 'y';
                    
                    // Track orbit angle if not already done
                    if (!obj.userData.orbitAngle) {
                        obj.userData.orbitAngle = 0;
                        // Get initial position to determine starting angle
                        const initialDist = Math.sqrt(obj.position.x ** 2 + obj.position.z ** 2);
                        if (initialDist > 0) {
                            obj.userData.orbitAngle = Math.atan2(obj.position.z, obj.position.x);
                        }
                    }
                    
                    obj.userData.orbitAngle += speed;
                    
                    if (axis === 'y') {
                        obj.position.x = Math.cos(obj.userData.orbitAngle) * radius;
                        obj.position.z = Math.sin(obj.userData.orbitAngle) * radius;
                    } else if (axis === 'x') {
                        obj.position.y = Math.cos(obj.userData.orbitAngle) * radius;
                        obj.position.z = Math.sin(obj.userData.orbitAngle) * radius;
                    } else if (axis === 'z') {
                        obj.position.x = Math.cos(obj.userData.orbitAngle) * radius;
                        obj.position.y = Math.sin(obj.userData.orbitAngle) * radius;
                    }
                }
                
                // Apply scale animation
                if (anim.scale) {
                    const speed = anim.scale.speed || 0.02;
                    const min = anim.scale.min || 0.5;
                    const max = anim.scale.max || 1.5;
                    
                    if (!obj.userData.scaleTime) {
                        obj.userData.scaleTime = 0;
                    }
                    obj.userData.scaleTime += speed;
                    const scale = min + (max - min) * (Math.sin(obj.userData.scaleTime) + 1) / 2;
                    obj.scale.set(scale, scale, scale);
                }
            }
        }

        // Rotate the entire scene group (all objects together) - subtle continuous rotation
        this.sceneGroup.rotation.y += 0.0005;
        this.sceneGroup.rotation.x += 0.0001;

        // Apply mouse-controlled scene rotation to the group
        this.sceneGroup.rotation.y += this.sceneRotation.y;
        this.sceneGroup.rotation.x += this.sceneRotation.x;
        
        this.sceneRotation.x *= 0.95; // Damping
        this.sceneRotation.y *= 0.95; // Damping

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
