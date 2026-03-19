import { DragConfig, InternalDragOptions, Vector2, PointerType } from '../types';
import { V } from '../utils/maths';
import { coordinatesConfigResolver } from './coordinatesConfigResolver';
import { SUPPORT } from './support';

export const DEFAULT_PREVENT_SCROLL_DELAY = 250;
export const DEFAULT_DRAG_DELAY = 180;
export const DEFAULT_SWIPE_VELOCITY = 0.5;
export const DEFAULT_SWIPE_DISTANCE = 50;
export const DEFAULT_SWIPE_DURATION = 250;
export const DEFAULT_KEYBOARD_DISPLACEMENT = 10;

const DEFAULT_DRAG_AXIS_THRESHOLD: Record<PointerType, number> = { mouse: 0, touch: 0, pen: 8 };

export const dragConfigResolver = {
  ...coordinatesConfigResolver,
  device(
    this: InternalDragOptions,
    _v: any,
    _k: string,
    { pointer: { touch = false, lock = false, mouse = false } = {} }: DragConfig
  ) {
    this.pointerLock = lock && SUPPORT.pointerLock;
    if (SUPPORT.touch && touch) return 'touch';
    if (this.pointerLock) return 'mouse';
    if (SUPPORT.pointer && !mouse) return 'pointer';
    if (SUPPORT.touch) return 'touch';
    return 'mouse';
  },
  preventScrollAxis(this: InternalDragOptions, value: 'x' | 'y' | 'xy', _k: string, { preventScroll }: DragConfig) {
    const delayValue =
      preventScroll || (preventScroll === undefined && value) ? DEFAULT_PREVENT_SCROLL_DELAY : undefined;
    this.preventScrollDelay = typeof preventScroll === 'number' ? preventScroll : delayValue;
    if (!SUPPORT.touchscreen || preventScroll === false) return undefined;
    if (value) return value;
    if (preventScroll !== undefined) return 'y';
    return undefined;
  },
  pointerCapture(
    this: InternalDragOptions,
    _v: any,
    _k: string,
    { pointer: { capture = true, buttons = 1, keys = true } = {} }
  ) {
    this.pointerButtons = buttons;
    this.keys = keys;
    return !this.pointerLock && this.device === 'pointer' && capture;
  },
  threshold(
    this: InternalDragOptions,
    value: number | Vector2,
    _k: string,
    { filterTaps = false, tapsThreshold = 3, axis = undefined }
  ) {
    if ((typeof value === 'number' && value === 0) || (typeof value === 'object' && value[0] === 0 && value[1] === 0)) {
      if (filterTaps || axis) {
        console.warn('Warning: threshold value is 0 but filterTaps or axis is set, which may not behave as expected.');
      }
    }
    let defaultValue: number;
    if (filterTaps) {
      defaultValue = tapsThreshold;
    } else if (axis) {
      defaultValue = 1;
    } else {
      defaultValue = 0;
    }
    const threshold = V.toVector(value, defaultValue);
    this.filterTaps = filterTaps;
    this.tapsThreshold = tapsThreshold;
    return threshold;
  },
  swipe(
    this: InternalDragOptions,
    { velocity = DEFAULT_SWIPE_VELOCITY, distance = DEFAULT_SWIPE_DISTANCE, duration = DEFAULT_SWIPE_DURATION } = {}
  ) {
    return {
      velocity: this.transform(V.toVector(velocity)),
      distance: this.transform(V.toVector(distance)),
      duration
    };
  },
  delay(value: number | boolean = 0) {
    switch (value) {
      case true:
        return DEFAULT_DRAG_DELAY;
      case false:
        return 0;
      default:
        return value;
    }
  },
  axisThreshold(value: Record<PointerType, number>) {
    if (!value) return DEFAULT_DRAG_AXIS_THRESHOLD;
    return { ...DEFAULT_DRAG_AXIS_THRESHOLD, ...value };
  },
  keyboardDisplacement(value: number = DEFAULT_KEYBOARD_DISPLACEMENT) {
    return value;
  }
};
