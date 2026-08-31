import type { CSSProperties, ReactNode } from "react";

export interface RotatorItem {
  text?: string;
  children?: ReactNode;
  link?: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  animation?: string;
  render?: (item: RotatorItem, index: number) => ReactNode;
}

export interface TextRotatorProps {
  content: Array<string | RotatorItem>;
  time?: number;
  startDelay?: number;
  transitionTime?: number;
  className?: string;
  style?: CSSProperties;
  autoPlay?: boolean;
  onItemChange?: (item: RotatorItem | string, index: number) => void;
}

export interface UseRotatorOptions {
  content: Array<string | RotatorItem>;
  time?: number;
  startDelay?: number;
  autoPlay?: boolean;
  onItemChange?: (item: RotatorItem | string, index: number) => void;
}

export interface UseRotatorReturn {
  isEntered: boolean;
  currentIndex: number;
  currentItem: RotatorItem | string | undefined;
  next: () => void;
}
