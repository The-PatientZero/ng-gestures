const isBrowser = typeof window !== 'undefined' && window?.document?.createElement;

function supportsTouchEvents(): boolean {
  return isBrowser && 'ontouchstart' in window;
}

function isTouchScreen(): boolean {
  return supportsTouchEvents() || (isBrowser && window.navigator.maxTouchPoints > 1);
}

function supportsPointerEvents(): boolean {
  return isBrowser && 'onpointerdown' in window;
}

function supportsPointerLock(): boolean {
  return isBrowser && 'exitPointerLock' in window.document;
}

function supportsGestureEvents(): boolean {
  return isBrowser && 'GestureEvent' in window;
}

export const SUPPORT = {
  isBrowser,
  gesture: supportsGestureEvents(),
  /**
   * Some touchscreens using webkits don't have 'ontouchstart' in window. So
   * we're considering that browsers support TouchEvent if they have
   * `maxTouchPoints > 1`
   *
   * This generates failure on other Windows systems, so reverting
   * back to detecting TouchEvent support only.
   */
  touch: supportsTouchEvents(),
  // touch: isTouchScreen(),
  touchscreen: isTouchScreen(),
  pointer: supportsPointerEvents(),
  pointerLock: supportsPointerLock()
};
