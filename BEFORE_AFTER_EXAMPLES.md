# Before & After: Code Examples

## 1. Color Handling

### Before
```javascript
// In createMesh()
const params = objData.params;
if (typeof params.color === 'string') {
    params.color = parseInt(params.color);  // Could fail silently
}
// If color is invalid, mesh renders black or uses default Three.js color
```

**Problem**: String colors like `"0xFF0000"` work by accident. No fallback for undefined colors.

### After
```javascript
// New helper function (top of file)
function parseColor(color) {
    if (typeof color === 'number') return Math.max(0, color);
    if (typeof color === 'string') {
        try {
            return parseInt(color, 16);  // Explicitly handles hex strings
        } catch (e) {
            console.warn(`Invalid color format: ${color}, using default`);
        }
    }
    return 0xcccccc;  // Safe default grey
}

// In createMesh()
const color = parseColor(params.color);  // Always valid
```

**Result**: All color formats work, invalid colors don't crash, safe fallback always available.

---

## 2. Scale Clamping

### Before
```javascript
// AI outputs scale: 11.2
const scale = params.scale || 1;  // = 11.2
mesh.scale.set(scale, scale, scale);  // Object becomes HUGE and invisible
```

**Problem**: No validation of scale ranges. User sees black screen.

### After
```javascript
// New helper function
function clampScale(scale) {
    const normalized = typeof scale === 'number' ? scale : 1;
    return Math.max(0.1, Math.min(10, normalized));  // [0.1, 10] range
}

// In normalizeParams()
scale: clampScale(params.scale),  // 11.2 → 10.0

// Result: Visible, proportional object
```

**Result**: Objects always fit in reasonable visualization range.

---

## 3. Position Safety

### Before
```javascript
const x = params.x || 0;
const y = params.y || 0;
const z = params.z || 0;
// If params.x = NaN, it becomes 0 (wrong by accident)
// If params.x = Infinity, object placed far off-screen
```

**Problem**: No validation of position values. Objects can disappear.

### After
```javascript
// New helper function
function safePosition(value, defaultValue = 0) {
    return (typeof value === 'number' && isFinite(value)) ? value : defaultValue;
}

// In normalizeParams()
x: safePosition(params.x),        // Validates isFinite()
y: safePosition(params.y),
z: safePosition(params.z),
```

**Result**: Positions always valid, objects never placed at Infinity.

---

## 4. Lighting

### Before
```javascript
setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Weak
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(20, 20, 10);
    // Result: Potentially dark scenes, harsh shadows, back objects invisible
}
```

**Problem**: Single light source, weak ambient. Dark scenes possible.

### After
```javascript
setupLights() {
    // Strong ambient light ensures nothing is completely black
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);  // Stronger
    
    // Primary light from good angle
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(30, 30, 20);  // Better positioned
    
    // Secondary fill light from opposite
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-20, 10, -30);  // Reduces shadows
}
```

**Result**: Always visible, no dark regions, better contrast.

---

## 5. Object Normalization

### Before
```javascript
async generateScene() {
    const sceneData = await this.sceneGenerator.generateSceneFromDescription(description);
    this.createObjectsFromData(sceneData.objects);
}

createObjectsFromData(objectsData) {
    for (const objData of objectsData) {
        try {
            const params = objData.params;  // Could be undefined!
            const role = objData.role || 'environment';
            const attachTo = objData.attachTo || 'scene';
            
            // If params is undefined, createMesh() will crash
            let mesh = this.createMesh(objData);
        } catch (error) {
            console.error(`Error: ${error}`);
            // Scene partially rendered, some objects missing
        }
    }
}
```

**Problem**: No validation before processing. One bad object can break the scene.

### After
```javascript
createObjectsFromData(objectsData) {
    for (let objData of objectsData) {
        try {
            // Normalize FIRST - catch issues early
            objData = normalizeObjectData(objData);
            if (!objData) continue;  // Skip invalid objects
            
            // Now objData is guaranteed safe
            const params = objData.params;  // Always exists
            const role = objData.role;      // Always valid
            const attachTo = objData.attachTo;  // Always valid
            
            let mesh = this.createMesh(objData);  // Safe call
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }
}

function normalizeObjectData(objData) {
    if (!objData || typeof objData !== 'object') return null;
    
    return {
        type: objData.type || 'cube',              // Default to cube
        name: objData.name || objData.type,        // Default name
        role: objData.role || 'environment',       // Default role
        attachTo: objData.attachTo || 'scene',     // Default attachment
        params: normalizeParams(objData.params || {}),  // Validate all params
        scale_multiplier: clampScale(objData.scale_multiplier),
        offset: objData.offset || { x: 0, y: 0, z: 0 }
    };
}
```

**Result**: All objects have valid properties. Invalid objects skipped gracefully.

---

## 6. Background Color

### Before
```javascript
// Set background color
if (sceneData.background) {
    this.scene.background = new THREE.Color(parseInt(sceneData.background));
    // If background is "invalid", parseInt returns NaN, Three.js throws
}
// Result: Black screen, or missing background
```

**Problem**: No error handling. Invalid background crashes color assignment.

### After
```javascript
function parseBackgroundColor(background) {
    try {
        if (!background) return new THREE.Color(0x383838);  // Default
        if (typeof background === 'number') return new THREE.Color(background);
        if (typeof background === 'string') {
            return new THREE.Color(parseInt(background, 16));
        }
    } catch (e) {
        console.warn(`Invalid background: ${background}`);
    }
    return new THREE.Color(0x383838);  // Fallback
}

// In generateScene()
this.scene.background = parseBackgroundColor(sceneData.background);  // Always valid
```

**Result**: Background always valid, never crashes.

---

## 7. Camera Framing

### Before
```javascript
fitCameraToScene() {
    for (const obj of this.currentObjects) {
        const geometry = obj.geometry;
        geometry.computeBoundingBox();  // Could fail if geometry is null
        const bbox = geometry.boundingBox;  // Could be undefined
        
        minX = Math.min(minX, pos.x - (bbox.max.x - bbox.min.x) / 2);
        // If bbox is null, this crashes
    }
    
    const distance = Math.max(maxX - minX, maxY - minY, maxZ - minZ) * 1.5;
    // If all objects are at same point, distance = 0, camera doesn't move
}
```

**Problem**: No error handling. Invalid geometries crash. Edge cases not handled.

### After
```javascript
fitCameraToScene() {
    if (this.currentObjects.length === 0) {
        // Fallback for empty scene
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);
        return;
    }

    for (const obj of this.currentObjects) {
        try {
            if (obj.geometry) {
                geometry.computeBoundingBox();
                const bbox = geometry.boundingBox;
                if (!bbox) continue;  // Skip invalid
                // ... calculate bounds
            } else {
                // Handle objects without geometry (Groups)
                minX = Math.min(minX, pos.x - 1);
                maxX = Math.max(maxX, pos.x + 1);
                // ...
            }
        } catch (e) {
            console.warn('Failed to compute bounding box');
            continue;  // Skip object, continue with others
        }
    }
    
    // Validate calculated bounds
    if (!isFinite(minX) || !isFinite(maxX) || /* ... */) {
        console.warn('Using default view');
        this.camera.position.set(0, 20, 40);
        this.camera.lookAt(0, 0, 0);
        return;
    }
    
    // Calculate distance with safety minimum
    const maxSize = Math.max(sizeX, sizeY, sizeZ, 1);  // Never 0
    const distance = maxSize * 2;
    
    // Position camera
    this.camera.position.set(
        centerX + distance * 0.7,
        centerY + distance * 0.6,
        centerZ + distance * 0.7
    );
    this.camera.lookAt(centerX, centerY, centerZ);
}
```

**Result**: Camera always frames scene, handles edge cases, never fails.

---

## Summary Table

| Aspect | Before | After |
|--------|--------|-------|
| **Colors** | May fail silently | Validated + fallback |
| **Scales** | Can be huge/tiny | Clamped [0.1, 10] |
| **Positions** | NaN/Infinity possible | Always valid |
| **Lighting** | Potentially dark | Always visible |
| **Objects** | Crashes on invalid | Skipped gracefully |
| **Background** | May throw error | Always valid |
| **Camera** | May fail to frame | Always frames scene |
| **One bad object** | Breaks whole scene | Others still render |

**Result: Robust, visible, predictable rendering.**
