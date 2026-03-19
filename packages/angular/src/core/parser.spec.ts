import {
  dragAction,
  pullToRefreshAction,
  registerAction,
  scrollAction,
  hoverAction,
  moveAction,
  pinchAction,
  wheelAction
} from './actions';
import { parseMergedHandlers } from './parser';

function createState(first = false, last = false) {
  return {
    first,
    last
  } as any;
}

describe('parseMergedHandlers', () => {
  [dragAction, pinchAction, scrollAction, wheelAction, moveAction, hoverAction, pullToRefreshAction].forEach((action) =>
    registerAction(action)
  );

  it('maps public gesture handlers to internal handlers and preserves native handlers', () => {
    const onDragStart = jest.fn();
    const onDrag = jest.fn();
    const onDragEnd = jest.fn();
    const onPullToRefresh = jest.fn();
    const onClick = jest.fn();

    const result = parseMergedHandlers(
      {
        onDragStart,
        onDrag,
        onDragEnd,
        onPullToRefresh,
        onClick
      },
      {}
    );

    expect(result.handlers.drag).toBeDefined();
    expect(result.handlers.pullToRefresh).toBeDefined();
    expect(result.nativeHandlers.onClick).toBe(onClick);
    expect(result.config.drag).toEqual({});
    expect(result.config.pullToRefresh).toEqual({});

    result.handlers.drag?.(createState(true, false));
    result.handlers.drag?.(createState(false, true));
    result.handlers.pullToRefresh?.(createState(false, false));

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenCalledTimes(2);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onPullToRefresh).toHaveBeenCalledTimes(1);
  });
});
