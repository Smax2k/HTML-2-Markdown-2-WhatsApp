import { useState, useMemo, useCallback } from 'react'
import ReactQuill from 'react-quill-new'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { marked } from 'marked'
import 'react-quill-new/dist/quill.snow.css'
import './App.css'

function App() {
  const [htmlContent, setHtmlContent] = useState('')
  const [markdownInput, setMarkdownInput] = useState('')
  const [whatsappInput, setWhatsappInput] = useState('')
  const [inputMode, setInputMode] = useState('html') // 'html', 'markdown', ou 'whatsapp'
  const [outputMode, setOutputMode] = useState('markdown') // 'markdown', 'whatsapp', ou 'html'

  // Configuration de marked pour la conversion Markdown → HTML
  const markedOptions = useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
    return marked
  }, [])

  const turndownService = useMemo(() => {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    })
    service.use(gfm)
    service.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: function (content) {
        return '~~' + content + '~~'
      }
    })
    service.addRule('listItem', {
      filter: 'li',
      replacement: function (content, node, options) {
        content = content
          .trim()
          .replace(/\n+$/g, '') // remove trailing newlines
          .replace(/\n/gm, '\n    ') // indent internal newlines

        let prefix = options.bulletListMarker + ' '
        const parent = node.parentNode

        if (parent.nodeName === 'OL') {
          const start = parent.getAttribute('start')
          const index = Array.prototype.indexOf.call(parent.children, node)
          prefix = (start ? Number(start) + index : index + 1) + '. '
        }

        return (
          prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
        )
      }
    })
    return service
  }, [])

  // Conversion WhatsApp → Markdown
  const whatsappToMarkdown = useCallback((text) => {
    if (!text) return ''
    let result = text

    // Bold: *text* -> **text**
    result = result.replace(/(?<![*])\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '**$1**')

    // Italic: _text_ -> *text*
    result = result.replace(/(?<![_])_(?!_)(.+?)(?<!_)_(?!_)/g, '*$1*')

    // Strikethrough: ~text~ -> ~~text~~
    result = result.replace(/(?<![~])~(?!~)(.+?)(?<!~)~(?!~)/g, '~~$1~~')

    // Code: identique en Markdown et WhatsApp (`code`)

    return result
  }, [])

  // Nettoyer le HTML avant conversion (remplacer les &nbsp; par des espaces normaux)
  const cleanHtml = useCallback((html) => {
    if (!html) return ''
    // Remplacer les entités &nbsp; et les caractères Unicode \u00A0 par des espaces normaux
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ')
  }, [])

  // Conversion HTML → Markdown
  const markdownFromHtml = useMemo(() => {
    if (!htmlContent) return ''
    const cleaned = cleanHtml(htmlContent)
    let markdown = turndownService.turndown(cleaned)

    // Post-traitement: supprimer les backslashes d'échappement inutiles
    // Ex: "1\." → "1." (Turndown échappe les points après les numéros)
    markdown = markdown.replace(/(\d+)\\\./g, '$1.')

    return markdown
  }, [htmlContent, turndownService, cleanHtml])

  // Conversion WhatsApp input → Markdown
  const markdownFromWhatsapp = useMemo(() => {
    return whatsappToMarkdown(whatsappInput)
  }, [whatsappInput, whatsappToMarkdown])

  // Le Markdown actuel selon le mode d'entrée
  const currentMarkdown = useMemo(() => {
    switch (inputMode) {
      case 'html':
        return markdownFromHtml
      case 'markdown':
        return markdownInput
      case 'whatsapp':
        return markdownFromWhatsapp
      default:
        return ''
    }
  }, [inputMode, markdownFromHtml, markdownInput, markdownFromWhatsapp])

  // Conversion Markdown → HTML (pour affichage)
  const htmlFromMarkdown = useMemo(() => {
    if (!currentMarkdown) return ''
    return markedOptions.parse(currentMarkdown)
  }, [currentMarkdown, markedOptions])

  // Conversion Markdown vers format WhatsApp
  const whatsappContent = useMemo(() => {
    if (!currentMarkdown) return ''

    let result = currentMarkdown

    // Étape 1: Protéger le bold avec des placeholders
    result = result.replace(/\*\*(.+?)\*\*/g, '{{BOLD}}$1{{/BOLD}}')
    result = result.replace(/__(.+?)__/g, '{{BOLD}}$1{{/BOLD}}')

    // Étape 2: Convertir l'italique Markdown *text* -> _text_
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '_$1_')

    // Étape 3: Restaurer le bold avec le format WhatsApp *text*
    result = result.replace(/\{\{BOLD\}\}(.+?)\{\{\/BOLD\}\}/g, '*$1*')

    // Headers -> Bold (WhatsApp n'a pas de headers)
    result = result.replace(/^#{1,6}\s+(.+)$/gm, '*$1*')

    // Strikethrough: ~~text~~ -> ~text~
    result = result.replace(/~~(.+?)~~/g, '~$1~')

    // Code inline: identique (`code`)

    // Links: [text](url) -> text (url)
    result = result.replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')

    return result
  }, [currentMarkdown])

  // Définir l'output actuel selon le mode
  const getCurrentOutput = () => {
    switch (outputMode) {
      case 'markdown':
        return currentMarkdown
      case 'whatsapp':
        return whatsappContent
      case 'html':
        return inputMode === 'html' ? htmlContent : htmlFromMarkdown
      default:
        return currentMarkdown
    }
  }

  const currentOutput = getCurrentOutput()

  // Synchronisation: quand on change de mode d'input
  const handleInputModeChange = useCallback((newMode) => {
    if (newMode === inputMode) return

    // Synchroniser le contenu vers le nouveau mode
    if (newMode === 'markdown') {
      if (inputMode === 'html') {
        setMarkdownInput(markdownFromHtml)
      } else if (inputMode === 'whatsapp') {
        setMarkdownInput(markdownFromWhatsapp)
      }
    } else if (newMode === 'html') {
      const mdToConvert = inputMode === 'markdown' ? markdownInput : markdownFromWhatsapp
      if (mdToConvert) {
        setHtmlContent(markedOptions.parse(mdToConvert))
      }
    } else if (newMode === 'whatsapp') {
      setWhatsappInput(whatsappContent)
    }

    setInputMode(newMode)
  }, [inputMode, markdownFromHtml, markdownFromWhatsapp, markdownInput, whatsappContent, markedOptions])

  // Effacer tout le contenu
  const clearAll = useCallback(() => {
    setHtmlContent('')
    setMarkdownInput('')
    setWhatsappInput('')
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image',
    'blockquote', 'code-block'
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentOutput)
    } catch (err) {
      console.error('Copy error:', err)
    }
  }

  const getOutputPlaceholder = () => {
    switch (outputMode) {
      case 'markdown':
        return 'Markdown output will appear here...'
      case 'whatsapp':
        return 'WhatsApp format will appear here...'
      case 'html':
        return 'HTML output will appear here...'
      default:
        return ''
    }
  }

  const getInputPlaceholder = () => {
    if (inputMode === 'markdown') {
      return `Paste or write your Markdown here...

Examples:
# Title
**bold** and *italic*
~~strikethrough~~
- list
[link](url)`
    }
    return `Paste your WhatsApp text here...

Examples:
*bold* and _italic_
~strikethrough~
\`code\``
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>HTML ↔ Markdown ↔ WhatsApp</h1>
        <p>Real-time bidirectional conversion</p>
      </header>

      <main className="editor-grid">
        {/* Colonne gauche - Éditeur */}
        <section className="panel editor-panel">
          <div className="panel-header">
            <div className="mode-tabs">
              <button
                className={`mode-tab ${inputMode === 'html' ? 'active' : ''}`}
                data-mode="html"
                onClick={() => handleInputModeChange('html')}
              >
                ✏️ HTML
              </button>
              <button
                className={`mode-tab ${inputMode === 'markdown' ? 'active' : ''}`}
                data-mode="markdown"
                onClick={() => handleInputModeChange('markdown')}
              >
                📝 Markdown
              </button>
              <button
                className={`mode-tab ${inputMode === 'whatsapp' ? 'active' : ''}`}
                data-mode="whatsapp"
                onClick={() => handleInputModeChange('whatsapp')}
              >
                💬 WhatsApp
              </button>
            </div>
            <button className="clear-btn" onClick={clearAll} title="Clear all">
              🗑️ Clear
            </button>
          </div>
          <div className="editor-container">
            {inputMode === 'html' ? (
              <ReactQuill
                theme="snow"
                value={htmlContent}
                onChange={setHtmlContent}
                modules={modules}
                formats={formats}
                placeholder="Start typing here..."
              />
            ) : (
              <textarea
                className="markdown-input"
                value={inputMode === 'markdown' ? markdownInput : whatsappInput}
                onChange={(e) => inputMode === 'markdown'
                  ? setMarkdownInput(e.target.value)
                  : setWhatsappInput(e.target.value)
                }
                placeholder={getInputPlaceholder()}
              />
            )}
          </div>
        </section>

        {/* Colonne droite - Output */}
        <section className="panel output-panel">
          <div className="panel-header">
            <div className="mode-tabs">
              <button
                className={`mode-tab ${outputMode === 'markdown' ? 'active' : ''}`}
                data-mode="markdown"
                onClick={() => setOutputMode('markdown')}
              >
                📄 Markdown
              </button>
              <button
                className={`mode-tab ${outputMode === 'whatsapp' ? 'active' : ''}`}
                data-mode="whatsapp"
                onClick={() => setOutputMode('whatsapp')}
              >
                💬 WhatsApp
              </button>
              <button
                className={`mode-tab ${outputMode === 'html' ? 'active' : ''}`}
                data-mode="html"
                onClick={() => setOutputMode('html')}
              >
                🌐 HTML
              </button>
            </div>
            <button className="copy-btn" onClick={copyToClipboard} title="Copy">
              📋 Copy
            </button>
          </div>
          <div className="output-content">
            <pre><code>{currentOutput || getOutputPlaceholder()}</code></pre>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-text">Open Source Project</span>
          <a
            href="https://github.com/Smax2k/HTML-2-Markdown-2-WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
