import { FullGestureState, GestureHandlers, GestureKey, InternalHandlers, UserGestureConfig } from './types';
import { EngineMap } from './actions';

const PUBLIC_HANDLER_TO_GESTURE = {
  onDrag: 'drag',
  onWheel: 'wheel',
  onScroll: 'scroll',
  onPinch: 'pinch',
  onMove: 'move',
  onHover: 'hover',
  onPullToRefresh: 'pullToRefresh'
} as const satisfies Record<string, GestureKey>;

type PublicBaseHandlerKey = keyof typeof PUBLIC_HANDLER_TO_GESTURE;
type PublicHandlerKey = PublicBaseHandlerKey | `${PublicBaseHandlerKey}Start` | `${PublicBaseHandlerKey}End`;

function getPublicHandlerDefinition(key: string): {
  gestureKey: GestureKey;
  baseHandlerKey: PublicBaseHandlerKey;
} | null {
  const baseHandlerKey = (key.endsWith('Start')
    ? key.slice(0, -'Start'.length)
    : key.endsWith('End')
      ? key.slice(0, -'End'.length)
      : key) as PublicBaseHandlerKey;

  const gestureKey = PUBLIC_HANDLER_TO_GESTURE[baseHandlerKey];
  if (!gestureKey) return null;

  return { gestureKey, baseHandlerKey };
}

function buildInternalHandler(
  handlers: GestureHandlers,
  baseHandlerKey: PublicBaseHandlerKey
): (state: FullGestureState<GestureKey>) => any {
  const startKey = `${baseHandlerKey}Start` as PublicHandlerKey;
  const endKey = `${baseHandlerKey}End` as PublicHandlerKey;

  return (state: FullGestureState<GestureKey>) => {
    let memo = undefined;
    if (state.first && startKey in handlers) (handlers as any)[startKey](state);
    if (baseHandlerKey in handlers) memo = (handlers as any)[baseHandlerKey](state);
    if (state.last && endKey in handlers) (handlers as any)[endKey](state);
    return memo;
  };
}

export function parseMergedHandlers(mergedHandlers: GestureHandlers, mergedConfig: UserGestureConfig) {
  const nativeHandlers: Record<string, any> = {};
  const config = { ...mergedConfig };
  const internalHandlers: InternalHandlers = {};
  const registered = new Set<GestureKey>();

  for (const key in mergedHandlers) {
    const definition = getPublicHandlerDefinition(key);
    if (!definition) {
      nativeHandlers[key] = mergedHandlers[key];
      continue;
    }

    const { gestureKey, baseHandlerKey } = definition;
    if (registered.has(gestureKey) || !EngineMap.has(gestureKey)) continue;

    internalHandlers[gestureKey] = buildInternalHandler(mergedHandlers, baseHandlerKey);
    (config as any)[gestureKey] = (config as any)[gestureKey] || {};
    registered.add(gestureKey);
  }

  return { handlers: internalHandlers, config, nativeHandlers };
}
