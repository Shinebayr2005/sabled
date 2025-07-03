import React, { forwardRef, useState, useRef, useEffect, useCallback, useMemo, useId, isValidElement, cloneElement } from 'react';
import { createPortal } from 'react-dom';

// HeroUI-style types
type TooltipPlacement = 
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end" 
  | "right" | "right-start" | "right-end";

type TooltipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "foreground";
type TooltipSize = "sm" | "md" | "lg";
type TooltipRadius = "none" | "sm" | "md" | "lg" | "full";
type TooltipShadow = "none" | "sm" | "md" | "lg";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  color?: TooltipColor;
  size?: TooltipSize;
  radius?: TooltipRadius;
  shadow?: TooltipShadow;
  offset?: number;
  delay?: number;
  closeDelay?: number;
  showArrow?: boolean;
  isDisabled?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  shouldCloseOnBlur?: boolean;
  shouldFlip?: boolean;
  triggerScaleOnOpen?: boolean;
  disableAnimation?: boolean;
  motionProps?: {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
  };
  classNames?: {
    base?: string;
    arrow?: string;
    content?: string;
  };
  onOpenChange?: (isOpen: boolean) => void;
  containerPadding?: number;
  crossOffset?: number;
  shouldUpdatePosition?: boolean;
  isKeyboardDismissDisabled?: boolean;
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
}

const Tooltip = forwardRef<HTMLElement, TooltipProps>(({
  children,
  content,
  placement = "top",
  color = "default",
  size = "md",
  radius = "md",
  shadow = "md",
  offset = 8,
  delay = 0,
  closeDelay = 500,
  showArrow = true,
  isDisabled = false,
  isOpen,
  defaultOpen = false,
  shouldCloseOnBlur = true,
  shouldFlip = true,
  triggerScaleOnOpen = true,
  disableAnimation = false,
  motionProps,
  classNames,
  onOpenChange,
  containerPadding = 12,
  crossOffset = 0,
  shouldUpdatePosition = true,
  isKeyboardDismissDisabled = false,
  shouldCloseOnInteractOutside,
}, ref) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const [currentPlacement, setCurrentPlacement] = useState<TooltipPlacement>(placement);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const delayTimeoutRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const tooltipId = useId();

  // Controlled vs uncontrolled state
  const isControlled = isOpen !== undefined;
  const tooltipIsOpen = isControlled ? isOpen : internalIsOpen;

  // HeroUI color mappings
  const colorClasses = useMemo(() => ({
    default: "bg-content1 text-content1-foreground border-divider",
    primary: "bg-primary text-primary-foreground border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border-secondary/20", 
    success: "bg-success text-success-foreground border-success/20",
    warning: "bg-warning text-warning-foreground border-warning/20",
    danger: "bg-danger text-danger-foreground border-danger/20",
    foreground: "bg-foreground text-background border-foreground/20",
  }), []);

  const sizeClasses = useMemo(() => ({
    sm: "px-2 py-1 text-tiny",
    md: "px-3 py-2 text-small",
    lg: "px-4 py-3 text-medium",
  }), []);

  const radiusClasses = useMemo(() => ({
    none: "rounded-none",
    sm: "rounded-small",
    md: "rounded-medium", 
    lg: "rounded-large",
    full: "rounded-full",
  }), []);

  const shadowClasses = useMemo(() => ({
    none: "shadow-none",
    sm: "shadow-small",
    md: "shadow-medium",
    lg: "shadow-large",
  }), []);

  // Arrow colors for each variant
  const arrowColors = useMemo(() => ({
    default: "#ffffff",
    primary: "#006fee",
    secondary: "#9353d3", 
    success: "#17c964",
    warning: "#f5a524",
    danger: "#f31260",
    foreground: "#11181c",
  }), []);

  // Smart positioning with collision detection
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || !tooltipIsOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const positions = {
      top: { 
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
      },
      "top-start": {
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.left + scrollLeft
      },
      "top-end": {
        top: triggerRect.top + scrollTop - tooltipRect.height - offset,
        left: triggerRect.right + scrollLeft - tooltipRect.width
      },
      bottom: {
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2
      },
      "bottom-start": {
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.left + scrollLeft
      },
      "bottom-end": {
        top: triggerRect.bottom + scrollTop + offset,
        left: triggerRect.right + scrollLeft - tooltipRect.width
      },
      left: {
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      },
      "left-start": {
        top: triggerRect.top + scrollTop,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      },
      "left-end": {
        top: triggerRect.bottom + scrollTop - tooltipRect.height,
        left: triggerRect.left + scrollLeft - tooltipRect.width - offset
      },
      right: {
        top: triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + scrollLeft + offset
      },
      "right-start": {
        top: triggerRect.top + scrollTop,
        left: triggerRect.right + scrollLeft + offset
      },
      "right-end": {
        top: triggerRect.bottom + scrollTop - tooltipRect.height,
        left: triggerRect.right + scrollLeft + offset
      },
    };

    // Check if position fits in viewport with flip support
    const checkFit = (pos: { top: number; left: number }) => ({
      ...pos,
      fits: {
        top: pos.top >= containerPadding,
        bottom: pos.top + tooltipRect.height <= viewportHeight - containerPadding,
        left: pos.left >= containerPadding,
        right: pos.left + tooltipRect.width <= viewportWidth - containerPadding,
      }
    });

    let targetPlacement = placement;
    let targetPosition = positions[placement];

    if (shouldFlip) {
      const checkedPosition = checkFit(targetPosition);
      const allFits = checkedPosition.fits.top && checkedPosition.fits.bottom && 
                     checkedPosition.fits.left && checkedPosition.fits.right;
      
      if (!allFits) {
        // Try opposite placement
        const opposites: Record<string, TooltipPlacement> = {
          top: "bottom", "top-start": "bottom-start", "top-end": "bottom-end",
          bottom: "top", "bottom-start": "top-start", "bottom-end": "top-end",
          left: "right", "left-start": "right-start", "left-end": "right-end",
          right: "left", "right-start": "left-start", "right-end": "left-end",
        };
        
        const oppositePlacement = opposites[placement];
        if (oppositePlacement && positions[oppositePlacement]) {
          const oppositePos = checkFit(positions[oppositePlacement]);
          const oppositeFits = oppositePos.fits.top && oppositePos.fits.bottom && 
                              oppositePos.fits.left && oppositePos.fits.right;
          
          if (oppositeFits) {
            targetPlacement = oppositePlacement;
            targetPosition = positions[oppositePlacement];
          }
        }
      }
    }

    // Final position adjustments to keep in viewport
    const finalTop = Math.max(containerPadding, 
      Math.min(targetPosition.top, viewportHeight - tooltipRect.height - containerPadding));
    const finalLeft = Math.max(containerPadding,
      Math.min(targetPosition.left, viewportWidth - tooltipRect.width - containerPadding));

    setPosition({ top: finalTop, left: finalLeft });
    setCurrentPlacement(targetPlacement);
  }, [placement, offset, shouldFlip, containerPadding, tooltipIsOpen]);

  // Update position when tooltip opens or placement changes
  useEffect(() => {
    if (tooltipIsOpen && shouldUpdatePosition) {
      updatePosition();
      
      // Listen for resize/scroll to update position
      const handleUpdate = () => updatePosition();
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate);
      
      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate);
      };
    }
  }, [tooltipIsOpen, updatePosition, shouldUpdatePosition]);

  // Handle opening tooltip
  const openTooltip = useCallback(() => {
    if (isDisabled) return;
    
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    delayTimeoutRef.current = window.setTimeout(() => {
      if (!isControlled) {
        setInternalIsOpen(true);
      }
      onOpenChange?.(true);
    }, delay);
  }, [isDisabled, isControlled, delay, onOpenChange]);

  // Handle closing tooltip
  const closeTooltip = useCallback(() => {
    if (isDisabled) return;

    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      if (!isControlled) {
        setInternalIsOpen(false);
      }
      onOpenChange?.(false);
    }, closeDelay);
  }, [isDisabled, isControlled, closeDelay, onOpenChange]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    openTooltip();
  }, [openTooltip]);

  const handleMouseLeave = useCallback(() => {
    closeTooltip();
  }, [closeTooltip]);

  const handleFocus = useCallback(() => {
    openTooltip();
  }, [openTooltip]);

  const handleBlur = useCallback(() => {
    if (shouldCloseOnBlur) {
      closeTooltip();
    }
  }, [shouldCloseOnBlur, closeTooltip]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tooltipIsOpen && !isKeyboardDismissDisabled) {
        closeTooltip();
      }
    };

    if (tooltipIsOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [tooltipIsOpen, closeTooltip, isKeyboardDismissDisabled]);

  // Click outside handling
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!tooltipIsOpen) return;
      
      const target = e.target as Element;
      const isOutside = !triggerRef.current?.contains(target) && 
                       !tooltipRef.current?.contains(target);
      
      if (isOutside) {
        if (shouldCloseOnInteractOutside) {
          if (shouldCloseOnInteractOutside(target)) {
            closeTooltip();
          }
        } else {
          closeTooltip();
        }
      }
    };

    if (tooltipIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [tooltipIsOpen, closeTooltip, shouldCloseOnInteractOutside]);

  // Get arrow styles based on placement
  const getArrowStyles = useCallback(() => {
    if (!showArrow) return null;

    const arrowSize = size === "sm" ? 6 : size === "md" ? 8 : 10;
    const arrowColor = arrowColors[color];
    
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      border: "solid transparent",
    };

    switch (currentPlacement) {
      case "top":
      case "top-start":
      case "top-end":
        return {
          ...baseStyle,
          top: "100%",
          left: currentPlacement === "top" ? "50%" : 
                currentPlacement === "top-start" ? "16px" : "auto",
          right: currentPlacement === "top-end" ? "16px" : "auto",
          transform: currentPlacement === "top" ? "translateX(-50%)" : "none",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopWidth: arrowSize,
          borderTopColor: arrowColor,
        };

      case "bottom":
      case "bottom-start": 
      case "bottom-end":
        return {
          ...baseStyle,
          bottom: "100%",
          left: currentPlacement === "bottom" ? "50%" :
                currentPlacement === "bottom-start" ? "16px" : "auto",
          right: currentPlacement === "bottom-end" ? "16px" : "auto",
          transform: currentPlacement === "bottom" ? "translateX(-50%)" : "none",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderBottomColor: arrowColor,
        };

      case "left":
      case "left-start":
      case "left-end":
        return {
          ...baseStyle,
          left: "100%",
          top: currentPlacement === "left" ? "50%" :
               currentPlacement === "left-start" ? "16px" : "auto",
          bottom: currentPlacement === "left-end" ? "16px" : "auto",
          transform: currentPlacement === "left" ? "translateY(-50%)" : "none",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftWidth: arrowSize,
          borderLeftColor: arrowColor,
        };

      case "right":
      case "right-start":
      case "right-end":
        return {
          ...baseStyle,
          right: "100%",
          top: currentPlacement === "right" ? "50%" :
               currentPlacement === "right-start" ? "16px" : "auto",
          bottom: currentPlacement === "right-end" ? "16px" : "auto", 
          transform: currentPlacement === "right" ? "translateY(-50%)" : "none",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderRightColor: arrowColor,
        };

      default:
        return baseStyle;
    }
  }, [showArrow, size, color, currentPlacement, arrowColors]);

  // Get transform origin for animations
  const getTransformOrigin = useCallback(() => {
    switch (currentPlacement) {
      case "top":
      case "top-start": 
      case "top-end":
        return "bottom center";
      case "bottom":
      case "bottom-start":
      case "bottom-end":
        return "top center";
      case "left":
      case "left-start":
      case "left-end":
        return "right center";
      case "right":
      case "right-start":
      case "right-end":
        return "left center";
      default:
        return "center center";
    }
  }, [currentPlacement]);

  // Enhanced children cloning with proper ref forwarding
  const renderTrigger = () => {
    if (!isValidElement(children)) {
      return children;
    }

    const childProps = children.props as any;
    
    const mergedRef = (node: HTMLElement | null) => {
      triggerRef.current = node;
      
      // Forward ref to parent if provided
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as any).current = node;
      }
      
      // Handle existing ref
      const originalRef = (children as any).ref;
      if (typeof originalRef === 'function') {
        originalRef(node);
      } else if (originalRef?.current !== undefined) {
        originalRef.current = node;
      }
    };
    
    return cloneElement(children as any, {
      ref: mergedRef,
      onMouseEnter: (e: React.MouseEvent) => {
        childProps.onMouseEnter?.(e);
        handleMouseEnter();
      },
      onMouseLeave: (e: React.MouseEvent) => {
        childProps.onMouseLeave?.(e);
        handleMouseLeave();
      },
      onFocus: (e: React.FocusEvent) => {
        childProps.onFocus?.(e);
        handleFocus();
      },
      onBlur: (e: React.FocusEvent) => {
        childProps.onBlur?.(e);
        handleBlur();
      },
      'aria-describedby': tooltipIsOpen ? tooltipId : undefined,
      className: `${childProps.className || ''} ${triggerScaleOnOpen && tooltipIsOpen ? 'scale-95' : ''}`.trim(),
    });
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  // Tooltip element
  const tooltipElement = tooltipIsOpen ? (
    <div
      ref={tooltipRef}
      className={`
        fixed z-50 border backdrop-blur-md
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${radiusClasses[radius]}
        ${shadowClasses[shadow]}
        ${!disableAnimation ? 'tooltip-scale-enter' : ''}
        ${classNames?.base || ''}
      `}
      style={{
        top: position.top,
        left: position.left + crossOffset,
        transformOrigin: getTransformOrigin(),
        zIndex: 50,
        ...motionProps?.initial,
        ...(tooltipIsOpen && motionProps?.animate),
      }}
      role="tooltip"
      id={tooltipId}
      data-placement={currentPlacement}
      data-open={tooltipIsOpen}
    >
      <div className={classNames?.content || ''}>
        {content}
      </div>
      {showArrow && getArrowStyles() && (
        <div
          className={`absolute ${classNames?.arrow || ''}`}
          style={getArrowStyles() as React.CSSProperties}
        />
      )}
    </div>
  ) : null;

  return (
    <>
      {renderTrigger()}
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
export type { TooltipProps, TooltipPlacement, TooltipColor, TooltipSize, TooltipRadius, TooltipShadow };
