import { ResolverMap } from './resolver';
import { sharedConfigResolver } from './sharedConfigResolver';
import { commonConfigResolver } from './commonConfigResolver';
import { coordinatesConfigResolver } from './coordinatesConfigResolver';
import { InternalPullToRefreshOptions, PullToRefreshConfig } from '../types';
import { V } from '../utils/maths';
import { SUPPORT } from './support';

const DEFAULT_PULL_TO_REFRESH_CONFIG: Partial<PullToRefreshConfig> = {
  threshold: 80,
  maxDistance: 120,
  resistance: 2.5,
  requireScrollTop: true,
  axis: 'y',
  enabled: true
};

export const pullToRefreshConfigResolver: ResolverMap = {
  ...sharedConfigResolver,
  ...commonConfigResolver,
  ...coordinatesConfigResolver,
  device(this: InternalPullToRefreshOptions) {
    if (SUPPORT.pointer) return 'pointer';
    if (SUPPORT.touch) return 'touch';
    return 'mouse';
  },
  // Pull-to-refresh may need `preventDefault()`, so passive listeners must stay disabled.
  eventOptions({ passive = false, capture = false } = {}) {
    return { passive, capture };
  },
  threshold() {
    // Emit from the first move so progress can be observed immediately. The
    // refresh trigger distance is tracked separately via `pullThreshold`.
    return V.toVector(0);
  },
  pullThreshold(value = DEFAULT_PULL_TO_REFRESH_CONFIG.threshold!) {
    // Preserve the original scalar threshold for pull-to-refresh specific logic.
    return value;
  },
  maxDistance(value = DEFAULT_PULL_TO_REFRESH_CONFIG.maxDistance!) {
    return value;
  },
  resistance(value = DEFAULT_PULL_TO_REFRESH_CONFIG.resistance!) {
    return value;
  },
  requireScrollTop(value = DEFAULT_PULL_TO_REFRESH_CONFIG.requireScrollTop!) {
    return value;
  }
};
