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

        const prompt = `You are a 3D scene creator that can create both static and animated scenes. The user describes a scene, and you respond with a JSON object with instructions to recreate it using 3D primitives and animations.

AVAILABLE SHAPES:
- Basic: sphere, cube, cylinder, cone, pyramid
- Complex: torus, ring, dodecahedron, icosahedron, octahedron, tetrahedron, vase, capsule, wedge
- 2D/Lines: plane, line, circle, verticalLine, horizontalLine, disk, star
- Utilities: grid, axes, tube, lightSphere

ANIMATION OPTIONS:
Each object can have animation properties:
- "rotation": { "x": speed, "y": speed, "z": speed } - rotates object on axes (speed in radians/frame, typical: 0.002-0.01)
- "orbit": { "radius": distance, "speed": speed, "axis": "y" } - orbits around center point (speed typical: 0.001-0.005)
- "scale": { "speed": speed, "min": minimum, "max": maximum } - pulsing/scaling animation

RESPONSE FORMAT:
{
  "objects": [
    {
      "type": "sphere",
      "name": "object name",
      "params": { "radius": 2, "color": "0x808080", "x": 0, "y": 0, "z": 0 },
      "animation": { "rotation": { "x": 0, "y": 0.002, "z": 0 } }
    },
    {
      "type": "circle",
      "name": "orbit",
      "params": { "radius": 10, "color": "0x666666", "x": 0, "y": 0, "z": 0 }
    }
  ],
  "background": "0x1a1a1a",
  "scene_description": "Description"
}

IMPORTANT:
- Use ONLY grayscale (0x000000 to 0xffffff)
- Make objects LARGE (radius 2-20)
- Use circles for orbits, not lines
- Add orbit animations to make planets/objects move around circles
- Include rotation animations for spinning objects
- For planets: create sphere + circle orbit + both animations

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
                        model: 'gpt-3.5-turbo',
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
                throw new Error(`API error: ${error.error || 'Unknown error'}`);
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

        const validTypes = ['sphere', 'cube', 'cylinder', 'cone', 'torus', 'plane', 'line', 'pyramid', 'tetrahedron', 'octahedron', 'lightSphere', 'ring', 'dodecahedron', 'icosahedron', 'vase', 'capsule', 'disk', 'prism', 'wedge', 'star', 'circle', 'verticalLine', 'horizontalLine', 'grid', 'axes', 'tube'];

        for (const obj of sceneData.objects) {
            if (!obj.type || !validTypes.includes(obj.type)) {
                throw new Error(`Invalid object type: ${obj.type}. Must be one of: ${validTypes.join(', ')}`);
            }
            if (!obj.params) {
                throw new Error('Each object must have params');
            }
        }

        return true;
    }
}
