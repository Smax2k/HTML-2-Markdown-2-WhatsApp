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

  // Conversion HTML → Markdown
  const markdownFromHtml = useMemo(() => {
    if (!htmlContent) return ''
    return turndownService.turndown(htmlContent)
  }, [htmlContent, turndownService])

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
      console.error('Erreur de copie:', err)
    }
  }

  const getOutputPlaceholder = () => {
    switch (outputMode) {
      case 'markdown':
        return 'Le Markdown apparaîtra ici...'
      case 'whatsapp':
        return 'Le format WhatsApp apparaîtra ici...'
      case 'html':
        return 'Le HTML apparaîtra ici...'
      default:
        return ''
    }
  }

  const getInputPlaceholder = () => {
    if (inputMode === 'markdown') {
      return `Collez ou écrivez votre Markdown ici...

Exemples:
# Titre
**gras** et *italique*
~~barré~~
- liste
[lien](url)`
    }
    return `Collez votre texte WhatsApp ici...

Exemples:
*gras* et _italique_
~barré~
\`code\``
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>HTML ↔ Markdown ↔ WhatsApp</h1>
        <p>Conversion bidirectionnelle en temps réel</p>
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
            <button className="clear-btn" onClick={clearAll} title="Effacer tout">
              🗑️ Effacer
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
                placeholder="Commencez à écrire ici..."
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
            <button className="copy-btn" onClick={copyToClipboard} title="Copier">
              📋 Copier
            </button>
          </div>
          <div className="output-content">
            <pre><code>{currentOutput || getOutputPlaceholder()}</code></pre>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
