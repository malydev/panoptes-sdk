# Panoptes SDK Documentation

Clean, modern documentation site built with Astro and Tailwind CSS following SOLID principles.

## 🏗️ Architecture

This project follows SOLID principles for maintainable, scalable components:

### Single Responsibility Principle
Each component has one clear purpose:
- `BaseLayout.astro` - Page structure only
- `Button.astro` - Button rendering only
- `Card.astro` - Card container only
- `Hero.astro` - Hero section only

### Open/Closed Principle
Components are open for extension via props and slots:
```astro
<Card title="Custom Title" icon="🎯">
  <p>Any content here</p>
</Card>
```

### Liskov Substitution Principle
Components can be swapped without breaking functionality:
```astro
<!-- Can use any variant -->
<Button variant="primary">Click me</Button>
<Button variant="secondary">Or me</Button>
```

### Interface Segregation Principle
Components only require props they actually use:
```astro
interface Props {
  title?: string;  // Optional, only if needed
  required: string; // Required only when necessary
}
```

### Dependency Inversion Principle
High-level pages depend on abstractions (components), not concrete implementations.

## 📂 Project Structure

```
docs/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.astro
│   │   │   └── Card.astro
│   │   └── content/         # Content components
│   │       ├── Hero.astro
│   │       └── CodeExample.astro
│   ├── layouts/
│   │   └── BaseLayout.astro # Base page layout
│   ├── pages/
│   │   └── index.astro      # Home page (uses composition)
│   ├── styles/
│   │   └── global.css       # Tailwind styles
│   └── types/               # TypeScript types
├── public/                  # Static assets
│   └── favicon.svg
└── astro.config.mjs        # Astro config
```

## 🚀 Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🎨 Design System

### Colors
- Primary: Blue (`#3b82f6`)
- Secondary: Purple (`#8b5cf6`)
- Background: Slate shades

### Components
All components are modular and reusable following component composition patterns.

## ✨ Features

- ⚡ Fast builds with Astro
- 🎨 Tailwind CSS for styling
- 🌙 Dark mode support
- 📱 Fully responsive
- ♿ Accessible
- 🧩 Component-based architecture
- 🔧 TypeScript for type safety

## 👤 Created by

**[malydev](https://github.com/malydev) (Miguel Lipa)**
