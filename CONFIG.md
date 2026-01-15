# Configuration Setup

## Adding Your API Key

You have two options to add your OpenAI API key:

### Option 1: Use config.js (Recommended - Persistent)

1. Open `config.js` in your editor
2. Find this line:
   ```javascript
   OPENAI_API_KEY: '', // Add your API key here
   ```
3. Add your API key between the quotes:
   ```javascript
   OPENAI_API_KEY: 'sk-...your-key-here...', // Add your API key here
   ```
4. Save the file
5. Reload the app - your API key will be automatically loaded!

### Option 2: Paste in Prompt (One-time)

1. When you first open the app, you'll be prompted for an API key
2. Paste your OpenAI API key
3. It will be saved to browser storage and used automatically (until browser cache is cleared)

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in with your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the key immediately (you won't be able to see it again!)
5. Paste it in the config.js file or the prompt

## Security Notes

⚠️ **Important:**
- **Never commit config.js with your API key to GitHub**
- The key in config.js is stored locally in your browser
- Add `config.js` to your `.gitignore` if using version control
- Keep your API key secret - don't share it!

## Environment Variables for Deployment

If you're deploying this app:

1. Use environment variables on your server
2. For Vercel/Netlify, set them in project settings
3. Never hardcode API keys in production code
4. Use a backend proxy to hide the API key

Example for backend proxying:
```javascript
// Instead of calling OpenAI directly from frontend
// Call your backend endpoint
const response = await fetch('/api/generate-scene', {
    method: 'POST',
    body: JSON.stringify({ description: userInput })
});
```

## Troubleshooting

### API Key not loading?
- Check that config.js exists in the root folder
- Make sure you have a valid OpenAI API key
- Clear browser cache and reload
- Open browser console (F12) for error messages

### "Invalid API key" error?
- Verify the key is correct in config.js
- Check that there are no extra spaces
- Make sure your OpenAI account has credits remaining
