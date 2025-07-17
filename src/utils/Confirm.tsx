import React from "react";
import ReactDOM from "react-dom/client";
import Confirm, { ConfirmProps } from "../components/Confirm";

const confirm = ({
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
  type = "default",
  width = 400,
  showIcon = true,
  icon,
  closable = true,
  className,
  overlayClassName,
}: {
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: ConfirmProps['confirmColor'];
  confirmVariant?: ConfirmProps['confirmVariant'];
  cancelColor?: ConfirmProps['cancelColor'];
  cancelVariant?: ConfirmProps['cancelVariant'];
  type?: ConfirmProps['type'];
  width?: string | number;
  showIcon?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
  className?: string;
  overlayClassName?: string;
}) => {
  // Create a wrapper div for the dialog
  if (typeof document === "undefined") {
    return;
  }

  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

  // Disable body scroll when modal opens
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;
  
  // Get scrollbar width
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  // Prevent scroll and compensate for scrollbar
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;

  // Create a root for rendering
  const root = ReactDOM.createRoot(wrapper);

  const cleanup = () => {
    // Re-enable body scroll and restore padding
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    
    root.unmount();

    if (document.body.contains(wrapper)) {
      document.body.removeChild(wrapper);
    }
  };

  // Handle confirm and cancel actions
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    cleanup();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    cleanup();
  };

  // Render the ConfirmDialog (remove escape key handling from utils)
  root.render(
    <Confirm
      title={title}
      content={content}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmColor={confirmColor}
      confirmVariant={confirmVariant}
      cancelColor={cancelColor}
      cancelVariant={cancelVariant}
      type={type}
      width={width}
      showIcon={showIcon}
      icon={icon}
      closable={closable}
      className={className}
      overlayClassName={overlayClassName}
    />
  );
};

export default confirm;
