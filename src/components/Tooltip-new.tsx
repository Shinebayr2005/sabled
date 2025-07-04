import React, { useState, useRef, useEffect } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";
type TooltipAnimation = "scale" | "fade" | "slide" | "bounce";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  delay?: number;
  closeDelay?: number;
  animation?: TooltipAnimation;
  className?: string;
  isDisabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  delay = 500,
  closeDelay = 100,
  animation = "scale",
  className = "",
  isDisabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'exit' | 'idle'>('idle');
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

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
      setAnimationPhase('enter');
      
      // Remove animation class after animation completes
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimationPhase('idle');
      }, 300);
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
    
    // Start exit animation
    setIsAnimating(true);
    setAnimationPhase('exit');
    
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setIsAnimating(false);
      setAnimationPhase('idle');
    }, closeDelay + 150); // Add time for exit animation
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-0 left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent",
    bottom: "top-0 left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent",
    left: "right-0 top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent",
    right: "left-0 top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent",
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
          return placement === "top" ? "tooltip-slide-up" :
                 placement === "bottom" ? "tooltip-slide-down" :
                 placement === "left" ? "tooltip-slide-left" :
                 "tooltip-slide-right";
        case "bounce":
          return "tooltip-bounce";
        default:
          return "tooltip-scale";
      }
    })();
    
    const phase = animationPhase === 'enter' ? 'enter' : 'exit';
    return `${baseAnimation}-${phase}`;
  };

  const getTransformOrigin = () => {
    switch (placement) {
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

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span className="inline-block">{children}</span>

      {visible && (
        <div
          className={`
            absolute z-50 pointer-events-none
            ${positionClasses[placement]} 
            ${getAnimationClasses()}
            ${getTransformOrigin()}
            ${className}
          `}
        >
          <div className="relative">
            {showArrow && (
              <div
                className={`
                  absolute w-0 h-0 border-8 
                  ${arrowClasses[placement]}
                `}
              />
            )}
            <div className="
              rounded-lg bg-gray-800 text-white text-sm 
              px-3 py-2 shadow-lg backdrop-blur-sm
              border border-gray-700
              max-w-xs break-words
            ">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export types
export type { TooltipProps as TooltipNewProps, TooltipPlacement as TooltipNewPlacement, TooltipAnimation as TooltipNewAnimation };

// Set display name for debugging
Tooltip.displayName = "TooltipNew";
