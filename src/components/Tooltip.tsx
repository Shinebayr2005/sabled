import React, { useState, useRef, useEffect } from 'react';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type TooltipVariant = 'dark' | 'light' | 'primary';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  disabled?: boolean;
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  variant = 'dark',
  disabled = false,
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const variantClasses = {
    dark: 'bg-gray-900 text-white border-gray-800',
    light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
    primary: 'bg-primary text-white border-primary'
  };

  const arrowClasses = {
    dark: 'border-gray-900',
    light: 'border-gray-200',
    primary: 'border-primary'
  };

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top + scrollTop - tooltipRect.height - 8;
          left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + scrollTop + 8;
          left = triggerRect.left + scrollLeft + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left + scrollLeft - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + scrollTop + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + scrollLeft + 8;
          break;
      }

      setPosition({ top, left });
    }
  }, [isVisible, placement]);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getArrowStyles = () => {
    const baseClasses = 'absolute w-0 h-0 border-4 border-solid border-transparent';
    
    switch (placement) {
      case 'top':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-t-4 ${arrowClasses[variant]}`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 border-b-4 ${arrowClasses[variant]}`;
      case 'left':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 border-l-4 ${arrowClasses[variant]}`;
      case 'right':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 border-r-4 ${arrowClasses[variant]}`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            fixed z-50 px-3 py-2 text-sm font-medium rounded-lg border
            ${variantClasses[variant]}
            transition-all duration-200 ease-in-out
            transform scale-100 opacity-100
            max-w-xs break-words
          `}
          style={{
            top: position.top,
            left: position.left,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {content}
          <div className={getArrowStyles()} />
        </div>
      )}
    </>
  );
};

export default Tooltip;
