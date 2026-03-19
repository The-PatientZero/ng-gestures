# ng-gestures

Angular gesture library intended as a modern replacement path for deprecated HammerJS integrations.

The package lives in [`packages/angular`](./packages/angular) and ships:

- standalone directives for drag, pinch, wheel, scroll, move, hover, and pull-to-refresh
- `GestureService` for programmatic binding
- `GesturesDirective` for multi-gesture output binding
- `LegacyGestureAdapterDirective` for HammerJS-style events during migration

## Install

```bash
npm install ng-gestures
```

## Angular Support

- Angular `>=16.0.0 <21.0.0`

## Quick Usage

```typescript
import { Component, signal } from '@angular/core';
import { UseDragDirective, type AngularGestureState } from 'ng-gestures';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UseDragDirective],
  template: `
    <div useDrag (onDrag)="onDrag($event)" [style.transform]="transform()">
      Drag me
    </div>
  `
})
export class AppComponent {
  readonly position = signal([0, 0] as const);

  readonly transform = () => {
    const [x, y] = this.position();
    return `translate3d(${x}px, ${y}px, 0)`;
  };

  onDrag(state: AngularGestureState<'drag'>) {
    this.position.set([state.offset[0], state.offset[1]]);
  }
}
```

## Public API Highlights

- `UseDragDirective`: `onDragStart`, `onDrag`, `onDragEnd`
- `UsePinchDirective`: `onPinchStart`, `onPinch`, `onPinchEnd`
- `UseWheelDirective`: `onWheelStart`, `onWheel`, `onWheelEnd`
- `UseScrollDirective`: `onScrollStart`, `onScroll`, `onScrollEnd`
- `UseMoveDirective`: `onMoveStart`, `onMove`, `onMoveEnd`
- `UseHoverDirective`: `onHover`
- `UsePullToRefreshDirective`: `onPullToRefreshStart`, `onPullToRefresh`, `onPullToRefreshEnd`
- `GesturesDirective`: combined gesture output binding
- `GestureService`: `useDrag`, `usePinch`, `useWheel`, `useScroll`, `useMove`, `useHover`, `usePullToRefresh`, `useGesture`
- `LegacyGestureAdapterDirective`: `pan`, `panstart`, `panmove`, `panend`, `pinch`, `swipe`

All Angular outputs and service callbacks emit the full gesture state, with the underlying DOM event available on `state.event`.

## Workspace Commands

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
