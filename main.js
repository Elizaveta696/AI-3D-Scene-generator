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

        // Initialize anatomy system for character assembly
        this.anatomy = this.createAnatomy();

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

        // Setup global scale controls
        this.setupScaleControls();
    }

    /**
     * Create the anatomy system for character assembly
     * Maps body parts to their hierarchical relationships
     */
    createAnatomy() {
        return {
            bodies: {}, // Map of body ID to body parts
            attachmentRules: {
                'head': { parent: 'scene', offsetY: 1.2 },
                'torso': { parent: 'scene', offsetY: 0.4 },
                'legs': { parent: 'torso', offsetY: -0.8 },
                'arms': { parent: 'torso', offsetY: 0.5 }
            },
            clothing: {} // Map of clothing to attachment rules
        };
    }

    /**
     * Track an object in the anatomy system
     * @param {string} bodyId - Unique identifier for the character
     * @param {string} partName - head, torso, legs, etc.
     * @param {THREE.Mesh} mesh - The Three.js mesh for this part
     */
    registerBodyPart(bodyId, partName, mesh) {
        if (!this.anatomy.bodies[bodyId]) {
            this.anatomy.bodies[bodyId] = {};
        }
        this.anatomy.bodies[bodyId][partName] = {
            mesh: mesh,
            children: [] // Objects attached to this part
        };
    }

    /**
     * Register multiple body parts for a complex model like human
     * Automatically creates head, torso, legs parts with proper offsets
     */
    registerHumanBodyParts(bodyId, humanMesh, scale = 1) {
        if (!this.anatomy.bodies[bodyId]) {
            this.anatomy.bodies[bodyId] = {};
        }
        
        // Create virtual body parts for human anatomy
        // Head is 1.2 units above torso
        const headGroup = new THREE.Group();
        headGroup.position.copy(humanMesh.position);
        headGroup.position.y += 1.2 * scale;
        
        const torsoGroup = new THREE.Group();
        torsoGroup.position.copy(humanMesh.position);
        torsoGroup.position.y += 0.4 * scale;
        
        const legsGroup = new THREE.Group();
        legsGroup.position.copy(humanMesh.position);
        legsGroup.position.y -= 0.3 * scale;
        
        this.anatomy.bodies[bodyId]['head'] = {
            mesh: headGroup,
            children: [],
            offset: { x: 0, y: 1.2 * scale, z: 0 }
        };
        this.anatomy.bodies[bodyId]['torso'] = {
            mesh: torsoGroup,
            children: [],
            offset: { x: 0, y: 0.4 * scale, z: 0 }
        };
        this.anatomy.bodies[bodyId]['legs'] = {
            mesh: legsGroup,
            children: [],
            offset: { x: 0, y: -0.3 * scale, z: 0 }
        };
    }

    /**
     * Attach an object (clothing, accessory) to a body part
     * Handles relative positioning and scaling
     */
    attachToBodyPart(bodyId, attachToPoint, clothingMesh, options = {}) {
        const bodyParts = this.anatomy.bodies[bodyId];
        if (!bodyParts || !bodyParts[attachToPoint]) {
            console.warn(`Body part not found: ${attachToPoint}, treating as scene object`);
            return false;
        }

        const parentPart = bodyParts[attachToPoint];
        const scale_multiplier = options.scale_multiplier || 1.0;
        const offset = options.offset || { x: 0, y: 0, z: 0 };

        // Scale clothing relative to body part
        if (clothingMesh.scale) {
            clothingMesh.scale.multiplyScalar(scale_multiplier);
        }

        // Position relative to parent with z-fighting offset
        clothingMesh.position.copy(parentPart.mesh.position);
        clothingMesh.position.x += offset.x;
        clothingMesh.position.y += offset.y;
        clothingMesh.position.z += offset.z + 0.05; // Slight z-offset to avoid z-fighting

        // Add to parent's children list
        parentPart.children.push({
            mesh: clothingMesh,
            offset: offset,
            scale_multiplier: scale_multiplier
        });

        return true;
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

    setupScaleControls() {
        const scaleDownBtn = document.getElementById('scaleDownBtn');
        const scaleUpBtn = document.getElementById('scaleUpBtn');

        if (scaleDownBtn) {
            scaleDownBtn.addEventListener('click', () => {
                this.scaleAllObjects(0.9);
            });
        }

        if (scaleUpBtn) {
            scaleUpBtn.addEventListener('click', () => {
                this.scaleAllObjects(1.1);
            });
        }
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

            // Reset scale to 1.0x
            this.sceneGroup.scale.set(1, 1, 1);
            const scaleValueElement = document.getElementById('scaleValue');
            if (scaleValueElement) {
                scaleValueElement.textContent = '1.0x';
            }

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
        // First pass: create all body objects and scene-level objects
        const bodyObjects = new Map(); // Track bodies by ID
        
        for (const objData of objectsData) {
            try {
                const params = objData.params;
                
                // Determine if this is a body, clothing, or scene object
                const role = objData.role || 'environment';
                const attachTo = objData.attachTo || 'scene';
                
                // Only create scene-level objects in first pass
                if (attachTo === 'scene') {
                    let mesh = this.createMesh(objData);
                    
                    if (!mesh) continue;
                    
                    // Track body objects separately
                    if (role === 'body') {
                        if (!bodyObjects.has(objData.name)) {
                            bodyObjects.set(objData.name, {
                                mesh: mesh,
                                data: objData
                            });
                        }
                        // Register body parts based on type
                        if (objData.type === 'human') {
                            this.registerHumanBodyParts(objData.name, mesh, params.scale || 1);
                        } else {
                            this.registerBodyPart(objData.name, 'torso', mesh);
                        }
                        // Add to scene
                        this.sceneGroup.add(mesh);
                        this.currentObjects.push(mesh);
                    }
                }
            } catch (error) {
                console.error(`Error creating object ${objData.type}:`, error);
            }
        }
        
        // Second pass: attach clothing and accessories to body parts
        for (const objData of objectsData) {
            try {
                const attachTo = objData.attachTo || 'scene';
                
                // Skip scene-level objects
                if (attachTo === 'scene') continue;
                
                // Create clothing/accessory mesh
                let mesh = this.createMesh(objData);
                if (!mesh) continue;
                
                // Find the parent body
                let parentBodyId = null;
                for (const [bodyId, bodyParts] of Object.entries(this.anatomy.bodies)) {
                    if (bodyParts[attachTo]) {
                        parentBodyId = bodyId;
                        break;
                    }
                }
                
                if (!parentBodyId) {
                    console.warn(`Could not find body part "${attachTo}" for ${objData.name}, treating as scene object`);
                    this.sceneGroup.add(mesh);
                    this.currentObjects.push(mesh);
                    continue;
                }
                
                // Attach to body part with relative positioning
                const attachmentOptions = {
                    scale_multiplier: objData.scale_multiplier || 1.0,
                    offset: objData.offset || { x: 0, y: 0, z: 0 }
                };
                
                this.attachToBodyPart(parentBodyId, attachTo, mesh, attachmentOptions);
                
                mesh.userData.name = objData.name || objData.type;
                if (objData.animation) {
                    mesh.userData.animation = objData.animation;
                }
                this.sceneGroup.add(mesh);
                this.currentObjects.push(mesh);
                
            } catch (error) {
                console.error(`Error attaching ${objData.type}:`, error);
            }
        }
    }

    /**
     * Create a mesh from object data
     * Handles all shape types and returns the appropriate Three.js mesh
     */
    createMesh(objData) {
        let mesh;
        const params = objData.params;
        
        // Convert color string to number if needed
        if (typeof params.color === 'string') {
            params.color = parseInt(params.color);
        }
        
        // Get position - use 0 if not specified since relative positioning is handled separately
        const x = params.x || 0;
        const y = params.y || 0;
        const z = params.z || 0;
        
        // Create mesh based on type
        switch (objData.type) {
            case 'sphere':
                mesh = Trees.sphere(params.radius || 2, params.color, x, y, z);
                break;
            case 'cube':
                mesh = Trees.cube(params.width || 2, params.height || 2, params.depth || 2, params.color, x, y, z);
                break;
            case 'cylinder':
                mesh = Trees.cylinder(params.radiusTop || 2, params.radiusBottom || 2, params.height || 4, params.color, x, y, z);
                break;
            case 'cone':
                mesh = Trees.cone(params.radius || 2, params.height || 4, params.color, x, y, z);
                break;
            case 'torus':
                mesh = Trees.torus(params.radius || 3, params.tube || 1, params.color, x, y, z);
                break;
            case 'plane':
                mesh = Trees.plane(params.width || 4, params.height || 4, params.color, x, y, z);
                break;
            case 'pyramid':
                mesh = Trees.pyramid(params.size || 2, params.height || 4, params.color, x, y, z);
                break;
            case 'tetrahedron':
                mesh = Trees.tetrahedron(params.radius || 2, params.color, x, y, z);
                break;
            case 'octahedron':
                mesh = Trees.octahedron(params.radius || 2, params.color, x, y, z);
                break;
            case 'dodecahedron':
                mesh = Trees.dodecahedron(params.radius || 2, params.color, x, y, z);
                break;
            case 'icosahedron':
                mesh = Trees.icosahedron(params.radius || 2, params.color, x, y, z);
                break;
            case 'lightSphere':
                mesh = Trees.lightSphere(params.radius || 3, params.color, params.intensity || 1, x, y, z);
                if (mesh.light) {
                    this.scene.add(mesh.light);
                }
                break;
            case 'ring':
                mesh = Trees.ring(params.innerRadius || 2, params.outerRadius || 4, params.color, x, y, z);
                break;
            case 'vase':
                mesh = Trees.vase(params.scale || 2, params.color, x, y, z);
                break;
            case 'capsule':
                mesh = Trees.capsule(params.radius || 1, params.length || 4, params.color, x, y, z);
                break;
            case 'disk':
                mesh = Trees.disk(params.radius || 2, params.color, x, y, z);
                break;
            case 'prism':
                mesh = Trees.prism(params.radius || 2, params.height || 4, params.sides || 6, params.color, x, y, z);
                break;
            case 'wedge':
                mesh = Trees.wedge(params.width || 2, params.height || 2, params.depth || 2, params.color, x, y, z);
                break;
            case 'star':
                mesh = Trees.star(params.radius || 2, params.color, x, y, z);
                break;
            case 'circle':
                mesh = Trees.circle(params.radius || 2, params.color, x, y, z);
                break;
            case 'verticalLine':
                mesh = Trees.verticalLine(params.height || 4, params.color, x, y, z);
                break;
            case 'horizontalLine':
                mesh = Trees.horizontalLine(params.length || 4, params.color, x, y, z);
                break;
            case 'grid':
                mesh = Trees.grid(params.size || 10, params.divisions || 10, params.color, x, y, z);
                break;
            case 'axes':
                mesh = Trees.axes(params.size || 5, x, y, z);
                break;
            case 'tube':
                mesh = Trees.tube(params.radius || 2, params.tubeRadius || 0.5, params.height || 4, params.color, x, y, z);
                break;
            case 'human':
                mesh = Trees.human(params.scale || 1, params.color || 0x999999, x, y, z);
                break;
            case 'house':
                mesh = Trees.house(params.scale || 1, params.color || 0x8B4513, x, y, z);
                break;
            case 'tree':
                mesh = Trees.tree(params.scale || 1, params.color || 0x228B22, x, y, z);
                break;
            case 'cloud':
                mesh = Trees.cloud(params.scale || 1, x, y, z);
                break;
            case 'mountain':
                mesh = Trees.mountain(params.scale || 1, params.color || 0x808080, x, y, z);
                break;
            case 'eye':
                mesh = Trees.eye(params.scale || 1, x, y, z);
                break;
            case 'hair':
                mesh = Trees.hair(params.scale || 1, params.color || 0x8B4513, x, y, z);
                break;
            case 'animal':
                mesh = Trees.animal(params.scale || 1, params.color || 0xFF6B6B, x, y, z);
                break;
            case 'line':
                const start = new THREE.Vector3(params.x1 || 0, params.y1 || 0, params.z1 || 0);
                const end = new THREE.Vector3(params.x2 || 1, params.y2 || 1, params.z2 || 1);
                mesh = Trees.line(start, end, params.color);
                break;
            default:
                console.warn(`Unknown object type: ${objData.type}`);
                return null;
        }
        
        // Store original material properties for transparency toggle
        if (mesh && mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach(mat => {
                if (!mat.userData) mat.userData = {};
                mat.userData.originalColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                mat.userData.originalEmissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000);
            });
        }
        
        // Store original properties for children
        if (mesh && mesh.children) {
            mesh.traverse(child => {
                if (child.material) {
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach(mat => {
                        if (!mat.userData) mat.userData = {};
                        mat.userData.originalColor = mat.color ? mat.color.clone() : new THREE.Color(0xffffff);
                        mat.userData.originalEmissive = mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000);
                    });
                }
            });
        }
        
        return mesh;
    }

    displayObjectsList(objectsData) {
        const listDiv = document.getElementById('objectsList');
        listDiv.innerHTML = '';

        for (let i = 0; i < objectsData.length; i++) {
            const obj = objectsData[i];
            const item = document.createElement('div');
            item.className = 'object-item';
            
            const label = document.createElement('span');
            label.textContent = `• ${obj.name || obj.type} (${obj.type})`;
            label.style.flex = '1';
            item.appendChild(label);
            
            // Add transparency toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-visibility-btn';
            toggleBtn.textContent = '👁️';
            toggleBtn.title = 'Toggle transparency';
            toggleBtn.dataset.objectIndex = i;
            toggleBtn.style.marginLeft = '8px';
            toggleBtn.style.padding = '2px 8px';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.border = '1px solid #666';
            toggleBtn.style.background = '#555';
            toggleBtn.style.color = '#fff';
            toggleBtn.style.borderRadius = '3px';
            toggleBtn.style.fontSize = '12px';
            
            // Click handler for transparency toggle
            toggleBtn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.objectIndex);
                this.toggleObjectTransparency(index);
            });
            
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.appendChild(toggleBtn);
            listDiv.appendChild(item);
        }
    }

    /**
     * Scale all objects together
     * @param {number} scaleFactor - Multiplier (1.1 for bigger, 0.9 for smaller)
     */
    scaleAllObjects(scaleFactor) {
        this.sceneGroup.scale.multiplyScalar(scaleFactor);
        
        // Update scale display
        const newScale = this.sceneGroup.scale.x;
        const scaleValueElement = document.getElementById('scaleValue');
        if (scaleValueElement) {
            scaleValueElement.textContent = newScale.toFixed(2) + 'x';
        }
    }

    /**
     * Toggle visibility state of an object through 3 modes:
     * normal → transparent → highlighted → normal
     * @param {number} index - Index in currentObjects array
     */
    toggleObjectTransparency(index) {
        if (index >= 0 && index < this.currentObjects.length) {
            const mesh = this.currentObjects[index];
            
            // Initialize state if not set (0=normal, 1=transparent, 2=highlighted)
            if (mesh.userData.visibilityState === undefined) {
                mesh.userData.visibilityState = 0;
            }
            
            // Cycle through states
            mesh.userData.visibilityState = (mesh.userData.visibilityState + 1) % 3;
            
            // Apply state
            this.setObjectVisibilityState(mesh, mesh.userData.visibilityState);
        }
    }

    /**
     * Set visibility state on mesh and all children
     * States: 0=normal, 1=transparent, 2=highlighted (bright red with glow)
     * @param {THREE.Object3D} object - Object to modify
     * @param {number} state - Visibility state (0-2)
     */
    setObjectVisibilityState(object, state) {
        if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            
            materials.forEach(mat => {
                if (state === 0) {
                    // Normal state
                    mat.transparent = false;
                    mat.opacity = 1.0;
                    mat.emissive.copy(mat.userData.originalEmissive || new THREE.Color(0x000000));
                    if (mat.color) {
                        mat.color.copy(mat.userData.originalColor || new THREE.Color(0xffffff));
                    }
                } else if (state === 1) {
                    // Transparent state
                    mat.transparent = true;
                    mat.opacity = 0.3;
                    mat.emissive.copy(mat.userData.originalEmissive || new THREE.Color(0x000000));
                } else if (state === 2) {
                    // Highlighted state - bright red glow
                    mat.transparent = true;
                    mat.opacity = 0.9;
                    mat.emissive.set(0xff3333);
                    if (mat.color) {
                        mat.color.set(0xff6666);
                    }
                }
            });
        }
        
        // Recursively apply to children
        if (object.children && object.children.length > 0) {
            object.children.forEach(child => {
                this.setObjectVisibilityState(child, state);
            });
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
