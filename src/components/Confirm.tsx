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
  type?: 'default' | 'danger' | 'warning' | 'info';
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
    
    const iconMap = {
      default: "❓",
      danger: "⚠️",
      warning: "⚠️", 
      info: "ℹ️"
    };
    
    return iconMap[type];
  };

  const getTypeColors = () => {
    const colorMap = {
      default: { confirmColor: "primary" as ButtonColor },
      danger: { confirmColor: "danger" as ButtonColor },
      warning: { confirmColor: "warning" as ButtonColor },
      info: { confirmColor: "primary" as ButtonColor }
    };
    
    return colorMap[type];
  };

  const typeColors = getTypeColors();
  const finalConfirmColor = confirmColor === "primary" ? typeColors.confirmColor : confirmColor;

  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-300 ${
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
            style={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            ×
          </button>
        )}
        
        <div className="flex items-start gap-4">
          {showIcon && (
            <div className="flex-shrink-0 text-2xl mt-1">
              {getTypeIcon()}
            </div>
          )}
          
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-bold mb-2 text-gray-900 pr-8">{title}</h3>
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
