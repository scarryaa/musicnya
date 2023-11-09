export interface ContextMenuItem {
  label?: string;
  icon?: any;
  action: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}

export interface ContextMenuType {
  items: ContextMenuItem[];
}
