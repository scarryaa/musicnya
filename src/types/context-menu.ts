export interface ContextMenuItem {
  label?: string;
  icon?: any;
  action: () => void;
}

export interface ContextMenuType {
  items: ContextMenuItem[];
}
