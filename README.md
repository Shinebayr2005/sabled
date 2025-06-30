# 🎨 Sabled UI Library

A modern, comprehensive React component library focused on practical user interactions. Built with TailwindCSS and TypeScript, featuring the industry's best Confirm dialogs and Message notifications with zero-setup APIs.

## ✨ Features

- 🎯 **15+ Production-Ready Components** - Featuring powerful Confirm dialogs and Message notifications
- 🚀 **Zero Setup Required** - No providers, context, or configuration needed
- 💬 **Imperative APIs** - Call Confirm and Message directly from anywhere in your code
- 🎨 **Modern Design System** - Clean, cohesive components with a focus on usability and consistency
- ⚡ **Performance Optimized** - Tree-shakeable with minimal bundle size
- 🔧 **Highly Customizable** - Multiple variants, colors, and sizes for every component
- 📱 **Responsive Design** - Works beautifully on all screen sizes
- ♿ **Accessibility First** - ARIA compliant with keyboard navigation
- 💪 **TypeScript Native** - Full type safety and IntelliSense support

## 🚀 Installation

```bash
npm install sabled
```

## 🎬 Quick Start

```tsx
import { Confirm, Message, Button, Input, Card } from "sabled";

function App() {
  const handleDelete = async () => {
    const confirmed = await Confirm({
      title: "Delete Item",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (confirmed) {
      // Perform delete action
      Message.success("Item deleted successfully!");
    }
  };

  return (
    <div className="p-6">
      <Card variant="bordered" className="p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <div className="flex gap-4">
          <Input
            label="Search users"
            placeholder="Type to search..."
            variant="bordered"
          />
          <Button variant="bordered" color="danger" onClick={handleDelete}>
            Delete Selected
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

## 🧩 Components

### � Confirm (Core Feature)

The most important component - beautiful, promise-based confirmation dialogs that integrate seamlessly into your workflow.

```tsx
// Simple confirmation
const confirmed = await Confirm("Are you sure?");

// Advanced confirmation with options
const result = await Confirm({
  title: "Delete Account",
  message: "This will permanently delete your account and all associated data.",
  confirmText: "Delete Forever",
  cancelText: "Keep Account",
  variant: "danger",
  size: "md",
});

if (result) {
  // User confirmed
}
```

**Why it's special:**

- Promise-based API - no state management needed
- Zero setup - works instantly without providers
- Beautiful animations and transitions
- Customizable variants (default, danger, warning, success)
- Keyboard accessible (Enter/Escape)
- Auto-focus management

### 📢 Message (Core Feature)

Essential toast notifications with a clean, imperative API. No providers or context needed.

```tsx
// Simple messages
Message.success("Profile updated!");
Message.error("Failed to save changes");
Message.warning("Session will expire soon");
Message.info("New feature available");

// Advanced options
Message.success("Upload complete", {
  duration: 5000,
  showClose: true,
  position: "top-right",
});

// Custom content
Message.custom({
  title: "Custom Notification",
  content: <div>Rich HTML content here</div>,
  variant: "primary",
  duration: 0, // Persist until closed
});
```

**Why it's essential:**

- Imperative API - call from anywhere in your code
- No setup required - works out of the box
- Smart positioning and stacking
- Auto-dismiss with customizable timing
- Rich content support
- Mobile-friendly responsive design

### 🔘 Button

Modern button component with multiple variants and states.

```tsx
<Button
  variant="bordered"
  color="primary"
  size="md"
  startContent={<SearchIcon />}
  loading={isLoading}
>
  Search
</Button>
```

**Features:**

- Multiple variants (solid, bordered, flat, faded, shadow, ghost)
- Color themes (default, primary, secondary, success, warning, danger)
- Loading states with spinners
- Icon support (start/end content)
- Full accessibility support

### 📝 Input & Textarea

Modern form controls with clean HeroUI-inspired design.

```tsx
<Input
  label="Email"
  variant="bordered"
  startContent={<EmailIcon />}
  isInvalid={hasError}
  errorMessage="Please enter a valid email"
/>

<Textarea
  label="Comments"
  variant="bordered"
  rows={4}
  maxLength={500}
  showCharCount
/>
```

**Features:**

- HeroUI-inspired variants (flat, faded, bordered, underlined)
- Validation states with error messages
- Start/end content support
- Character counting for textarea
- Full accessibility compliance

### 🖼️ Avatar

Clean avatar component with multiple styling options.

```tsx
<Avatar src="/user.jpg" name="John Doe" size="lg" color="primary" isBordered />
```

**Features:**

- Automatic initials fallback from name
- Multiple sizes (sm, md, lg)
- Color themes and border options
- Click handlers for interactive use
- Disabled state support

### 🎯 Badge

Simple, effective badges for status and labels.

```tsx
<Badge variant="solid" color="success">
  Active
</Badge>
```

**Features:**

- Multiple variants (solid, flat, faded, shadow, bordered)
- Color system integration
- Size options (sm, md, lg)
- Content flexibility

### 🃏 Card

Versatile container component for organizing content.

```tsx
<Card
  variant="bordered"
  header={<h3>Card Title</h3>}
  footer={<Button fullWidth>Action</Button>}
>
  Card content goes here
</Card>
```

**Features:**

- Multiple variants (flat, faded, bordered, shadow)
- Header and footer support
- Interactive states (hoverable, pressable)
- Flexible sizing and radius options

### 🪟 Modal

Clean modal component with backdrop and animations.

```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Settings" size="md">
  Modal content here
</Modal>
```

**Features:**

- Backdrop click to close
- Keyboard navigation (Escape key)
- Size variants and positioning
- Scroll lock when open

### 📊 Progress

Progress indicators for loading states and data visualization.

```tsx
<Progress
  variant="linear"
  value={75}
  color="primary"
  showValue
  label="Upload Progress"
/>
```

**Features:**

- Linear and circular variants
- Color theme integration
- Value display options
- Indeterminate states

### 🔄 Spinner

Loading spinners for async operations.

```tsx
<Spinner size="md" color="primary" label="Loading..." />
```

**Features:**

- Multiple size options
- Color customization
- Optional labels
- Accessible screen reader support

### 💬 Tooltip

Contextual information overlays.

```tsx
<Tooltip content="Helpful information" placement="top">
  <Button>Hover me</Button>
</Tooltip>
```

**Features:**

- Smart positioning
- Keyboard navigation
- Delay customization
- Multiple placement options

## 🎨 Design System

### Core Philosophy

Sabled prioritizes **practical functionality** over flashy effects. Every component is designed to solve real UI problems with clean, accessible interfaces.

### Color Palette

- **Primary**: Customizable brand color theme
- **Success**: Green variants for positive actions
- **Danger**: Red variants for destructive actions
- **Warning**: Orange variants for caution
- **Secondary**: Neutral secondary theme
- **Default**: Clean neutral grays

### Component Variants

- **Solid**: Filled backgrounds for primary actions
- **Bordered**: Clean borders for secondary actions
- **Flat**: Minimal styling for subtle interactions
- **Faded**: Subtle backgrounds with transparency
- **Shadow**: Elevated appearance with shadows

### Size System

- **sm, md, lg**: Consistent sizing across all components
- Responsive design principles
- Touch-friendly minimum sizes

## 🎯 What Makes Sabled Special

### 🚀 Zero Configuration

- No providers or context setup required
- Components work instantly after installation
- No theme configuration needed
- Just import and use

### 💬 Imperative APIs

- `Confirm()` returns a promise - no state management
- `Message.success()` works from anywhere in your app
- Clean, predictable APIs that feel natural
- Async/await friendly patterns

### 🎨 Practical Design

- HeroUI-inspired modern aesthetics
- Focus on usability over decoration
- Consistent behavior across all components
- Mobile-first responsive design

### ♿ Accessibility Built-in

- Full keyboard navigation support
- Screen reader compatibility
- Focus management and ARIA labels
- Color contrast compliance

## 🛠️ Customization

### TailwindCSS Integration

Sabled is built with TailwindCSS and integrates seamlessly with your existing setup:

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
          DEFAULT: "#3b82f6",
          50: "#eff6ff",
          100: "#dbeafe",
          // ... your color palette
        },
      },
    },
  },
};
```

### Custom Styling

All components accept className props and work with your existing CSS:

```tsx
<Button className="my-custom-button-class">
  Custom Styled
</Button>

<Confirm
  className="custom-confirm-dialog"
  title="Custom Confirmation"
>
  This dialog can be styled with CSS
</Confirm>
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
npm run pub
```

## 📄 License

MIT - Feel free to use in your projects!

---

**Made with ❤️ by SHINEE** - Trying to make great UIs easily.
