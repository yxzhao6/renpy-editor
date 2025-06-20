# Markdown Editor

A beautiful, modern web-based markdown editor with real-time preview and powerful features.

## Features

- **Real-time Preview** - See your markdown rendered instantly as you type
- **Modern UI** - Clean, responsive design that works on all devices
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

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save file
- `Ctrl/Cmd + O` - Open file
- `Ctrl/Cmd + B` - Bold text
- `Ctrl/Cmd + I` - Italic text
- `Tab` - Indent (4 spaces)

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

## Customization

You can easily customize the editor by modifying:

- `styles.css` - Change colors, fonts, and layout
- `script.js` - Add new features or modify behavior
- `index.html` - Adjust the interface structure

## License

This project is open source and available under the MIT License.

---

**Happy writing!** ✍️
