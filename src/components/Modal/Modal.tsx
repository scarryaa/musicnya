import { Show } from "solid-js";
import styles from "./Modal.module.scss";

const Modal = (props) => {
  return (
    <Show when={props.isOpen()}>
      <div class={styles.backdrop} onClick={props.onClose}></div>
      <div class={styles.modal} onClick={props.onClose}>
        <div class={styles.modal__content} onClick={(e) => e.stopPropagation()}>
          <button class="close-button" onClick={props.onClose}>
            &times;
          </button>
          {props.children}
        </div>
      </div>
    </Show>
  );
};

export default Modal;
