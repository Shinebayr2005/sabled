import React, { useEffect, useState } from "react";

type MessageProps = {
  id: number;
  text?: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number; // In milliseconds
  onClose: () => void;
  closable?: boolean;
  size?: "small" | "medium" | "large"; // New size prop
  className?: string;
  style?: React.CSSProperties;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom";
};

const Message: React.FC<MessageProps> = ({
  text,
  description,
  type,
  duration = 3000,
  onClose,
  closable = true,
  size = "medium", // Default size
  className = "",
  style,
  position = "top",
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
    switch (type) {
      case "success":
        return "bg-green-100 text-green-900 border-green-500";
      case "error":
        return "bg-red-100 text-red-900 border-red-500";
      case "info":
        return "bg-primary/10 text-primary border-primary";
      case "warning":
        return "bg-yellow-100 text-yellow-900 border-yellow-500";
      default:
        return "bg-gray-100 text-gray-900 border-gray-500";
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return "text-xs p-2"; // Smaller font and padding
      case "large":
        return "text-base p-4"; // Larger font and padding
      case "medium":
      default:
        return "text-sm p-3"; // Default medium size
    }
  };

  return (
    <div
      className={`${className} mb-2 rounded-lg border-l-4 shadow-md transform transition-all duration-300 ${
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
      } ${getTypeStyle()} ${getSizeStyle()}`}
      style={style}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-bold">{text}</span>
          {description && <span className="text-sm">{description}</span>}
        </div>
        {closable && (
          <button
            className="ml-4 text-gray-600 hover:text-gray-900"
            onClick={() => setVisible(false)}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
