# 🎨 Sabled UI Library

A modern, comprehensive React component library with beautiful designs inspired by Material-UI, Chakra UI, and Ant Design. Built with TailwindCSS and TypeScript for maximum customization and developer experience.

## ✨ Features

- 🎯 **15+ Production-Ready Components** - Buttons, inputs, modals, cards, avatars, and more
- 🎨 **Modern Design System** - Inspired by leading UI libraries with consistent styling
- ⚡ **Performance Optimized** - Tree-shakeable with automatic CSS injection
- 🔧 **Highly Customizable** - Easy theming and component variants
- 📱 **Responsive Design** - Works beautifully on all screen sizes
- ♿ **Accessibility First** - ARIA compliant with keyboard navigation
- 🌙 **Dark Mode Ready** - Built-in support for dark themes
- 💪 **TypeScript Native** - Full type safety and IntelliSense support

## 🚀 Installation

```bash
npm install sabled
```

## 🎬 Quick Start

```tsx
import { Button, Input, Card, Avatar, Badge, StyleProvider } from 'sabled';

function App() {
  return (
    <StyleProvider>
      <Card variant="elevated" hoverable>
        <div className="flex items-center gap-4">
          <Avatar 
            src="/avatar.jpg" 
            fallback="JD" 
            status="online"
            badge={<Badge color="primary" size="small">Pro</Badge>}
          />
          <div className="flex-1">
            <Input 
              label="Search" 
              placeholder="Type something..."
              variant="outlined"
            />
          </div>
          <Button variant="solid" color="primary" size="large">
            Search
          </Button>
        </div>
      </Card>
    </StyleProvider>
  );
}
```

## 🧩 Components

### 🔘 Button
Enhanced with ripple effects, loading states, and focus management.

```tsx
<Button 
  variant="solid" 
  color="primary" 
  size="large"
  iconLeft={<SearchIcon />}
  loading
>
  Loading...
</Button>
```

**New Features:**
- Active scale animation
- Enhanced focus states with ring
- Better shadow system
- Improved color variants

### 📝 Input & Textarea
Modern form controls with floating labels and validation states.

```tsx
<Input
  label="Email"
  variant="outlined"
  startIcon={<EmailIcon />}
  error={false}
  helperText="We'll never share your email"
/>
```

**New Features:**
- Enhanced focus animations
- Better visual feedback
- Improved accessibility
- Group hover effects

### 🖼️ Avatar (New!)
Professional avatar component with status indicators and badges.

```tsx
<Avatar
  src="/user.jpg"
  fallback="JD"
  size="lg"
  status="online"
  badge={<Badge color="primary" size="sm">VIP</Badge>}
/>
```

**Features:**
- Multiple sizes (xs, sm, md, lg, xl, 2xl)
- Status indicators (online, offline, away, busy)
- Badge support
- Fallback to initials
- Loading state

### 🎯 Badge
Enhanced with better typography and hover effects.

```tsx
<Badge variant="soft" color="success">
  Active
</Badge>
```

**New Features:**
- Improved color system
- Hover scale animation
- Better shadows
- Dot variant with pulse animation

### 🃏 Card
Redesigned with gradient backgrounds and better hover effects.

```tsx
<Card 
  variant="elevated"
  hoverable
  header={<h3>Card Title</h3>}
  footer={<Button fullWidth>Action</Button>}
>
  Beautiful card content with enhanced styling
</Card>
```

**New Features:**
- Gradient backgrounds
- Enhanced hover animations
- Better border system
- Improved shadows

### 🪟 Modal
Modernized with backdrop blur and smooth animations.

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Enhanced Modal"
  size="large"
>
  Now with glassmorphism effects and better animations!
</Modal>
```

**New Features:**
- Backdrop blur effects
- Glassmorphism design
- Enhanced animations
- Better close interactions

### 📊 Progress
Redesigned with gradients and shimmer effects.

```tsx
<Progress 
  variant="linear" 
  value={75} 
  color="primary"
  showValue
  label="Upload Progress"
/>
```

**New Features:**
- Gradient progress bars
- Shimmer loading animation
- Enhanced circular variant
- Better color system

### 🔄 Spinner (New!)
Multiple loading animations with customizable styles.

```tsx
<Spinner 
  variant="dots" 
  size="lg" 
  color="primary"
  label="Loading..."
/>
```

**Variants:**
- `spinner` - Classic spinning circle
- `dots` - Bouncing dots
- `pulse` - Pulsing circle
- `bars` - Animated bars

### 💬 Tooltip (New!)
Smart positioning with beautiful animations.

```tsx
<Tooltip content="This is a helpful tooltip" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

**Features:**
- Smart positioning
- Multiple variants (dark, light, primary)
- Delay customization
- Keyboard navigation support

## 🎨 Design System

### Color Palette
- **Primary**: Customizable blue theme
- **Success**: Green variants
- **Danger**: Red variants
- **Warning**: Yellow variants
- **Info**: Blue info variants
- **Default**: Neutral grays

### Component Variants
- **Solid**: Filled backgrounds
- **Outlined**: Border-only designs
- **Soft**: Subtle backgrounds
- **Text**: Minimal styling

### Size System
- **xs, sm, md, lg, xl, 2xl**: Consistent sizing across all components

## 🎯 Enhanced Features

### Modern Animations
- Smooth transitions with easing
- Scale and translate effects
- Loading shimmer animations
- Pulse and bounce variants

### Focus Management
- Enhanced focus rings
- Keyboard navigation
- Screen reader support
- ARIA compliance

### Visual Polish
- Glassmorphism effects
- Gradient backgrounds
- Enhanced shadows
- Better typography

## 🛠️ Customization

### Primary Color
```css
:root {
  --color-primary: #your-brand-color;
}
```

### TailwindCSS Integration
```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/sabled/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          // ... your color palette
        }
      }
    }
  }
}
```

## 📦 Bundle Size
- Tree-shakeable components
- Optimized CSS injection
- No runtime dependencies
- Minimal overhead

## 🧪 Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Publish to npm
npm run deploy
```

## 📄 License

MIT - Feel free to use in your projects!

---

**Made with ❤️ by SHINEE** - Building beautiful UIs, one component at a time.
