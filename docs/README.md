# Panoptes SDK Documentation

This directory contains the complete documentation for Panoptes SDK, built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## 🚀 Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:4321
```

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📂 Structure

```
docs/
├── src/
│   ├── content/
│   │   └── docs/              # Documentation content (Markdown)
│   │       ├── getting-started/
│   │       ├── concepts/
│   │       ├── databases/
│   │       ├── transports/
│   │       ├── advanced/
│   │       ├── api/
│   │       ├── examples/
│   │       ├── comparison/
│   │       ├── compliance/
│   │       └── contributing/
│   ├── assets/                # Images and assets
│   └── styles/                # Custom CSS
├── public/                    # Static files
└── astro.config.mjs          # Astro configuration
```

## 📝 Adding Content

### Create a New Page

1. Add a new `.md` or `.mdx` file in `src/content/docs/`
2. Add frontmatter:

```md
---
title: Your Page Title
description: A brief description
---

# Your Content Here
```

3. The page will automatically appear in navigation based on `astro.config.mjs`

### Update Navigation

Edit `astro.config.mjs` to modify the sidebar navigation structure.

## 🎨 Styling

Custom styles are in `src/styles/custom.css`.

Starlight provides built-in components:
- `<Card>` and `<CardGrid>`
- `<Tabs>` and `<TabItem>`
- `<Aside>` for callouts
- And more...

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build)

## 👤 Maintainer

**[malydev](https://github.com/malydev) (Miguel Lipa)**
