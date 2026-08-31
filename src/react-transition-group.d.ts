// Ambient declarations for `react-transition-group/Transition`.
// react-transition-group v4 ships no TypeScript types and no `@types`
// package is installed; this local declaration covers the subset of the
// API used by TextRotator. It is only the exit-timing integration
// (`in`, `timeout`, `onExited`) plus the render-prop status.

declare module "react-transition-group/Transition" {
  import type { ComponentType, ReactNode, RefObject } from "react";

  export type TransitionStatus =
    | "entering"
    | "entered"
    | "exiting"
    | "exited"
    | "unmounted";

  export interface TransitionProps {
    in?: boolean;
    timeout?: number | { enter?: number; exit?: number };
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    appear?: boolean;
    enter?: boolean;
    exit?: boolean;
    nodeRef?: RefObject<HTMLElement>;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
    onExit?: (node: HTMLElement) => void;
    onExiting?: (node: HTMLElement) => void;
    onExited?: (node: HTMLElement) => void;
    addEndListener?: (node: HTMLElement, done: () => void) => void;
    children?: ReactNode | ((status: TransitionStatus) => ReactNode);
  }

  const Transition: ComponentType<TransitionProps>;
  export default Transition;
}
