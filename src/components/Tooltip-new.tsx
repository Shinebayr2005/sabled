import React, { useState, useRef } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  showArrow?: boolean;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  showArrow = true,
  delay = 100,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowPosition = {
    top: "bottom-0 left-1/2 -translate-x-1/2 border-t-gray-800",
    bottom: "top-0 left-1/2 -translate-x-1/2 border-b-gray-800",
    left: "right-0 top-1/2 -translate-y-1/2 border-l-gray-800",
    right: "left-0 top-1/2 -translate-y-1/2 border-r-gray-800",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span className="inline-block">{children}</span>

      {visible && (
        <div
          className={`absolute z-50 ${positionClasses[placement]} transition-opacity duration-200`}
        >
          <div className="relative">
            {showArrow && (
              <div
                className={`absolute w-0 h-0 border-8 border-transparent ${arrowPosition[placement]}`}
              />
            )}
            <div className="rounded bg-gray-800 text-white text-sm px-3 py-1 shadow-md">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
