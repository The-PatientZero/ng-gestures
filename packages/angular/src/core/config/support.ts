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
   * Some WebKit-based touch devices do not expose `ontouchstart` on `window`.
   * We intentionally use the stricter `TouchEvent` check here because relying
   * on `maxTouchPoints` was too broad on some Windows systems.
   *
   * `touchscreen` remains available for broader device capability checks.
   */
  touch: supportsTouchEvents(),
  touchscreen: isTouchScreen(),
  pointer: supportsPointerEvents(),
  pointerLock: supportsPointerLock()
};
