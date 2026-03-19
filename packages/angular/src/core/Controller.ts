import { EngineMap } from './actions';
import { parse } from './config/resolver';
import { isTouch, parseProp, toHandlerProp, touchIds } from './utils/events';
import { EventStore } from './EventStore';
import { TimeoutStore } from './TimeoutStore';
import { chain } from './utils/fn';
import { GestureKey, InternalConfig, InternalHandlers, NativeHandlers, State, UserGestureConfig } from './types';

export class Controller {
  /**
   * The list of gestures handled by the Controller.
   */
  public gestures = new Set<GestureKey>();
  /**
   * Tracks listeners attached directly to `config.target`.
   */
  private readonly _targetEventStore = new EventStore(this);
  /**
   * Stores per-gesture event listeners.
   */
  public gestureEventStores: { [key in GestureKey]?: EventStore } = {};
  public gestureTimeoutStores: { [key in GestureKey]?: TimeoutStore } = {};
  public handlers: InternalHandlers = {};
  private nativeHandlers?: NativeHandlers;
  public config = {} as InternalConfig;
  public pointerIds = new Set<number>();
  public touchIds = new Set<number>();
  public state = {
    shared: {
      shiftKey: false,
      metaKey: false,
      ctrlKey: false,
      altKey: false
    }
  } as State;

  constructor(handlers: InternalHandlers) {
    resolveGestures(this, handlers);
  }
  /**
   * Sets pointer or touch ids based on the event.
   * @param event
   */
  setEventIds(event: TouchEvent | PointerEvent) {
    if (isTouch(event)) {
      this.touchIds = new Set(touchIds(event));
      return this.touchIds;
    } else if ('pointerId' in event) {
      if (event.type === 'pointerup' || event.type === 'pointercancel') this.pointerIds.delete(event.pointerId);
      else if (event.type === 'pointerdown') this.pointerIds.add(event.pointerId);
      return this.pointerIds;
    }
    return new Set();
  }
  /**
   * Attaches handlers to the controller.
   * @param handlers
   * @param nativeHandlers
   */
  applyHandlers(handlers: InternalHandlers, nativeHandlers?: NativeHandlers) {
    this.handlers = handlers;
    this.nativeHandlers = nativeHandlers;
  }
  /**
   * Compute and attaches a config to the controller.
   * @param config
   * @param gestureKey
   */
  applyConfig(config: UserGestureConfig, gestureKey?: GestureKey) {
    this.config = parse(config, gestureKey, this.config);
  }
  /**
   * Cleans all side effects (listeners, timeouts). When the gesture is
   * destroyed.
   */
  clean() {
    this._targetEventStore.clean();
    for (const key of this.gestures) {
      this.gestureEventStores[key].clean();
      this.gestureTimeoutStores[key].clean();
    }
  }
  /**
   * Attaches listeners when an explicit `config.target` is configured.
   */
  effect() {
    if (this.config.shared.target) {
      this.bind();
    }
    return () => this._targetEventStore.clean();
  }
  /**
   * Builds handler props and, when a target is configured, attaches them
   * directly to that target.
   * @param args
   */
  bind(...args: any[]) {
    const sharedConfig = this.config.shared;
    const props: any = {};

    let target;
    if (sharedConfig.target) {
      target = sharedConfig.target();
      // Stop early if the resolved target is not available yet.
      if (!target) return;
    }

    if (sharedConfig.enabled) {
      for (const gestureKey of this.gestures) {
        const gestureConfig = this.config[gestureKey];
        const bindFunction = bindToProps(props, gestureConfig.eventOptions, !!target);
        if (gestureConfig.enabled) {
          const Engine = EngineMap.get(gestureKey);
          if (Engine) {
            const engine = new Engine(this, args, gestureKey);
            engine.bind(bindFunction);
          }
        }
      }

      const nativeBindFunction = bindToProps(props, sharedConfig.eventOptions, !!target);
      for (const eventKey in this.nativeHandlers) {
        nativeBindFunction(
          eventKey,
          '',
          (event) => (this.nativeHandlers as any)[eventKey]({ ...this.state.shared, event, args }),
          undefined,
          true
        );
      }
    }

    // If no explicit target is configured, collapse the handler arrays into
    // single callbacks.
    for (const handlerProp in props) {
      props[handlerProp] = chain(...props[handlerProp]);
    }

    // When no target is configured, return handler props to the caller.
    if (!target) return props;

    // When a target is configured, attach listeners directly to it.
    for (const handlerProp in props) {
      const { device, capture, passive } = parseProp(handlerProp);
      this._targetEventStore.add(target, device, '', props[handlerProp], { capture, passive });
    }
  }
}

function setupGesture(ctrl: Controller, gestureKey: GestureKey) {
  ctrl.gestures.add(gestureKey);
  ctrl.gestureEventStores[gestureKey] = new EventStore(ctrl, gestureKey);
  ctrl.gestureTimeoutStores[gestureKey] = new TimeoutStore();
}

function resolveGestures(ctrl: Controller, internalHandlers: InternalHandlers) {
  // Register hover after move so its pointer-leave bookkeeping is not removed
  // too early during shared teardown paths.
  if (internalHandlers.drag) setupGesture(ctrl, 'drag');
  if (internalHandlers.wheel) setupGesture(ctrl, 'wheel');
  if (internalHandlers.scroll) setupGesture(ctrl, 'scroll');
  if (internalHandlers.move) setupGesture(ctrl, 'move');
  if (internalHandlers.pinch) setupGesture(ctrl, 'pinch');
  if (internalHandlers.hover) setupGesture(ctrl, 'hover');
  if (internalHandlers.pullToRefresh) setupGesture(ctrl, 'pullToRefresh');
}

const bindToProps =
  (props: any, eventOptions: AddEventListenerOptions, withPassiveOption: boolean) =>
  (
    device: string,
    action: string,
    handler: (event: any) => void,
    options: AddEventListenerOptions = {},
    isNative = false
  ) => {
    const capture = options.capture ?? eventOptions.capture;
    const passive = options.passive ?? eventOptions.passive;
    // Native handlers are already expressed as prop names such as `onMouseDown`.
    let handlerProp = isNative ? device : toHandlerProp(device, action, capture);
    if (withPassiveOption && passive) handlerProp += 'Passive';
    props[handlerProp] = props[handlerProp] || [];
    props[handlerProp].push(handler);
  };
