import React, { useState, useRef, useEffect } from 'react';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
type TooltipVariant = 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'error';
type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';
type TooltipSize = 'sm' | 'md' | 'lg';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  trigger?: TooltipTrigger | TooltipTrigger[];
  disabled?: boolean;
  delay?: number;
  hideDelay?: number;
  showArrow?: boolean;
  interactive?: boolean;
  maxWidth?: string;
  offset?: number;
  className?: string;
  contentClassName?: string;
  onShow?: () => void;
  onHide?: () => void;
  visible?: boolean; // For manual control
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  trigger = 'hover',
  disabled = false,
  delay = 300,
  hideDelay = 0,
  showArrow = true,
  interactive = false,
  maxWidth = '320px',
  offset = 8,
  className = '',
  contentClassName = '',
  onShow,
  onHide,
  visible
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const isManuallyControlled = visible !== undefined;
  const shouldShow = isManuallyControlled ? visible : isVisible;

  const variantClasses = {
    dark: 'bg-gray-900 text-white border-gray-800',
    light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
    primary: 'bg-blue-600 text-white border-blue-600',
    success: 'bg-green-600 text-white border-green-600',
    warning: 'bg-yellow-500 text-white border-yellow-500',
    error: 'bg-red-600 text-white border-red-600'
  };

  const arrowClasses = {
    dark: 'border-gray-900',
    light: 'border-gray-200',
    primary: 'border-blue-600',
    success: 'border-green-600',
    warning: 'border-yellow-500',
    error: 'border-red-600'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  useEffect(() => {
    if (shouldShow && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          top = triggerRect.top + scrollTop - tooltipRect.height - offset;
          if (placement === 'top-start') {
            left = triggerRect.left + scrollLeft;
          } else if (placement === 'top-end') {
            left = triggerRect.right + scrollLeft - tooltipRect.width;
          } else {
            left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2;
          }
          break;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          top = triggerRect.bottom + scrollTop + offset;
          if (placement === 'bottom-start') {
            left = triggerRect.left + scrollLeft;
          } else if (placement === 'bottom-end') {
            left = triggerRect.right + scrollLeft - tooltipRect.width;
          } else {
            left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2;
          }
          break;
        case 'left':
        case 'left-start':
        case 'left-end':
          left = triggerRect.left + scrollLeft - tooltipRect.width - offset;
          if (placement === 'left-start') {
            top = triggerRect.top + scrollTop;
          } else if (placement === 'left-end') {
            top = triggerRect.bottom + scrollTop - tooltipRect.height;
          } else {
            top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2;
          }
          break;
        case 'right':
        case 'right-start':
        case 'right-end':
          left = triggerRect.right + scrollLeft + offset;
          if (placement === 'right-start') {
            top = triggerRect.top + scrollTop;
          } else if (placement === 'right-end') {
            top = triggerRect.bottom + scrollTop - tooltipRect.height;
          } else {
            top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2;
          }
          break;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 0) left = 8;
      if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
      if (top < 0) top = 8;
      if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 8;

      setPosition({ top, left });
    }
  }, [shouldShow, placement, offset]);

  const showTooltip = () => {
    if (disabled || isManuallyControlled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    showTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      onShow?.();
    }, delay);
  };

  const hideTooltip = () => {
    if (disabled || isManuallyControlled) return;
    
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    const actualHideDelay = hideDelay || 0;
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      onHide?.();
    }, actualHideDelay);
  };

  const handleClick = () => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('click') !== -1) {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('focus') !== -1) {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('focus') !== -1) {
      hideTooltip();
    }
  };

  const handleMouseEnter = () => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('hover') !== -1) {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('hover') !== -1) {
      hideTooltip();
    }
  };

  const handleTooltipMouseEnter = () => {
    if (interactive && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    if (interactive && triggers.indexOf('hover') !== -1) {
      hideTooltip();
    }
  };

  const getArrowStyles = () => {
    if (!showArrow) return '';
    
    const baseClasses = 'absolute w-0 h-0 border-4 border-solid border-transparent';
    
    switch (placement) {
      case 'top':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-t-4 ${arrowClasses[variant]}`;
      case 'top-start':
        return `${baseClasses} top-full left-4 border-t-4 ${arrowClasses[variant]}`;
      case 'top-end':
        return `${baseClasses} top-full right-4 border-t-4 ${arrowClasses[variant]}`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 border-b-4 ${arrowClasses[variant]}`;
      case 'bottom-start':
        return `${baseClasses} bottom-full left-4 border-b-4 ${arrowClasses[variant]}`;
      case 'bottom-end':
        return `${baseClasses} bottom-full right-4 border-b-4 ${arrowClasses[variant]}`;
      case 'left':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 border-l-4 ${arrowClasses[variant]}`;
      case 'left-start':
        return `${baseClasses} left-full top-4 border-l-4 ${arrowClasses[variant]}`;
      case 'left-end':
        return `${baseClasses} left-full bottom-4 border-l-4 ${arrowClasses[variant]}`;
      case 'right':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 border-r-4 ${arrowClasses[variant]}`;
      case 'right-start':
        return `${baseClasses} right-full top-4 border-r-4 ${arrowClasses[variant]}`;
      case 'right-end':
        return `${baseClasses} right-full bottom-4 border-r-4 ${arrowClasses[variant]}`;
      default:
        return baseClasses;
    }
  };

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        tabIndex={triggers.indexOf('focus') !== -1 ? 0 : undefined}
      >
        {children}
      </div>

      {shouldShow && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50 font-medium rounded-lg border
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${contentClassName}
            transition-all duration-200 ease-in-out
            transform scale-100 opacity-100
            break-words
            ${interactive ? 'cursor-pointer' : ''}
            animate-in fade-in zoom-in-95
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out
            data-[state=closed]:zoom-out-95
          `}
          style={{
            top: position.top,
            left: position.left,
            maxWidth: maxWidth,
            animationDuration: '150ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          aria-hidden={!shouldShow}
        >
          {content}
          {showArrow && <div className={getArrowStyles()} />}
        </div>
      )}
    </>
  );
};

export default Tooltip;
