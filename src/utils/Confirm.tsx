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

  // Store original styles
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyPosition = document.body.style.position;
  const originalBodyTop = document.body.style.top;
  const originalBodyLeft = document.body.style.left;
  const originalBodyRight = document.body.style.right;
  const originalBodyWidth = document.body.style.width;
  const originalDocumentElementOverflow = document.documentElement.style.overflow;
  
  // Get current scroll position
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  
  // Prevent scroll completely
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = `-${scrollX}px`;
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.documentElement.style.overflow = 'hidden';

  // Create a root for rendering
  const root = ReactDOM.createRoot(wrapper);

  const cleanup = () => {
    // Restore original styles
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.position = originalBodyPosition;
    document.body.style.top = originalBodyTop;
    document.body.style.left = originalBodyLeft;
    document.body.style.right = originalBodyRight;
    document.body.style.width = originalBodyWidth;
    document.documentElement.style.overflow = originalDocumentElementOverflow;
    
    // Restore scroll position
    window.scrollTo(scrollX, scrollY);
    
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

  // Render the ConfirmDialog
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
