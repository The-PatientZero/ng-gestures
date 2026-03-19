import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserWheelConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[useWheel]',
  standalone: true
})
export class UseWheelDirective implements OnInit, OnDestroy {
  @Input() useWheelConfig?: UserWheelConfig;
  @Output() onWheelStart = new EventEmitter<AngularGestureState<'wheel'>>();
  @Output() onWheel = new EventEmitter<AngularGestureState<'wheel'>>();
  @Output() onWheelEnd = new EventEmitter<AngularGestureState<'wheel'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.useWheel(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onWheelStart,
          main: this.onWheel,
          end: this.onWheelEnd
        }),
      this.useWheelConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
