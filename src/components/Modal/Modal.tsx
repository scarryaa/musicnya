import styles from "./Modal.module.scss";
import { Component, JSX } from "solid-js";

type ModalProps = {
  children?: JSX.Element | JSX.Element[];
  isOpen: boolean;
  onClose: () => void;
};

export const Modal: Component<ModalProps> = (props) => {
  return (
    <div
      class={styles.modal}
      style={{ display: props.isOpen ? "block" : "none" }}
    >
      <div class={styles.modalContent}>
        <div class={styles.modalHeader}>
          <span class={styles.close} onClick={() => props.onClose()}>
            &times;
          </span>
          <slot name="header" />
        </div>
        <div class={styles.modalBody}>
          <slot name="body" />
        </div>
        <div class={styles.modalFooter}>
          <slot name="footer" />
        </div>
      </div>
    </div>
  );
};
