// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    loadFromLocalStorage();
    setupAutoSave();
    setupSlashCommands();
});

// Global variables
let editor;
let preview;
let autoSaveInterval;
let isFullscreen = false;
let slashCommandDropdown = null;
let currentSlashCommand = '';

// Initialize the editor
function initializeEditor() {
    editor = document.getElementById('markdown-editor');
    preview = document.getElementById('markdown-preview');
    
    // Set up real-time preview
    editor.addEventListener('input', updatePreview);
    
    // Set up keyboard shortcuts
    editor.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Initial preview update
    updatePreview();
    
    // Focus the editor
    editor.focus();
}

// Setup slash commands
function setupSlashCommands() {
    editor.addEventListener('input', handleSlashCommand);
    editor.addEventListener('keydown', handleSlashCommandKeydown);
    
    // Create dropdown element
    createSlashCommandDropdown();
}

// Create slash command dropdown
function createSlashCommandDropdown() {
    slashCommandDropdown = document.createElement('div');
    slashCommandDropdown.className = 'slash-command-dropdown';
    slashCommandDropdown.style.display = 'none';
    document.body.appendChild(slashCommandDropdown);
}

// Handle slash command input
function handleSlashCommand(e) {
    const cursorPosition = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];
    
    // Check if current line starts with /
    if (currentLine.startsWith('/')) {
        const command = currentLine.substring(1).toLowerCase();
        currentSlashCommand = command;
        showSlashCommandDropdown(command);
    } else {
        hideSlashCommandDropdown();
    }
}

// Handle slash command keyboard navigation
function handleSlashCommandKeydown(e) {
    if (slashCommandDropdown.style.display === 'none') return;
    
    const items = slashCommandDropdown.querySelectorAll('.slash-command-item');
    const activeItem = slashCommandDropdown.querySelector('.slash-command-item.active');
    let currentIndex = -1;
    
    if (activeItem) {
        currentIndex = Array.from(items).indexOf(activeItem);
    }
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                if (activeItem) activeItem.classList.remove('active');
                items[currentIndex + 1].classList.add('active');
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
                if (activeItem) activeItem.classList.remove('active');
                items[currentIndex - 1].classList.add('active');
            }
            break;
        case 'Enter':
            e.preventDefault();
            if (activeItem) {
                executeSlashCommand(activeItem.dataset.command);
            }
            break;
        case 'Escape':
            e.preventDefault();
            hideSlashCommandDropdown();
            break;
    }
}

// Show slash command dropdown
function showSlashCommandDropdown(command) {
    const commands = [
        { name: 'text', description: 'Insert plain text', icon: 'fas fa-font' },
        { name: 'image', description: 'Insert image', icon: 'fas fa-image' }
    ];
    
    const filteredCommands = commands.filter(cmd => 
        cmd.name.includes(command) || cmd.description.toLowerCase().includes(command)
    );
    
    if (filteredCommands.length === 0) {
        hideSlashCommandDropdown();
        return;
    }
    
    slashCommandDropdown.innerHTML = filteredCommands.map((cmd, index) => `
        <div class="slash-command-item ${index === 0 ? 'active' : ''}" data-command="${cmd.name}">
            <i class="${cmd.icon}"></i>
            <div class="slash-command-content">
                <div class="slash-command-name">${cmd.name}</div>
                <div class="slash-command-description">${cmd.description}</div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    slashCommandDropdown.querySelectorAll('.slash-command-item').forEach(item => {
        item.addEventListener('click', () => {
            executeSlashCommand(item.dataset.command);
        });
    });
    
    // Position dropdown
    positionSlashCommandDropdown();
    slashCommandDropdown.style.display = 'block';
}

// Position slash command dropdown
function positionSlashCommandDropdown() {
    const cursorPosition = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split('\n');
    const currentLineNumber = lines.length - 1;
    const currentLineText = lines[currentLineNumber];
    
    // Create a temporary element to measure text dimensions
    const temp = document.createElement('span');
    temp.style.font = window.getComputedStyle(editor).font;
    temp.style.visibility = 'hidden';
    temp.style.position = 'absolute';
    temp.style.whiteSpace = 'pre';
    temp.textContent = currentLineText;
    document.body.appendChild(temp);
    
    const textWidth = temp.offsetWidth;
    const lineHeight = parseInt(window.getComputedStyle(editor).lineHeight);
    document.body.removeChild(temp);
    
    // Get editor position
    const editorRect = editor.getBoundingClientRect();
    const editorPadding = 24; // 1.5rem padding
    
    // Calculate position
    const left = editorRect.left + editorPadding + textWidth;
    const top = editorRect.top + editorPadding + (currentLineNumber * lineHeight) + lineHeight;
    
    slashCommandDropdown.style.left = `${left}px`;
    slashCommandDropdown.style.top = `${top}px`;
}

// Hide slash command dropdown
function hideSlashCommandDropdown() {
    if (slashCommandDropdown) {
        slashCommandDropdown.style.display = 'none';
    }
}

// Execute slash command
function executeSlashCommand(command) {
    const cursorPosition = editor.selectionStart;
    const textBeforeCursor = editor.value.substring(0, cursorPosition);
    const textAfterCursor = editor.value.substring(cursorPosition);
    
    // Find the start of the current line
    const lines = textBeforeCursor.split('\n');
    const currentLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
    
    // Remove the slash command
    const newTextBefore = textBeforeCursor.substring(0, currentLineStart);
    
    // Insert the appropriate content based on command
    let insertText = '';
    
    switch (command) {
        case 'text':
            // Show LLM prompt input instead of inserting text directly
            showLLMPromptInput(newTextBefore, textAfterCursor);
            return; // Don't proceed with normal insertion
        case 'image':
            // Show image generation prompt input
            showImagePromptInput(newTextBefore, textAfterCursor);
            return; // Don't proceed with normal insertion
        default:
            insertText = '';
    }
    
    // Update editor content
    editor.value = newTextBefore + insertText + '\n' + textAfterCursor;
    
    // Set cursor position after inserted content
    const newCursorPosition = currentLineStart + insertText.length + 1;
    editor.selectionStart = newCursorPosition;
    editor.selectionEnd = newCursorPosition;
    
    // Hide dropdown and update preview
    hideSlashCommandDropdown();
    editor.focus();
    updatePreview();
    
    // Update status
    updateStatus(`Inserted ${command}`);
}

// Show LLM prompt input popup
function showLLMPromptInput(textBefore, textAfter) {
    // Hide slash command dropdown
    hideSlashCommandDropdown();
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'llm-prompt-overlay';
    overlay.innerHTML = `
        <div class="llm-prompt-popup">
            <div class="llm-prompt-header">
                <h3><i class="fas fa-robot"></i> AI Text Generation</h3>
                <button class="llm-prompt-close" onclick="closeLLMPrompt()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="llm-prompt-content">
                <label for="llm-prompt-input">Enter your prompt:</label>
                <input type="text" id="llm-prompt-input" placeholder="Describe what you want to generate..." />
                <div class="llm-prompt-buttons">
                    <button class="llm-prompt-generate" onclick="generateLLMText()">
                        <i class="fas fa-magic"></i> Generate
                    </button>
                    <button class="llm-prompt-cancel" onclick="closeLLMPrompt()">
                        Cancel
                    </button>
                </div>
                <div class="llm-prompt-status" id="llm-prompt-status"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Store context for later use
    overlay.dataset.textBefore = textBefore;
    overlay.dataset.textAfter = textAfter;
    
    // Focus input and handle Enter key
    const input = document.getElementById('llm-prompt-input');
    input.focus();
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            generateLLMText();
        } else if (e.key === 'Escape') {
            closeLLMPrompt();
        }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLLMPrompt();
        }
    });
}

// Close LLM prompt popup
function closeLLMPrompt() {
    const overlay = document.querySelector('.llm-prompt-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
    editor.focus();
}

// Generate text using Gemini API
async function generateLLMText() {
    const input = document.getElementById('llm-prompt-input');
    const status = document.getElementById('llm-prompt-status');
    const generateBtn = document.querySelector('.llm-prompt-generate');
    const overlay = document.querySelector('.llm-prompt-overlay');
    
    const prompt = input.value.trim();
    if (!prompt) {
        status.innerHTML = '<span class="error">Please enter a prompt</span>';
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    status.innerHTML = '<span class="loading">Generating text with AI...</span>';
    
    try {
        // Call Gemini API with proper authentication
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAyvZHMQL723otF0nrBwGy6O4bQ5IiIelo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const generatedText = data.candidates[0].content.parts[0].text;
            
            // Insert generated text into editor
            const textBefore = overlay.dataset.textBefore;
            const textAfter = overlay.dataset.textAfter;
            
            editor.value = textBefore + generatedText + '\n' + textAfter;
            
            // Set cursor position after generated text
            const newCursorPosition = textBefore.length + generatedText.length + 1;
            editor.selectionStart = newCursorPosition;
            editor.selectionEnd = newCursorPosition;
            
            // Update preview and close popup
            updatePreview();
            closeLLMPrompt();
            updateStatus('AI text generated successfully!');
        } else {
            throw new Error('No content generated from API response');
        }
        
    } catch (error) {
        console.error('Error generating text:', error);
        status.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
    }
}

// Show image generation prompt input popup
function showImagePromptInput(textBefore, textAfter) {
    // Hide slash command dropdown
    hideSlashCommandDropdown();
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'llm-prompt-overlay';
    overlay.innerHTML = `
        <div class="llm-prompt-popup">
            <div class="llm-prompt-header">
                <h3><i class="fas fa-image"></i> AI Image Generation</h3>
                <button class="llm-prompt-close" onclick="closeLLMPrompt()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="llm-prompt-content">
                <label for="image-prompt-input">Describe the image you want to generate:</label>
                <input type="text" id="image-prompt-input" placeholder="A beautiful sunset over mountains..." />
                <div class="llm-prompt-buttons">
                    <button class="llm-prompt-generate" onclick="generateImage()">
                        <i class="fas fa-magic"></i> Generate Image
                    </button>
                    <button class="llm-prompt-cancel" onclick="closeLLMPrompt()">
                        Cancel
                    </button>
                </div>
                <div class="llm-prompt-status" id="image-prompt-status"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Store context for later use
    overlay.dataset.textBefore = textBefore;
    overlay.dataset.textAfter = textAfter;
    
    // Focus input and handle Enter key
    const input = document.getElementById('image-prompt-input');
    input.focus();
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            generateImage();
        } else if (e.key === 'Escape') {
            closeLLMPrompt();
        }
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLLMPrompt();
        }
    });
}

// Generate image using Gemini API
async function generateImage() {
    const input = document.getElementById('image-prompt-input');
    const status = document.getElementById('image-prompt-status');
    const generateBtn = document.querySelector('.llm-prompt-generate');
    const overlay = document.querySelector('.llm-prompt-overlay');
    
    const prompt = input.value.trim();
    if (!prompt) {
        status.innerHTML = '<span class="error">Please enter a prompt</span>';
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    status.innerHTML = '<span class="loading">Generating image with AI...</span>';
    
    try {
        // Call Gemini API for image generation
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=AIzaSyAyvZHMQL723otF0nrBwGy6O4bQ5IiIelo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"]
                }
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let imageData = null;
            let imageText = '';
            
            // Extract image data and text from response
            for (const part of data.candidates[0].content.parts) {
                if (part.text) {
                    imageText = part.text;
                } else if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
                    imageData = part.inlineData.data;
                }
            }
            
            if (imageData) {
                // Convert base64 to data URL
                const mimeType = data.candidates[0].content.parts.find(p => p.inlineData)?.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${imageData}`;
                
                // Insert image markdown into editor
                const textBefore = overlay.dataset.textBefore;
                const textAfter = overlay.dataset.textAfter;
                
                const imageMarkdown = `![${prompt}](${imageUrl})`;
                editor.value = textBefore + imageMarkdown + '\n' + textAfter;
                
                // Set cursor position after generated image
                const newCursorPosition = textBefore.length + imageMarkdown.length + 1;
                editor.selectionStart = newCursorPosition;
                editor.selectionEnd = newCursorPosition;
                
                // Update preview and close popup
                updatePreview();
                closeLLMPrompt();
                updateStatus('AI image generated successfully!');
            } else {
                throw new Error('No image data received from API');
            }
        } else {
            throw new Error('No content generated from API response');
        }
        
    } catch (error) {
        console.error('Error generating image:', error);
        status.innerHTML = `<span class="error">Error: ${error.message}</span>`;
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Image';
    }
}

// Update the preview with markdown rendering
function updatePreview() {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    const sanitizedHtml = DOMPurify.sanitize(html);
    preview.innerHTML = sanitizedHtml;
    
    // Update word count
    updateWordCount();
    
    // Update status
    updateStatus('Editing...');
}

// Update word count
function updateWordCount() {
    const text = editor.value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const wordCountElement = document.querySelector('.word-count');
    wordCountElement.textContent = `${words} words`;
}

// Update status message
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    
    // Clear status after 3 seconds
    setTimeout(() => {
        if (statusElement.textContent === message) {
            statusElement.textContent = 'Ready';
        }
    }, 3000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
    }
    
    // Ctrl/Cmd + O to open
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        loadFile();
    }
    
    // Ctrl/Cmd + B for bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**');
    }
    
    // Ctrl/Cmd + I for italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*');
    }
    
    // Tab to indent
    if (e.key === 'Tab') {
        e.preventDefault();
        insertAtCursor('    ');
    }
}

// Insert markdown syntax at cursor position
function insertMarkdown(before, after) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    
    const newText = before + selectedText + after;
    editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);
    
    // Set cursor position
    if (selectedText) {
        editor.selectionStart = start;
        editor.selectionEnd = start + newText.length;
    } else {
        editor.selectionStart = start + before.length;
        editor.selectionEnd = start + before.length;
    }
    
    editor.focus();
    updatePreview();
}

// Insert text at cursor position
function insertAtCursor(text) {
    const start = editor.selectionStart;
    editor.value = editor.value.substring(0, start) + text + editor.value.substring(start);
    editor.selectionStart = start + text.length;
    editor.selectionEnd = start + text.length;
    editor.focus();
    updatePreview();
}

// Save file
function saveFile() {
    const content = editor.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateStatus('File saved successfully!');
}

// Load file
function loadFile() {
    const fileInput = document.getElementById('file-input');
    fileInput.click();
}

// Handle file input change
document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.value = e.target.result;
            updatePreview();
            updateStatus(`Loaded: ${file.name}`);
        };
        reader.readAsText(file);
    }
});

// Clear editor
function clearEditor() {
    if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
        editor.value = '';
        updatePreview();
        updateStatus('Editor cleared');
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const container = document.querySelector('.container');
    const fullscreenBtn = document.querySelector('.fullscreen-btn i');
    
    if (!isFullscreen) {
        container.classList.add('fullscreen');
        fullscreenBtn.className = 'fas fa-compress';
        isFullscreen = true;
        updateStatus('Fullscreen mode');
    } else {
        container.classList.remove('fullscreen');
        fullscreenBtn.className = 'fas fa-expand';
        isFullscreen = false;
        updateStatus('Normal mode');
    }
}

// Auto-save functionality
function setupAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (editor.value.trim() !== '') {
            saveToLocalStorage();
        }
    }, 30000); // Auto-save every 30 seconds
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('markdownEditor_content', editor.value);
        localStorage.setItem('markdownEditor_timestamp', Date.now());
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    try {
        const savedContent = localStorage.getItem('markdownEditor_content');
        const timestamp = localStorage.getItem('markdownEditor_timestamp');
        
        if (savedContent && timestamp) {
            const timeDiff = Date.now() - parseInt(timestamp);
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            // Only restore if less than 24 hours old
            if (hoursDiff < 24) {
                editor.value = savedContent;
                updatePreview();
                updateStatus('Restored from auto-save');
            }
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// Export as HTML
function exportAsHTML() {
    const markdown = editor.value;
    const html = marked.parse(markdown);
    const sanitizedHtml = DOMPurify.sanitize(html);
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Document</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin: 1.5rem 0 1rem 0;
        }
        code {
            background: #f1f3f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: monospace;
        }
        pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #667eea;
            margin: 1rem 0;
            padding: 0.5rem 1rem;
            background: #f8f9fa;
            color: #6c757d;
        }
        a {
            color: #667eea;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${sanitizedHtml}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateStatus('Exported as HTML');
}

// Add export HTML button to toolbar
document.addEventListener('DOMContentLoaded', function() {
    const toolbar = document.querySelector('.toolbar');
    const separator = document.createElement('div');
    separator.className = 'separator';
    
    const exportBtn = document.createElement('button');
    exportBtn.className = 'toolbar-btn';
    exportBtn.onclick = exportAsHTML;
    exportBtn.title = 'Export as HTML';
    exportBtn.innerHTML = '<i class="fas fa-file-export"></i>';
    
    toolbar.appendChild(separator);
    toolbar.appendChild(exportBtn);
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    if (isFullscreen) {
        const container = document.querySelector('.container');
        container.style.height = '100vh';
    }
});

// Handle beforeunload to warn about unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (editor.value.trim() !== '') {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Add some sample content for demonstration
function loadSampleContent() {
    const sampleMarkdown = `# Welcome to Markdown Editor

This is a **powerful** and *beautiful* markdown editor with real-time preview.

## Features

- **Real-time preview** - See your changes instantly
- **Toolbar shortcuts** - Quick formatting with buttons
- **Keyboard shortcuts** - Use Ctrl+B for bold, Ctrl+I for italic
- **Auto-save** - Your work is automatically saved
- **File operations** - Save and load markdown files
- **Export options** - Export as HTML
- **Responsive design** - Works on all devices

## Code Example

\`\`\`javascript
function hello() {
    console.log("Hello, Markdown!");
}
\`\`\`

## Lists

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

![Sample Image](https://via.placeholder.com/300x200)

## Blockquotes

> This is a blockquote. It's great for highlighting important information.

## Tables

| Feature | Status |
|---------|--------|
| Real-time Preview | ✅ |
| Auto-save | ✅ |
| Export HTML | ✅ |
| Responsive | ✅ |

---

*Happy writing!* 🎉`;

    editor.value = sampleMarkdown;
    updatePreview();
    updateStatus('Sample content loaded');
}

// Add sample content button (for demonstration)
document.addEventListener('DOMContentLoaded', function() {
    const toolbar = document.querySelector('.toolbar');
    const separator = document.createElement('div');
    separator.className = 'separator';
    
    const sampleBtn = document.createElement('button');
    sampleBtn.className = 'toolbar-btn';
    sampleBtn.onclick = loadSampleContent;
    sampleBtn.title = 'Load Sample Content';
    sampleBtn.innerHTML = '<i class="fas fa-lightbulb"></i>';
    
    toolbar.appendChild(separator);
    toolbar.appendChild(sampleBtn);
}); 