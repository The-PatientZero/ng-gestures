import { sharedConfigResolver } from './sharedConfigResolver';
import { ConfigResolverMap } from '../actions';
import { GestureKey, InternalConfig, UserGestureConfig } from '../types';

export type Resolver = (x: any, key: string, obj: any) => any;
export type ResolverMap = { [k: string]: Resolver | ResolverMap | boolean };

export function resolveWith<T extends { [k: string]: any }, V extends { [k: string]: any }>(
  resolvers: ResolverMap,
  config: Partial<T> = {}
): V {
  const result: any = {};
  const isDevelopment = false; // Disabled for browser compatibility

  for (const [key, resolver] of Object.entries(resolvers)) {
    switch (typeof resolver) {
      case 'function':
        if (isDevelopment) {
          const r = resolver.call(result, config[key], key, config);
          if (!Number.isNaN(r)) result[key] = r;
        } else {
          result[key] = resolver.call(result, config[key], key, config);
        }
        break;
      case 'object':
        result[key] = resolveWith(resolver, config[key]);
        break;
      case 'boolean':
        if (resolver) result[key] = config[key];
        break;
    }
  }

  return result;
}

export function parse(newConfig: UserGestureConfig, gestureKey?: GestureKey, _config: any = {}): InternalConfig {
  const { target, eventOptions, window, enabled, transform, ...rest } = newConfig;
  _config.shared = resolveWith(sharedConfigResolver, { target, eventOptions, window, enabled, transform });

  if (gestureKey) {
    const resolver = ConfigResolverMap.get(gestureKey);
    _config[gestureKey] = resolveWith(resolver, { shared: _config.shared, ...rest });
  } else {
    for (const key in rest) {
      const resolver = ConfigResolverMap.get(key as GestureKey);

      if (resolver) {
        _config[key] = resolveWith(resolver, { shared: _config.shared, ...(rest as any)[key] });
      }
    }
  }
  return _config;
}
