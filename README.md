# Sabled UI Library

A customizable React component library built with TailwindCSS and TypeScript.

## Installation

```bash
npm install sabled
```

## Usage

### Basic Button Usage

```tsx
import { Button, StyleProvider } from 'sabled';

function App() {
  return (
    <StyleProvider>
      <div className="p-4">
        <Button variant="solid" color="primary">
          Click me!
        </Button>
        
        <Button variant="outlined" color="danger" size="large">
          Delete
        </Button>
        
        <Button variant="text" loading>
          Loading...
        </Button>
      </div>
    </StyleProvider>
  );
}
```

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `solid \| outlined \| dashed \| text \| link` | `solid` | Button style variant |
| `color` | `default \| primary \| danger \| success` | `default` | Button color theme |
| `size` | `small \| medium \| large` | `medium` | Button size |
| `borderRadius` | `none \| sm \| md \| lg \| xl \| 2xl \| 3xl \| full` | `md` | Border radius |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `iconLeft` | `React.ReactNode` | - | Icon on the left side |
| `iconRight` | `React.ReactNode` | - | Icon on the right side |
| `onClick` | `(event: React.MouseEvent) => void` | - | Click handler |

### Styling

The library automatically injects CSS styles when you import components. For custom styling in your consuming application, make sure TailwindCSS is configured to include the library's styles:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/sabled/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
}
```

### StyleProvider (Optional)

You can wrap your app with `StyleProvider` for better style isolation, but it's not required:

```tsx
import { StyleProvider } from 'sabled';

function App() {
  return (
    <StyleProvider>
      {/* Your app content */}
    </StyleProvider>
  );
}
```

## Components

- **Button**: Customizable button with ripple effects, loading states, and multiple variants
- **Message**: Utility for showing messages (imported from utils)
- **Confirm**: Utility for confirmation dialogs (imported from utils)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Publish to npm
npm run deploy
```
