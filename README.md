# 🔄 HTML ↔ Markdown ↔ WhatsApp Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)

> **Real-time bidirectional converter** between HTML, Markdown and WhatsApp formatting.

## ✨ Features

- 🔄 **Bidirectional Conversion** - Convert seamlessly between all three formats
- ⚡ **Real-time** - Conversions happen instantly as you type
- ✏️ **WYSIWYG Editor** - Rich HTML editor with full toolbar
- 📝 **Full Markdown Support** - Headers, lists, bold, italic, strikethrough, links, code...
- 💬 **WhatsApp Format** - Compatible with native WhatsApp formatting (`*bold*`, `_italic_`, `~strikethrough~`, `` `code` ``)
- 📋 **One-click Copy** - Easily copy the output to clipboard
- 🌙 **Modern Interface** - Clean dark theme design

## 🚀 Demo

🔗 **[Try it live](https://html2md.jbahu.fr)**

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Smax2k/HTML-2-Markdown-2-WhatsApp.git
cd HTML-2-Markdown-2-WhatsApp

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:5173`

## ☁️ Deploy to Cloudflare Workers

### 1. Configure Wrangler

Copy the example file and add your credentials:

```bash
cp wrangler.toml.example wrangler.toml
```

Edit `wrangler.toml` and replace:
- `YOUR_ACCOUNT_ID_HERE` with your Cloudflare Account ID

### 2. Deploy

```bash
npm run deploy
# or
bun run deploy
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run deploy` | Build + deploy to Cloudflare |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 📖 Usage

### Input Modes

1. **HTML** - Use the WYSIWYG editor to format your text
2. **Markdown** - Write directly in Markdown syntax
3. **WhatsApp** - Paste WhatsApp formatted text

### Output Modes

- **Markdown** - Standard Markdown format (GFM)
- **WhatsApp** - WhatsApp-compatible format
- **HTML** - Generated HTML code

### Format Mapping

| Format | Bold | Italic | Strikethrough | Code |
|--------|------|--------|---------------|------|
| Markdown | `**text**` | `*text*` | `~~text~~` | `` `code` `` |
| WhatsApp | `*text*` | `_text_` | `~text~` | `` `code` `` |
| HTML | `<b>text</b>` | `<i>text</i>` | `<s>text</s>` | `<code>code</code>` |

## 🧰 Tech Stack

- **[React 19](https://react.dev/)** - UI Framework
- **[Vite 7](https://vite.dev/)** - Lightning-fast build tool
- **[React Quill](https://github.com/zenoamaro/react-quill)** - WYSIWYG Editor
- **[Turndown](https://github.com/mixmark-io/turndown)** - HTML → Markdown conversion
- **[Marked](https://github.com/markedjs/marked)** - Markdown → HTML conversion
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge hosting

## 📁 Project Structure

```
html2markdown/
├── src/
│   ├── App.jsx          # Main component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── worker/
│   └── src/
│       └── index.ts     # Cloudflare Worker
├── public/              # Static assets
├── wrangler.toml.example # Cloudflare config template
└── package.json
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

⭐ If you find this project useful, please give it a star!
