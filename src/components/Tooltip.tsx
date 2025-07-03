import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  isValidElement,
  cloneElement,
} from "react";
import { createPortal } from "react-dom";

type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";
type TooltipVariant =
  | "dark"
  | "light"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info";
type TooltipTrigger = "hover" | "click" | "focus" | "manual";
type TooltipSize = "xs" | "sm" | "md" | "lg" | "xl";
type TooltipAnimation = "fade" | "scale" | "slide" | "bounce" | "none";
type TooltipMotion = "spring" | "smooth" | "fast" | "slow";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  size?: TooltipSize;
  animation?: TooltipAnimation;
  motion?: TooltipMotion;
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
  triggerClassName?: string;
  onShow?: () => void;
  onHide?: () => void;
  visible?: boolean; // For manual control
  zIndex?: number;
  boundary?: "viewport" | "window" | HTMLElement;
  fallbackPlacements?: TooltipPlacement[];
  followCursor?: boolean;
  hideOnClick?: boolean;
  duration?: number;
  appendTo?: HTMLElement | "body";
  virtualElement?: {
    getBoundingClientRect: () => DOMRect;
  };
  disablePortal?: boolean;
  // HeroUI-style props
  color?: TooltipVariant;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  closeDelay?: number;
  openDelay?: number;
  motionProps?: {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
  };
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  variant = "dark",
  color,
  size = "md",
  animation = "scale",
  motion = "spring",
  trigger = "hover",
  disabled = false,
  delay = 0,
  hideDelay = 0,
  openDelay,
  closeDelay,
  showArrow = true,
  interactive = false,
  maxWidth = "320px",
  offset = 8,
  className = "",
  contentClassName = "",
  arrowClassName = "",
  triggerClassName = "",
  radius = "md",
  shadow = "lg",
  onShow,
  onHide,
  visible,
  zIndex = 9999,
  boundary = "viewport",
  fallbackPlacements = [],
  followCursor = false,
  hideOnClick = false,
  duration = 0,
  appendTo = "body",
  virtualElement,
  disablePortal = false,
  motionProps,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(placement);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const durationTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const mouseTrackingRef = useRef<boolean>(false);
  const tooltipId = useId();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const isManuallyControlled = visible !== undefined;
  const shouldShow = isManuallyControlled ? visible : isVisible;
  const actualDelay = openDelay ?? delay;
  const actualHideDelay = closeDelay ?? hideDelay;
  const actualVariant = color ?? variant;

  // Enhanced variant classes with modern glassmorphism
  const variantClasses = useMemo(
    () => ({
      dark: "bg-gray-900/90 text-white border-gray-700/50 backdrop-blur-md shadow-2xl",
      light: "bg-white/90 text-gray-900 border-gray-200/50 backdrop-blur-md shadow-2xl",
      primary: "bg-blue-600/90 text-white border-blue-500/50 backdrop-blur-md shadow-2xl shadow-blue-500/20",
      success: "bg-green-600/90 text-white border-green-500/50 backdrop-blur-md shadow-2xl shadow-green-500/20",
      warning: "bg-yellow-500/90 text-white border-yellow-400/50 backdrop-blur-md shadow-2xl shadow-yellow-500/20",
      error: "bg-red-600/90 text-white border-red-500/50 backdrop-blur-md shadow-2xl shadow-red-500/20",
      info: "bg-blue-500/90 text-white border-blue-400/50 backdrop-blur-md shadow-2xl shadow-blue-500/20",
    }),
    []
  );

  const radiusClasses = useMemo(
    () => ({
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-xl",
      full: "rounded-full",
    }),
    []
  );

  const shadowClasses = useMemo(
    () => ({
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    }),
    []
  );

  const motionClasses = useMemo(
    () => ({
      spring: "transition-all duration-300 cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "transition-all duration-200 ease-out",
      fast: "transition-all duration-150 ease-in-out",
      slow: "transition-all duration-500 ease-in-out",
    }),
    []
  );

  const arrowColors = useMemo(
    () => ({
      dark: "#1f2937",
      light: "#ffffff",
      primary: "#2563eb",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      info: "#3b82f6",
    }),
    []
  );

  const sizeClasses = useMemo(
    () => ({
      xs: "px-2 py-1 text-xs leading-tight",
      sm: "px-2.5 py-1.5 text-xs leading-tight",
      md: "px-3 py-2 text-sm leading-snug",
      lg: "px-4 py-3 text-base leading-normal",
      xl: "px-5 py-4 text-lg leading-relaxed",
    }),
    []
  );

  // Smart positioning with enhanced collision detection
  const calculatePosition = useCallback(
    (preferredPlacement: TooltipPlacement) => {
      const triggerElement = virtualElement || triggerRef.current;
      if (!triggerElement) return { top: 0, left: 0, placement: preferredPlacement };

      const triggerRect = virtualElement 
        ? virtualElement.getBoundingClientRect()
        : triggerRef.current!.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;

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
          case "xs":
            tooltipHeight = 28;
            break;
          case "sm":
            tooltipHeight = 32;
            break;
          case "md":
            tooltipHeight = 40;
            break;
          case "lg":
            tooltipHeight = 48;
            break;
          case "xl":
            tooltipHeight = 56;
            break;
        }
      }

      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;
      let boundaryRect = {
        top: 0,
        left: 0,
        right: viewportWidth,
        bottom: viewportHeight,
      };

      if (boundary instanceof HTMLElement) {
        const rect = boundary.getBoundingClientRect();
        boundaryRect = {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        };
      }

      let top = 0;
      let left = 0;
      let finalPlacement = preferredPlacement;

      const positions = {
        top: () => ({
          top: triggerRect.top + scrollTop - tooltipHeight - offset,
          left:
            triggerRect.left +
            scrollLeft +
            triggerRect.width / 2 -
            tooltipWidth / 2,
        }),
        "top-start": () => ({
          top: triggerRect.top + scrollTop - tooltipHeight - offset,
          left: triggerRect.left + scrollLeft,
        }),
        "top-end": () => ({
          top: triggerRect.top + scrollTop - tooltipHeight - offset,
          left: triggerRect.right + scrollLeft - tooltipWidth,
        }),
        bottom: () => ({
          top: triggerRect.bottom + scrollTop + offset,
          left:
            triggerRect.left +
            scrollLeft +
            triggerRect.width / 2 -
            tooltipWidth / 2,
        }),
        "bottom-start": () => ({
          top: triggerRect.bottom + scrollTop + offset,
          left: triggerRect.left + scrollLeft,
        }),
        "bottom-end": () => ({
          top: triggerRect.bottom + scrollTop + offset,
          left: triggerRect.right + scrollLeft - tooltipWidth,
        }),
        left: () => ({
          top:
            triggerRect.top +
            scrollTop +
            triggerRect.height / 2 -
            tooltipHeight / 2,
          left: triggerRect.left + scrollLeft - tooltipWidth - offset,
        }),
        "left-start": () => ({
          top: triggerRect.top + scrollTop,
          left: triggerRect.left + scrollLeft - tooltipWidth - offset,
        }),
        "left-end": () => ({
          top: triggerRect.bottom + scrollTop - tooltipHeight,
          left: triggerRect.left + scrollLeft - tooltipWidth - offset,
        }),
        right: () => ({
          top:
            triggerRect.top +
            scrollTop +
            triggerRect.height / 2 -
            tooltipHeight / 2,
          left: triggerRect.right + scrollLeft + offset,
        }),
        "right-start": () => ({
          top: triggerRect.top + scrollTop,
          left: triggerRect.right + scrollLeft + offset,
        }),
        "right-end": () => ({
          top: triggerRect.bottom + scrollTop - tooltipHeight,
          left: triggerRect.right + scrollLeft + offset,
        }),
      };

      // Try preferred placement first
      const tryPlacement = (placementToTry: TooltipPlacement) => {
        const pos = positions[placementToTry]();
        const wouldFit = {
          top: pos.top >= boundaryRect.top + 8,
          bottom: pos.top + tooltipHeight <= boundaryRect.bottom - 8,
          left: pos.left >= boundaryRect.left + 8,
          right: pos.left + tooltipWidth <= boundaryRect.right - 8,
        };
        return {
          ...pos,
          fits:
            wouldFit.top && wouldFit.bottom && wouldFit.left && wouldFit.right,
        };
      };

      let result = tryPlacement(preferredPlacement);
      if (!result.fits) {
        // Try fallback placements
        const allFallbacks = [
          ...fallbackPlacements,
          getOppositePlacement(preferredPlacement),
        ];

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
    },
    [offset, boundary, fallbackPlacements, virtualElement]
  );

  // Get opposite placement for fallback
  const getOppositePlacement = (
    placement: TooltipPlacement
  ): TooltipPlacement => {
    const opposites: Record<TooltipPlacement, TooltipPlacement> = {
      top: "bottom",
      "top-start": "bottom-start",
      "top-end": "bottom-end",
      bottom: "top",
      "bottom-start": "top-start",
      "bottom-end": "top-end",
      left: "right",
      "left-start": "right-start",
      "left-end": "right-end",
      right: "left",
      "right-start": "left-start",
      "right-end": "left-end",
    };
    return opposites[placement] || "top";
  };

  // Handle mouse tracking for followCursor
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!followCursor || !mouseTrackingRef.current) return;

      setMousePosition({ x: e.clientX, y: e.clientY });

      if (tooltipRef.current) {
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;

        setPosition({
          top: e.clientY + scrollTop + offset,
          left: e.clientX + scrollLeft + offset,
        });
      }
    },
    [followCursor, offset]
  );

  // Update position with ResizeObserver for dynamic content
  useEffect(() => {
    if (
      shouldShow &&
      (triggerRef.current || virtualElement) &&
      tooltipRef.current &&
      !followCursor
    ) {
      const result = calculatePosition(placement);
      setPosition({ top: result.top, left: result.left });
      setActualPlacement(result.placement);
    }
  }, [shouldShow, placement, calculatePosition, followCursor, virtualElement]);

  // ResizeObserver for dynamic tooltip size changes
  useEffect(() => {
    if (!tooltipRef.current || !shouldShow) return;

    resizeObserverRef.current = new ResizeObserver(() => {
      if (triggerRef.current || virtualElement) {
        const result = calculatePosition(placement);
        setPosition({ top: result.top, left: result.left });
        setActualPlacement(result.placement);
      }
    });

    resizeObserverRef.current.observe(tooltipRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [shouldShow, calculatePosition, placement, virtualElement]);

  // Handle mouse tracking
  useEffect(() => {
    if (followCursor && shouldShow) {
      mouseTrackingRef.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        mouseTrackingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
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
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  const showTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return;

    clearAllTimeouts();
    
    showTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      setAnimationState('entering');
      onShow?.();

      // Wait for entrance animation
      animationTimeoutRef.current = window.setTimeout(() => {
        setAnimationState('entered');
      }, animation === 'bounce' ? 300 : 200);

      // Set duration timeout if specified
      if (duration > 0) {
        durationTimeoutRef.current = window.setTimeout(() => {
          // Inline hide logic to avoid dependency issues
          setAnimationState('exiting');
          const exitDelay = animation === 'bounce' ? 150 : animation === 'fade' ? 150 : 200;
          setTimeout(() => {
            setIsVisible(false);
            setAnimationState('exited');
            onHide?.();
          }, exitDelay);
        }, duration);
      }
    }, actualDelay);
  }, [
    disabled,
    isManuallyControlled,
    actualDelay,
    duration,
    animation,
    onShow,
    onHide,
    clearAllTimeouts,
  ]);

  const hideTooltip = useCallback(() => {
    if (disabled || isManuallyControlled) return;

    clearAllTimeouts();

    hideTimeoutRef.current = window.setTimeout(() => {
      setAnimationState('exiting');

      // Wait for exit animation to complete
      const exitDelay = animation === 'bounce' ? 150 : animation === 'fade' ? 150 : 200;
      animationTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setAnimationState('exited');
        onHide?.();
      }, exitDelay);
    }, actualHideDelay);
  }, [
    disabled,
    isManuallyControlled,
    actualHideDelay,
    animation,
    onHide,
    clearAllTimeouts,
  ]);

  // Event handlers
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isManuallyControlled) return;

      if (triggers.indexOf("click") !== -1) {
        e.stopPropagation();
        if (isVisible) {
          hideTooltip();
        } else {
          showTooltip();
        }
      }
    },
    [
      disabled,
      isManuallyControlled,
      triggers,
      isVisible,
      showTooltip,
      hideTooltip,
    ]
  );

  const handleMouseEnter = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf("hover") !== -1) {
      showTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf("hover") !== -1) {
      hideTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, hideTooltip]);

  const handleFocus = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf("focus") !== -1) {
      showTooltip();
    }
  }, [disabled, isManuallyControlled, triggers, showTooltip]);

  const handleBlur = useCallback(() => {
    if (disabled || isManuallyControlled) return;
    if (triggers.indexOf("focus") !== -1) {
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
    if (interactive && triggers.indexOf("hover") !== -1) {
      hideTooltip();
    }
  }, [interactive, triggers, hideTooltip]);

  const handleTooltipClick = useCallback(() => {
    if (hideOnClick) {
      hideTooltip();
    }
  }, [hideOnClick, hideTooltip]);

  // Enhanced arrow styles with inline styles for better control
  const getArrowStyles = useCallback(() => {
    if (!showArrow) return null;

    const arrowSize = size === "xs" ? 6 : size === "sm" ? 8 : size === "md" ? 10 : size === "lg" ? 12 : 14;
    const arrowColor = arrowColors[variant];
    
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      width: 0,
      height: 0,
      border: "solid transparent",
    };

    switch (actualPlacement) {
      case "top":
        return {
          ...baseStyle,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopWidth: arrowSize,
          borderTopColor: arrowColor,
        };
      case "top-start":
        return {
          ...baseStyle,
          top: "100%",
          left: "16px",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopWidth: arrowSize,
          borderTopColor: arrowColor,
        };
      case "top-end":
        return {
          ...baseStyle,
          top: "100%",
          right: "16px",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderTopWidth: arrowSize,
          borderTopColor: arrowColor,
        };
      case "bottom":
        return {
          ...baseStyle,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderBottomColor: arrowColor,
        };
      case "bottom-start":
        return {
          ...baseStyle,
          bottom: "100%",
          left: "16px",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderBottomColor: arrowColor,
        };
      case "bottom-end":
        return {
          ...baseStyle,
          bottom: "100%",
          right: "16px",
          borderLeftWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderBottomColor: arrowColor,
        };
      case "left":
        return {
          ...baseStyle,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftWidth: arrowSize,
          borderLeftColor: arrowColor,
        };
      case "left-start":
        return {
          ...baseStyle,
          left: "100%",
          top: "16px",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftWidth: arrowSize,
          borderLeftColor: arrowColor,
        };
      case "left-end":
        return {
          ...baseStyle,
          left: "100%",
          bottom: "16px",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderLeftWidth: arrowSize,
          borderLeftColor: arrowColor,
        };
      case "right":
        return {
          ...baseStyle,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderRightColor: arrowColor,
        };
      case "right-start":
        return {
          ...baseStyle,
          right: "100%",
          top: "16px",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderRightColor: arrowColor,
        };
      case "right-end":
        return {
          ...baseStyle,
          right: "100%",
          bottom: "16px",
          borderTopWidth: arrowSize,
          borderBottomWidth: arrowSize,
          borderRightWidth: arrowSize,
          borderRightColor: arrowColor,
        };
      default:
        return baseStyle;
    }
  }, [showArrow, size, actualPlacement, variant, arrowColors]);

  // Professional animation system
  const getAnimationClasses = useCallback(() => {
    const baseClasses = motionClasses[motion];
    const isEntering = animationState === 'entering';
    const isExiting = animationState === 'exiting';
    
    // Use CSS animations for better performance
    if (animation === 'none') {
      return baseClasses;
    }

    if (animation === 'fade') {
      if (isEntering) return `${baseClasses} tooltip-fade-enter`;
      if (isExiting) return `${baseClasses} tooltip-fade-exit`;
      return `${baseClasses} opacity-100`;
    }

    if (animation === 'scale') {
      if (isEntering) return `${baseClasses} tooltip-scale-enter`;
      if (isExiting) return `${baseClasses} tooltip-scale-exit`;
      return `${baseClasses} opacity-100 scale-100`;
    }

    if (animation === 'slide') {
      const direction = getSlideDirection();
      if (isEntering) return `${baseClasses} tooltip-slide-${direction}-enter`;
      if (isExiting) return `${baseClasses} tooltip-slide-${direction}-exit`;
      return `${baseClasses} opacity-100 translate-x-0 translate-y-0`;
    }

    if (animation === 'bounce') {
      if (isEntering) return `${baseClasses} tooltip-bounce-enter`;
      if (isExiting) return `${baseClasses} tooltip-bounce-exit`;
      return `${baseClasses} opacity-100 scale-100`;
    }

    // Default
    return `${baseClasses} opacity-100 scale-100`;
  }, [animation, motion, animationState, motionClasses]);

  const getSlideDirection = useCallback(() => {
    switch (actualPlacement) {
      case "top":
      case "top-start":
      case "top-end":
        return "up";
      case "bottom":
      case "bottom-start":
      case "bottom-end":
        return "down";
      case "left":
      case "left-start":
      case "left-end":
        return "left";
      case "right":
      case "right-start":
      case "right-end":
        return "right";
      default:
        return "up";
    }
  }, [actualPlacement]);

  // Transform origin for better animations
  const getTransformOrigin = useCallback(() => {
    switch (actualPlacement) {
      case "top":
        return "bottom center";
      case "top-start":
        return "bottom left";
      case "top-end":
        return "bottom right";
      case "bottom":
        return "top center";
      case "bottom-start":
        return "top left";
      case "bottom-end":
        return "top right";
      case "left":
        return "right center";
      case "left-start":
        return "right top";
      case "left-end":
        return "right bottom";
      case "right":
        return "left center";
      case "right-start":
        return "left top";
      case "right-end":
        return "left bottom";
      default:
        return "center center";
    }
  }, [actualPlacement]);

  // Global click handler for click-outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (
        triggers.indexOf("click") !== -1 &&
        isVisible &&
        !isManuallyControlled
      ) {
        const target = e.target as HTMLElement;
        if (
          !triggerRef.current?.contains(target) &&
          !tooltipRef.current?.contains(target)
        ) {
          hideTooltip();
        }
      }
    };

    if (triggers.indexOf("click") !== -1) {
      document.addEventListener("click", handleGlobalClick);
      return () => document.removeEventListener("click", handleGlobalClick);
    }
  }, [triggers, isVisible, isManuallyControlled, hideTooltip]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      mouseTrackingRef.current = false;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [clearAllTimeouts]);

  // Get container element with portal fallback
  const getContainer = useCallback(() => {
    if (disablePortal) return null;
    if (appendTo === "body") return document.body;
    if (appendTo instanceof HTMLElement) return appendTo;
    return document.body;
  }, [appendTo, disablePortal]);

  const tooltipElement = shouldShow ? (
    <div
      ref={tooltipRef}
      className={`
        fixed font-medium border-2 z-50
        ${variantClasses[actualVariant]}
        ${sizeClasses[size]}
        ${radiusClasses[radius]}
        ${shadowClasses[shadow]}
        ${contentClassName}
        ${interactive ? "cursor-pointer" : "cursor-default"}
        ${getAnimationClasses()}
        break-words select-none
        will-change-transform
      `}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: maxWidth,
        transformOrigin: getTransformOrigin(),
        pointerEvents: interactive ? "auto" : "none",
        zIndex: zIndex,
        ...motionProps?.initial,
        ...(animationState === 'entering' && motionProps?.animate),
        ...(animationState === 'exiting' && motionProps?.exit),
      }}
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
      onClick={handleTooltipClick}
      role="tooltip"
      aria-hidden={!shouldShow}
      id={tooltipId}
      data-placement={actualPlacement}
      data-variant={actualVariant}
      data-size={size}
      data-animation={animation}
      data-state={animationState}
    >
      {content}
      {showArrow && getArrowStyles() && (
        <div
          className={`absolute ${arrowClassName}`}
          style={getArrowStyles() as React.CSSProperties}
        />
      )}
    </div>
  ) : null;

  const container = getContainer();

  // Enhanced children handling like HeroUI
  const renderTrigger = () => {
    if (virtualElement) return null;

    // If children is a single React element, clone it with our props
    if (isValidElement(children)) {
      const childProps = children.props as any;
      return cloneElement(children as React.ReactElement<any>, {
        ref: (node: HTMLElement) => {
          triggerRef.current = node;
          // Handle existing ref
          const originalRef = (children as any).ref;
          if (typeof originalRef === 'function') {
            originalRef(node);
          } else if (originalRef?.current !== undefined) {
            originalRef.current = node;
          }
        },
        className: `${childProps.className || ''} ${triggerClassName}`.trim(),
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
        onClick: (e: React.MouseEvent) => {
          childProps.onClick?.(e);
          handleClick(e);
        },
        tabIndex: triggers.indexOf("focus") !== -1 ? 0 : childProps.tabIndex,
        'aria-describedby': shouldShow ? tooltipId : undefined,
      });
    }

    // Fallback for non-React elements or multiple children
    return (
      <span
        ref={triggerRef as any}
        className={`inline-block ${triggerClassName}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        tabIndex={triggers.indexOf("focus") !== -1 ? 0 : undefined}
        aria-describedby={shouldShow ? tooltipId : undefined}
      >
        {children}
      </span>
    );
  };

  return (
    <>
      {renderTrigger()}

      {tooltipElement &&
        (container ? createPortal(tooltipElement, container) : tooltipElement)}
    </>
  );
};

export default Tooltip;
