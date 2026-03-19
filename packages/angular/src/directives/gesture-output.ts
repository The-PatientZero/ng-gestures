import { EventEmitter } from '@angular/core';
import type { GestureKey } from '../core/types';
import type { AngularGestureState } from '../types';

type LifecycleGestureKey = Exclude<GestureKey, 'hover'>;

type LifecycleEmitters<Key extends LifecycleGestureKey> = {
  start: EventEmitter<AngularGestureState<Key>>;
  main: EventEmitter<AngularGestureState<Key>>;
  end: EventEmitter<AngularGestureState<Key>>;
};

export function emitGestureLifecycle<Key extends LifecycleGestureKey>(
  state: AngularGestureState<Key>,
  emitters: LifecycleEmitters<Key>
) {
  if (state.first) emitters.start.emit(state);
  emitters.main.emit(state);
  if (state.last) emitters.end.emit(state);
}
