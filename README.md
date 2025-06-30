# 🎨 Sabled UI Library Demo Version

A modern React component library designed for practical, accessible, and beautiful user interfaces. Built with TailwindCSS and TypeScript, Sabled offers zero-setup APIs for Confirm dialogs and Message notifications, making it easy to create production-ready UIs with minimal configuration.

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

**Made with ❤️ by SHINEE** - Trying to make great UIs easily.
