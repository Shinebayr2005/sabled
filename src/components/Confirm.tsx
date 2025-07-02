import React, { useState, useEffect } from "react";
import Button, { ButtonColor, ButtonVariant } from "./Button";

export interface ConfirmProps {
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: ButtonColor;
  confirmVariant?: ButtonVariant;
  cancelColor?: ButtonColor;
  cancelVariant?: ButtonVariant;
  width?: string | number;
  className?: string;
  overlayClassName?: string;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
  type?: "default" | "danger" | "warning" | "info";
  closable?: boolean;
}

const Confirm: React.FC<ConfirmProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  confirmVariant = "solid",
  cancelColor = "default",
  cancelVariant = "flat",
  width = 400,
  className = "",
  overlayClassName = "",
  showIcon = true,
  customIcon,
  type = "default",
  closable = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setVisible(true);
  }, []);

  const handleClose = (action?: () => void) => {
    // Trigger fade-out animation
    setVisible(false);

    // Execute the action after the animation ends
    setTimeout(() => {
      if (action) action();
    }, 300); // Match the transition duration
  };

  const getTypeIcon = () => {
    if (!showIcon) return null;

    // Use custom icon if provided
    if (customIcon) {
      return customIcon;
    }

    // Default icons for each type
    const iconMap = {
      default: (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      danger: (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
    };

    return iconMap[type];
  };

  const getTypeColors = () => {
    const colorMap = {
      default: { confirmColor: "primary" as ButtonColor },
      danger: { confirmColor: "danger" as ButtonColor },
      warning: { confirmColor: "warning" as ButtonColor },
      info: { confirmColor: "primary" as ButtonColor },
    };

    return colorMap[type];
  };

  const typeColors = getTypeColors();
  const finalConfirmColor =
    confirmColor === "primary" ? typeColors.confirmColor : confirmColor;

  const widthStyle = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } ${overlayClassName}`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${
          visible ? "scale-100" : "scale-90"
        } ${className}`}
        style={{ width: widthStyle }}
      >
        {closable && (
          <button
            onClick={() => handleClose(onCancel)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            style={{ position: "absolute", top: "16px", right: "16px" }}
          >
            ×
          </button>
        )}

        <div className="flex items-start gap-4">
          {showIcon && (
            <div className="flex-shrink-0 mt-1">{getTypeIcon()}</div>
          )}

          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold mb-2 text-gray-900 pr-8">
                {title}
              </h3>
            )}
            {content && (
              <p className="text-gray-700 mb-6 leading-relaxed">{content}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={() => handleClose(onCancel || (() => {}))}
            color={cancelColor}
            variant={cancelVariant}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => handleClose(onConfirm || (() => {}))}
            variant={confirmVariant}
            color={finalConfirmColor}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
