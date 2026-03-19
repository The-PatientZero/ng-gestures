import { CoordinatesEngine } from './CoordinatesEngine';
import { wheelValues } from '../utils/events';
import { V } from '../utils/maths';
import { clampStateInternalMovementToBounds } from '../utils/state';

export interface BaseWheelEngine extends CoordinatesEngine<'wheel'> {
  wheel(this: BaseWheelEngine, event: WheelEvent): void;
  wheelChange(this: BaseWheelEngine, event: WheelEvent): void;
  wheelEnd(this: BaseWheelEngine): void;
}

export class WheelEngine extends CoordinatesEngine<'wheel'> implements BaseWheelEngine {
  ingKey = 'wheeling' as const;

  wheel(event: WheelEvent) {
    // Prevent default browser behavior immediately for Ctrl/Cmd + wheel (zoom) and Shift + wheel (horizontal scroll)
    if (this.config.preventDefault && (event.ctrlKey || event.metaKey || event.shiftKey)) {
      event.preventDefault();
    }

    if (!this.state._active) this.start(event);
    this.wheelChange(event);
    this.timeoutStore.add('wheelEnd', this.wheelEnd.bind(this));
  }

  wheelChange(event: WheelEvent) {
    const state = this.state;
    state._delta = wheelValues(event);
    V.addTo(state._movement, state._delta);

    // _movement rolls back to when it passed the bounds.
    clampStateInternalMovementToBounds(state);

    this.compute(event);
    this.emit();
  }

  wheelEnd() {
    if (!this.state._active) return;
    this.state._active = false;
    this.compute();
    this.emit();
  }

  bind(bindFunction: any) {
    bindFunction('wheel', '', this.wheel.bind(this));
  }
}
