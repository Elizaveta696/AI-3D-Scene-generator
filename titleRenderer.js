/**
 * titleRenderer.js - Modern 3D animated title
 * Renders a clean, modern animated 3D text title
 */

class TitleRenderer {
    constructor(canvasElement) {
        if (!canvasElement) {
            console.warn('TitleRenderer: Canvas element not found');
            return;
        }
        
        this.canvas = canvasElement;
        
        try {
            this.scene = new THREE.Scene();
            this.scene.background = null;
            
            const width = this.canvas.clientWidth || 800;
            const height = this.canvas.clientHeight || 180;
            
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 2.5;
            
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas, 
                antialias: true, 
                alpha: true,
                premultipliedAlpha: true,
                failIfMajorPerformanceCaveat: false
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);  // Fully transparent
            
            this.setupLights();
            this.createTitle();
            
            this.time = 0;
            this.animationId = null;
            this.animate();
            
            window.addEventListener('resize', () => this.onWindowResize());
        } catch (e) {
            console.error('TitleRenderer initialization error:', e);
        }
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
        keyLight.position.set(3, 2, 3);
        this.scene.add(keyLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
        fillLight.position.set(-3, -1, -3);
        this.scene.add(fillLight);
    }
    
    createTitle() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 2048;
        canvas.height = 768;
        
        // Fully transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Wait for Google Font to load then draw
        document.fonts.ready.then(() => {
            // Black text - two lines, Gravitas One font
            context.fillStyle = '#000000';
            context.font = 'bold 280px "Gravitas One"';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('Scene', canvas.width / 2, canvas.height / 2 - 100);
            context.fillText('Generator', canvas.width / 2, canvas.height / 2 + 100);
            
            // Update texture after font loads
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            if (this.titleMesh && this.titleMesh.material.map) {
                this.titleMesh.material.map = texture;
                this.titleMesh.material.needsUpdate = true;
            }
        });
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        
        const geometry = new THREE.PlaneGeometry(7, 2.1);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.001,
            side: THREE.DoubleSide,
            shininess: 0
        });
        
        this.titleMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.titleMesh);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.time += 0.008;
        
        if (this.titleMesh) {
            this.titleMesh.rotation.y = Math.sin(this.time * 0.4) * 0.08;
            this.titleMesh.position.y = Math.sin(this.time * 0.6) * 0.08;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }
    }
}

// Initialize when Three.js is available and DOM is ready
function initTitleRenderer() {
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded yet, retrying...');
        setTimeout(initTitleRenderer, 100);
        return;
    }
    
    const titleCanvas = document.getElementById('title-canvas');
    if (titleCanvas) {
        new TitleRenderer(titleCanvas);
    }
}

// Run after brief delay to ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitleRenderer);
} else {
    initTitleRenderer();
}
