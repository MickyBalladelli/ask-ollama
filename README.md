# Ask Ollama

Ask Ollama is a local chat app for Ollama. It has a React UI, a Vite web build, and an Electron desktop shell.

## Features

- Chat with any installed Ollama model.
- Stream answers as Ollama writes them.
- Render answers as Markdown, including code blocks, tables, links, and lists.
- Keep multiple saved chats in the left sidebar.
- Create, switch, and delete chats.
- Save chats in browser local storage.
- Remember the selected model per chat.
- Show model badges for text, vision, code, and large-context guesses.
- Refresh installed models from Ollama.
- Use a system prompt to guide future answers.
- Search inside the current chat.
- Export a chat as Markdown.
- Clear the current chat.
- Edit a user message and resend from that point.
- Regenerate the latest answer.
- Copy assistant answers.
- Cancel an active request.
- Auto-scroll while new answer text appears.
- Stop auto-scroll when you scroll up.
- Resume auto-scroll when you return near the bottom.
- Attach text files.
- Attach PDFs and extract their text.
- Attach images and send them to vision models.
- Paste images from the clipboard.
- Drag and drop files.
- Show image thumbnails in the attachment list.
- Show attachment type and size.
- Warn when a file is large and may exceed model memory.
- Warn when a PDF has no extractable text.
- Warn when an image is attached but the selected model does not look like a vision model.
- Show a clearer error when Ollama is not running.
- Use `src/images/ollama.png` as the app logo, favicon, window icon, and packaged app icon.

## Requirements

- Node.js and npm.
- Ollama running on the machine.
- At least one Ollama model installed.
- A vision model, such as `llava`, if you want image understanding.

## Install

```bash
npm install
```

## Run Web App

```bash
npm run dev
```

Vite proxies Ollama calls from `/api/ollama` to `http://localhost:11434`.

## Build Web App

```bash
npm run build
```

## Run Desktop App

```bash
npm run desktop
```

The desktop app talks directly to `http://localhost:11434`.

## Package Apps

Build Windows portable app:

```bash
npm run dist:win
```

Build Mac app:

```bash
npm run dist:mac
```

Outputs go to `release/`. Ollama must still be running on the target machine.

## Backend Configuration

Default web API base:

```text
/api/ollama
```

Override it with:

```env
VITE_OLLAMA_API_BASE_URL=https://example.com/api/ollama
```

The app uses:

- `GET /api/tags` to load models.
- `POST /api/generate` to stream answers.

## Project Structure

- `src/components/` - React UI components.
- `src/lib/` - Ollama API, file helpers, PDF text, model capability helpers.
- `src/images/ollama.png` - logo and icon image.
- `electron/` - desktop app shell and preload bridge.
- `vite.config.js` - Vite config and Ollama proxy.
- `package.json` - scripts and Electron packaging config.

## Notes

- Attached books and text files are sent as-is, not summarized first.
- Very large files may exceed the selected model context.
- Image attachments need a vision-capable Ollama model.
