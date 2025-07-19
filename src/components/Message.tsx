import React, { useEffect, useState, useRef, useMemo } from "react";

export interface MessageProps {
  id: number;
  text?: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  variant?: "default" | "solid" | "minimal" | "outlined" | "ghost";
  duration?: number;
  onClose: () => void;
  onDismiss?: () => void;
  closable?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top" | "bottom";
  showIcon?: boolean;
  bordered?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  pauseOnHover?: boolean;
  showProgress?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  maxCount?: number;
  priority?: "low" | "normal" | "high";
}

const Message: React.FC<MessageProps> = ({
  id,
  text,
  description,
  type,
  variant = "default",
  duration = 4000,
  onClose,
  onDismiss,
  closable = true,
  size = "medium",
  className = "",
  style,
  position = "top-right",
  showIcon = true,
  bordered = false,
  rounded = "lg",
  pauseOnHover = true,
  showProgress = false,
  action,
  persistent = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const progressTimerRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const remainingTimeRef = useRef<number>(duration);
  const messageElementRef = useRef<HTMLDivElement>(null);

  // Memoize smooth animation configurations
  const animationDirections = useMemo(() => {
    let entryDirection = '';
    let exitTransform = '';
    
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        entryDirection = '-translate-x-full';
        exitTransform = 'translateX(-100%) scale(0.95)';
        break;
      case 'top-right':
      case 'bottom-right':
        entryDirection = 'translate-x-full';
        exitTransform = 'translateX(100%) scale(0.95)';
        break;
      case 'top':
        entryDirection = '-translate-y-full';
        exitTransform = 'translateY(-100%) scale(0.95)';
        break;
      case 'bottom':
        entryDirection = 'translate-y-full';
        exitTransform = 'translateY(100%) scale(0.95)';
        break;
      default:
        entryDirection = 'translate-x-full';
        exitTransform = 'translateX(100%) scale(0.95)';
    }
    
    return { entryDirection, exitTransform };
  }, [position]);

  // Simple smooth initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (isExiting) return; // Prevent multiple close calls
    
    setIsExiting(true);
    
    // Clear any running timers immediately
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (progressTimerRef.current) {
      cancelAnimationFrame(progressTimerRef.current);
      progressTimerRef.current = undefined;
    }
    
    // Let utility handle the animation smoothly
    onClose();
  };

  // Auto-dismiss timer with pause/resume capability
  useEffect(() => {
    if (persistent || duration <= 0 || isExiting) return;

    const startTimer = () => {
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        // Use the same handleClose function for consistent animation
        handleClose();
      }, remainingTimeRef.current);

      // Progress bar animation
      if (showProgress) {
        const startProgress = (remainingTimeRef.current / duration) * 100;
        setProgress(startProgress);
        
        const updateProgress = () => {
          if (isExiting) return; // Stop if exiting
          
          const elapsed = Date.now() - (startTimeRef.current || 0);
          const remaining = Math.max(0, remainingTimeRef.current - elapsed);
          const newProgress = (remaining / duration) * 100;
          setProgress(newProgress);

          if (remaining > 0 && !isPaused && !isExiting) {
            progressTimerRef.current = window.requestAnimationFrame(updateProgress);
          }
        };
        
        progressTimerRef.current = window.requestAnimationFrame(updateProgress);
      }
    };

    const pauseTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - (startTimeRef.current || 0);
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
      if (progressTimerRef.current) {
        cancelAnimationFrame(progressTimerRef.current);
      }
    };

    if (isPaused) {
      pauseTimer();
    } else {
      startTimer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) cancelAnimationFrame(progressTimerRef.current);
    };
  }, [duration, onClose, isPaused, persistent, showProgress]);

  const handleMouseEnter = () => {
    if (pauseOnHover && !persistent) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && !persistent) {
      setIsPaused(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && closable) {
      handleClose();
    }
  };

  const getExitDirection = () => {
    // For exit, we want the opposite direction of entry
    switch (position) {
      case 'top-left':
      case 'bottom-left':
        return '-translate-x-full'; // Exit to the left
      case 'top-right':
      case 'bottom-right':
        return 'translate-x-full'; // Exit to the right
      case 'top':
        return '-translate-y-full'; // Exit upward
      case 'bottom':
        return 'translate-y-full'; // Exit downward
      default:
        return 'translate-x-full'; // Default exit to the right
    }
  };

  const getEntryDirection = () => animationDirections.entryDirection;

  const getTypeStyle = () => {
    const shadowStyles = "shadow-lg backdrop-blur-sm";
    
    // Base color schemes for each type
    const colorSchemes = {
      success: {
        default: `bg-green-50/95 text-green-900 border-green-500 ${shadowStyles}`,
        solid: `bg-green-600 text-white border-green-600 ${shadowStyles}`,
        minimal: `bg-green-50/50 text-green-800 border-transparent`,
        outlined: `bg-white/95 text-green-700 border-green-500 ${shadowStyles}`,
        ghost: `bg-transparent text-green-700 border-transparent hover:bg-green-50/50`
      },
      error: {
        default: `bg-red-50/95 text-red-900 border-red-500 ${shadowStyles}`,
        solid: `bg-red-600 text-white border-red-600 ${shadowStyles}`,
        minimal: `bg-red-50/50 text-red-800 border-transparent`,
        outlined: `bg-white/95 text-red-700 border-red-500 ${shadowStyles}`,
        ghost: `bg-transparent text-red-700 border-transparent hover:bg-red-50/50`
      },
      info: {
        default: `bg-blue-50/95 text-blue-900 border-blue-500 ${shadowStyles}`,
        solid: `bg-blue-600 text-white border-blue-600 ${shadowStyles}`,
        minimal: `bg-blue-50/50 text-blue-800 border-transparent`,
        outlined: `bg-white/95 text-blue-700 border-blue-500 ${shadowStyles}`,
        ghost: `bg-transparent text-blue-700 border-transparent hover:bg-blue-50/50`
      },
      warning: {
        default: `bg-yellow-50/95 text-yellow-900 border-yellow-500 ${shadowStyles}`,
        solid: `bg-yellow-600 text-white border-yellow-600 ${shadowStyles}`,
        minimal: `bg-yellow-50/50 text-yellow-800 border-transparent`,
        outlined: `bg-white/95 text-yellow-700 border-yellow-500 ${shadowStyles}`,
        ghost: `bg-transparent text-yellow-700 border-transparent hover:bg-yellow-50/50`
      }
    };

    // Determine border style based on variant and bordered prop
    const getBorderStyle = () => {
      if (variant === 'minimal' || variant === 'ghost') return '';
      if (variant === 'outlined') return 'border-2';
      return bordered ? 'border-2' : 'border-l-4';
    };

    const borderStyle = getBorderStyle();
    const colorStyle = colorSchemes[type][variant] || colorSchemes[type].default;
    
    return `${colorStyle} ${borderStyle}`;
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return "text-xs p-3 min-w-[200px] max-w-[320px]";
      case "large":
        return "text-base p-5 min-w-[280px] max-w-[500px]";
      case "medium":
      default:
        return "text-sm p-4 min-w-[240px] max-w-[400px]";
    }
  };

  const getRoundedStyle = () => {
    const roundedMap = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };
    return roundedMap[rounded];
  };

  const getTypeIcon = () => {
    if (!showIcon) return null;

    const iconMap = {
      success: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    };

    // Icon styling based on variant
    const getIconStyles = () => {
      const baseIconClass = "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3";
      
      switch (variant) {
        case 'solid':
          // For solid variant, use white icons with colored background
          return {
            container: `${baseIconClass} ${
              type === "success" ? "bg-green-700" :
              type === "error" ? "bg-red-700" :
              type === "info" ? "bg-blue-700" : "bg-yellow-700"
            }`,
            icon: "text-white"
          };
        case 'minimal':
        case 'ghost':
          // For minimal and ghost variants, simpler styling
          return {
            container: `${baseIconClass} ${
              type === "success" ? "bg-green-100" :
              type === "error" ? "bg-red-100" :
              type === "info" ? "bg-blue-100" : "bg-yellow-100"
            }`,
            icon: type === "success" ? "text-green-600" :
                  type === "error" ? "text-red-600" :
                  type === "info" ? "text-blue-600" : "text-yellow-600"
          };
        case 'outlined':
          // For outlined variant, subtle background with border
          return {
            container: `${baseIconClass} border-2 ${
              type === "success" ? "bg-green-50 border-green-200" :
              type === "error" ? "bg-red-50 border-red-200" :
              type === "info" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"
            }`,
            icon: type === "success" ? "text-green-600" :
                  type === "error" ? "text-red-600" :
                  type === "info" ? "text-blue-600" : "text-yellow-600"
          };
        default:
          // Default variant styling
          return {
            container: `${baseIconClass} ${
              type === "success" ? "bg-green-100" :
              type === "error" ? "bg-red-100" :
              type === "info" ? "bg-blue-100" : "bg-yellow-100"
            }`,
            icon: type === "success" ? "text-green-600" :
                  type === "error" ? "text-red-600" :
                  type === "info" ? "text-blue-600" : "text-yellow-600"
          };
      }
    };

    const iconStyles = getIconStyles();

    return (
      <div className={iconStyles.container}>
        <div className={iconStyles.icon}>
          {iconMap[type]}
        </div>
      </div>
    );
  };

  const getProgressBarColor = () => {
    switch (type) {
      case "success": return "bg-green-500";
      case "error": return "bg-red-500";
      case "info": return "bg-blue-500";
      case "warning": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      ref={messageElementRef}
      data-message-element
      data-message-id={id}
      className={`
        ${className}
        transform transition-all duration-300 ease-out
        ${visible 
          ? "opacity-100 translate-x-0 translate-y-0 scale-100" 
          : `opacity-0 ${isExiting ? getExitDirection() : getEntryDirection()} scale-95`
        }
        ${getTypeStyle()}
        ${getSizeStyle()}
        ${getRoundedStyle()}
        relative overflow-hidden
        will-change-transform
      `}
      style={{
        ...style,
        // Let the utility handle all animations
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={closable ? 0 : -1}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby={text ? `message-title-${id}` : undefined}
      aria-describedby={description ? `message-desc-${id}` : undefined}
    >
      {/* Progress bar */}
      {showProgress && !persistent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${getProgressBarColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 min-w-0">
          {getTypeIcon()}
          <div className="flex flex-col flex-1 min-w-0">
            {text && (
              <div 
                id={`message-title-${id}`}
                className="font-semibold leading-tight text-current"
              >
                {text}
              </div>
            )}
            {description && (
              <div 
                id={`message-desc-${id}`}
                className="text-sm opacity-90 mt-1 leading-relaxed"
              >
                {description}
              </div>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 rounded"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        
        {closable && (
          <button
            type="button"
            className={`ml-4 transition-opacity flex-shrink-0 w-6 h-6 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50 ${
              variant === 'solid' 
                ? 'text-white/80 hover:text-white hover:bg-white/20' 
                : 'text-current opacity-60 hover:opacity-100 hover:bg-black/10'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
