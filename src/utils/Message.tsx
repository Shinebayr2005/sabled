import ReactDOM from "react-dom/client";
import React from "react";
import Message from "../components/Message";

let messageId = 0;

const getContainer = (position: string) => {
  if (typeof document === "undefined") {
    return;
  }

  const containerId = `message-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.transition = "all 0.3s";
    container.style.cssText += getPositionStyle(position);
    document.body.appendChild(container);
  }

  return container;
};

const getPositionStyle = (position: string) => {
  switch (position) {
    case "top-right":
      return "top: 1rem; right: 1rem;";
    case "top-left":
      return "top: 1rem; left: 1rem;";
    case "bottom-right":
      return "bottom: 1rem; right: 1rem;";
    case "bottom-left":
      return "bottom: 1rem; left: 1rem;";
    case "top":
      return "top: 1rem; left: 50%; transform: translateX(-50%);";
    case "bottom":
      return "bottom: 1rem; left: 50%; transform: translateX(-50%);";
    default:
      return "top: 1rem; right: 1rem;";
  }
};

const message = ({
  text,
  description,
  type = "info",
  duration = 3000,
  position = "top",
  closable = true,
  size = "medium",
}: {
  text: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom";
  closable?: boolean;
  size?: "small" | "medium" | "large";
}) => {
  const container = getContainer(position);
  const id = ++messageId;

  if (!document) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.style.transition = "all 0.3s";
  wrapper.id = `message-${id}`;

  if (!container) {
    return;
  }

  container.appendChild(wrapper);

  const root = ReactDOM.createRoot(wrapper);

  const cleanup = () => {
    root.unmount();
    container.removeChild(wrapper);
  };

  root.render(
    <Message
      id={id}
      text={text}
      description={description}
      type={type}
      duration={duration}
      onClose={cleanup}
      closable={closable}
      size={size} // Pass size to the Message component
    />
  );

  if (duration > 0) {
    setTimeout(cleanup, duration + 300);
  }
};

// Static methods with size support
message.success = (
  text: string,
  description?: string,
  duration: number = 3000,
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom",
  size?: "small" | "medium" | "large"
) =>
  message({
    text,
    description,
    type: "success",
    duration,
    position,
    closable: true,
    size,
  });

message.error = (
  text: string,
  description?: string,
  duration: number = 3000,
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom",
  size?: "small" | "medium" | "large"
) =>
  message({
    text,
    description,
    type: "error",
    duration,
    position,
    closable: true,
    size,
  });

message.info = (
  text: string,
  description?: string,
  duration: number = 3000,
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom",
  size?: "small" | "medium" | "large"
) =>
  message({
    text,
    description,
    type: "info",
    duration,
    position,
    closable: true,
    size,
  });

message.warning = (
  text: string,
  description?: string,
  duration: number = 3000,
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top"
    | "bottom",
  size?: "small" | "medium" | "large"
) =>
  message({
    text,
    description,
    type: "warning",
    duration,
    position,
    closable: true,
    size,
  });

export default message;
