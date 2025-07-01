import ReactDOM from "react-dom/client";
import Message from "../components/Message";

let messageId = 0;
const activeMessages = new Map<number, { root: ReactDOM.Root; wrapper: HTMLElement; timer?: number }>();
const messageQueue: Array<() => void> = [];
let isProcessingQueue = false;

// Enhanced configuration
interface MessageConfig {
  text?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top" | "bottom";
  closable?: boolean;
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  bordered?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  maxCount?: number;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  persistent?: boolean;
  priority?: "low" | "normal" | "high";
}

const defaultConfig: Required<Omit<MessageConfig, 'text' | 'description' | 'action' | 'onClose'>> = {
  type: "info",
  duration: 4000,
  position: "top-right",
  closable: true,
  size: "medium",
  showIcon: true,
  bordered: false,
  rounded: "lg",
  maxCount: 5,
  pauseOnHover: true,
  showProgress: false,
  persistent: false,
  priority: "normal"
};

const getContainer = (position: string) => {
  if (typeof document === "undefined") return;

  const containerId = `message-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.cssText = `
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      ${getPositionStyle(position)}
      display: flex;
      flex-direction: column;
      gap: 0px;
      max-height: 100vh;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(container);
  }

  return container;
};

const getPositionStyle = (position: string) => {
  const positions: Record<string, string> = {
    "top-right": "top: 1rem; right: 1rem; align-items: flex-end;",
    "top-left": "top: 1rem; left: 1rem; align-items: flex-start;", 
    "bottom-right": "bottom: 1rem; right: 1rem; align-items: flex-end; flex-direction: column-reverse;",
    "bottom-left": "bottom: 1rem; left: 1rem; align-items: flex-start; flex-direction: column-reverse;",
    "top": "top: 1rem; left: 50%; transform: translateX(-50%); align-items: center;",
    "bottom": "bottom: 1rem; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse;",
  };

  return positions[position] || positions["top-right"];
};

const enforceMaxCount = (position: string, maxCount: number) => {
  const container = getContainer(position);
  if (!container) return;

  const messages = Array.from(container.children) as HTMLElement[];
  if (messages.length >= maxCount) {
    // Remove oldest messages (from the bottom of the visual stack)
    const removeCount = messages.length - maxCount + 1;
    const messagesToRemove = position.includes('bottom') 
      ? messages.slice(-removeCount) // Remove from end for bottom positions
      : messages.slice(0, removeCount); // Remove from start for top positions
    
    messagesToRemove.forEach(messageElement => {
      const messageId = parseInt(messageElement.id.replace('message-', ''));
      // Add a slight delay between removals for smoother animation
      setTimeout(() => dismissMessage(messageId), Math.random() * 100);
    });
  }
};

const dismissMessage = (id: number) => {
  const messageData = activeMessages.get(id);
  if (!messageData) return;

  const { root, wrapper, timer } = messageData;
  
  if (timer) {
    clearTimeout(timer);
  }

  // Get the container and position to determine animation direction
  const container = wrapper.parentElement;
  const containerId = container?.id || '';
  const position = containerId.replace('message-container-', '');
  const isBottomPosition = position.includes('bottom');
  const messageIndex = Array.from(container?.children || []).indexOf(wrapper);

  // Trigger exit animation for the message being dismissed
  const messageElement = wrapper.querySelector('[data-message-element]') as HTMLElement;
  if (messageElement) {
    messageElement.style.opacity = '0';
    
    // Position-specific exit animation based on natural edge
    let exitTransform = '';
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        exitTransform = 'translateX(-100%) scale(0.95)'; // Move left
        break;
      case 'top-right':
      case 'bottom-right':
        exitTransform = 'translateX(100%) scale(0.95)'; // Move right
        break;
      case 'top':
        exitTransform = 'translateY(-100%) scale(0.95)'; // Move up
        break;
      case 'bottom':
        exitTransform = 'translateY(100%) scale(0.95)'; // Move down
        break;
      default:
        exitTransform = 'translateX(100%) scale(0.95)'; // Default to right
    }
    messageElement.style.transform = exitTransform;
    
    // Animate list movement for remaining messages
    setTimeout(() => {
      const siblings = Array.from(container?.children || []) as HTMLElement[];
      siblings.forEach((sibling, index) => {
        if (sibling !== wrapper) {
          const siblingMessage = sibling.querySelector('[data-message-element]') as HTMLElement;
          if (siblingMessage) {
            // Temporarily set transition for smooth movement
            siblingMessage.style.transition = 'transform 0.2s ease-out';
            
            // Calculate movement direction for list reflow
            const siblingIndex = siblings.indexOf(sibling);
            const removedIndex = siblings.indexOf(wrapper);
            
            // Smooth transition for remaining messages
            if (siblingIndex !== removedIndex) {
              siblingMessage.style.transform = 'translateX(0) translateY(0)';
            }
            
            // Reset transition after animation
            setTimeout(() => {
              siblingMessage.style.transition = '';
              siblingMessage.style.transform = '';
            }, 200);
          }
        }
      });
      
      // Collapse the wrapper height for smooth removal
      wrapper.style.height = wrapper.offsetHeight + 'px';
      wrapper.style.overflow = 'hidden';
      wrapper.style.transition = 'height 0.2s ease-out, margin 0.2s ease-out, padding 0.2s ease-out';
      
      requestAnimationFrame(() => {
        wrapper.style.height = '0px';
        wrapper.style.marginBottom = '0px';
        wrapper.style.paddingTop = '0px';
        wrapper.style.paddingBottom = '0px';
      });
    }, 100);
  }

  // Update z-index of remaining messages for proper stacking
  if (container) {
    const remainingMessages = Array.from(container.children) as HTMLElement[];
    remainingMessages.forEach((msg, index) => {
      if (msg !== wrapper) {
        msg.style.zIndex = (remainingMessages.length - index).toString();
      }
    });
  }

  setTimeout(() => {
    try {
      root.unmount();
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
      activeMessages.delete(id);
      
      // Position-specific reflow animation for remaining messages
      if (container) {
        requestAnimationFrame(() => {
          const messages = Array.from(container.children) as HTMLElement[];
          messages.forEach((msg, index) => {
            // Smooth settlement animation for all positions
            msg.style.transform = 'translateX(0) translateY(0)';
            msg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          });
        });
      }
    } catch (error) {
      console.warn('Error cleaning up message:', error);
    }
  }, 450); // Total animation time
};

const processMessageQueue = () => {
  if (isProcessingQueue || messageQueue.length === 0) return;
  
  isProcessingQueue = true;
  const nextMessage = messageQueue.shift();
  if (nextMessage) {
    nextMessage();
  }
  isProcessingQueue = false;
  
  // Process next if any
  if (messageQueue.length > 0) {
    setTimeout(processMessageQueue, 100);
  }
};

const message = (config: MessageConfig) => {
  const mergedConfig = { ...defaultConfig, ...config };
  const { position, maxCount, priority } = mergedConfig;

  const createMessage = () => {
    const container = getContainer(position);
    const id = ++messageId;

    if (!document || !container) return id;

    // Enforce max count
    enforceMaxCount(position, maxCount);

    const wrapper = document.createElement("div");
    wrapper.id = `message-${id}`;
    
    // Position-specific initial transform based on natural edge
    let initialTransform = '';
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        initialTransform = 'translateX(-100%)'; // Start from left
        break;
      case 'top-right':
      case 'bottom-right':
        initialTransform = 'translateX(100%)'; // Start from right
        break;
      case 'top':
        initialTransform = 'translateY(-100%)'; // Start from top
        break;
      case 'bottom':
        initialTransform = 'translateY(100%)'; // Start from bottom
        break;
      default:
        initialTransform = 'translateX(100%)'; // Default to right
    }
    
    wrapper.style.cssText = `
      pointer-events: auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: ${initialTransform};
      opacity: 0;
      margin-bottom: 8px;
      position: relative;
      z-index: ${1000 + id};
    `;

    // Insert based on priority and position behavior
    if (priority === "high") {
      container.insertBefore(wrapper, container.firstChild);
    } else {
      // For normal priority, add to the end (top of visual stack)
      if (position.includes('bottom')) {
        container.insertBefore(wrapper, container.firstChild);
      } else {
        container.appendChild(wrapper);
      }
    }

    const root = ReactDOM.createRoot(wrapper);

    const cleanup = () => {
      dismissMessage(id);
      mergedConfig.onClose?.();
    };

    let timer: number | undefined;
    if (mergedConfig.duration > 0 && !mergedConfig.persistent) {
      timer = window.setTimeout(cleanup, mergedConfig.duration);
    }

    activeMessages.set(id, { root, wrapper, timer });

    root.render(
      <Message
        {...mergedConfig}
        id={id}
        onClose={cleanup}
        onDismiss={() => dismissMessage(id)}
      />
    );

    // Trigger position-specific enter animation
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateX(0) translateY(0)';
      
      // Update positions of other messages to create space with smooth movement
      const allMessages = Array.from(container.children) as HTMLElement[];
      allMessages.forEach((msg, index) => {
        if (msg !== wrapper) {
          // Smooth transition for existing messages
          msg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          msg.style.transform = 'translateX(0) translateY(0)';
        }
      });
    });

    return id;
  };

  // Handle priority queueing
  if (priority === "high") {
    return createMessage();
  } else {
    messageQueue.push(createMessage);
    processMessageQueue();
    return messageId + 1; // Return expected ID
  }
};

// Enhanced static methods with better typing
const createMessageMethod = (type: "success" | "error" | "info" | "warning") => {
  return (config: string | Omit<MessageConfig, 'type'>): number => {
    if (typeof config === 'string') {
      return message({ text: config, type });
    }
    return message({ ...config, type });
  };
};

// Public API methods
const messageAPI = Object.assign(message, {
  success: createMessageMethod("success"),
  error: createMessageMethod("error"), 
  info: createMessageMethod("info"),
  warning: createMessageMethod("warning"),
  
  // Utility methods
  dismiss: (id: number) => dismissMessage(id),
  dismissAll: (position?: string) => {
    if (position) {
      const container = getContainer(position);
      if (container) {
        Array.from(container.children).forEach(child => {
          const id = parseInt((child as HTMLElement).id.replace('message-', ''));
          dismissMessage(id);
        });
      }
    } else {
      activeMessages.forEach((_, id) => dismissMessage(id));
    }
  },
  
  // Configuration
  config: (newDefaults: Partial<typeof defaultConfig>) => {
    Object.assign(defaultConfig, newDefaults);
  },
  
  // Get active message count
  getCount: (position?: string) => {
    if (position) {
      const container = document.getElementById(`message-container-${position}`);
      return container ? container.children.length : 0;
    }
    return activeMessages.size;
  }
});

export default messageAPI;
