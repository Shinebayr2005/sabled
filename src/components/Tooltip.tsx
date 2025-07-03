import React, { useState, useRef, useEffect } from 'react';

type TooltipPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(placement);
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

  // Smart positioning with collision detection
  const calculatePosition = (preferredPlacement: TooltipPlacement) => {
    if (!triggerRef.current || !tooltipRef.current) return { top: 0, left: 0, placement: preferredPlacement };

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let finalPlacement = preferredPlacement;

    const positions = {
      'top': () => ({
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
      }),
      'top-start': () => ({
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.left + scrollLeft
      }),
      'top-end': () => ({
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.right + scrollLeft - tooltipRect.width
      }),
      'bottom': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
      }),
      'bottom-start': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft
      }),
      'bottom-end': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.right + scrollLeft - tooltipRect.width
      }),
      'left': () => ({
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      }),
      'left-start': () => ({
        top: triggerRect.top + scrollTop,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      }),
      'left-end': () => ({
        top: triggerRect.bottom + scrollTop - tooltipRect.height,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      }),
      'right': () => ({
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + scrollLeft + offset
      }),
      'right-start': () => ({
        top: triggerRect.top + scrollTop,
        left: triggerRect.right + scrollLeft + offset
      }),
      'right-end': () => ({
        top: triggerRect.bottom + scrollTop - tooltipRect.height,
        left: triggerRect.right + scrollLeft + offset
      })
    };

    // Calculate position for preferred placement
    const pos = positions[preferredPlacement]();
    top = pos.top;
    left = pos.left;

    // Check for collisions and adjust if needed
    const margin = 8;
    
    // Check top collision
    if (top < margin) {
      if (preferredPlacement.startsWith('top')) {
        const bottomPlacement = preferredPlacement.replace('top', 'bottom') as TooltipPlacement;
        if (positions[bottomPlacement]) {
          const newPos = positions[bottomPlacement]();
          if (newPos.top + tooltipRect.height + margin <= viewportHeight) {
            top = newPos.top;
            finalPlacement = bottomPlacement;
          }
        }
      }
    }

    // Check bottom collision
    if (top + tooltipRect.height > viewportHeight - margin) {
      if (preferredPlacement.startsWith('bottom')) {
        const topPlacement = preferredPlacement.replace('bottom', 'top') as TooltipPlacement;
        if (positions[topPlacement]) {
          const newPos = positions[topPlacement]();
          if (newPos.top >= margin) {
            top = newPos.top;
            finalPlacement = topPlacement;
          }
        }
      }
    }

    // Check left collision
    if (left < margin) {
      if (preferredPlacement.startsWith('left')) {
        const rightPlacement = preferredPlacement.replace('left', 'right') as TooltipPlacement;
        if (positions[rightPlacement]) {
          const newPos = positions[rightPlacement]();
          if (newPos.left + tooltipRect.width + margin <= viewportWidth) {
            left = newPos.left;
            finalPlacement = rightPlacement;
          }
        }
      } else {
        left = margin;
      }
    }

    // Check right collision
    if (left + tooltipRect.width > viewportWidth - margin) {
      if (preferredPlacement.startsWith('right')) {
        const leftPlacement = preferredPlacement.replace('right', 'left') as TooltipPlacement;
        if (positions[leftPlacement]) {
          const newPos = positions[leftPlacement]();
          if (newPos.left >= margin) {
            left = newPos.left;
            finalPlacement = leftPlacement;
          }
        }
      } else {
        left = viewportWidth - tooltipRect.width - margin;
      }
    }

    // Final boundary checks
    if (top < margin) top = margin;
    if (top + tooltipRect.height > viewportHeight - margin) {
      top = viewportHeight - tooltipRect.height - margin;
    }
    if (left < margin) left = margin;
    if (left + tooltipRect.width > viewportWidth - margin) {
      left = viewportWidth - tooltipRect.width - margin;
    }

    return { top, left, placement: finalPlacement };
  };

  useEffect(() => {
    if (shouldShow && triggerRef.current && tooltipRef.current) {
      const result = calculatePosition(placement);
      setPosition({ top: result.top, left: result.left });
      setActualPlacement(result.placement);
    }
  }, [shouldShow, placement, offset]);

  const showTooltip = () => {
    if (disabled || isManuallyControlled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    showTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(true);
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
      setIsAnimating(false);
      // Add a small delay to allow exit animation
      setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, 200);
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
    
    switch (actualPlacement) {
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

  // Animation direction based on placement
  const getAnimationDirection = () => {
    switch (actualPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return 'animate-slide-down';
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return 'animate-slide-up';
      case 'left':
      case 'left-start':
      case 'left-end':
        return 'animate-slide-right';
      case 'right':
      case 'right-start':
      case 'right-end':
        return 'animate-slide-left';
      default:
        return 'animate-fade-in';
    }
  };

  // Transform origin for smooth animations
  const getTransformOrigin = () => {
    switch (actualPlacement) {
      case 'top':
        return 'bottom center';
      case 'top-start':
        return 'bottom left';
      case 'top-end':
        return 'bottom right';
      case 'bottom':
        return 'top center';
      case 'bottom-start':
        return 'top left';
      case 'bottom-end':
        return 'top right';
      case 'left':
        return 'right center';
      case 'left-start':
        return 'right top';
      case 'left-end':
        return 'right bottom';
      case 'right':
        return 'left center';
      case 'right-start':
        return 'left top';
      case 'right-end':
        return 'left bottom';
      default:
        return 'center center';
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
            ${interactive ? 'cursor-pointer' : ''}
            break-words
            transition-all duration-200 ease-out
            ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            ${getAnimationDirection()}
          `}
          style={{
            top: position.top,
            left: position.left,
            maxWidth: maxWidth,
            transformOrigin: getTransformOrigin(),
            pointerEvents: interactive ? 'auto' : 'none'
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          aria-hidden={!shouldShow}
          data-placement={actualPlacement}
        >
          {content}
          {showArrow && <div className={getArrowStyles()} />}
        </div>
      )}
    </>
  );
};

export default Tooltip;
