# ng-gestures

`ng-gestures` is an Angular gesture library with standalone directives, programmatic service bindings, and HammerJS-style migration helpers. It is intended for applications that want modern gesture handling without depending on deprecated HammerJS infrastructure.

## Why `ng-gestures`

- Angular-first API surface instead of framework-neutral wrappers
- Standalone directives for drag, pinch, wheel, scroll, move, hover, and pull-to-refresh
- Programmatic bindings through `GestureService`
- Strongly typed gesture payloads for template and TypeScript consumers
- Incremental HammerJS migration support through `LegacyGestureAdapterDirective`

## Installation

```bash
npm install ng-gestures
```

## Angular Support

- Angular `>=16.0.0 <21.0.0`
- Standalone components are supported directly
- `GesturesModule` is available for NgModule-based applications

## Choose an Integration Style

| Style | Best for | API |
| --- | --- | --- |
| Single-gesture directive | Most template-driven components | `useDrag`, `usePinch`, `useWheel`, `useScroll`, `useMove`, `useHover`, `usePullToRefresh` |
| Combined directive | One element with multiple gestures | `gestures`, `gesturesConfig`, `gesturesHandlers` |
| Service binding | Programmatic setup, dynamic targets, custom lifecycle | `GestureService` |
| HammerJS bridge | Incremental migration from legacy templates | `LegacyGestureAdapterDirective` |

## Quick Start

### Standalone Component

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
      [useDragConfig]="{ bounds: { left: -200, right: 200, top: -120, bottom: 120 } }"
      (onDrag)="onDrag($event)"
      class="surface"
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

### NgModule Application

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GesturesModule } from 'ng-gestures';

@NgModule({
  imports: [BrowserModule, GesturesModule]
})
export class AppModule {}
```

## Directive API

### Single-Gesture Directives

Each directive attaches to one element, accepts a gesture-specific config input, and emits a strongly typed `AngularGestureState<'...'>` payload.

| Selector | Config input | Outputs |
| --- | --- | --- |
| `useDrag` | `useDragConfig` | `onDragStart`, `onDrag`, `onDragEnd` |
| `usePinch` | `usePinchConfig` | `onPinchStart`, `onPinch`, `onPinchEnd` |
| `useWheel` | `useWheelConfig` | `onWheelStart`, `onWheel`, `onWheelEnd` |
| `useScroll` | `useScrollConfig` | `onScrollStart`, `onScroll`, `onScrollEnd` |
| `useMove` | `useMoveConfig` | `onMoveStart`, `onMove`, `onMoveEnd` |
| `useHover` | `useHoverConfig` | `onHover` |
| `usePullToRefresh` | `usePullToRefreshConfig` | `onPullToRefreshStart`, `onPullToRefresh`, `onPullToRefreshEnd` |

Lifecycle semantics are consistent across gesture types:

- `Start` outputs fire when `state.first` is `true`
- main outputs fire for every gesture update
- `End` outputs fire when `state.last` is `true`

### Combined `gestures` Directive

Use `gestures` when the same element needs several gestures.

```html
<div
  gestures
  [gesturesConfig]="gestureConfig"
  (onDrag)="onDrag($event)"
  (onPinch)="onPinch($event)"
  (onWheel)="onWheel($event)"
></div>
```

```typescript
import { Component } from '@angular/core';
import { GesturesDirective, type AngularGestureConfig } from 'ng-gestures';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [GesturesDirective],
  templateUrl: './canvas.component.html'
})
export class CanvasComponent {
  readonly gestureConfig: AngularGestureConfig = {
    drag: {
      axis: 'x',
      bounds: { left: -300, right: 300 }
    },
    pinch: {
      scaleBounds: { min: 0.75, max: 3 }
    },
    wheel: {
      preventDefault: true
    }
  };

  onDrag() {}
  onPinch() {}
  onWheel() {}
}
```

You can also provide `gesturesHandlers` when you prefer code-driven registration over template outputs.

## `GestureService`

Use `GestureService` when you need explicit lifecycle control or when the target is managed programmatically.

### Single Gesture

```typescript
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { GestureService, type GestureDestroyFn } from 'ng-gestures';

@Component({
  selector: 'app-service-example',
  standalone: true,
  template: `<div #surface class="surface"></div>`
})
export class ServiceExampleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('surface', { static: true }) surface!: ElementRef<HTMLElement>;

  private destroyGesture?: GestureDestroyFn;

  constructor(private readonly gestureService: GestureService) {}

  ngAfterViewInit() {
    this.destroyGesture = this.gestureService.useDrag(
      this.surface.nativeElement,
      (state) => {
        console.log(state.offset, state.event);
      },
      {
        axis: 'x',
        bounds: { left: -250, right: 250 }
      }
    );
  }

  ngOnDestroy() {
    this.destroyGesture?.();
  }
}
```

### Multiple Gestures

```typescript
const destroy = gestureService.useGesture(
  element,
  {
    onDragStart: (state) => {
      console.log('drag start', state.initial);
    },
    onDrag: (state) => {
      console.log('drag', state.offset);
    },
    onPinch: (state) => {
      console.log('pinch', state.offset);
    },
    onPullToRefreshEnd: (state) => {
      if (state.shouldRefresh) {
        refreshData();
      }
    }
  },
  {
    drag: { threshold: 0 },
    pinch: { scaleBounds: { min: 0.8, max: 2.5 } },
    pullToRefresh: { threshold: 72, maxDistance: 120 }
  }
);

destroy();
```

## Gesture Payloads

All Angular outputs and service handlers receive the full gesture state. The underlying browser event is always available on `state.event`.

### Common Fields

| Field | Meaning |
| --- | --- |
| `first` | First event in the active gesture lifecycle |
| `last` | Final event in the active gesture lifecycle |
| `active` | Whether the gesture is currently active |
| `movement` | Displacement for the current gesture |
| `offset` | Accumulated gesture offset |
| `delta` | Difference from the previous event |
| `distance` | Accumulated absolute movement |
| `direction` | Direction per axis |
| `velocity` | Velocity per axis |
| `initial` | Raw values at gesture start |
| `values` | Current raw gesture values |
| `event` | Original DOM event |

### Gesture-Specific Fields

| Gesture | Additional fields |
| --- | --- |
| Drag | `tap`, `swipe`, `cancel()` |
| Pinch | `origin`, `turns`, `cancel()` |
| Pull-to-refresh | `progress`, `shouldRefresh`, `cancel()` |

## Configuration Guide

### Shared Options

Most config objects support a common set of options:

| Option | Purpose |
| --- | --- |
| `enabled` | Enable or disable the gesture without removing bindings |
| `eventOptions` | Customize passive or capture listener behavior |
| `from` | Set the starting offset |
| `threshold` | Require a minimum displacement before the gesture becomes intentional |
| `preventDefault` | Call `preventDefault()` on handled events |
| `triggerAllEvents` | Emit events before the threshold is reached |
| `rubberband` | Apply elastic overflow behavior |
| `transform` | Map raw coordinates into a custom coordinate space |

### Commonly Used Gesture-Specific Options

- Drag: `axis`, `bounds`, `filterTaps`, `delay`, `preventScroll`, `pointer`, `swipe`
- Pinch: `scaleBounds`, `angleBounds`, `modifierKey`, `pinchOnWheel`
- Move and hover: `mouseOnly`
- Pull-to-refresh: `threshold`, `maxDistance`, `resistance`, `requireScrollTop`

The exported config types are:

- `UserDragConfig`
- `UserPinchConfig`
- `UserWheelConfig`
- `UserScrollConfig`
- `UserMoveConfig`
- `UserHoverConfig`
- `UserPullToRefreshConfig`
- `AngularGestureConfig`

## HammerJS Migration

`ng-gestures` supports both incremental migration and direct replacement.

### Option 1: Keep HammerJS-Style Templates During Migration

```html
<div
  pan
  (panstart)="onPanStart($event)"
  (pan)="onPan($event)"
  (panmove)="onPanMove($event)"
  (panend)="onPanEnd($event)"
  (swipe)="onSwipe($event)"
  (pinch)="onPinch($event)"
></div>
```

The adapter emits a HammerJS-like payload with:

- `deltaX`
- `deltaY`
- `isFinal`
- `scale`
- `rotation`
- `srcEvent`

### Option 2: Move to Native `ng-gestures` APIs

| HammerJS concept | Recommended replacement |
| --- | --- |
| `panstart`, `pan`, `panend` | `onDragStart`, `onDrag`, `onDragEnd` |
| `pinch` | `onPinch` / `usePinch` |
| `swipe` | `drag` state plus `state.swipe` |

## Exports

The package exports:

- `GestureService`
- `GesturesModule`
- `UseDragDirective`
- `UsePinchDirective`
- `UseWheelDirective`
- `UseScrollDirective`
- `UseMoveDirective`
- `UseHoverDirective`
- `UsePullToRefreshDirective`
- `GesturesDirective`
- `LegacyGestureAdapterDirective`
- `HammerJSLikeEvent`
- Angular-facing types such as `AngularGestureState`, `AngularHandler`, `AngularGestureConfig`, and `GestureDestroyFn`
- Core gesture types and utilities for advanced usage

## Examples and Development

- Example application: [The-PatientZero/ng-gestures/examples](https://github.com/The-PatientZero/ng-gestures/tree/main/examples)
- Issue tracker: [The-PatientZero/ng-gestures/issues](https://github.com/The-PatientZero/ng-gestures/issues)

From the workspace root:

```bash
npm install
npm run build
npm test
npm run lint
npm start
```

## Attribution

This package is inspired by the `use-gesture` ecosystem and includes third-party attribution in the published package. See the bundled `NOTICE` and `THIRD_PARTY_LICENSES` files for details.
