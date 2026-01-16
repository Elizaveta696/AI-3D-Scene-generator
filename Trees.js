/**
 * Trees.js - Basic 3D Object Primitives
 * Contains factory functions for creating pre-made 3D objects
 */

const Trees = {
    /**
     * Creates a sphere
     * @param {number} radius - Radius of the sphere
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Sphere mesh
     */
    sphere: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.7
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a cube/box
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} depth - Depth
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Cube mesh
     */
    cube: function(width = 1, height = 1, depth = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a cylinder
     * @param {number} radiusTop - Radius at top
     * @param {number} radiusBottom - Radius at bottom
     * @param {number} height - Height
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Cylinder mesh
     */
    cylinder: function(radiusTop = 1, radiusBottom = 1, height = 2, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a cone
     * @param {number} radius - Base radius
     * @param {number} height - Height
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Cone mesh
     */
    cone: function(radius = 1, height = 2, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.ConeGeometry(radius, height, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a torus
     * @param {number} radius - Main radius
     * @param {number} tube - Tube radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Torus mesh
     */
    torus: function(radius = 1, tube = 0.4, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.TorusGeometry(radius, tube, 16, 100);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.6
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a plane
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Plane mesh
     */
    plane: function(width = 2, height = 2, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.9,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a line
     * @param {THREE.Vector3} start - Start position
     * @param {THREE.Vector3} end - End position
     * @param {string} color - Hex color code
     * @returns {THREE.Line} Line object
     */
    line: function(start = new THREE.Vector3(0, 0, 0), end = new THREE.Vector3(1, 1, 1), color = 0xffffff) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 2
        });
        return new THREE.Line(geometry, material);
    },

    /**
     * Creates a pyramid
     * @param {number} size - Base size
     * @param {number} height - Height
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Pyramid mesh
     */
    pyramid: function(size = 1, height = 2, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.ConeGeometry(size, height, 4);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a tetrahedron
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Tetrahedron mesh
     */
    tetrahedron: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.TetrahedronGeometry(radius);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates an octahedron
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Octahedron mesh
     */
    octahedron: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.OctahedronGeometry(radius);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates emissive light (for suns, etc.)
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} intensity - Emission intensity
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Light sphere mesh
     */
    lightSphere: function(radius = 1, color = 0xffff00, intensity = 1, x = 0, y = 0, z = 0) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: intensity
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        // Add a point light to illuminate the scene
        const light = new THREE.PointLight(color, intensity * 2, 1000);
        light.position.copy(mesh.position);
        mesh.light = light;
        
        return mesh;
    },

    /**
     * Creates a ring/Saturn-like object
     * @param {number} innerRadius - Inner radius
     * @param {number} outerRadius - Outer radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Ring mesh
     */
    ring: function(innerRadius = 1, outerRadius = 2, color = 0xccaa88, x = 0, y = 0, z = 0) {
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.4,
            roughness: 0.6,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a dodecahedron
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Dodecahedron mesh
     */
    dodecahedron: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.DodecahedronGeometry(radius);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates an icosahedron
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Icosahedron mesh
     */
    icosahedron: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.IcosahedronGeometry(radius);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a lathe shape (vase-like)
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Lathe mesh
     */
    vase: function(scale = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.5, 0));
        points.push(new THREE.Vector2(0.8, 0.2));
        points.push(new THREE.Vector2(1, 0.5));
        points.push(new THREE.Vector2(0.9, 1));
        points.push(new THREE.Vector2(0.5, 1.2));
        points.push(new THREE.Vector2(0.3, 1));
        const geometry = new THREE.LatheGeometry(points, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.scale.set(scale, scale, scale);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a capsule (rounded box)
     * @param {number} radius - Radius
     * @param {number} length - Length
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Capsule mesh
     */
    capsule: function(radius = 0.5, length = 2, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.CapsuleGeometry(radius, length, 8, 16);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.7
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a disc/disk
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Disk mesh
     */
    disk: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.CircleGeometry(radius, 64);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a prism
     * @param {number} radius - Radius
     * @param {number} height - Height
     * @param {number} sides - Number of sides (3-12)
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Prism mesh
     */
    prism: function(radius = 1, height = 2, sides = 6, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.CylinderGeometry(radius, radius, height, sides);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a wedge/block
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} depth - Depth
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Wedge mesh
     */
    wedge: function(width = 1, height = 1, depth = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const geometry = new THREE.TetrahedronGeometry(1);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(width, height, depth);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a star burst shape
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Star group
     */
    star: function(radius = 1, color = 0xffffff, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // Create 6 rays emanating from center
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const start = new THREE.Vector3(0, 0, 0);
            const end = new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
            const material = new THREE.LineBasicMaterial({ color: color, linewidth: 3 });
            const line = new THREE.Line(geometry, material);
            group.add(line);
        }
        
        return group;
    },

    /**
     * Creates a circle outline (not filled)
     * @param {number} radius - Radius
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Line} Circle line
     */
    circle: function(radius = 1, color = 0x808080, x = 0, y = 0, z = 0) {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            ));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: 1 });
        const circle = new THREE.Line(geometry, material);
        circle.position.set(x, y, z);
        return circle;
    },

    /**
     * Creates a vertical line
     * @param {number} height - Height of line
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Line} Vertical line
     */
    verticalLine: function(height = 2, color = 0x808080, x = 0, y = 0, z = 0) {
        const start = new THREE.Vector3(0, -height / 2, 0);
        const end = new THREE.Vector3(0, height / 2, 0);
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const line = new THREE.Line(geometry, material);
        line.position.set(x, y, z);
        return line;
    },

    /**
     * Creates a horizontal line
     * @param {number} length - Length of line
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Line} Horizontal line
     */
    horizontalLine: function(length = 2, color = 0x808080, x = 0, y = 0, z = 0) {
        const start = new THREE.Vector3(-length / 2, 0, 0);
        const end = new THREE.Vector3(length / 2, 0, 0);
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const line = new THREE.Line(geometry, material);
        line.position.set(x, y, z);
        return line;
    },

    /**
     * Creates a grid
     * @param {number} size - Grid size
     * @param {number} divisions - Number of divisions
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.GridHelper} Grid
     */
    grid: function(size = 10, divisions = 10, color = 0x808080, x = 0, y = 0, z = 0) {
        const grid = new THREE.GridHelper(size, divisions, color, color);
        grid.position.set(x, y, z);
        return grid;
    },

    /**
     * Creates axes (X, Y, Z lines)
     * @param {number} size - Size of axes
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.AxesHelper} Axes
     */
    axes: function(size = 5, x = 0, y = 0, z = 0) {
        const axes = new THREE.AxesHelper(size);
        axes.position.set(x, y, z);
        return axes;
    },

    /**
     * Creates a tube/hollow cylinder
     * @param {number} radius - Outer radius
     * @param {number} tubeRadius - Tube radius
     * @param {number} height - Height
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Mesh} Tube mesh
     */
    tube: function(radius = 2, tubeRadius = 0.5, height = 4, color = 0x808080, x = 0, y = 0, z = 0) {
        const curve = new THREE.LineCurve3(
            new THREE.Vector3(0, -height / 2, 0),
            new THREE.Vector3(0, height / 2, 0)
        );
        const geometry = new THREE.TubeGeometry(curve, 8, tubeRadius, 8, false);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    },

    /**
     * Creates a simple human figure
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Human figure group
     */
    human: function(scale = 1, color = 0x999999, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // Head
        const headGeom = new THREE.SphereGeometry(0.4 * scale, 16, 16);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xcc9988 });
        const head = new THREE.Mesh(headGeom, headMat);
        head.position.y = 1.2 * scale;
        group.add(head);
        
        // Body
        const bodyGeom = new THREE.BoxGeometry(0.4 * scale, 0.8 * scale, 0.3 * scale);
        const bodyMat = new THREE.MeshStandardMaterial({ color: color });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = 0.4 * scale;
        group.add(body);
        
        // Left arm
        const armGeom = new THREE.BoxGeometry(0.15 * scale, 0.6 * scale, 0.15 * scale);
        const armMat = new THREE.MeshStandardMaterial({ color: 0xcc9988 });
        const leftArm = new THREE.Mesh(armGeom, armMat);
        leftArm.position.set(-0.35 * scale, 0.5 * scale, 0);
        group.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeom, armMat);
        rightArm.position.set(0.35 * scale, 0.5 * scale, 0);
        group.add(rightArm);
        
        // Left leg
        const legGeom = new THREE.BoxGeometry(0.15 * scale, 0.6 * scale, 0.15 * scale);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const leftLeg = new THREE.Mesh(legGeom, legMat);
        leftLeg.position.set(-0.15 * scale, -0.3 * scale, 0);
        group.add(leftLeg);
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeom, legMat);
        rightLeg.position.set(0.15 * scale, -0.3 * scale, 0);
        group.add(rightLeg);
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple house
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} House group
     */
    house: function(scale = 1, color = 0x8B4513, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // Main walls
        const wallGeom = new THREE.BoxGeometry(2 * scale, 1.8 * scale, 1.5 * scale);
        const wallMat = new THREE.MeshStandardMaterial({ color: color });
        const walls = new THREE.Mesh(wallGeom, wallMat);
        walls.position.y = 0.9 * scale;
        group.add(walls);
        
        // Roof
        const roofGeom = new THREE.ConeGeometry(1.5 * scale, 1 * scale, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.y = 2.2 * scale;
        group.add(roof);
        
        // Door
        const doorGeom = new THREE.BoxGeometry(0.4 * scale, 1 * scale, 0.1 * scale);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeom, doorMat);
        door.position.set(0, 0.5 * scale, 0.75 * scale);
        group.add(door);
        
        // Window
        const winGeom = new THREE.BoxGeometry(0.4 * scale, 0.4 * scale, 0.1 * scale);
        const winMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB });
        const window1 = new THREE.Mesh(winGeom, winMat);
        window1.position.set(-0.5 * scale, 1.2 * scale, 0.75 * scale);
        group.add(window1);
        
        const window2 = new THREE.Mesh(winGeom, winMat);
        window2.position.set(0.5 * scale, 1.2 * scale, 0.75 * scale);
        group.add(window2);
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple eye
     * @param {number} scale - Scale factor
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Eye group
     */
    eye: function(scale = 1, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // White of eye
        const whiteGeom = new THREE.SphereGeometry(0.6 * scale, 16, 16);
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const white = new THREE.Mesh(whiteGeom, whiteMat);
        group.add(white);
        
        // Iris
        const irisGeom = new THREE.SphereGeometry(0.35 * scale, 16, 16);
        const irisMat = new THREE.MeshStandardMaterial({ color: 0x4488BB });
        const iris = new THREE.Mesh(irisGeom, irisMat);
        iris.position.z = 0.25 * scale;
        group.add(iris);
        
        // Pupil
        const pupilGeom = new THREE.SphereGeometry(0.15 * scale, 12, 12);
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const pupil = new THREE.Mesh(pupilGeom, pupilMat);
        pupil.position.z = 0.5 * scale;
        group.add(pupil);
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple tree/plant
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code (foliage)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Tree group
     */
    tree: function(scale = 1, color = 0x228B22, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        // Trunk
        const trunkGeom = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 0.75 * scale;
        group.add(trunk);
        
        // Foliage
        const foliageGeom = new THREE.SphereGeometry(1 * scale, 8, 8);
        const foliageMat = new THREE.MeshStandardMaterial({ color: color });
        const foliage = new THREE.Mesh(foliageGeom, foliageMat);
        foliage.position.y = 2 * scale;
        group.add(foliage);
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple cloud
     * @param {number} scale - Scale factor
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Cloud group
     */
    cloud: function(scale = 1, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        const cloudMat = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF,
            metalness: 0,
            roughness: 0.8
        });
        
        // Create cloud from multiple spheres
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * scale, 8, 8), cloudMat);
        s1.position.x = -0.6 * scale;
        group.add(s1);
        
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.7 * scale, 8, 8), cloudMat);
        s2.position.x = 0;
        group.add(s2);
        
        const s3 = new THREE.Mesh(new THREE.SphereGeometry(0.5 * scale, 8, 8), cloudMat);
        s3.position.x = 0.6 * scale;
        group.add(s3);
        
        const s4 = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 8, 8), cloudMat);
        s4.position.set(-0.3 * scale, 0.3 * scale, 0);
        group.add(s4);
        
        const s5 = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 8, 8), cloudMat);
        s5.position.set(0.3 * scale, 0.3 * scale, 0);
        group.add(s5);
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple mountain
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Mountain group
     */
    mountain: function(scale = 1, color = 0x808080, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        const mountainMat = new THREE.MeshStandardMaterial({ color: color });
        
        // Peak
        const peakGeom = new THREE.ConeGeometry(0.8 * scale, 2 * scale, 8);
        const peak = new THREE.Mesh(peakGeom, mountainMat);
        peak.castShadow = true;
        peak.receiveShadow = true;
        group.add(peak);
        
        // Base
        const baseGeom = new THREE.ConeGeometry(2 * scale, 0.5 * scale, 8);
        const base = new THREE.Mesh(baseGeom, mountainMat);
        base.position.y = -0.75 * scale;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);
        
        return group;
    },

    /**
     * Creates simple hair/afro
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Hair group
     */
    hair: function(scale = 1, color = 0x8B4513, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        const hairMat = new THREE.MeshStandardMaterial({ color: color });
        
        // Main hair volume
        const mainGeom = new THREE.SphereGeometry(0.6 * scale, 16, 16);
        const main = new THREE.Mesh(mainGeom, hairMat);
        group.add(main);
        
        // Hair strands (simple cylinders)
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const strandGeom = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 0.8 * scale, 6);
            const strand = new THREE.Mesh(strandGeom, hairMat);
            strand.position.set(
                Math.cos(angle) * 0.6 * scale,
                0.4 * scale,
                Math.sin(angle) * 0.6 * scale
            );
            group.add(strand);
        }
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    },

    /**
     * Creates a simple animal (cat-like)
     * @param {number} scale - Scale factor
     * @param {string} color - Hex color code
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @returns {THREE.Group} Animal group
     */
    animal: function(scale = 1, color = 0xFF6B6B, x = 0, y = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        const bodyMat = new THREE.MeshStandardMaterial({ color: color });
        
        // Body
        const bodyGeom = new THREE.SphereGeometry(0.5 * scale, 12, 12);
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        group.add(body);
        
        // Head
        const headGeom = new THREE.SphereGeometry(0.35 * scale, 12, 12);
        const head = new THREE.Mesh(headGeom, bodyMat);
        head.position.set(0.6 * scale, 0.1 * scale, 0);
        group.add(head);
        
        // Ears
        const earGeom = new THREE.ConeGeometry(0.15 * scale, 0.4 * scale, 8);
        const leftEar = new THREE.Mesh(earGeom, bodyMat);
        leftEar.position.set(0.5 * scale, 0.4 * scale, -0.2 * scale);
        group.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeom, bodyMat);
        rightEar.position.set(0.5 * scale, 0.4 * scale, 0.2 * scale);
        group.add(rightEar);
        
        // Tail
        const tailGeom = new THREE.CylinderGeometry(0.08 * scale, 0.05 * scale, 1 * scale, 8);
        const tail = new THREE.Mesh(tailGeom, bodyMat);
        tail.position.set(-0.5 * scale, -0.2 * scale, 0);
        tail.rotation.z = 0.5;
        group.add(tail);
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeom = new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 0.4 * scale, 6);
            const leg = new THREE.Mesh(legGeom, bodyMat);
            const xOffset = i < 2 ? -0.25 : 0.25;
            const zOffset = i % 2 === 0 ? -0.25 : 0.25;
            leg.position.set(xOffset * scale, -0.4 * scale, zOffset * scale);
            group.add(leg);
        }
        
        group.castShadow = true;
        group.receiveShadow = true;
        return group;
    }
};
