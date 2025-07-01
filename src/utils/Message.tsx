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
      gap: 8px;
      max-height: 100vh;
      overflow: hidden;
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

  const messages = Array.from(container.children);
  if (messages.length >= maxCount) {
    // Remove oldest messages
    const removeCount = messages.length - maxCount + 1;
    for (let i = 0; i < removeCount; i++) {
      const oldestMessage = messages[i] as HTMLElement;
      const messageId = parseInt(oldestMessage.id.replace('message-', ''));
      dismissMessage(messageId);
    }
  }
};

const dismissMessage = (id: number) => {
  const messageData = activeMessages.get(id);
  if (!messageData) return;

  const { root, wrapper, timer } = messageData;
  
  if (timer) {
    clearTimeout(timer);
  }

  // Trigger exit animation
  const messageElement = wrapper.querySelector('[data-message-element]') as HTMLElement;
  if (messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(-10px) scale(0.95)';
  }

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
  }, 300);
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
    wrapper.style.cssText = `
      pointer-events: auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(-10px);
      opacity: 0;
    `;

    // Insert based on priority
    if (priority === "high") {
      container.insertBefore(wrapper, container.firstChild);
    } else {
      container.appendChild(wrapper);
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

    // Trigger enter animation
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
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
