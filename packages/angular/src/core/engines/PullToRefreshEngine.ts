import { CoordinatesEngine } from './CoordinatesEngine';
import { pointerValues } from '../utils/events';
import { V } from '../utils/maths';

type PullToRefreshEvent = PointerEvent | TouchEvent | MouseEvent;

export class PullToRefreshEngine extends CoordinatesEngine<'pullToRefresh'> {
  ingKey = 'pullingToRefresh' as const;
  override aliasKey = 'xy';

  override reset() {
    super.reset();
    const state = this.state;
    state.canceled = false;
    state.shouldRefresh = false;
    state.progress = 0;
    state.cancel = this.cancel.bind(this);
  }

  cancel() {
    const state = this.state;
    if (state.canceled) return;

    state.canceled = true;
    state.active = false;
    state._active = false;
    this.compute();
    this.emit();
  }

  pointerDown(event: PullToRefreshEvent) {
    // Only start if we're at the top of the scroll container (if required)
    if (this.config.requireScrollTop) {
      const target = event.currentTarget as HTMLElement;
      if (target.scrollTop > 0) {
        return;
      }
    }

    // For mouse events, only respond to left button
    if ('button' in event && event.button !== 0) {
      return;
    }

    if (this.state._active) return;

    this.start(event as any);
    this.computeValues(pointerValues(event as any));
    this.computeInitial();

    this.state.progress = 0;
    this.state.shouldRefresh = false;
  }

  pointerMove(event: PullToRefreshEvent) {
    if (!this.state._active) return;
    const state = this.state;
    const values = pointerValues(event as any);

    const movement = V.sub(values, state._initial);

    // Only allow downward movement (positive Y)
    if (movement[1] < 0) {
      this.cancel();
      return;
    }

    // Apply resistance if we're beyond the threshold
    const threshold = this.config.pullThreshold || 80;
    const maxDistance = this.config.maxDistance || 120;
    const resistance = this.config.resistance || 2.5;

    let pullDistance = movement[1];

    if (pullDistance > threshold) {
      const excess = pullDistance - threshold;
      pullDistance = threshold + excess / resistance;
    }

    // Limit to max distance
    pullDistance = Math.min(pullDistance, maxDistance);

    state._delta = [0, pullDistance - state._movement[1]];
    state._movement = [0, pullDistance];
    state._values = [values[0], state._initial[1] + pullDistance];

    state.progress = Math.min((pullDistance / threshold) * 100, 100);
    state.shouldRefresh = pullDistance >= threshold;

    this.computeValues(state._values);
    this.compute(event as any);
    this.emit();
  }

  pointerUp(event: PullToRefreshEvent) {
    if (!this.state._active) return;

    const state = this.state;
    state._active = false;

    this.compute(event as any);
    this.emit();

    this.clean();
  }

  bind(bindFunction: any) {
    const device = this.config.device;

    bindFunction(device, 'start', this.pointerDown.bind(this));
    bindFunction(device, 'change', this.pointerMove.bind(this));
    bindFunction(device, 'end', this.pointerUp.bind(this));
    bindFunction(device, 'cancel', this.pointerUp.bind(this));
  }
}
