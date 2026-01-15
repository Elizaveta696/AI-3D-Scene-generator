# AI 3D Scene Generator

An innovative web application that uses AI to transform text descriptions into interactive 3D scenes!

## 🎨 Features

- **Natural Language Input**: Describe your scene in plain English (e.g., "A red planet with 2 moons and a sun")
- **AI-Powered Generation**: OpenAI GPT analyzes your description and determines what 3D objects to create
- **Interactive 3D Viewer**: Explore your generated scenes with Three.js
- **Multiple Object Types**: Spheres, cubes, cylinders, cones, pyramids, toruses, rings, and more
- **Smart Positioning**: AI automatically places objects in 3D space appropriately
- **Color Management**: Realistic colors for all objects
- **Scene Export**: Save your scenes as JSON files
- **Lighting**: Dynamic lighting with shadows

## 📋 Project Structure

```
ai_3d_game/
├── index.html          # Main HTML interface
├── Trees.js            # 3D object primitives library
├── SceneGenerator.js   # OpenAI API integration
├── main.js             # Application logic & Three.js scene
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

1. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (with WebGL support)

### Installation

1. Clone or download this project
2. Open `index.html` in your web browser
3. When prompted, enter your OpenAI API key
4. Start creating 3D scenes!

## 💡 How It Works

1. **User Input**: You describe a 3D scene in the input area
2. **AI Processing**: The description is sent to OpenAI GPT
3. **JSON Response**: OpenAI returns JSON with object creation instructions
4. **3D Creation**: Objects are created using Three.js based on the instructions
5. **Visualization**: The scene is rendered in the 3D viewer

## 📝 Example Prompts

- "A red planet with 2 white moons and a yellow sun in the background"
- "A galaxy with several planets orbiting a central star"
- "A mountain landscape with green plains and blue water"
- "A futuristic city with tall buildings and flying vehicles"
- "A space station with various modules and solar panels"

## 🎮 Controls

### UI Controls
- **Generate Scene**: Click the button or press Ctrl+Enter to generate from your description
- **Reset Scene**: Clear the current scene and start fresh
- **Export 3D**: Download the scene data as a JSON file

### 3D Scene
- Mouse movement to rotate the camera (typically handled by Three.js defaults)
- The scene automatically adjusts camera to fit all objects

## 🏗️ Available 3D Objects

The `Trees.js` file contains factory functions for creating:

| Object | Description |
|--------|-------------|
| `sphere` | Standard sphere with adjustable radius |
| `cube` | Box with width, height, depth |
| `cylinder` | Cylindrical shape with top/bottom radius |
| `cone` | Conical shape |
| `pyramid` | 4-sided pyramid |
| `tetrahedron` | 4-sided polyhedron |
| `octahedron` | 8-sided polyhedron |
| `torus` | Donut shape |
| `ring` | Flat ring (like Saturn's rings) |
| `plane` | 2D plane surface |
| `line` | Simple line between two points |
| `lightSphere` | Emissive sphere that illuminates the scene |

## 🎨 Customization

### Modifying Object Types

To add new object types:

1. Add a new function to `Trees.js`:
```javascript
Trees.customShape: function(param1, param2, color, x, y, z) {
    const geometry = new THREE.CustomGeometry(param1, param2);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
}
```

2. Add the type to the valid types in `SceneGenerator.js`

3. Add handling in `main.js` in the `createObjectsFromData()` method

### Adjusting AI Behavior

To change how the AI generates scenes, modify the `prompt` variable in `SceneGenerator.js`. You can:
- Change the available objects
- Adjust default values
- Add specific instructions for object placement
- Include additional parameters

## 🔐 Security Notes

- Your OpenAI API key is stored in browser's localStorage
- Keys are only sent directly to OpenAI
- No keys are stored on any server
- Delete your key from browser settings if you reset your browser

## ⚠️ Important Settings

### API Key Management
```javascript
// View current key
const generator = new SceneGenerator();

// Set new key
generator.setApiKey('your-key-here');

// Clear key (not recommended, just remove from localStorage)
localStorage.removeItem('openai_api_key');
```

## 🐛 Troubleshooting

### "Invalid JSON response from OpenAI"
- The AI sometimes includes markdown formatting. The code auto-detects and parses JSON.
- Try a simpler description if this persists.

### Objects not appearing
- Check the browser console for errors (F12)
- Ensure your OpenAI API key has remaining credits
- Try resetting the scene

### Poor object positioning
- The AI learns from your descriptions. Be specific about positions:
  - "planet in the center"
  - "moon to the right"
  - "sun far behind"

## 📦 Dependencies

- **Three.js**: 3D graphics library (loaded from CDN)
- **OpenAI API**: For scene generation (requires API key)

## 📄 License

This project is open source. Feel free to modify and distribute!

## 🚀 Future Enhancements

Potential improvements:
- Material customization (metalness, roughness)
- Animation keyframes
- Physics simulation
- Texture support
- Export to GLTF/3D model formats
- Voice input for scene descriptions
- Scene library and presets
- Undo/Redo functionality
- Object property editor

## 💬 Contributing

Have ideas to improve this project? Feel free to:
- Report bugs
- Suggest new object types
- Propose UI improvements
- Share interesting scene prompts

## 📧 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your OpenAI API key is valid
3. Try simplifying your scene description
4. Ensure WebGL is enabled in your browser

---

**Created with Three.js and OpenAI GPT**

Enjoy creating amazing 3D scenes with AI! 🎨✨
