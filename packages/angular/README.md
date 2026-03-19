# ng-gestures

Angular gesture primitives and HammerJS-style migration helpers built on top of a `use-gesture`-inspired core.

## Installation

```bash
npm install ng-gestures
```

## Angular Support

- Angular `>=16.0.0 <21.0.0`
- Standalone directives and optional `GesturesModule`

## Quick Start

### Standalone

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
      class="draggable"
      [style.transform]="'translate3d(' + position().x + 'px,' + position().y + 'px,0)'"
    >
      Drag me
    </div>
  `
})
export class AppComponent {
  readonly position = signal({ x: 0, y: 0 });

  onDrag(state: AngularGestureState<'drag'>) {
    this.position.set({ x: state.offset[0], y: state.offset[1] });
  }
}
```

### NgModule

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GesturesModule } from 'ng-gestures';

@NgModule({
  imports: [BrowserModule, GesturesModule]
})
export class AppModule {}
```

## Public API

### Single-Gesture Directives

- `useDrag`: `onDragStart`, `onDrag`, `onDragEnd`
- `usePinch`: `onPinchStart`, `onPinch`, `onPinchEnd`
- `useWheel`: `onWheelStart`, `onWheel`, `onWheelEnd`
- `useScroll`: `onScrollStart`, `onScroll`, `onScrollEnd`
- `useMove`: `onMoveStart`, `onMove`, `onMoveEnd`
- `useHover`: `onHover`
- `usePullToRefresh`: `onPullToRefreshStart`, `onPullToRefresh`, `onPullToRefreshEnd`

Each directive emits the full gesture state. The original DOM event remains available on `state.event`.

### Combined Directive

`GesturesDirective` exposes the same output names as the single directives and also accepts a `gesturesHandlers` object when you prefer code over template outputs.

```html
<div
  gestures
  [gesturesConfig]="{ drag: { axis: 'x' }, pinch: { scaleBounds: { min: 0.75, max: 3 } } }"
  (onDrag)="onDrag($event)"
  (onPinch)="onPinch($event)"
></div>
```

### Gesture Service

Use `GestureService` for programmatic binding:

```typescript
import { GestureService } from 'ng-gestures';

const destroy = gestureService.useGesture(
  element,
  {
    onDrag: (state) => {
      // state.offset, state.delta, state.event, ...
    },
    onDragStart: (state) => {
      // lifecycle start
    },
    onDragEnd: (state) => {
      // lifecycle end
    }
  },
  {
    drag: { threshold: 0 }
  }
);

destroy();
```

### HammerJS Migration

Import the legacy adapter and listen to HammerJS-style outputs:

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

The adapter emits a HammerJS-like object with `deltaX`, `deltaY`, `isFinal`, `scale`, `rotation`, and `srcEvent`.

## Types

- `AngularGestureState<'drag' | 'pinch' | ...>`: strongly typed gesture payload for Angular consumers
- `AngularHandler<'drag' | 'pinch' | ...>`: handler signature for Angular-facing state callbacks
- Core gesture types are re-exported for advanced usage

## Development

From the workspace root:

```bash
npm install
npm run build
npm test
```
