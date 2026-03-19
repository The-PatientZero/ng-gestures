import { PinchConfig, GenericOptions, InternalPinchOptions, State, Vector2, ModifierKey } from '../types';
import { call, assignDefault } from '../utils/fn';
import { V } from '../utils/maths';
import { commonConfigResolver } from './commonConfigResolver';
import { SUPPORT } from './support';

export const pinchConfigResolver = {
  ...commonConfigResolver,
  device(
    this: InternalPinchOptions,
    _v: any,
    _k: string,
    { shared, pointer: { touch = false } = {} }: { shared: GenericOptions } & PinchConfig
  ) {
    // Use native gesture events only when the browser supports them and an
    // explicit target is available.
    const sharedConfig = shared;
    if (sharedConfig.target && !SUPPORT.touch && SUPPORT.gesture) return 'gesture';
    if (SUPPORT.touch && touch) return 'touch';
    if (SUPPORT.touchscreen) {
      if (SUPPORT.pointer) return 'pointer';
      if (SUPPORT.touch) return 'touch';
    }
    // Returning `undefined` falls back to wheel-based pinch support.
    return undefined;
  },
  bounds(_v: any, _k: string, { scaleBounds = {}, angleBounds = {} }: PinchConfig) {
    const _scaleBounds = (state?: State) => {
      const D = assignDefault(call(scaleBounds, state), { min: -Infinity, max: Infinity });
      return [D.min, D.max];
    };

    const _angleBounds = (state?: State) => {
      const A = assignDefault(call(angleBounds, state), { min: -Infinity, max: Infinity });
      return [A.min, A.max];
    };

    if (typeof scaleBounds !== 'function' && typeof angleBounds !== 'function') return [_scaleBounds(), _angleBounds()];

    return (state: State) => [_scaleBounds(state), _angleBounds(state)];
  },
  threshold(this: InternalPinchOptions, value: number | Vector2, _k: string, config: PinchConfig) {
    this.lockDirection = config.axis === 'lock';
    const threshold = V.toVector(value, this.lockDirection ? [0.1, 3] : 0);
    return threshold;
  },
  modifierKey(value: ModifierKey | ModifierKey[]) {
    if (value === undefined) return 'ctrlKey';
    return value;
  },
  pinchOnWheel(value = true) {
    return value;
  }
};
