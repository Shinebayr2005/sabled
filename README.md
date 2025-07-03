# 🎨 Sabled UI Library Demo Version

A modern React component library designed for practical, accessible, and beautiful user interfaces. Built with TailwindCSS and TypeScript, Sabled offers zero-setup APIs for Confirm dialogs and Message notifications, making it easy to create production-ready UIs with minimal configuration.

## ✨ Features

- 🎯 **15+ Production-Ready Components** - Featuring powerful Confirm dialogs and Message notifications
- 🚀 **Zero Setup Required** - No providers, context, or configuration needed
- 🪄 **No CSS Imports Needed** - Styles are automatically included; just use the components
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
  const handleDelete = () => {
    Confirm({
      title: "Delete Item",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: () => {
        // Perform delete action
        console.log("Item deleted");
        Message.success({
          text: "Item deleted successfully!",
          variant: "solid", // NEW: Use solid variant for emphasis
          showProgress: true,
          action: {
            label: "Undo",
            onClick: () => Message.info({
              text: "Undo feature coming soon!",
              variant: "minimal" // NEW: Use minimal variant for subtle info
            })
          }
        });
      },
      onCancel: () => {
        console.log("Delete cancelled");
        Message.info({
          text: "Delete operation cancelled",
          variant: "ghost" // NEW: Use ghost variant for non-intrusive feedback
        });
      },
    });
  };

  const handleSearch = (value: string) => {
    console.log("Searching for:", value);
    if (value.trim()) {
      Message.info({
        text: `Searching for: ${value}`,
        variant: "outlined", // NEW: Use outlined variant for clean look
        description: "Please wait while we search...",
        showProgress: true,
        pauseOnHover: true
      });
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
            onChange={handleSearch}
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

## 🎨 Message Variants (NEW!)

The Message component now supports 5 different visual variants to match your design needs:

```tsx
// Default - Standard appearance
Message.success("Standard success message");

// Solid - Bold, high contrast for critical messages
Message.error({ text: "Critical error!", variant: "solid" });

// Minimal - Subtle, low visual impact
Message.info({ text: "Auto-saved", variant: "minimal" });

// Outlined - Clean, professional border design
Message.warning({ text: "Review required", variant: "outlined" });

// Ghost - Transparent, non-intrusive
Message.success({ text: "Connected", variant: "ghost" });
```

**Made with ❤️ by SHINEE** - Trying to make great UIs easily.
