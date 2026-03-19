import { GestureService } from './gesture.service';

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

function createMouseEvent(type: string, options: Record<string, any> = {}) {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: 0,
    buttons: 1,
    clientX: 0,
    clientY: 0,
    ...options
  });
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

describe('GestureService', () => {
  it('wires useGesture lifecycle and native handlers', () => {
    const service = new GestureService();
    const target = createTarget();
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    const onClick = jest.fn();

    const destroy = service.useGesture(
      target,
      {
        onDragStart,
        onDrag,
        onDragEnd,
        onClick
      },
      {
        drag: {
          threshold: 0
        }
      }
    );

    target.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20, timeStamp: 0 }));
    target.dispatchEvent(createPointerEvent('pointermove', { clientX: 40, clientY: 20, timeStamp: 10 }));
    target.dispatchEvent(createPointerEvent('pointerup', { clientX: 40, clientY: 20, timeStamp: 20 }));
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenCalled();
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragStart.mock.calls[0][0].first).toBe(true);
    expect(onDragEnd.mock.calls[0][0].last).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(1);

    destroy();
  });

  it('starts pull-to-refresh from the pointer-down position and ignores mouse compatibility events', () => {
    const service = new GestureService();
    const target = createTarget();
    const handler = jest.fn();

    const destroy = service.usePullToRefresh(target, handler, { threshold: 80 });

    target.dispatchEvent(createPointerEvent('pointerdown', { clientX: 50, clientY: 200, timeStamp: 0 }));
    target.dispatchEvent(createPointerEvent('pointermove', { clientX: 50, clientY: 220, timeStamp: 10 }));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].progress).toBe(25);
    expect(handler.mock.calls[0][0].shouldRefresh).toBe(false);

    target.dispatchEvent(createMouseEvent('mousemove', { clientX: 50, clientY: 260 }));
    expect(handler).toHaveBeenCalledTimes(1);

    target.dispatchEvent(createPointerEvent('pointerup', { clientX: 50, clientY: 220, timeStamp: 20 }));

    expect(handler.mock.calls[handler.mock.calls.length - 1]?.[0].last).toBe(true);

    destroy();
  });
});
