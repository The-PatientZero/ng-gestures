import { ElementRef } from '@angular/core';
import { GestureService } from '../gesture.service';
import { GesturesDirective } from './gestures.directive';
import { LegacyGestureAdapterDirective } from './legacy-gesture-adapter.directive';
import { UseDragDirective } from './use-drag.directive';

function createPointerEvent(type: string, options: Record<string, any> = {}) {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    buttons: 1,
    button: 0,
    clientX: 0,
    clientY: 0,
    ...options
  });

  if (options.timeStamp !== undefined) {
    Object.defineProperty(event, 'timeStamp', {
      configurable: true,
      value: options.timeStamp
    });
  }

  return event;
}

function createTarget() {
  const target = document.createElement('div');
  Object.defineProperty(target, 'scrollTop', {
    configurable: true,
    writable: true,
    value: 0
  });
  document.body.appendChild(target);
  return target;
}

describe('Angular directives', () => {
  it('emits lifecycle outputs for UseDragDirective', () => {
    const target = createTarget();
    const directive = new UseDragDirective(new ElementRef(target), new GestureService());
    const start = jest.fn();
    const move = jest.fn();
    const end = jest.fn();

    directive.useDragConfig = {
      threshold: 0
    };
    directive.onDragStart.subscribe(start);
    directive.onDrag.subscribe(move);
    directive.onDragEnd.subscribe(end);
    directive.ngOnInit();

    target.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20, timeStamp: 0 }));
    target.dispatchEvent(createPointerEvent('pointermove', { clientX: 20, clientY: 20, timeStamp: 10 }));
    target.dispatchEvent(createPointerEvent('pointerup', { clientX: 20, clientY: 20, timeStamp: 20 }));

    expect(start).toHaveBeenCalledTimes(1);
    expect(move).toHaveBeenCalled();
    expect(end).toHaveBeenCalledTimes(1);

    directive.ngOnDestroy();
  });

  it('wires combined outputs for GesturesDirective including pull-to-refresh', () => {
    const target = createTarget();
    const directive = new GesturesDirective(new ElementRef(target), new GestureService());
    const drag = jest.fn();
    const pull = jest.fn();

    directive.gesturesConfig = {
      drag: {
        threshold: 0
      },
      pullToRefresh: {
        threshold: 80
      }
    };

    directive.onDrag.subscribe(drag);
    directive.onPullToRefresh.subscribe(pull);
    directive.ngOnInit();

    target.dispatchEvent(createPointerEvent('pointerdown', { clientX: 50, clientY: 200, timeStamp: 0 }));
    target.dispatchEvent(createPointerEvent('pointermove', { clientX: 80, clientY: 220, timeStamp: 10 }));
    target.dispatchEvent(createPointerEvent('pointerup', { clientX: 80, clientY: 220, timeStamp: 20 }));

    expect(drag).toHaveBeenCalled();
    expect(pull).toHaveBeenCalled();
    expect(pull.mock.calls[0][0].progress).toBe(25);

    directive.ngOnDestroy();
  });

  it('emits HammerJS-style pan lifecycle and swipe events from the legacy adapter', () => {
    const target = createTarget();
    const directive = new LegacyGestureAdapterDirective(new ElementRef(target), new GestureService());
    const panstart = jest.fn();
    const pan = jest.fn();
    const panend = jest.fn();
    const swipe = jest.fn();

    directive.panstart.subscribe(panstart);
    directive.pan.subscribe(pan);
    directive.panend.subscribe(panend);
    directive.swipe.subscribe(swipe);
    directive.ngOnInit();

    target.dispatchEvent(createPointerEvent('pointerdown', { clientX: 0, clientY: 0, timeStamp: 0 }));
    target.dispatchEvent(createPointerEvent('pointermove', { clientX: 120, clientY: 0, timeStamp: 10 }));
    target.dispatchEvent(createPointerEvent('pointerup', { clientX: 120, clientY: 0, timeStamp: 20 }));

    expect(panstart).toHaveBeenCalledTimes(1);
    expect(pan).toHaveBeenCalled();
    expect(panend).toHaveBeenCalledTimes(1);
    expect(swipe).toHaveBeenCalledTimes(1);

    directive.ngOnDestroy();
  });
});
