function injectStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
  
    // Resolve the path dynamically for both CJS and ESM builds
    if (process.env.NODE_ENV === 'development') {
      // Use relative path in development
      link.href = './styles/index.css';
    } else {
      // Use absolute path for production builds
      link.href = new URL('./index.css', import.meta.url).href;
    }
  
    document.head.appendChild(link);
  }
  
  injectStyles();

export { default as MyComponent } from './components/MyComponent';
export { default as Button } from './components/Button';
export { default as Message } from './utils/Message';
