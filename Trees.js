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
    }
};
