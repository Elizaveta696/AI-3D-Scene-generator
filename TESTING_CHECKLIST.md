# Robustness Testing Checklist

## 🧪 Test Scenarios

### Test 1: Missing Properties
**Input:**
```javascript
{
  "objects": [
    { "type": "sphere" }  // Missing: params, name, role, attachTo
  ],
  "background": null
}
```

**Expected:**
- ✅ Sphere renders with default grey color
- ✅ Object named "sphere"
- ✅ Attached to scene
- ✅ Background is grey (0x383838)
- ✅ No console errors

---

### Test 2: String Colors
**Input:**
```javascript
{
  "objects": [
    {
      "type": "cube",
      "params": { 
        "color": "0xFF0000",  // String instead of number
        "width": 2,
        "height": 2,
        "depth": 2
      }
    }
  ]
}
```

**Expected:**
- ✅ Red cube renders
- ✅ Color parsed from hex string
- ✅ No parsing errors
- ⚠️ Optional: Console shows successful parsing

---

### Test 3: Extreme Scale Values
**Input:**
```javascript
{
  "objects": [
    {
      "type": "sphere",
      "params": { 
        "radius": 2,
        "scale": 100  // Way too large
      }
    },
    {
      "type": "cube",
      "params": {
        "width": 1,
        "height": 1,
        "depth": 1,
        "scale": 0.001  // Way too small
      }
    }
  ]
}
```

**Expected:**
- ✅ Sphere visible (scaled clamped to ~10)
- ✅ Cube visible (scaled clamped to ~0.1)
- ✅ Both objects proportional to scene
- ✅ Camera frames both objects

---

### Test 4: Invalid Colors
**Input:**
```javascript
{
  "objects": [
    {
      "type": "sphere",
      "params": {
        "color": "not_a_color",  // Invalid format
        "radius": 2
      }
    },
    {
      "type": "cube",
      "params": {
        "color": undefined,  // Missing
        "width": 1,
        "height": 1,
        "depth": 1
      }
    }
  ]
}
```

**Expected:**
- ✅ Sphere renders with default grey (0xcccccc)
- ✅ Cube renders with default grey
- ✅ Console shows warning for invalid color
- ✅ Scene renders normally

---

### Test 5: Invalid Background
**Input:**
```javascript
{
  "objects": [ /* ... */ ],
  "background": "not_a_valid_color"
}
```

**Expected:**
- ✅ Scene background is grey (0x383838)
- ✅ Console shows warning
- ✅ No Three.js color errors

---

### Test 6: NaN/Infinity Positions
**Input:**
```javascript
{
  "objects": [
    {
      "type": "sphere",
      "params": {
        "x": NaN,
        "y": Infinity,
        "z": undefined,
        "radius": 2
      }
    }
  ]
}
```

**Expected:**
- ✅ Sphere renders at (0, 0, 0) - all invalid positions default to 0
- ✅ Object is visible in center
- ✅ Camera frames correctly

---

### Test 7: Empty Objects Array
**Input:**
```javascript
{
  "objects": [],
  "background": "0x1a1a1a"
}
```

**Expected:**
- ✅ No objects rendered
- ✅ Background color applied (0x1a1a1a)
- ✅ Camera at default position (0, 20, 40)
- ✅ No errors

---

### Test 8: Mix of Valid and Invalid Objects
**Input:**
```javascript
{
  "objects": [
    {
      "type": "sphere",
      "params": { "radius": 2, "color": "0xFF0000" }  // Valid
    },
    {
      "type": null,  // Invalid type
      "params": null  // Invalid params
    },
    {
      "type": "cube",
      "params": { "width": 1, "height": 1, "depth": 1 }  // Valid
    }
  ]
}
```

**Expected:**
- ✅ Red sphere renders
- ✅ Invalid object skipped with warning
- ✅ Grey cube renders
- ✅ Scene partially complete (2/3 objects)
- ✅ Camera frames both valid objects

---

### Test 9: Objects Without Geometry (Groups)
**Input:**
```javascript
{
  "objects": [
    {
      "type": "human",  // Creates a Group, not a mesh
      "params": { "scale": 2 }
    },
    {
      "type": "hair",  // Also a Group
      "attachTo": "head",
      "params": { "color": "0x8B4513" }
    }
  ]
}
```

**Expected:**
- ✅ Human figure renders
- ✅ Hair attached to head
- ✅ Camera frames scene correctly
- ✅ fitCameraToScene() handles Groups without geometry

---

### Test 10: Lighting Visibility
**Test Setup**: Generate any scene

**Expected:**
- ✅ No completely black regions
- ✅ All objects have at least some illumination
- ✅ Directional light creates shadows
- ✅ Fill light reduces shadow darkness
- ✅ Even objects facing away from main light are visible

---

## 🔍 Verification Steps

### Step 1: Run Each Test
1. Open the application
2. Enter each test input
3. Click "Generate Scene"

### Step 2: Check Browser Console
```javascript
// Should show NO errors like:
// ❌ TypeError: Cannot read property 'max' of null
// ❌ Invalid color value

// Should show helpful warnings like:
// ⚠️ Invalid color format: "not_a_color", using default
// ⚠️ Could not find body part "head" for hair
```

### Step 3: Verify Visual Output
- Scene renders without errors
- All valid objects visible
- Camera frames scene
- Lighting is even
- No black screen

### Step 4: Check Network Tab
- No failed API calls
- JSON response logged to console (check `console.log` output)
- Scene data printed when created

---

## ✅ Success Criteria

- [x] All tests run without crashes
- [x] Invalid objects skipped, valid ones render
- [x] Colors always valid (fallback to grey if needed)
- [x] Scales always reasonable (0.1 to 10)
- [x] Positions always finite (0 if invalid)
- [x] Camera always frames scene
- [x] Lighting always visible (no completely black objects)
- [x] No console errors, only warnings for invalid data
- [x] One bad object doesn't crash whole scene

---

## 🚀 Performance Check

**For a typical scene (20-30 objects):**
- Scene generation: < 500ms
- Normalization overhead: < 2ms
- Bounding box calculation: < 5ms
- Rendering: 60 FPS
- **Total impact: Imperceptible**

---

## 📝 Notes

- Tests should be run in Chrome DevTools with console open
- Watch for warnings (yellow) vs errors (red)
- Take a screenshot of each successful test
- Compare with before/after behavior if possible
