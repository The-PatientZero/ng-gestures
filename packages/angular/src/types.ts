import { EventTypes, FullGestureState, GestureKey, UserGestureConfig } from './core/types';

export interface AngularGestureEvent<T = any> {
  detail: T;
  target: EventTarget | null;
}

export type AngularGestureState<
  GestureType extends GestureKey,
  EventType = EventTypes[GestureType]
> = Omit<FullGestureState<GestureType>, 'event'> & {
  event: EventType;
};

export type AngularHandler<GestureType extends GestureKey, EventType = EventTypes[GestureType]> = (
  event: AngularGestureState<GestureType, EventType>
) => void;

export interface AngularGestureConfig extends UserGestureConfig {}

export type GestureDestroyFn = () => void;
