export interface WindowState {
  id: string;
  title: string;
  icon: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  z: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}
