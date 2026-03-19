import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/examples', pathMatch: 'full' },
  {
    path: 'examples',
    loadComponent: () => import('./examples/examples-home.component').then((m) => m.ExamplesHomeComponent)
  },
  {
    path: 'examples/drag',
    loadComponent: () => import('./examples/drag-example.component').then((m) => m.DragExampleComponent)
  },
  {
    path: 'examples/pinch',
    loadComponent: () => import('./examples/pinch-example.component').then((m) => m.PinchExampleComponent)
  },
  {
    path: 'examples/scroll',
    loadComponent: () => import('./examples/scroll-example.component').then((m) => m.ScrollExampleComponent)
  },
  {
    path: 'examples/wheel',
    loadComponent: () => import('./examples/wheel-example.component').then((m) => m.WheelExampleComponent)
  },
  {
    path: 'examples/move',
    loadComponent: () => import('./examples/move-example.component').then((m) => m.MoveExampleComponent)
  },
  {
    path: 'examples/hover',
    loadComponent: () => import('./examples/hover-example.component').then((m) => m.HoverExampleComponent)
  },
  {
    path: 'examples/pull-to-refresh',
    loadComponent: () =>
      import('./examples/pull-to-refresh-example.component').then((m) => m.PullToRefreshExampleComponent)
  }
];
