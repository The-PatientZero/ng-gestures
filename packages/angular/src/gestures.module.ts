import { NgModule } from '@angular/core';
import { GestureService } from './gesture.service';
import { UseDragDirective } from './directives/use-drag.directive';
import { UsePinchDirective } from './directives/use-pinch.directive';
import { UseWheelDirective } from './directives/use-wheel.directive';
import { UseScrollDirective } from './directives/use-scroll.directive';
import { UseMoveDirective } from './directives/use-move.directive';
import { UseHoverDirective } from './directives/use-hover.directive';
import { UsePullToRefreshDirective } from './directives/use-pull-to-refresh.directive';
import { GesturesDirective } from './directives/gestures.directive';
import { LegacyGestureAdapterDirective } from './directives/legacy-gesture-adapter.directive';

const DIRECTIVES = [
  UseDragDirective,
  UsePinchDirective,
  UseWheelDirective,
  UseScrollDirective,
  UseMoveDirective,
  UseHoverDirective,
  UsePullToRefreshDirective,
  GesturesDirective,
  LegacyGestureAdapterDirective
];

@NgModule({
  imports: DIRECTIVES,
  exports: DIRECTIVES,
  providers: [GestureService]
})
export class GesturesModule {}
