import { For, type JSX } from "solid-js";
import styles from "./ContextMenu.module.scss";

export function createContextMenu(e, items): void {
  let contextMenu = document.createElement("contextMenu");
  contextMenu.setAttribute("class", styles.contextMenu);
  contextMenu.style.top = `${e.clientY}px`;
  contextMenu.style.left = `${e.clientX}px`;

  contextMenu = ContextMenu({
    isVisible: true,
    items: items,
    x: e.clientX,
    y: e.clientY
  });

  // Remove the context menu if it already exists
  const existingContextMenu = document.querySelector("contextMenu");
  if (existingContextMenu) {
    existingContextMenu.remove();
  }

  // Remove the context menu if user right clicks
  document.addEventListener("contextmenu", (e) => {
    contextMenu.remove();
  });

  // Remove the context menu if the user clicks outside of it
  document.addEventListener("click", (e) => {
    if (e.target !== contextMenu) {
      contextMenu.remove();
    }
  });

  document.body.appendChild(contextMenu);
}

export function ContextMenu(props): JSX.Element {
  return (
    <div
      class={styles.contextMenu}
      style={`top: ${props.y}px; left: ${props.x}px; position: absolute;`}
    >
      <div>
        <div style="display: flex; flex-direction: row">
          <For each={props.items.filter((item) => item.isQuickAction)}>
            {(item) => (
              <div
                class={styles.contextMenu__quick__item}
                onclick={item.action}
              >
                <item.icon size={item.iconSize || 24} />
              </div>
            )}
          </For>
        </div>

        <For each={props.items.filter((item) => !item.isQuickAction)}>
          {(item) => (
            <div class={styles.contextMenu__item} onclick={item.action}>
              <item.icon size={item.iconSize || 24} style="margin-top: 3px" />
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
