# Markdown Editor

A beautiful, modern web-based markdown editor with real-time preview and powerful features.

## Features

- **Real-time Preview** - See your markdown rendered instantly as you type
- **Modern UI** - Clean, responsive design that works on all devices
- **Slash Commands** - Type `/` to access quick insertion menu
- **Toolbar Shortcuts** - Quick formatting buttons for common markdown syntax
- **Keyboard Shortcuts** - Power user shortcuts for faster editing
- **Auto-save** - Your work is automatically saved to browser storage
- **File Operations** - Save and load markdown files
- **Export Options** - Export your markdown as HTML
- **Fullscreen Mode** - Distraction-free writing experience
- **Word Count** - Track your document length
- **Sample Content** - Load example markdown to get started

## Getting Started

1. Open `index.html` in your web browser
2. Start typing in the editor pane on the left
3. See your markdown rendered in real-time on the right
4. Use the toolbar buttons or keyboard shortcuts for formatting
5. Try typing `/` to access the slash command menu

## Slash Commands

Type `/` in the editor to open a dropdown menu with quick insertion options:

- `/text` - Generate AI-powered text using Gemini API
- `/image` - Generate AI-powered images using Gemini API

### Using Slash Commands

1. Type `/` at the beginning of a line
2. Start typing to filter commands (e.g., `/im` shows image)
3. Use arrow keys to navigate
4. Press Enter or click to insert
5. Press Escape to cancel

### AI Text Generation (`/text`)

When you select `/text`, a popup will appear where you can:

1. Enter a prompt describing what you want to generate
2. Press Enter or click "Generate" to send to Gemini API
3. The AI-generated text will be inserted into your document
4. The popup includes loading states and error handling

### AI Image Generation (`/image`)

When you select `/image`, a popup will appear where you can:

1. Enter a prompt describing the image you want to generate
2. Press Enter or click "Generate Image" to send to Gemini API
3. The AI-generated image will be inserted as markdown with a data URL
4. The image appears directly in your document and preview

**Note:** Both AI features use the [Google Gemini API](https://ai.google.dev/gemini-api/docs/image-generation#javascript) to generate content based on your prompts. Image generation uses the `gemini-2.0-flash-preview-image-generation` model.

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save file
- `Ctrl/Cmd + O` - Open file
- `Ctrl/Cmd + B` - Bold text
- `Ctrl/Cmd + I` - Italic text
- `Tab` - Indent (4 spaces)
- `/` - Open slash command menu
- `Arrow Keys` - Navigate slash commands
- `Enter` - Execute slash command
- `Escape` - Close slash command menu

## Toolbar Features

### Formatting

- **Bold** - `**text**`
- **Italic** - `*text*`
- **Heading** - `### Heading`
- **List** - `- Item`
- **Link** - `[text](url)`
- **Image** - `![alt](url)`
- **Code Block** - `\`\`\`code\`\`\``
- **Inline Code** - `` `code` ``
- **Quote** - `> text`

### File Operations

- **Save** - Download as .md file
- **Load** - Open markdown file
- **Clear** - Clear editor content
- **Export HTML** - Export as standalone HTML file
- **Sample Content** - Load example markdown

## Supported Markdown Syntax

- **Headers** - `# H1`, `## H2`, `### H3`, etc.
- **Emphasis** - `**bold**`, `*italic*`, `~~strikethrough~~`
- **Lists** - `- unordered`, `1. ordered`
- **Links** - `[text](url)`
- **Images** - `![alt](url)`
- **Code** - `` `inline` `` and `\`\`\`blocks\`\`\``
- **Blockquotes** - `> text`
- **Tables** - Standard markdown table syntax
- **Horizontal Rules** - `---`

## Browser Compatibility

Works in all modern browsers:

- Chrome/Chromium
- Firefox
- Safari
- Edge

## Local Storage

The editor automatically saves your content to browser localStorage every 30 seconds. Content is restored when you reload the page (if less than 24 hours old).

## File Structure

```
markdown-editor/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Dependencies

The editor uses CDN-hosted libraries:

- **Marked.js** - Markdown parsing
- **DOMPurify** - HTML sanitization
- **Font Awesome** - Icons
- **Google Gemini API** - AI text generation

## Customization

You can easily customize the editor by modifying:

- `styles.css` - Change colors, fonts, and layout
- `script.js` - Add new features or modify behavior
- `index.html` - Adjust the interface structure

## License

This project is open source and available under the MIT License.

---

**Happy writing!** ✍️
