import { CoordinatesEngine } from './CoordinatesEngine';
import { coordinatesConfigResolver } from '../config/coordinatesConfigResolver';
import { pointerId, getPointerType, pointerValues } from '../utils/events';
import { V } from '../utils/maths';
import { Vector2 } from '../types';

const KEYS_DELTA_MAP = {
  ArrowRight: (displacement: number, factor: number = 1) => [displacement * factor, 0],
  ArrowLeft: (displacement: number, factor: number = 1) => [-1 * displacement * factor, 0],
  ArrowUp: (displacement: number, factor: number = 1) => [0, -1 * displacement * factor],
  ArrowDown: (displacement: number, factor: number = 1) => [0, displacement * factor]
};

export class DragEngine extends CoordinatesEngine<'drag'> {
  ingKey = 'dragging' as const;

  // Overrides the generic Engine reset logic with drag-specific state.
  override reset(this: DragEngine) {
    super.reset();
    const state = this.state;
    state._pointerId = undefined;
    state._pointerActive = false;
    state._keyboardActive = false;
    state._preventScroll = false;
    state._delayed = false;
    state.swipe = [0, 0];
    state.tap = false;
    state.canceled = false;
    state.cancel = this.cancel.bind(this);
  }

  override setup() {
    const state = this.state;

    if (state._bounds instanceof HTMLElement) {
      const boundRect = state._bounds.getBoundingClientRect();
      const targetRect = (state.currentTarget as HTMLElement).getBoundingClientRect();
      const _bounds = {
        left: boundRect.left - targetRect.left + state.offset[0],
        right: boundRect.right - targetRect.right + state.offset[0],
        top: boundRect.top - targetRect.top + state.offset[1],
        bottom: boundRect.bottom - targetRect.bottom + state.offset[1]
      };
      state._bounds = coordinatesConfigResolver.bounds(_bounds) as [Vector2, Vector2];
    }
  }

  cancel() {
    const state = this.state;
    if (state.canceled) return;
    state.canceled = true;
    state._active = false;
    setTimeout(() => {
      // Recompute without a triggering event so kinematics are not recalculated.
      this.compute();
      this.emit();
    }, 0);
  }

  setActive() {
    this.state._active = this.state._pointerActive || this.state._keyboardActive;
  }

  // Overrides Engine.clean with drag-specific pointer cleanup.
  override clean() {
    this.pointerClean();
    this.state._pointerActive = false;
    this.state._keyboardActive = false;
    super.clean();
  }

  pointerDown(event: PointerEvent) {
    const config = this.config;
    const state = this.state;

    if (
      event.buttons != null &&
      // When `pointer.buttons` is an array, require the current button
      // combination to be included.
      (Array.isArray(config.pointerButtons)
        ? !config.pointerButtons.includes(event.buttons)
        : // When `pointer.buttons` is a number, require an exact match unless
          // `-1` is used to allow any combination.
          config.pointerButtons !== -1 && config.pointerButtons !== event.buttons)
    )
      return;

    const ctrlIds = this.ctrl.setEventIds(event);
    // Capture the pointer so release events can still be observed off-target.
    if (config.pointerCapture) {
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    if (
      // in some situations described in project issue #494
      // like when a new browser tab is opened during a drag gesture, the drag
      // can be interrupted mid-way, and can stall. This happens because the
      // pointerId that initiated the gesture is lost, and since the drag
      // persists until that pointerId is lifted with pointerup, it never ends.
      //
      // Therefore, when we detect that only one pointer is pressing the screen,
      // we consider that the gesture can proceed.
      ctrlIds &&
      ctrlIds.size > 1 &&
      state._pointerActive
    )
      return;

    this.start(event);
    this.setupPointer(event);

    state._pointerId = pointerId(event);
    state._pointerActive = true;

    this.computeValues(pointerValues(event));
    this.computeInitial();

    if (config.preventScrollAxis && getPointerType(event) !== 'mouse') {
      // Delay activation until the gesture becomes intentional so native scroll
      // can win when appropriate.
      state._active = false;
      this.setupScrollPrevention(event);
    } else if (config.delay > 0) {
      this.setupDelayTrigger(event);
      // Keep `triggerAllEvents` behavior consistent even while the drag is delayed.
      if (config.triggerAllEvents) {
        this.compute(event);
        this.emit();
      }
    } else {
      this.startPointerDrag(event);
    }
  }

  startPointerDrag(event: PointerEvent) {
    const state = this.state;
    state._active = true;
    state._preventScroll = true;
    state._delayed = false;

    this.compute(event);
    this.emit();
  }

  private handleDelayedDrag(event: PointerEvent): boolean {
    const state = this.state;
    if (state._delayed && state.intentional) {
      this.timeoutStore.remove('dragDelay');
      // makes sure `first` is still true when moving for the first time after a
      // delay.
      state.active = false;
      this.startPointerDrag(event);
      return true;
    }
    return false;
  }

  private handlePreventScrollAxis(event: PointerEvent): boolean {
    const state = this.state;
    const config = this.config;
    if (!(config.preventScrollAxis && !state._preventScroll)) return false;

    if (!state.axis) return true;

    if (state.axis === config.preventScrollAxis || config.preventScrollAxis === 'xy') {
      state._active = false;
      this.clean();
      return true;
    } else {
      this.timeoutStore.remove('startPointerDrag');
      this.startPointerDrag(event);
      return true;
    }
  }

  pointerMove(event: PointerEvent) {
    const state = this.state;

    if (!state._pointerActive) return;

    const id = pointerId(event);
    if (state._pointerId !== undefined && id !== state._pointerId) return;
    const _values = pointerValues(event);

    if (document.pointerLockElement === event.target) {
      state._delta = [event.movementX, event.movementY];
    } else {
      state._delta = V.sub(_values, state._values);
      this.computeValues(_values);
    }

    V.addTo(state._movement, state._delta);
    this.compute(event);

    // Start immediately once a delayed gesture becomes intentional.
    if (this.handleDelayedDrag(event)) return;

    if (this.handlePreventScrollAxis(event)) return;

    this.emit();
  }

  pointerUp(event: PointerEvent) {
    this.ctrl.setEventIds(event);
    this.releasePointerCapture(event);

    if (!this.isValidPointer(event)) return;

    this.state._pointerActive = false;
    this.setActive();
    this.compute(event);

    this.handleTapDetection();
    this.handleSwipeDetection();

    this.emit();
  }

  private releasePointerCapture(event: PointerEvent) {
    try {
      if (this.config.pointerCapture && (event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
        // Browsers should release capture automatically, but doing it here
        // keeps teardown predictable across implementations.
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore pointer-capture release failures in edge cases.
    }
  }

  private isValidPointer(event: PointerEvent): boolean {
    const state = this.state;
    if (!state._active || !state._pointerActive) return false;

    const id = pointerId(event);
    if (state._pointerId !== undefined && id !== state._pointerId) return false;

    return true;
  }

  private handleTapDetection() {
    const state = this.state;
    const config = this.config;
    const [dx, dy] = state._distance;
    state.tap = dx <= config.tapsThreshold && dy <= config.tapsThreshold;

    if (state.tap && config.filterTaps) {
      state._force = true;
    }
  }

  private handleSwipeDetection() {
    const state = this.state;
    const config = this.config;

    if (state.tap && config.filterTaps) return;

    const [_dx, _dy] = state._delta;
    const [_mx, _my] = state._movement;
    const [svx, svy] = config.swipe.velocity;
    const [sx, sy] = config.swipe.distance;
    const sdt = config.swipe.duration;

    if (state.elapsedTime < sdt) {
      const _vx = Math.abs(_dx / state.timeDelta);
      const _vy = Math.abs(_dy / state.timeDelta);

      if (_vx > svx && Math.abs(_mx) > sx) state.swipe[0] = Math.sign(_dx);
      if (_vy > svy && Math.abs(_my) > sy) state.swipe[1] = Math.sign(_dy);
    }
  }

  pointerClick(event: MouseEvent) {
    // event.detail indicates the number of buttons being pressed. When it's
    // null, it's likely to be a keyboard event from the Enter Key that could
    // be used for accessibility, and therefore shouldn't be prevented.
    if (!this.state.tap && event.detail > 0) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  setupPointer(event: PointerEvent) {
    const config = this.config;
    const device = config.device;

    if (config.pointerLock) {
      (event.currentTarget as HTMLElement).requestPointerLock();
    }

    if (!config.pointerCapture) {
      this.eventStore.add(this.sharedConfig.window, device, 'change', this.pointerMove.bind(this));
      this.eventStore.add(this.sharedConfig.window, device, 'end', this.pointerUp.bind(this));
      this.eventStore.add(this.sharedConfig.window, device, 'cancel', this.pointerUp.bind(this));
    }
  }

  pointerClean() {
    if (this.config.pointerLock && document.pointerLockElement === this.state.currentTarget) {
      document.exitPointerLock();
    }
  }

  preventScroll(event: PointerEvent) {
    if (this.state._preventScroll && event.cancelable) {
      event.preventDefault();
    }
  }

  setupScrollPrevention(event: PointerEvent) {
    this.state._preventScroll = false;
    persistEvent(event);
    // Add window listeners so native scrolling can be blocked once dragging starts.
    const remove = this.eventStore.add(this.sharedConfig.window, 'touch', 'change', this.preventScroll.bind(this), {
      passive: false
    });
    this.eventStore.add(this.sharedConfig.window, 'touch', 'end', remove);
    this.eventStore.add(this.sharedConfig.window, 'touch', 'cancel', remove);
    this.timeoutStore.add('startPointerDrag', this.startPointerDrag.bind(this), this.config.preventScrollDelay, event);
  }

  setupDelayTrigger(event: PointerEvent) {
    this.state._delayed = true;
    this.timeoutStore.add(
      'dragDelay',
      () => {
        // Force the drag to start once the delay elapses, regardless of threshold.
        this.state._step = [0, 0];
        this.startPointerDrag(event);
      },
      this.config.delay
    );
  }

  keyDown(event: KeyboardEvent) {
    const deltaFn = (KEYS_DELTA_MAP as any)[event.key];
    if (deltaFn) {
      const state = this.state;
      let factor: number;
      if (event.shiftKey) {
        factor = 10;
      } else if (event.altKey) {
        factor = 0.1;
      } else {
        factor = 1;
      }
      this.start(event);

      state._delta = deltaFn(this.config.keyboardDisplacement, factor);
      state._keyboardActive = true;
      V.addTo(state._movement, state._delta);

      this.compute(event);
      this.emit();
    }
  }

  keyUp(event: KeyboardEvent) {
    if (!(event.key in KEYS_DELTA_MAP)) return;

    this.state._keyboardActive = false;
    this.setActive();
    this.compute(event);
    this.emit();
  }

  bind(bindFunction: any) {
    const device = this.config.device;

    bindFunction(device, 'start', this.pointerDown.bind(this));

    if (this.config.pointerCapture) {
      bindFunction(device, 'change', this.pointerMove.bind(this));
      bindFunction(device, 'end', this.pointerUp.bind(this));
      bindFunction(device, 'cancel', this.pointerUp.bind(this));
      bindFunction('lostPointerCapture', '', this.pointerUp.bind(this));
    }

    if (this.config.keys) {
      bindFunction('key', 'down', this.keyDown.bind(this));
      bindFunction('key', 'up', this.keyUp.bind(this));
    }
    if (this.config.filterTaps) {
      bindFunction('click', '', this.pointerClick.bind(this), { capture: true, passive: false });
    }
  }
}

function persistEvent(event: PointerEvent) {
  'persist' in event && typeof event.persist === 'function' && event.persist();
}
