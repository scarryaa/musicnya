import { createSignal } from "solid-js";
import styles from "./Tooltip.module.scss";

type Position = "top" | "bottom" | "left" | "right";
const DEFAULT_DELAY = 500;
const DEFAULT_POSITION = "top";

export const Tooltip = (props: {
  text: string;
  children: any;
  position?: Position;
  delay?: number;
  offset?: number;
}) => {
  const [showTooltip, setShowTooltip] = createSignal(false);
  let timeoutId: any;

  const getPositionStyle = (): { [key: string]: string } => {
    switch (props.position || DEFAULT_POSITION) {
      case "top":
        return {
          bottom: "30 + " + (props.offset || 0) + "px",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: "30 + " + (props.offset || 0) + "px",
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: "50%",
          right: "40px",
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: "50%",
          left: "40px",
          transform: "translateY(-50%)",
        };
      default:
        return {
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  const adjustTooltipWidthAndHeight = () => {
    const tooltip = document.getElementById("tooltip");
    if (tooltip) {
      const tooltipWidth = tooltip.clientWidth;
      const tooltipHeight = tooltip.clientHeight;

      switch (props.position || DEFAULT_POSITION) {
        case "top":
        case "bottom":
          tooltip.style.width = tooltipWidth + "px";
          tooltip.style.height = tooltipHeight - 10 + "px";
          break;
        case "left":
        case "right":
          tooltip.style.width = tooltipWidth + "px";
          tooltip.style.height = tooltipHeight + 10 + "px";
          break;
        default:
          tooltip.style.width = tooltipWidth + "px";
          tooltip.style.height = tooltipHeight + "px";
          break;
      }
    }
  };

  const showTooltipWithDelay = () => {
    timeoutId = setTimeout(() => {
      setShowTooltip(true);
      adjustTooltipWidthAndHeight();
    }, props.delay || DEFAULT_DELAY);
  };

  const cancelTooltipDelay = () => {
    clearTimeout(timeoutId);
  };

  return (
    <div class={styles.tooltip}>
      <div
        onMouseEnter={showTooltipWithDelay}
        onMouseLeave={() => {
          setShowTooltip(false);
          cancelTooltipDelay();
        }}
      >
        {props.children}
      </div>
      {showTooltip() && (
        <div
          class={styles.tooltip__text}
          style={getPositionStyle()}
          id="tooltip"
        >
          {props.text}
        </div>
      )}
    </div>
  );
};
