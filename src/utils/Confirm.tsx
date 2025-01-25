import ReactDOM from "react-dom/client";
import React from "react";
import Confirm from "../components/Confirm";

const confirm = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: {
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}) => {
  // Create a wrapper div for the dialog
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

  // Create a root for rendering
  const root = ReactDOM.createRoot(wrapper);

  const cleanup = () => {
    root.unmount();
    document.body.removeChild(wrapper);
  };

  // Handle confirm and cancel actions
  const handleConfirm = () => {
    onConfirm();
    cleanup();
  };

  const handleCancel = () => {
    onCancel();
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
