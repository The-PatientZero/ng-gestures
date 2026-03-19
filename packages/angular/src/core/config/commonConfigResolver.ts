import { InternalGestureOptions, Vector2, State, GenericOptions } from '../types';
import { V } from '../utils/maths';

export const identity = (v: Vector2) => v;
export const DEFAULT_RUBBERBAND = 0.15;

export const commonConfigResolver = {
  enabled(value = true) {
    return value;
  },
  eventOptions(value: AddEventListenerOptions | undefined, _k: string, config: { shared: GenericOptions }) {
    return { ...config.shared.eventOptions, ...value };
  },
  preventDefault(value = false) {
    return value;
  },
  triggerAllEvents(value = false) {
    return value;
  },
  rubberband(value: number | boolean | Vector2 = 0): Vector2 {
    switch (value) {
      case true:
        return [DEFAULT_RUBBERBAND, DEFAULT_RUBBERBAND];
      case false:
        return [0, 0];
      default:
        return V.toVector(value);
    }
  },
  from(value: number | Vector2 | ((s: State) => Vector2)) {
    if (typeof value === 'function') return value;
    if (value !== null && value !== undefined) return V.toVector(value);
    return [0, 0];
  },
  transform(this: InternalGestureOptions, value: any, _k: string, config: { shared: GenericOptions }) {
    const transform = value || config.shared.transform;
    this.hasCustomTransform = !!transform;

    const isDevelopment = false; // Disabled for browser compatibility
    if (isDevelopment) {
      const originalTransform = transform || identity;
      return (v: Vector2) => {
        const r = originalTransform(v);
        if (!isFinite(r[0]) || !isFinite(r[1])) {
          console.warn(
            `[ng-gestures]: config.transform() must produce a valid result, but it was: [${r[0]},${[1]}]`
          );
        }
        return r;
      };
    }
    return transform || identity;
  },
  threshold(value: any) {
    return V.toVector(value, 0);
  }
};

const isDevelopment = false; // Disabled for browser compatibility
if (isDevelopment) {
  Object.assign(commonConfigResolver, {
    domTarget(value: any) {
      if (value !== undefined) {
        throw Error(`[ng-gestures]: \`domTarget\` option has been renamed to \`target\`.`);
      }
      return NaN;
    },
    lockDirection(value: any) {
      if (value !== undefined) {
        throw Error(
          `[ng-gestures]: \`lockDirection\` option has been merged with \`axis\`. Use it as in \`{ axis: 'lock' }\``
        );
      }
      return NaN;
    },
    initial(value: any) {
      if (value !== undefined) {
        throw Error(`[ng-gestures]: \`initial\` option has been renamed to \`from\`.`);
      }
      return NaN;
    }
  });
}
