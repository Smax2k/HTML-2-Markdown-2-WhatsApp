# 🔄 HTML ↔ Markdown ↔ WhatsApp Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)

> **Convertisseur bidirectionnel en temps réel** entre HTML, Markdown et le format WhatsApp.

## ✨ Fonctionnalités

- 🔄 **Conversion bidirectionnelle** - Convertissez dans les deux sens entre les trois formats
- ⚡ **Temps réel** - Les conversions s'effectuent instantanément pendant la saisie
- ✏️ **Éditeur WYSIWYG** - Éditeur HTML riche avec barre d'outils complète
- 📝 **Support Markdown complet** - Headers, listes, gras, italique, barré, liens, code...
- 💬 **Format WhatsApp** - Compatible avec le formatage natif WhatsApp (`*gras*`, `_italique_`, `~barré~`)
- 📋 **Copie en un clic** - Copiez facilement le résultat dans le presse-papiers
- 🌙 **Interface moderne** - Design sombre et épuré

## 🚀 Démo

🔗 **[Accéder à l'application](https://html2md.jbahu.workers.dev)**

## 📦 Installation

### Prérequis

- Node.js 18+ ou Bun
- Compte Cloudflare (pour le déploiement)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/Smax2k/HTML-2-Markdown-2-WhatsApp.git
cd HTML-2-Markdown-2-WhatsApp

# Installer les dépendances
npm install
# ou
bun install

# Lancer le serveur de développement
npm run dev
# ou
bun run dev
```

L'application sera accessible sur `http://localhost:5173`

## ☁️ Déploiement sur Cloudflare Workers

### 1. Configurer Wrangler

Copiez le fichier exemple et ajoutez vos informations :

```bash
cp wrangler.toml.example wrangler.toml
```

Éditez `wrangler.toml` et remplacez :
- `VOTRE_ACCOUNT_ID_ICI` par votre Account ID Cloudflare

### 2. Déployer

```bash
npm run deploy
# ou
bun run deploy
```

## 🛠️ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm run deploy` | Build + déploiement sur Cloudflare |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run git` | Commit et push rapide |

## 📖 Utilisation

### Modes d'entrée

1. **HTML** - Utilisez l'éditeur WYSIWYG pour formater votre texte
2. **Markdown** - Écrivez directement en syntaxe Markdown
3. **WhatsApp** - Collez du texte formaté WhatsApp

### Modes de sortie

- **Markdown** - Format Markdown standard (GFM)
- **WhatsApp** - Format compatible avec WhatsApp
- **HTML** - Code HTML généré

### Correspondance des formats

| Format | Gras | Italique | Barré | Code |
|--------|------|----------|-------|------|
| Markdown | `**text**` | `*text*` | `~~text~~` | `` `code` `` |
| WhatsApp | `*text*` | `_text_` | `~text~` | `` `code` `` |
| HTML | `<b>text</b>` | `<i>text</i>` | `<s>text</s>` | `<code>code</code>` |

## 🧰 Technologies utilisées

- **[React 19](https://react.dev/)** - Framework UI
- **[Vite 7](https://vite.dev/)** - Build tool ultra-rapide
- **[React Quill](https://github.com/zenoamaro/react-quill)** - Éditeur WYSIWYG
- **[Turndown](https://github.com/mixmark-io/turndown)** - Conversion HTML → Markdown
- **[Marked](https://github.com/markedjs/marked)** - Conversion Markdown → HTML
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Hébergement edge

## 📁 Structure du projet

```
html2markdown/
├── src/
│   ├── App.jsx          # Composant principal
│   ├── App.css          # Styles de l'application
│   ├── index.css        # Styles globaux
│   └── main.jsx         # Point d'entrée React
├── worker/
│   └── src/
│       └── index.ts     # Cloudflare Worker
├── public/              # Assets statiques
├── wrangler.toml.example # Configuration Cloudflare (exemple)
└── package.json
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Jonathan Bahu**

- GitHub: [@Smax2k](https://github.com/Smax2k)

---

⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile !
