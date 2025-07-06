import React, { useState, useRef, useEffect, useId } from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipAnimation = "scale" | "fade" | "slide" | "bounce";
type TooltipColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type TooltipVariant = "solid" | "bordered" | "light" | "flat" | "shadow";
type TooltipSize = "sm" | "md" | "lg";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  delay?: number;
  closeDelay?: number;
  animation?: TooltipAnimation;
  color?: TooltipColor;
  variant?: TooltipVariant;
  size?: TooltipSize;
  className?: string;
  isDisabled?: boolean;
  maxWidth?: string;
  animationDuration?: number;
  exitDuration?: number;
  usePortal?: boolean;
  disableAutoPosition?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  delay = 500,
  closeDelay = 100,
  animation = "scale",
  color = "default",
  variant = "solid",
  size = "md",
  className = "",
  isDisabled = false,
  maxWidth = "210px",
  animationDuration,
  exitDuration,
  usePortal = false,
  disableAutoPosition = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "enter" | "exit" | "idle"
  >("idle");
  const [actualPlacement, setActualPlacement] = useState<TooltipPlacement>(placement);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const getAnimationDuration = (phase: "enter" | "exit") => {
    if (phase === "exit") {
      return exitDuration || 200; // Custom exit duration or default 200ms
    }

    if (animationDuration) {
      return animationDuration; // Use custom duration if provided
    }

    // Default enter animation durations vary by type
    switch (animation) {
      case "fade":
        return 150;
      case "scale":
      case "slide":
        return 200;
      case "bounce":
        return 300;
      default:
        return 200;
    }
  };

  const getColorClasses = () => {
    const colorMap = {
      default: {
        solid: "bg-gray-800 text-white border-gray-700",
        bordered: "bg-transparent text-gray-800 border-gray-300 border-2",
        light: "bg-gray-100 text-gray-800 border-gray-200",
        flat: "bg-gray-200 text-gray-800 border-transparent",
        shadow: "bg-white text-gray-800 border-gray-200 shadow-lg",
      },
      primary: {
        solid: "bg-primary text-white border-primary",
        bordered: "bg-transparent text-primary border-primary border-2",
        light: "bg-primary/10 text-primary border-primary/20",
        flat: "bg-primary/20 text-primary border-transparent",
        shadow:
          "bg-white text-primary border-primary/20 shadow-lg shadow-primary/25",
      },
      secondary: {
        solid: "bg-secondary text-white border-secondary",
        bordered: "bg-transparent text-secondary border-secondary border-2",
        light: "bg-secondary/10 text-secondary border-secondary/20",
        flat: "bg-secondary/20 text-secondary border-transparent",
        shadow: "bg-white text-secondary border-secondary/20 shadow-lg",
      },
      success: {
        solid: "bg-green-600 text-white border-green-700",
        bordered: "bg-transparent text-green-600 border-green-600 border-2",
        light: "bg-green-100 text-green-600 border-green-200",
        flat: "bg-green-200 text-green-600 border-transparent",
        shadow:
          "bg-white text-green-600 border-green-200 shadow-lg shadow-green-500/25",
      },
      warning: {
        solid: "bg-yellow-600 text-white border-yellow-700",
        bordered: "bg-transparent text-yellow-600 border-yellow-600 border-2",
        light: "bg-yellow-100 text-yellow-600 border-yellow-200",
        flat: "bg-yellow-200 text-yellow-600 border-transparent",
        shadow:
          "bg-white text-yellow-600 border-yellow-200 shadow-lg shadow-yellow-500/25",
      },
      danger: {
        solid: "bg-red-600 text-white border-red-700",
        bordered: "bg-transparent text-red-600 border-red-600 border-2",
        light: "bg-red-100 text-red-600 border-red-200",
        flat: "bg-red-200 text-red-600 border-transparent",
        shadow:
          "bg-white text-red-600 border-red-200 shadow-lg shadow-red-500/25",
      },
      info: {
        solid: "bg-cyan-600 text-white border-cyan-700",
        bordered: "bg-transparent text-cyan-600 border-cyan-600 border-2",
        light: "bg-cyan-100 text-cyan-600 border-cyan-200",
        flat: "bg-cyan-200 text-cyan-600 border-transparent",
        shadow:
          "bg-white text-cyan-600 border-cyan-200 shadow-lg shadow-cyan-500/25",
      },
    };

    return colorMap[color][variant];
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "lg":
        return "text-base px-4 py-3";
      case "md":
      default:
        return "text-sm px-3 py-2";
    }
  };

  const getArrowBg = () => {
    const bgMap = {
      default: {
        solid: "bg-gray-800",
        bordered: "bg-white",
        light: "bg-gray-100",
        flat: "bg-gray-200",
        shadow: "bg-white",
      },
      primary: {
        solid: "bg-primary",
        bordered: "bg-white",
        light: "bg-primary/10",
        flat: "bg-primary/20",
        shadow: "bg-white",
      },
      secondary: {
        solid: "bg-secondary",
        bordered: "bg-white",
        light: "bg-secondary/10",
        flat: "bg-secondary/20",
        shadow: "bg-white",
      },
      success: {
        solid: "bg-green-600",
        bordered: "bg-white",
        light: "bg-green-100",
        flat: "bg-green-200",
        shadow: "bg-white",
      },
      warning: {
        solid: "bg-yellow-600",
        bordered: "bg-white",
        light: "bg-yellow-100",
        flat: "bg-yellow-200",
        shadow: "bg-white",
      },
      danger: {
        solid: "bg-red-600",
        bordered: "bg-white",
        light: "bg-red-100",
        flat: "bg-red-200",
        shadow: "bg-white",
      },
      info: {
        solid: "bg-cyan-600",
        bordered: "bg-white",
        light: "bg-cyan-100",
        flat: "bg-cyan-200",
        shadow: "bg-white",
      },
    };

    return bgMap[color]?.[variant] || "bg-gray-800";
  };

  // Auto-positioning logic to prevent tooltip from going off-screen
  const calculateOptimalPlacement = (): TooltipPlacement => {
    if (disableAutoPosition || !triggerRef.current) return placement;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipEstimatedWidth = 200; // Approximate tooltip width
    const tooltipEstimatedHeight = 50; // Approximate tooltip height
    const margin = 10; // Margin from viewport edges

    // Check if the preferred placement fits
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    switch (placement) {
      case "top":
        if (spaceAbove >= tooltipEstimatedHeight + margin) return "top";
        if (spaceBelow >= tooltipEstimatedHeight + margin) return "bottom";
        break;
      case "bottom":
        if (spaceBelow >= tooltipEstimatedHeight + margin) return "bottom";
        if (spaceAbove >= tooltipEstimatedHeight + margin) return "top";
        break;
      case "left":
        if (spaceLeft >= tooltipEstimatedWidth + margin) return "left";
        if (spaceRight >= tooltipEstimatedWidth + margin) return "right";
        break;
      case "right":
        if (spaceRight >= tooltipEstimatedWidth + margin) return "right";
        if (spaceLeft >= tooltipEstimatedWidth + margin) return "left";
        break;
    }

    // Fallback: choose the side with the most space
    const spaces = [
      { placement: "top" as TooltipPlacement, space: spaceAbove },
      { placement: "bottom" as TooltipPlacement, space: spaceBelow },
      { placement: "left" as TooltipPlacement, space: spaceLeft },
      { placement: "right" as TooltipPlacement, space: spaceRight },
    ];

    return spaces.reduce((best, current) => 
      current.space > best.space ? current : best
    ).placement;
  };

  // Update actual placement when tooltip becomes visible
  useEffect(() => {
    if (visible && !disableAutoPosition) {
      const optimalPlacement = calculateOptimalPlacement();
      setActualPlacement(optimalPlacement);
    } else {
      setActualPlacement(placement);
    }
  }, [visible, placement, disableAutoPosition]);

  const getArrowExtraStyles = () => {
    switch (variant) {
      case "bordered":
        // Add border to match tooltip border
        return color === "default" 
          ? "border border-gray-300"
          : color === "primary"
          ? "border border-primary"
          : color === "secondary"
          ? "border border-secondary"
          : color === "success"
          ? "border border-green-600"
          : color === "warning"
          ? "border border-yellow-600"
          : color === "danger"
          ? "border border-red-600"
          : color === "info"
          ? "border border-cyan-600"
          : "border border-gray-300";
      case "light":
      case "flat":
        // Add subtle border and shadow for visibility
        return color === "default"
          ? "border border-gray-200 shadow-sm"
          : color === "primary"
          ? "border border-primary/20 shadow-sm"
          : color === "secondary"
          ? "border border-secondary/20 shadow-sm"
          : color === "success"
          ? "border border-green-200 shadow-sm"
          : color === "warning"
          ? "border border-yellow-200 shadow-sm"
          : color === "danger"
          ? "border border-red-200 shadow-sm"
          : color === "info"
          ? "border border-cyan-200 shadow-sm"
          : "border border-gray-200 shadow-sm";
      case "shadow":
        // Add subtle shadow to match tooltip shadow
        return color === "primary"
          ? "shadow-sm shadow-primary/25"
          : color === "secondary"
          ? "shadow-sm shadow-secondary/25"
          : color === "success"
          ? "shadow-sm shadow-green-500/25"
          : color === "warning"
          ? "shadow-sm shadow-yellow-500/25"
          : color === "danger"
          ? "shadow-sm shadow-red-500/25"
          : color === "info"
          ? "shadow-sm shadow-cyan-500/25"
          : "shadow-sm";
      default:
        return "";
    }
  };

  const renderArrow = () => {
    if (!showArrow) return null;

    const sizeMap = {
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
    };

    const base = `absolute rotate-45 ${sizeMap[size]} ${getArrowBg()} ${getArrowExtraStyles()} z-20`;

    const placementMap = {
      top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
      left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
      right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
    };

    return <div className={`${base} ${placementMap[actualPlacement]}`} />;
  };

  const show = () => {
    if (isDisabled) return;

    // Clear any existing timeouts
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (showTimeoutRef.current) return; // Already showing

    showTimeoutRef.current = setTimeout(() => {
      setVisible(true);
      setIsAnimating(true);
      setAnimationPhase("enter");

      // Remove animation class after animation completes
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimationPhase("idle");
      }, getAnimationDuration("enter"));
    }, delay);
  };

  const hide = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!visible) return;

    // Start exit animation immediately
    setIsAnimating(true);
    setAnimationPhase("exit");

    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setIsAnimating(false);
      setAnimationPhase("idle");
    }, getAnimationDuration("exit"));
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const getAnimationClasses = () => {
    if (!isAnimating) return "";

    const baseAnimation = (() => {
      switch (animation) {
        case "scale":
          return "tooltip-scale";
        case "fade":
          return "tooltip-fade";
        case "slide":
          return actualPlacement === "top"
            ? "tooltip-slide-up"
            : actualPlacement === "bottom"
            ? "tooltip-slide-down"
            : actualPlacement === "left"
            ? "tooltip-slide-left"
            : "tooltip-slide-right";
        case "bounce":
          return "tooltip-bounce";
        default:
          return "tooltip-scale";
      }
    })();

    const phase = animationPhase === "enter" ? "enter" : "exit";
    return `${baseAnimation}-${phase}`;
  };

  const getTransformOrigin = () => {
    switch (actualPlacement) {
      case "top":
        return "tooltip-origin-top";
      case "bottom":
        return "tooltip-origin-bottom";
      case "left":
        return "tooltip-origin-left";
      case "right":
        return "tooltip-origin-right";
      default:
        return "tooltip-origin-top";
    }
  };

  const renderTooltip = () => {
    if (!visible) return null;

    return (
      <div
        id={tooltipId}
        role="tooltip"
        className={`
          absolute z-50 pointer-events-none
          min-w-max
          ${positionClasses[actualPlacement]} 
          ${getAnimationClasses()}
          ${getTransformOrigin()}
          ${className}
        `}
        style={{ 
          maxWidth: maxWidth,
          animationDuration: `${getAnimationDuration(animationPhase === "idle" ? "enter" : animationPhase)}ms`,
        }}
        ref={tooltipRef}
      >
        <div className="relative z-10">
          {renderArrow()}
          <div
            className={`
              rounded-lg backdrop-blur-sm border break-words relative z-10
              ${getColorClasses()}
              ${getSizeClasses()}
            `}
          >
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <span
      className="relative inline-block max-w-max"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      ref={triggerRef}
      aria-describedby={visible ? tooltipId : undefined}
    >
      <span className="inline-block ">{children}</span>

      {usePortal && typeof document !== 'undefined' 
        ? createPortal(renderTooltip(), document.body)
        : renderTooltip()
      }
    </span>
  );
};

// Export types
export type {
  TooltipProps,
  TooltipPlacement,
  TooltipAnimation,
  TooltipColor,
  TooltipVariant,
  TooltipSize,
};

// Set display name for debugging
Tooltip.displayName = "Tooltip";

export default Tooltip;
