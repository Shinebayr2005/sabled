import React, { useEffect, useState } from "react";

export interface MessageProps {
  id: number;
  text?: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number; // In milliseconds
  onClose: () => void;
  closable?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom";
  showIcon?: boolean;
  bordered?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

const Message: React.FC<MessageProps> = ({
  text,
  description,
  type,
  duration = 3000,
  onClose,
  closable = true,
  size = "medium",
  className = "",
  style,
  position = "top",
  showIcon = true,
  bordered = false,
  rounded = "lg",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10); // Delay for fade-in
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); // Fade-out
      setTimeout(onClose, 300); // Cleanup after fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyle = () => {
    const baseStyles = bordered ? "border-2" : "border-l-4";

    switch (type) {
      case "success":
        return `bg-green-50 text-green-900 border-green-500 ${baseStyles}`;
      case "error":
        return `bg-red-50 text-red-900 border-red-500 ${baseStyles}`;
      case "info":
        return `bg-primary/10 text-primary border-primary ${baseStyles}`;
      case "warning":
        return `bg-yellow-50 text-yellow-900 border-yellow-500 ${baseStyles}`;
      default:
        return `bg-gray-50 text-gray-900 border-gray-500 ${baseStyles}`;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return "text-xs p-3"; // Smaller font and padding
      case "large":
        return "text-base p-5"; // Larger font and padding
      case "medium":
      default:
        return "text-sm p-4"; // Default medium size
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
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };

    const iconColorMap = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-primary",
      warning: "text-yellow-600",
    };

    return (
      <span
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : type === "info"
            ? "bg-primary"
            : "bg-yellow-500"
        }`}
      >
        {iconMap[type]}
      </span>
    );
  };

  return (
    <div
      className={`${className} mb-2 shadow-md transform transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 translate-x-0"
          : position === "top"
          ? "opacity-0 -translate-y-2"
          : position === "bottom"
          ? "opacity-0 translate-y-2"
          : position === "top-left"
          ? "opacity-0 -translate-y-2 -translate-x-2"
          : position === "top-right"
          ? "opacity-0 -translate-y-2 translate-x-2"
          : position === "bottom-left"
          ? "opacity-0 translate-y-2 -translate-x-2"
          : "opacity-0 translate-y-2 translate-x-2"
      } ${getTypeStyle()} backdrop-blur-sm ${getSizeStyle()} ${getRoundedStyle()}`}
      style={style}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {getTypeIcon()}
          <div className="flex flex-col flex-1 min-w-0">
            {text && (
              <span className="font-semibold leading-tight">{text}</span>
            )}
            {description && (
              <span className="text-sm opacity-90 mt-1 leading-relaxed">
                {description}
              </span>
            )}
          </div>
        </div>
        {closable && (
          <button
            className="ml-4 text-current opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-black/10"
            onClick={() => setVisible(false)}
            aria-label="Close message"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
