import { commonConfigResolver } from './commonConfigResolver';
import { InternalCoordinatesOptions, CoordinatesConfig, Bounds, DragBounds, State, Vector2 } from '../types';

const DEFAULT_AXIS_THRESHOLD = 0;

export const coordinatesConfigResolver = {
  ...commonConfigResolver,
  axis(
    this: InternalCoordinatesOptions,
    _v: any,
    _k: string,
    { axis }: CoordinatesConfig
  ): InternalCoordinatesOptions['axis'] {
    this.lockDirection = axis === 'lock';
    if (!this.lockDirection) return axis as any;
    return undefined;
  },
  axisThreshold(value = DEFAULT_AXIS_THRESHOLD) {
    return value;
  },
  bounds(
    value: DragBounds | ((state: State) => DragBounds) = {}
  ): [Vector2, Vector2] | ((state: State) => [Vector2, Vector2]) {
    if (typeof value === 'function') {
      return (state: State) => {
        const boundsValue = value(state);
        return coordinatesConfigResolver.bounds(boundsValue) as [Vector2, Vector2];
      };
    }

    if ('current' in value) {
      return (_state: State) => {
        const element = value.current;
        if (!element)
          return [
            [-Infinity, Infinity],
            [-Infinity, Infinity]
          ];
        const rect = element.getBoundingClientRect();
        return [
          [rect.left, rect.right],
          [rect.top, rect.bottom]
        ];
      };
    }

    if (typeof HTMLElement === 'function' && value instanceof HTMLElement) {
      return (_state: State) => {
        const rect = value.getBoundingClientRect();
        return [
          [rect.left, rect.right],
          [rect.top, rect.bottom]
        ];
      };
    }

    const { left = -Infinity, right = Infinity, top = -Infinity, bottom = Infinity } = value as Bounds;

    return [
      [left, right],
      [top, bottom]
    ];
  }
};
