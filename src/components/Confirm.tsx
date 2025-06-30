import React, { useState, useEffect } from "react";
import Button from "./Button";

type ConfirmProps = {
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

const Confirm: React.FC<ConfirmProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
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

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform duration-300 ${
          visible ? "scale-100" : "scale-90"
        }`}
      >
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{content}</p>
        <div className="flex justify-end space-x-4">
          <Button onClick={() => handleClose(onCancel || (() => {}))}>
            {cancelText}
          </Button>
          <Button
            onClick={() => handleClose(onConfirm || (() => {}))}
            variant="solid"
            color="primary"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
