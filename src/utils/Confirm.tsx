import ReactDOM from "react-dom/client";
import Confirm from "../components/Confirm";
import React from "react";

const confirm = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: {
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}) => {
  // Create a wrapper div for the dialog
  if (typeof document === "undefined") {
    return;
  }

  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

  // Create a root for rendering
  const root = ReactDOM.createRoot(wrapper);

  const cleanup = () => {
    root.unmount();

    if (typeof document === "undefined") {
      return;
    }
    document.body.removeChild(wrapper);
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
    />
  );
};

export default confirm;
