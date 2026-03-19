import { Injectable, OnDestroy } from '@angular/core';
import { Controller } from './core/Controller';
import {
  GestureKey,
  GestureHandlers,
  UserGestureConfig,
  EventTypes,
  AnyHandlerEventTypes,
  Handler,
  InternalHandlers,
  NativeHandlers,
  UserDragConfig,
  UserPinchConfig,
  UserWheelConfig,
  UserScrollConfig,
  UserMoveConfig,
  UserHoverConfig,
  UserPullToRefreshConfig
} from './core/types';
import {
  dragAction,
  pinchAction,
  scrollAction,
  wheelAction,
  moveAction,
  hoverAction,
  pullToRefreshAction,
  registerAction
} from './core/actions';
import { parseMergedHandlers } from './core/parser';
import { GestureDestroyFn } from './types';

@Injectable({
  providedIn: 'root'
})
export class GestureService implements OnDestroy {
  private readonly controllers = new Set<Controller>();

  /**
   * Creates a controller and manages its lifecycle
   */
  private createController(
    target: EventTarget,
    handlers: InternalHandlers,
    config: any = {},
    gestureKey?: GestureKey,
    nativeHandlers?: NativeHandlers
  ): GestureDestroyFn {
    const ctrl = new Controller(handlers);
    this.controllers.add(ctrl);

    ctrl.applyHandlers(handlers, nativeHandlers);
    ctrl.applyConfig({ ...config, target }, gestureKey);

    ctrl.effect();

    return () => {
      ctrl.clean();
      this.controllers.delete(ctrl);
    };
  }

  /**
   * Drag gesture service
   */
  public useDrag<EventType = EventTypes['drag']>(
    target: EventTarget,
    handler: Handler<'drag', EventType>,
    config?: UserDragConfig
  ): GestureDestroyFn {
    registerAction(dragAction);
    return this.createController(target, { drag: handler }, config || {}, 'drag');
  }

  /**
   * Pinch gesture service
   */
  public usePinch<EventType = EventTypes['pinch']>(
    target: EventTarget,
    handler: Handler<'pinch', EventType>,
    config?: UserPinchConfig
  ): GestureDestroyFn {
    registerAction(pinchAction);
    return this.createController(target, { pinch: handler }, config || {}, 'pinch');
  }

  /**
   * Wheel gesture service
   */
  public useWheel<EventType = EventTypes['wheel']>(
    target: EventTarget,
    handler: Handler<'wheel', EventType>,
    config?: UserWheelConfig
  ): GestureDestroyFn {
    registerAction(wheelAction);
    return this.createController(target, { wheel: handler }, config || {}, 'wheel');
  }

  /**
   * Scroll gesture service
   */
  public useScroll<EventType = EventTypes['scroll']>(
    target: EventTarget,
    handler: Handler<'scroll', EventType>,
    config?: UserScrollConfig
  ): GestureDestroyFn {
    registerAction(scrollAction);
    return this.createController(target, { scroll: handler }, config || {}, 'scroll');
  }

  /**
   * Move gesture service
   */
  public useMove<EventType = EventTypes['move']>(
    target: EventTarget,
    handler: Handler<'move', EventType>,
    config?: UserMoveConfig
  ): GestureDestroyFn {
    registerAction(moveAction);
    return this.createController(target, { move: handler }, config || {}, 'move');
  }

  /**
   * Hover gesture service
   */
  public useHover<EventType = EventTypes['hover']>(
    target: EventTarget,
    handler: Handler<'hover', EventType>,
    config?: UserHoverConfig
  ): GestureDestroyFn {
    registerAction(hoverAction);
    return this.createController(target, { hover: handler }, config || {}, 'hover');
  }

  /**
   * Pull-to-refresh gesture service
   */
  public usePullToRefresh<EventType = EventTypes['pullToRefresh']>(
    target: EventTarget,
    handler: Handler<'pullToRefresh', EventType>,
    config?: UserPullToRefreshConfig
  ): GestureDestroyFn {
    registerAction(pullToRefreshAction);

    const result = this.createController(target, { pullToRefresh: handler }, config || {}, 'pullToRefresh');

    return result;
  }

  /**
   * Multi-gesture service
   */
  public useGesture<
    HandlerTypes extends AnyHandlerEventTypes = EventTypes,
    Config extends UserGestureConfig = UserGestureConfig
  >(target: EventTarget, handlers: GestureHandlers<HandlerTypes>, config?: Config): GestureDestroyFn {
    [dragAction, pinchAction, scrollAction, wheelAction, moveAction, hoverAction, pullToRefreshAction].forEach(
      (action) => registerAction(action)
    );

    const parsed = parseMergedHandlers(handlers, config || {});
    return this.createController(target, parsed.handlers, parsed.config, undefined, parsed.nativeHandlers);
  }

  public ngOnDestroy() {
    this.controllers.forEach((ctrl) => ctrl.clean());
    this.controllers.clear();
  }
}
