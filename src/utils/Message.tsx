import ReactDOM from "react-dom/client";
import Message from "../components/Message";

let messageId = 0;
const activeMessages = new Map<number, { root: ReactDOM.Root; wrapper: HTMLElement }>();
const messageQueue: Array<() => void> = [];
let isProcessingQueue = false;

// Enhanced configuration
interface MessageConfig {
  text?: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  variant?: "default" | "solid" | "minimal" | "outlined" | "ghost";
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

// Type for valid positions
type ValidPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top" | "bottom";

const VALID_POSITIONS: ValidPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top', 'bottom'];

const defaultConfig: Required<Omit<MessageConfig, 'text' | 'description' | 'action' | 'onClose'>> = {
  type: "info",
  variant: "default",
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
      gap: 8px;
      max-height: 100vh;
      overflow: visible;
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
  if (!container || maxCount <= 0) return;

  const messages = Array.from(container.children) as HTMLElement[];
  if (messages.length >= maxCount) {
    // Remove oldest messages (from the bottom of the visual stack)
    const removeCount = messages.length - maxCount + 1;
    const messagesToRemove = position.includes('bottom') 
      ? messages.slice(-removeCount) // Remove from end for bottom positions
      : messages.slice(0, removeCount); // Remove from start for top positions
    
    messagesToRemove.forEach((messageElement, index) => {
      try {
        const messageIdStr = messageElement.id.replace('message-', '');
        const messageId = parseInt(messageIdStr, 10);
        
        if (!isNaN(messageId)) {
          // Add a slight delay between removals for smoother animation
          setTimeout(() => dismissMessage(messageId), index * 50);
        }
      } catch (error) {
        console.warn('Error parsing message ID for removal:', error);
      }
    });
  }
};

const dismissMessage = (id: number) => {
  const messageData = activeMessages.get(id);
  if (!messageData) return;

  const { root, wrapper } = messageData;

  // Get the container and position to determine animation direction
  const container = wrapper.parentElement;
  const containerId = container?.id || '';
  const position = containerId.replace('message-container-', '');

  // Simplified and ultra-smooth exit animation
  const messageElement = wrapper.querySelector('[data-message-element]') as HTMLElement;
  if (messageElement) {
    // Position-specific exit animations with consistent timing
    let exitTransform = '';
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        exitTransform = 'translateX(-100%) scale(0.95)';
        break;
      case 'top-right':
      case 'bottom-right':
        exitTransform = 'translateX(100%) scale(0.95)';
        break;
      case 'top':
        exitTransform = 'translateY(-100%) scale(0.95)';
        break;
      case 'bottom':
        exitTransform = 'translateY(100%) scale(0.95)';
        break;
      default:
        exitTransform = 'translateX(100%) scale(0.95)';
    }
    
    // Apply smooth exit animation
    messageElement.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    messageElement.style.transform = exitTransform;
    messageElement.style.opacity = '0';
  }

  // Capture positions for reflow before DOM changes
  const siblings = Array.from(container?.children || []) as HTMLElement[];
  const messagePositions = new Map();
  
  siblings.forEach((sibling) => {
    if (sibling !== wrapper) {
      const rect = sibling.getBoundingClientRect();
      messagePositions.set(sibling, { top: rect.top, left: rect.left });
    }
  });

  // Smooth wrapper collapse
  wrapper.style.height = wrapper.offsetHeight + 'px';
  wrapper.style.overflow = 'hidden';
  wrapper.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Start collapse animation
  requestAnimationFrame(() => {
    wrapper.style.height = '0px';
    wrapper.style.marginBottom = '0px';
    
    // Animate remaining messages to new positions
    setTimeout(() => {
      siblings.forEach((sibling) => {
        if (sibling !== wrapper && messagePositions.has(sibling)) {
          const siblingMessage = sibling.querySelector('[data-message-element]') as HTMLElement;
          if (siblingMessage) {
            const oldPosition = messagePositions.get(sibling);
            const newRect = sibling.getBoundingClientRect();
            
            const deltaY = oldPosition.top - newRect.top;
            const deltaX = oldPosition.left - newRect.left;
            
            // Only animate if there's movement
            if (Math.abs(deltaY) > 1 || Math.abs(deltaX) > 1) {
              siblingMessage.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;
              siblingMessage.style.transition = 'none';
              
              // Force reflow then animate
              siblingMessage.offsetHeight;
              
              siblingMessage.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
              siblingMessage.style.transform = 'translateX(0) translateY(0)';
              
              // Clean up
              setTimeout(() => {
                siblingMessage.style.transition = '';
                siblingMessage.style.transform = '';
              }, 400);
            }
          }
        }
      });
    }, 50);
  });

  // Clean up after animation completes
  setTimeout(() => {
    try {
      root.unmount();
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
      activeMessages.delete(id);
    } catch (error) {
      console.warn('Error cleaning up message:', error);
    }
  }, 400);
};

const processMessageQueue = () => {
  if (isProcessingQueue || messageQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  try {
    const nextMessage = messageQueue.shift();
    if (nextMessage) {
      nextMessage();
    }
  } catch (error) {
    console.warn('Error processing message queue:', error);
  } finally {
    isProcessingQueue = false;
  }
  
  // Process next if any
  if (messageQueue.length > 0) {
    setTimeout(processMessageQueue, 100);
  }
};

const message = (config: MessageConfig) => {
  // Input validation
  if (!config || typeof config !== 'object') {
    console.warn('Invalid message config provided');
    return -1;
  }

  const mergedConfig = { ...defaultConfig, ...config };
  const { position, maxCount, priority } = mergedConfig;

  // Validate position
  if (VALID_POSITIONS.indexOf(position as ValidPosition) === -1) {
    console.warn(`Invalid position "${position}". Using default "top-right".`);
    mergedConfig.position = 'top-right';
  }

  const createMessage = () => {
    try {
      const container = getContainer(mergedConfig.position);
      const id = ++messageId;

      if (!document || !container) return id;

      // Enforce max count
      enforceMaxCount(mergedConfig.position, maxCount);

      const wrapper = document.createElement("div");
      wrapper.id = `message-${id}`;
      
      // Position-specific initial transform based on natural edge
      let initialTransform = '';
      switch (mergedConfig.position) {
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
        if (mergedConfig.position.includes('bottom')) {
          container.insertBefore(wrapper, container.firstChild);
        } else {
          container.appendChild(wrapper);
        }
      }

      const root = ReactDOM.createRoot(wrapper);

      const cleanup = () => {
        mergedConfig.onClose?.();
      };

      // Let the component handle its own auto-dismiss timing
      // The utility only handles cleanup when the component calls onDismiss
      activeMessages.set(id, { root, wrapper });

      root.render(
        <Message
          {...mergedConfig}
          id={id}
          onClose={() => dismissMessage(id)}
          onDismiss={cleanup}
        />
      );

      // Simplified smooth entry animation
      requestAnimationFrame(() => {
        // Capture positions before adding new message
        const existingMessages = Array.from(container.children).filter(child => child !== wrapper) as HTMLElement[];
        const messagePositions = new Map();
        
        existingMessages.forEach((msg) => {
          const rect = msg.getBoundingClientRect();
          messagePositions.set(msg, { top: rect.top, left: rect.left });
        });
        
        // Show the new message
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateX(0) translateY(0)';
        
        // Animate existing messages to new positions
        requestAnimationFrame(() => {
          existingMessages.forEach((msg) => {
            if (messagePositions.has(msg)) {
              const messageElement = msg.querySelector('[data-message-element]') as HTMLElement;
              if (messageElement) {
                const oldPosition = messagePositions.get(msg);
                const newRect = msg.getBoundingClientRect();
                
                const deltaY = oldPosition.top - newRect.top;
                const deltaX = oldPosition.left - newRect.left;
                
                // Only animate if there's actual movement
                if (Math.abs(deltaY) > 1 || Math.abs(deltaX) > 1) {
                  messageElement.style.transform = `translateX(${deltaX}px) translateY(${deltaY}px)`;
                  messageElement.style.transition = 'none';
                  
                  // Force reflow
                  messageElement.offsetHeight;
                  
                  messageElement.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                  messageElement.style.transform = 'translateX(0) translateY(0)';
                  
                  // Clean up
                  setTimeout(() => {
                    messageElement.style.transition = '';
                    messageElement.style.transform = '';
                  }, 400);
                }
              }
            }
          });
        });
      });

      return id;
    } catch (error) {
      console.error('Error creating message:', error);
      return -1;
    }
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
          try {
            const idStr = (child as HTMLElement).id.replace('message-', '');
            const id = parseInt(idStr, 10);
            if (!isNaN(id)) {
              dismissMessage(id);
            }
          } catch (error) {
            console.warn('Error dismissing message:', error);
          }
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
  },
  
  // Check if messages can be added (respects maxCount)
  canAddMessage: (position: ValidPosition = 'top-right', maxCount = 5) => {
    const container = document.getElementById(`message-container-${position}`);
    const currentCount = container ? container.children.length : 0;
    return currentCount < maxCount;
  },
  
  // Clear all messages from all positions
  clear: () => {
    VALID_POSITIONS.forEach(position => {
      const container = document.getElementById(`message-container-${position}`);
      if (container) {
        Array.from(container.children).forEach(child => {
          const id = parseInt((child as HTMLElement).id.replace('message-', ''), 10);
          if (!isNaN(id)) {
            dismissMessage(id);
          }
        });
      }
    });
  }
});

export default messageAPI;
