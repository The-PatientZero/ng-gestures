import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Custom Jest matchers for Angular testing
import '@angular/core/testing';

setupZoneTestEnv();

// Mock PointerEvent for older browsers or test environments
if (!global.PointerEvent) {
  global.PointerEvent = class PointerEvent extends Event {
    pointerId: number;
    pressure: number;
    isPrimary: boolean;
    clientX: number;
    clientY: number;
    button: number;
    buttons: number;

    constructor(type: string, options: any = {}) {
      super(type, options);
      this.pointerId = options.pointerId || 1;
      this.pressure = options.pressure || 0.5;
      this.isPrimary = options.isPrimary || true;
      this.clientX = options.clientX || 0;
      this.clientY = options.clientY || 0;
      this.button = options.button || 0;
      this.buttons = options.buttons || 1;
    }
  } as any;
}

if (!('onpointerdown' in window)) {
  (window as any).onpointerdown = null;
}

// Mock TouchEvent if not available
if (!global.TouchEvent) {
  global.TouchEvent = class TouchEvent extends Event {
    touches: TouchList;
    targetTouches: TouchList;
    changedTouches: TouchList;

    constructor(type: string, options: any = {}) {
      super(type, options);
      this.touches = options.touches || [];
      this.targetTouches = options.targetTouches || [];
      this.changedTouches = options.changedTouches || [];
    }
  } as any;
}

// Mock requestAnimationFrame and cancelAnimationFrame
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb: FrameRequestCallback): number => {
    return setTimeout(cb, 16);
  };
}

if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = (id: number): void => {
    clearTimeout(id);
  };
}

if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => undefined;
}

if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => undefined;
}

if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.requestPointerLock) {
  HTMLElement.prototype.requestPointerLock = () => undefined;
}

if (!document.exitPointerLock) {
  document.exitPointerLock = () => undefined;
}

// Mock performance.now()
if (!global.performance?.now) {
  global.performance = global.performance || ({} as any);
  global.performance.now = global.performance.now || (() => Date.now());
}

// Suppress console warnings during tests
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
  document.body.innerHTML = '';
});
