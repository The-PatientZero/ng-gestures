# ng-gestures

`ng-gestures` is an Angular gesture library built for teams that want a modern replacement path away from deprecated HammerJS integrations. It combines Angular-friendly directives, programmatic bindings through a service, and a compatibility adapter for incremental migrations.

The library package lives in [packages/angular](./packages/angular), and the example app lives in [examples](./examples).

## Why This Repo Exists

- HammerJS is deprecated, but many Angular applications still depend on gesture-driven UI.
- Angular teams often want declarative template bindings instead of framework-agnostic event plumbing.
- Large applications usually need a migration path, not an all-at-once rewrite.

`ng-gestures` is designed around those needs:

- Angular-first standalone directives and optional `GesturesModule`
- Programmatic bindings through `GestureService`
- A combined `gestures` directive for multi-gesture surfaces
- A HammerJS-style adapter for `pan`, `panstart`, `panmove`, `panend`, `pinch`, and `swipe`
- Strongly typed gesture payloads for Angular consumers

## Installation

```bash
npm install ng-gestures
```

## Compatibility

- Angular `>=16.0.0 <21.0.0`
- Standalone components are supported directly
- `GesturesModule` is available for NgModule-based applications

## Quick Start

```typescript
import { Component, signal } from '@angular/core';
import { UseDragDirective, type AngularGestureState } from 'ng-gestures';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UseDragDirective],
  template: `
    <div
      useDrag
      [useDragConfig]="{ bounds: { left: -200, right: 200, top: -100, bottom: 100 } }"
      (onDrag)="onDrag($event)"
      class="card"
      [style.transform]="transform()"
    >
      Drag me
    </div>
  `
})
export class AppComponent {
  readonly position = signal([0, 0] as const);

  transform() {
    const [x, y] = this.position();
    return `translate3d(${x}px, ${y}px, 0)`;
  }

  onDrag(state: AngularGestureState<'drag'>) {
    this.position.set([state.offset[0], state.offset[1]]);
  }
}
```

All directive outputs and service handlers receive a full gesture state object. The original browser event is available on `state.event`.

## Integration Styles

| Style | Best for | Main API |
| --- | --- | --- |
| Single-gesture directives | Most Angular templates | `useDrag`, `usePinch`, `useWheel`, `useScroll`, `useMove`, `useHover`, `usePullToRefresh` |
| Combined directive | Surfaces that need several gestures on the same element | `gestures`, `gesturesConfig`, `gesturesHandlers` |
| Service bindings | Programmatic setup or dynamic targets | `GestureService` |
| Migration adapter | Incremental HammerJS replacement | `LegacyGestureAdapterDirective` |

## Public API Overview

### Standalone Directives

| Selector | Config input | Outputs |
| --- | --- | --- |
| `useDrag` | `useDragConfig` | `onDragStart`, `onDrag`, `onDragEnd` |
| `usePinch` | `usePinchConfig` | `onPinchStart`, `onPinch`, `onPinchEnd` |
| `useWheel` | `useWheelConfig` | `onWheelStart`, `onWheel`, `onWheelEnd` |
| `useScroll` | `useScrollConfig` | `onScrollStart`, `onScroll`, `onScrollEnd` |
| `useMove` | `useMoveConfig` | `onMoveStart`, `onMove`, `onMoveEnd` |
| `useHover` | `useHoverConfig` | `onHover` |
| `usePullToRefresh` | `usePullToRefreshConfig` | `onPullToRefreshStart`, `onPullToRefresh`, `onPullToRefreshEnd` |

### Combined Directive

`GesturesDirective` exposes:

- `gesturesConfig` for multi-gesture configuration
- `gesturesHandlers` for code-driven handler registration
- output bindings for drag, pinch, wheel, scroll, move, hover, and pull-to-refresh

### Service

`GestureService` exposes:

- `useDrag`
- `usePinch`
- `useWheel`
- `useScroll`
- `useMove`
- `useHover`
- `usePullToRefresh`
- `useGesture`

### HammerJS Migration Adapter

`LegacyGestureAdapterDirective` supports:

- `pan`
- `panstart`
- `panmove`
- `panend`
- `pinch`
- `swipe`

## Gesture Payloads

The Angular-facing `AngularGestureState<'gestureName'>` payload includes the same core shape across gesture types. Common fields include:

- `first`, `last`, `active` for lifecycle state
- `movement`, `offset`, `delta`, `distance`, `direction`, `velocity`
- `initial`, `values`, `timeStamp`, `elapsedTime`
- `event`, `target`, `currentTarget`

Gesture-specific additions include:

- drag: `tap`, `swipe`, `cancel()`
- pinch: `origin`, `turns`, `cancel()`
- pull-to-refresh: `progress`, `shouldRefresh`, `cancel()`

## HammerJS Migration

There are two practical migration paths.

### 1. Keep Existing Templates Working First

Use the compatibility adapter and continue listening to HammerJS-style outputs while moving the rest of the app forward.

```html
<div
  pan
  (panstart)="onPanStart($event)"
  (pan)="onPan($event)"
  (panend)="onPanEnd($event)"
  (swipe)="onSwipe($event)"
  (pinch)="onPinch($event)"
></div>
```

The emitted payload includes HammerJS-like fields such as `deltaX`, `deltaY`, `isFinal`, `scale`, `rotation`, and `srcEvent`.

### 2. Migrate to Native `ng-gestures` APIs

| HammerJS concept | Recommended `ng-gestures` API |
| --- | --- |
| `pan*` | `useDrag` or `onDrag*` |
| `pinch` | `usePinch` or `onPinch*` |
| `swipe` | `drag` state plus `state.swipe` |

## Repo Layout

| Path | Purpose |
| --- | --- |
| [packages/angular](./packages/angular) | Published Angular library |
| [examples](./examples) | Example application |
| [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES) | Third-party license notices |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm start
```

## Release Verification

```bash
npm run build
npm test
cd dist/ng-gestures
npm pack --dry-run
```

## Detailed Package Docs

The npm-facing consumer documentation lives in [packages/angular/README.md](./packages/angular/README.md).

## Credits

This project builds on ideas from the `use-gesture` ecosystem while providing an Angular-specific API and migration path. See [THIRD_PARTY_LICENSES/use-gesture.MIT](./THIRD_PARTY_LICENSES/use-gesture.MIT) for attribution details.
