/**
 * SceneGenerator.js - Handles communication with OpenAI
 * Sends user descriptions to OpenAI and gets back object creation instructions
 */

class SceneGenerator {
    constructor(apiKey = null) {
        // Priority: constructor param > config file > localStorage
        this.apiKey = apiKey || 
                      (typeof CONFIG !== 'undefined' && CONFIG.OPENAI_API_KEY) || 
                      localStorage.getItem('openai_api_key');
    }

    /**
     * Set the OpenAI API key
     * @param {string} key - OpenAI API key
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
    }

    /**
     * Check if API key is set
     * @returns {boolean} True if API key exists
     */
    hasApiKey() {
        return !!(this.apiKey && this.apiKey.trim());
    }

    /**
     * Send scene description to OpenAI and get back JSON with object instructions
     * @param {string} sceneDescription - User's description of the scene
     * @returns {Promise<Object>} Object containing instructions for creating 3D objects
     */
    async generateSceneFromDescription(sceneDescription) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not found. Please check your .env file.');
        }

        if (!sceneDescription.trim()) {
            throw new Error('Please provide a scene description.');
        }

        const prompt = `You are a 3D scene creator using semantic object relationships. Create diverse, interesting 3D scenes with varied objects and environments. RESPOND WITH VALID JSON ONLY.

ANATOMY HIERARCHY (VALID attachTo values for body parts):
- head: Top of the body
- torso: Main body/chest area
- legs: Lower body
- arms: (if needed for gloves/sleeves)
- scene: Scene-level objects (MUST use this for all standalone objects)

OBJECT ROLES:
- body: Primary body part (human, animal, etc.)
- clothing: Worn on body parts (dresses, shirts, pants)
- accessory: Worn on head/body (hats, glasses, jewelry)
- environment: Scene elements (buildings, trees, furniture)
- prop: Held objects or interactive items
- decoration: Non-functional scene elements

ATTACHMENT RULES (MANDATORY):
- Hair, eyes, hats, glasses → attachTo: "head"
- Shirts, jackets, vests → attachTo: "torso", coverage: "upper-body"
- Pants, skirts, dresses → attachTo: "torso", coverage: "lower-body" or "full-body"
- Shoes, socks → attachTo: "legs"
- Belts, necklaces → attachTo: "torso"
- Gloves → attachTo: "arms"
- ALL OTHER OBJECTS (sphere, cube, cylinder, cone, pyramid, torus, ring, plane, vase, capsule, disk, prism, wedge, tube, circle, verticalLine, horizontalLine, star, lightSphere, grid, axes, line, human, house, tree, cloud, mountain, eye, animal) → attachTo: "scene"

AVAILABLE OBJECT TYPES (COMPLETE LIST):
Shapes: sphere, cube, cylinder, cone, pyramid, tetrahedron, octahedron, dodecahedron, icosahedron, torus, ring, plane, vase, capsule, disk, prism, wedge, star, circle, verticalLine, horizontalLine, grid, axes, tube, lightSphere, line
Complex Objects: human, house, tree, cloud, mountain, eye, hair, animal

CRITICAL RULES:
1. ONLY use attachTo values from: "head", "torso", "legs", "arms", or "scene"
2. NEVER invent attachTo values like "neck", "saturn", "face", "chest", etc.
3. For any standalone object → ALWAYS use attachTo: "scene"
4. NEVER output absolute x,y,z for objects with attachTo != "scene"
5. Only scene-level objects get absolute positions
6. Use scale_multiplier (0.5-2.0) for relative sizing
7. Include optional offset { "x", "y", "z" } for attachment points
8. Clothing must specify coverage field
9. Mix different types of objects in scenes - don't just create people/humans
10. RESPOND WITH ONLY VALID JSON - no explanations
11. Neveer use the color of the background as an object color
12. Use diverse colors and avoid repetition

EXAMPLE RESPONSE FOR "A girl in a blue dress with trees":
{
  "objects": [
    {
      "type": "human",
      "name": "girl",
      "role": "body",
      "attachTo": "scene",
      "params": { "scale": 2, "color": "0x999999", "x": -3, "y": 0, "z": 0 }
    },
    {
      "type": "hair",
      "name": "brown hair",
      "role": "accessory",
      "attachTo": "head",
      "coverage": "full-head",
      "params": { "scale": 1, "color": "0x4a3728" },
      "scale_multiplier": 1.0
    },
    {
      "type": "cube",
      "name": "blue dress",
      "role": "clothing",
      "attachTo": "torso",
      "coverage": "full-body",
      "params": { "width": 1, "height": 1.5, "depth": 0.8, "color": "0x0066ff" },
      "scale_multiplier": 1.0,
      "offset": { "x": 0, "y": -0.5, "z": 0.1 }
    },
    {
      "type": "tree",
      "name": "tree left",
      "role": "environment",
      "attachTo": "scene",
      "params": { "scale": 1.5, "color": "0x228B22", "x": -6, "y": 0, "z": 2 }
    },
    {
      "type": "tree",
      "name": "tree right",
      "role": "environment",
      "attachTo": "scene",
      "params": { "scale": 1.5, "color": "0x228B22", "x": 3, "y": 0, "z": 2 }
    }
  ],
  "background": "0x1a1a1a"
}

User description: "${sceneDescription}"`;


        try {
            // Call the local backend proxy instead of OpenAI directly
            const response = await fetch('/api/generate-scene', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a JSON generator for 3D scenes. Always respond with only valid JSON.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 2000
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                const errorMsg = error.details?.error?.message || error.error || 'Unknown error';
                console.error('Full error details:', error);
                throw new Error(`API error: ${errorMsg}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();

            // Parse the JSON response
            let sceneData;
            try {
                sceneData = JSON.parse(content);
            } catch (parseError) {
                // Try to extract JSON from response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    sceneData = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Could not parse OpenAI response as JSON');
                }
            }

            // Print the parsed JSON to console for debugging
            console.log('=== OpenAI Generated Scene Data ===');
            console.log(JSON.stringify(sceneData, null, 2));
            console.log('===================================');

            // Ensure objects array exists and is valid
            if (!sceneData.objects || !Array.isArray(sceneData.objects)) {
                sceneData.objects = [];
            }

            // Validate each object has required fields
            sceneData.objects = sceneData.objects.filter(obj => {
                if (!obj || typeof obj !== 'object') return false;
                // Set defaults for missing required fields
                if (!obj.type) obj.type = 'cube';
                if (!obj.name) obj.name = obj.type;
                if (!obj.params) obj.params = {};
                if (!obj.role) obj.role = 'environment';
                if (!obj.attachTo) obj.attachTo = 'scene';
                // Ensure params has required properties
                if (obj.params.color === undefined) obj.params.color = 0xcccccc;
                if (obj.params.scale === undefined) obj.params.scale = 1;
                return true;
            });

            // Ensure background is defined
            if (!sceneData.background) {
                sceneData.background = '0x383838';
            }

            return sceneData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate the scene data
     * @param {Object} sceneData - Scene data from OpenAI
     * @returns {boolean} True if valid
     */
    validateSceneData(sceneData) {
        if (!sceneData || typeof sceneData !== 'object') {
            throw new Error('Invalid scene data format');
        }

        if (!Array.isArray(sceneData.objects)) {
            throw new Error('Scene data must contain an objects array');
        }

        const validTypes = ['sphere', 'cube', 'cylinder', 'cone', 'torus', 'plane', 'line', 'pyramid', 'tetrahedron', 'octahedron', 'lightSphere', 'ring', 'dodecahedron', 'icosahedron', 'vase', 'capsule', 'disk', 'prism', 'wedge', 'star', 'circle', 'verticalLine', 'horizontalLine', 'grid', 'axes', 'tube', 'human', 'house', 'tree', 'cloud', 'mountain', 'eye', 'hair', 'animal'];

        for (const obj of sceneData.objects) {
            if (!obj.type || !validTypes.includes(obj.type)) {
                throw new Error(`Invalid object type: ${obj.type}`);
            }
            if (!obj.params) {
                throw new Error('Each object must have params');
            }
            // New semantic fields are optional but validated if present
            if (obj.attachTo && !['scene', 'head', 'torso', 'legs', 'arms'].includes(obj.attachTo)) {
                console.warn(`Unknown attachTo: ${obj.attachTo}, treating as scene-level`);
            }
        }

        return true;
    }
}
