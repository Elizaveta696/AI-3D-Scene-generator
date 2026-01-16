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

        const prompt = `You are a 3D scene creator using semantic object relationships. RESPOND WITH VALID JSON ONLY.

ANATOMY HIERARCHY:
- head: Top of the body
- torso: Main body/chest area
- legs: Lower body

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
- Standalone objects (buildings, trees, props) → attachTo: "scene"

EXAMPLE RESPONSE FOR "A girl in a blue dress":
{
  "objects": [
    {
      "type": "human",
      "name": "girl",
      "role": "body",
      "attachTo": "scene",
      "params": { "scale": 2, "color": "0x999999", "x": 0, "y": 0, "z": 0 }
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
    }
  ],
  "background": "0x1a1a1a"
}

CRITICAL RULES:
1. NEVER output absolute x,y,z for objects with attachTo != "scene"
2. Only output scene-level objects with absolute positions
3. Use scale_multiplier (0.5-2.0) for relative sizing
4. Include optional offset { "x", "y", "z" } for attachment points
5. Clothing must specify coverage field
6. NO position/size assumptions - let renderer handle placement
7. RESPOND WITH ONLY VALID JSON - no explanations

Available shapes: human, house, tree, cloud, mountain, eye, hair, animal, sphere, cube, cylinder, cone, pyramid, torus, ring, plane, vase, capsule, disk, prism, wedge, tube, circle, verticalLine, horizontalLine, star, lightSphere, grid, axes, line

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
