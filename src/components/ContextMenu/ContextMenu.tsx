import { For, onMount, type JSX } from "solid-js";
import styles from "./ContextMenu.module.scss";
import { contextMenu, setContextMenu } from "../../stores/store";

export function ContextMenu(): JSX.Element {
  // click event handler for context menu
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      value: {
        x: -10000,
        y: -10000,
        items: [],
        open: false,
        id: "",
        type: "",
        display: "none"
      }
    });

    // remove event listener
    window.removeEventListener("click", handleClick);
  };

  // handle click outside of context menu
  window.addEventListener("click", (e) => {
    if (contextMenu.value.open) {
      handleClick(e);
    }
  });

  return (
    <div
      onClick={handleClick}
      class={styles.contextMenu}
      style={`top: ${contextMenu.value.y}px; left: ${contextMenu.value.x}px; position: absolute; display: ${contextMenu.value.display}`}
    >
      <div>
        <div style="display: flex; flex-direction: row">
          <For
            each={contextMenu.value.items
              .filter((item) => item !== null)
              .filter((item) => item.isQuickAction)}
          >
            {(item) => (
              <div
                class={styles.contextMenu__quick__item}
                onclick={item.action}
              >
                <item.icon
                  size={item.iconSize || 24}
                  color="white"
                  fill="white"
                />
              </div>
            )}
          </For>
        </div>

        <For
          each={contextMenu.value.items
            .filter((item) => item !== null)
            .filter((item) => !item.isQuickAction)}
        >
          {(item) => (
            <div class={styles.contextMenu__item} onclick={item.action}>
              <item.icon
                size={item.iconSize || 24}
                color="white"
                fill="white"
                style="margin-top: 3px"
              />
              <span
                style={`vertical-align: top; margin-left: 0.5rem; margin-top: 6px; display: inline-block;`}
              >
                {item.label}
              </span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
