import { CommonGestureState } from '../types';

export function clampStateInternalMovementToBounds(state: CommonGestureState) {
  const [ox, oy] = state.overflow;
  const [dx, dy] = state._delta;
  const [dirx, diry] = state._direction;

  if ((ox < 0 && dx > 0 && dirx < 0) || (ox > 0 && dx < 0 && dirx > 0)) {
    state._movement[0] = state._movementBound[0] as number;
  }

  if ((oy < 0 && dy > 0 && diry < 0) || (oy > 0 && dy < 0 && diry > 0)) {
    state._movement[1] = state._movementBound[1] as number;
  }
}
