import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

type TooltipPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
type TooltipVariant = 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';
type TooltipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TooltipAnimation = 'fade' | 'scale' | 'slide' | 'bounce';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  animation?: TooltipAnimation;
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
  arrowClassName?: string;
  onShow?: () => void;
  onHide?: () => void;
  visible?: boolean; // For manual control
  zIndex?: number;
  boundary?: 'viewport' | 'window' | HTMLElement;
  fallbackPlacements?: TooltipPlacement[];
  followCursor?: boolean;
  hideOnClick?: boolean;
  duration?: number;
  appendTo?: HTMLElement | 'body';
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  variant = 'dark',
  size = 'md',
  animation = 'scale',
  trigger = 'hover',
  disabled = false,
  delay = 100,
  hideDelay = 100,
  showArrow = true,
  interactive = false,
  maxWidth = '320px',
  offset = 8,
  className = '',
  contentClassName = '',
  arrowClassName = '',
  onShow,
  onHide,
  visible,
  zIndex = 9999,
  boundary = 'viewport',
  fallbackPlacements = [],
  followCursor = false,
  hideOnClick = false,
  duration = 0,
  appendTo = 'body'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(placement);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const durationTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseTrackingRef = useRef<boolean>(false);

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const isManuallyControlled = visible !== undefined;
  const shouldShow = isManuallyControlled ? visible : isVisible;

  // Enhanced variant classes with better styling
  const variantClasses = useMemo(() => ({
    dark: 'bg-gray-900/95 text-white border-gray-700 backdrop-blur-sm shadow-xl',
    light: 'bg-white/95 text-gray-900 border-gray-300 backdrop-blur-sm shadow-xl',
    primary: 'bg-blue-600/95 text-white border-blue-500 backdrop-blur-sm shadow-xl',
    success: 'bg-green-600/95 text-white border-green-500 backdrop-blur-sm shadow-xl',
    warning: 'bg-yellow-500/95 text-white border-yellow-400 backdrop-blur-sm shadow-xl',
    error: 'bg-red-600/95 text-white border-red-500 backdrop-blur-sm shadow-xl',
    info: 'bg-blue-500/95 text-white border-blue-400 backdrop-blur-sm shadow-xl'
  }), []);

  const arrowClasses = useMemo(() => ({
    dark: 'border-gray-900',
    light: 'border-gray-300',
    primary: 'border-blue-600',
    success: 'border-green-600',
    warning: 'border-yellow-500',
    error: 'border-red-600',
    info: 'border-blue-500'
  }), []);

  const sizeClasses = useMemo(() => ({
    xs: 'px-2 py-1 text-xs leading-tight',
    sm: 'px-2.5 py-1.5 text-xs leading-tight',
    md: 'px-3 py-2 text-sm leading-snug',
    lg: 'px-4 py-3 text-base leading-normal',
    xl: 'px-5 py-4 text-lg leading-relaxed'
  }), []);

  // Smart positioning with enhanced collision detection
  const calculatePosition = useCallback((preferredPlacement: TooltipPlacement) => {
    if (!triggerRef.current) return { top: 0, left: 0, placement: preferredPlacement };

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Get tooltip dimensions - use estimated if not yet rendered
    let tooltipWidth = 200; // Default estimated width
    let tooltipHeight = 40; // Default estimated height
    
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      tooltipWidth = tooltipRect.width || tooltipWidth;
      tooltipHeight = tooltipRect.height || tooltipHeight;
    } else {
      // Estimate tooltip size based on content and size
      switch (size) {
        case 'xs':
          tooltipHeight = 28;
          break;
        case 'sm':
          tooltipHeight = 32;
          break;
        case 'md':
          tooltipHeight = 40;
          break;
        case 'lg':
          tooltipHeight = 48;
          break;
        case 'xl':
          tooltipHeight = 56;
          break;
      }
    }
    
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let boundaryRect = { top: 0, left: 0, right: viewportWidth, bottom: viewportHeight };

    if (boundary instanceof HTMLElement) {
      const rect = boundary.getBoundingClientRect();
      boundaryRect = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom
      };
    }

    let top = 0;
    let left = 0;
    let finalPlacement = preferredPlacement;

    const positions = {
      'top': () => ({
        top: triggerRect.top + scrollTop - tooltipHeight - offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipWidth / 2
      }),
      'top-start': () => ({
        top: triggerRect.top + scrollTop - tooltipHeight - offset,
        left: triggerRect.left + scrollLeft
      }),
      'top-end': () => ({
        top: triggerRect.top + scrollTop - tooltipHeight - offset,
        left: triggerRect.right + scrollLeft - tooltipWidth
      }),
      'bottom': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipWidth / 2
      }),
      'bottom-start': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft
      }),
      'bottom-end': () => ({
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.right + scrollLeft - tooltipWidth
      }),
      'left': () => ({
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipHeight / 2,
        left: triggerRect.left + scrollLeft - tooltipWidth - offset
      }),
      'left-start': () => ({
        top: triggerRect.top + scrollTop,
        left: triggerRect.left + scrollLeft - tooltipWidth - offset
      }),
      'left-end': () => ({
        top: triggerRect.bottom + scrollTop - tooltipHeight,
        left: triggerRect.left + scrollLeft - tooltipWidth - offset
      }),
      'right': () => ({
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipHeight / 2,
        left: triggerRect.right + scrollLeft + offset
      }),
      'right-start': () => ({
        top: triggerRect.top + scrollTop,
        left: triggerRect.right + scrollLeft + offset
      }),
      'right-end': () => ({
        top: triggerRect.bottom + scrollTop - tooltipHeight,
        left: triggerRect.right + scrollLeft + offset
      })
    };

    // Try preferred placement first
    const tryPlacement = (placementToTry: TooltipPlacement) => {
      const pos = positions[placementToTry]();
      const wouldFit = {
        top: pos.top >= boundaryRect.top + 8,
        bottom: pos.top + tooltipHeight <= boundaryRect.bottom - 8,
        left: pos.left >= boundaryRect.left + 8,
        right: pos.left + tooltipWidth <= boundaryRect.right - 8
      };
      return { ...pos, fits: wouldFit.top && wouldFit.bottom && wouldFit.left && wouldFit.right };
    };

    let result = tryPlacement(preferredPlacement);
    if (!result.fits) {
      // Try fallback placements
      const allFallbacks = [...fallbackPlacements, getOppositePlacement(preferredPlacement)];
      
      for (const fallback of allFallbacks) {
        const fallbackResult = tryPlacement(fallback);
        if (fallbackResult.fits) {
          result = fallbackResult;
          finalPlacement = fallback;
          break;
        }
      }
    }

    top = result.top;
    left = result.left;

    // Final boundary adjustments
    const margin = 8;
    if (top < boundaryRect.top + margin) top = boundaryRect.top + margin;
    if (top + tooltipHeight > boundaryRect.bottom - margin) {
      top = boundaryRect.bottom - tooltipHeight - margin;
    }
    if (left < boundaryRect.left + margin) left = boundaryRect.left + margin;
    if (left + tooltipWidth > boundaryRect.right - margin) {
      left = boundaryRect.right - tooltipWidth - margin;
    }

    return { top, left, placement: finalPlacement };
  }, [offset, boundary, fallbackPlacements]);

  // Get opposite placement for fallback
  const getOppositePlacement = (placement: TooltipPlacement): TooltipPlacement => {
    const opposites: Record<TooltipPlacement, TooltipPlacement> = {
      'top': 'bottom',
      'top-start': 'bottom-start',
      'top-end': 'bottom-end',
      'bottom': 'top',
      'bottom-start': 'top-start',
      'bottom-end': 'top-end',
      'left': 'right',
      'left-start': 'right-start',
      'left-end': 'right-end',
      'right': 'left',
      'right-start': 'left-start',
      'right-end': 'left-end'
    };
    return opposites[placement] || 'top';
  };

  // Handle mouse tracking for followCursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!followCursor || !mouseTrackingRef.current) return;
    
    setMousePosition({ x: e.clientX, y: e.clientY });
    
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setPosition({
        top: e.clientY + scrollTop + offset,
        left: e.clientX + scrollLeft + offset
      });
    }
  }, [followCursor, offset]);

  // Update position
  useEffect(() => {
    if (shouldShow && triggerRef.current && tooltipRef.current && !followCursor) {
      const result = calculatePosition(placement);
      setPosition({ top: result.top, left: result.left });
      setActualPlacement(result.placement);
    }
  }, [shouldShow, placement, calculatePosition, followCursor]);

  // Handle mouse tracking
  useEffect(() => {
    if (followCursor && shouldShow) {
      mouseTrackingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        mouseTrackingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [followCursor, shouldShow, handleMouseMove]);

  const clearAllTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (durationTimeoutRef.current) {
      clearTimeout(durationTimeoutRef.current);
      durationTimeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const showTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    
    clearAllTimeouts();
    
    showTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
      onShow?.();
      
      // Set duration timeout if specified
      if (duration > 0) {
        durationTimeoutRef.current = window.setTimeout(() => {
          hideTooltip();
        }, duration);
      }
    }, delay);
  }, [disabled, isManuallyControlled, delay, duration, onShow, clearAllTimeouts]);

  const hideTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    
    clearAllTimeouts();
    
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      
      // Wait for exit animation to complete
      const exitDelay = animation === 'fade' ? 150 : animation === 'scale' ? 200 : 250;
      setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, exitDelay);
    }, hideDelay);
  }, [disabled, isManuallyControlled, hideDelay, animation, onHide, clearAllTimeouts]);

  // Event handlers
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || isManuallyControlled) return;
    
    if (triggers.indexOf('click') !== -1) {
      e.stopPropagation();
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  }, [disabled, isManuallyControlled, triggers, isVisible, showTooltip, hideTooltip]);

  const handleMouseEnter = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf('hover') !== -1) {
      showTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf('hover') !== -1) {
      hideTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, hideTooltip]);

  const handleFocus = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf('focus') !== -1) {
      showTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, showTooltip]);

  const handleBlur = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf('focus') !== -1) {
      hideTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, hideTooltip]);

  const handleTooltipMouseEnter = useCallback(() => {
    if (interactive && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, [interactive]);

  const handleTooltipMouseLeave = useCallback(() => {
    if (interactive && triggers.indexOf('hover') !== -1) {
      hideTooltip();
    }
  }, [interactive, triggers, hideTooltip]);

  const handleTooltipClick = useCallback(() => {
    if (hideOnClick) {
      hideTooltip();
    }
  }, [hideOnClick, hideTooltip]);

  // Enhanced arrow styles
  const getArrowStyles = useCallback(() => {
    if (!showArrow) return '';
    
    const arrowSize = size === 'xs' ? 'border-2' : size === 'sm' ? 'border-3' : 'border-4';
    const baseClasses = `absolute w-0 h-0 ${arrowSize} border-solid border-transparent ${arrowClassName}`;
    
    const arrowColor = arrowClasses[variant];
    
    switch (actualPlacement) {
      case 'top':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-t-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'top-start':
        return `${baseClasses} top-full left-4 border-t-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'top-end':
        return `${baseClasses} top-full right-4 border-t-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 border-b-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'bottom-start':
        return `${baseClasses} bottom-full left-4 border-b-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'bottom-end':
        return `${baseClasses} bottom-full right-4 border-b-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'left':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 border-l-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'left-start':
        return `${baseClasses} left-full top-4 border-l-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'left-end':
        return `${baseClasses} left-full bottom-4 border-l-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'right':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 border-r-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'right-start':
        return `${baseClasses} right-full top-4 border-r-${arrowSize.split('-')[1]} ${arrowColor}`;
      case 'right-end':
        return `${baseClasses} right-full bottom-4 border-r-${arrowSize.split('-')[1]} ${arrowColor}`;
      default:
        return baseClasses;
    }
  }, [showArrow, size, actualPlacement, variant, arrowClasses, arrowClassName]);

  // Enhanced animation classes
  const getAnimationClasses = useCallback(() => {
    const baseTransition = 'transition-all duration-200 ease-out';
    const isEntering = isAnimating;
    
    switch (animation) {
      case 'fade':
        return `${baseTransition} ${isEntering ? 'opacity-100' : 'opacity-0'}`;
      case 'scale':
        return `${baseTransition} ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'slide':
        const slideDirection = getSlideDirection();
        return `${baseTransition} ${isEntering ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${slideDirection}`}`;
      case 'bounce':
        return `${baseTransition} ${isEntering ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-95'}`;
      default:
        return `${baseTransition} ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
    }
  }, [animation, isAnimating]);

  const getSlideDirection = useCallback(() => {
    switch (actualPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return 'translate-y-2';
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return '-translate-y-2';
      case 'left':
      case 'left-start':
      case 'left-end':
        return 'translate-x-2';
      case 'right':
      case 'right-start':
      case 'right-end':
        return '-translate-x-2';
      default:
        return 'translate-y-2';
    }
  }, [actualPlacement]);

  // Transform origin for better animations
  const getTransformOrigin = useCallback(() => {
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
  }, [actualPlacement]);

  // Global click handler for click-outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (triggers.indexOf('click') !== -1 && isVisible && !isManuallyControlled) {
        const target = e.target as HTMLElement;
        if (
          !triggerRef.current?.contains(target) &&
          !tooltipRef.current?.contains(target)
        ) {
          hideTooltip();
        }
      }
    };

    if (triggers.indexOf('click') !== -1) {
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [triggers, isVisible, isManuallyControlled, hideTooltip]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      mouseTrackingRef.current = false;
    };
  }, [clearAllTimeouts]);

  // Get container element
  const getContainer = useCallback(() => {
    if (appendTo === 'body') return document.body;
    if (appendTo instanceof HTMLElement) return appendTo;
    return document.body;
  }, [appendTo]);

  const tooltipElement = shouldShow ? (
    <div
      ref={tooltipRef}
      className={`
        fixed font-medium rounded-lg border-2
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${contentClassName}
        ${interactive ? 'cursor-pointer' : 'cursor-default'}
        ${getAnimationClasses()}
        break-words select-none
        will-change-transform
      `}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: maxWidth,
        transformOrigin: getTransformOrigin(),
        pointerEvents: interactive ? 'auto' : 'none',
        zIndex: zIndex
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
      onClick={handleTooltipClick}
      role="tooltip"
      aria-hidden={!shouldShow}
      data-placement={actualPlacement}
      data-variant={variant}
      data-size={size}
      data-animation={animation}
    >
      {content}
      {showArrow && <div className={getArrowStyles()} />}
    </div>
  ) : null;

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
        aria-describedby={shouldShow ? `tooltip-${Math.random().toString(36).substr(2, 9)}` : undefined}
      >
        {children}
      </div>

      {tooltipElement && createPortal(tooltipElement, getContainer())}
    </>
  );
};

export default Tooltip;
