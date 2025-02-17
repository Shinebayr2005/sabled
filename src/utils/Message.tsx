import ReactDOM from "react-dom/client";
import Message from "../components/Message";

let messageId = 0;

const getContainer = (position: string) => {
  if (typeof document === "undefined") return;

  const containerId = `message-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.transition = "all 0.3s";
    container.style.cssText += getPositionStyle(position) + " !important;";

    document.body.appendChild(container);
    container.offsetHeight;
  }

  return container;
};

const getPositionStyle = (position: string) => {
  const positions: Record<string, string> = {
    "top-right": "top: 1rem; right: 1rem;",
    "top-left": "top: 1rem; left: 1rem;",
    "bottom-right": "bottom: 1rem; right: 1rem;",
    "bottom-left": "bottom: 1rem; left: 1rem;",
    top: "top: 1rem; left: 50%; transform: translateX(-50%);",
    bottom: "bottom: 1rem; left: 50%; transform: translateX(-50%);",
  };

  return positions[position] || positions["top-right"];
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
  text?: string;
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

  if (!document || !container) return;

  const wrapper = document.createElement("div");
  wrapper.style.transition = "all 0.3s";
  wrapper.id = `message-${id}`;
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
      size={size}
      position={position}
    />
  );

  if (duration > 0) {
    setTimeout(cleanup, duration + 300);
  }
};

// **Refactored static methods**
const createMessage =
  (type: "success" | "error" | "info" | "warning") =>
  ({
    text,
    description,
    duration = 3000,
    position,
    size,
  }: {
    text?: string;
    description?: string;
    duration?: number;
    position?:
      | "top-right"
      | "top-left"
      | "bottom-right"
      | "bottom-left"
      | "top"
      | "bottom";
    size?: "small" | "medium" | "large";
  }) =>
    message({
      text,
      description,
      type,
      duration,
      position,
      closable: true,
      size,
    });

// Assign static methods dynamically
message.success = createMessage("success");
message.error = createMessage("error");
message.info = createMessage("info");
message.warning = createMessage("warning");

export default message;
