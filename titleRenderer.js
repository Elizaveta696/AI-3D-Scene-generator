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
            this.renderer.setClearColor(0x000000, 0);
            
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
        canvas.height = 512;
        
        // Grey background matching main scene
        context.fillStyle = '#383838';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // White text
        context.fillStyle = '#ffffff';
        context.font = 'bold 180px Poppins, -apple-system, BlinkMacSystemFont, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('3D Scene Generator', canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        
        const geometry = new THREE.PlaneGeometry(6, 1.2);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: false,
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
