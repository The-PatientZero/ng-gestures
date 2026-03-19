import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserPinchConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[usePinch]',
  standalone: true
})
export class UsePinchDirective implements OnInit, OnDestroy {
  @Input() usePinchConfig?: UserPinchConfig;
  @Output() onPinchStart = new EventEmitter<AngularGestureState<'pinch'>>();
  @Output() onPinch = new EventEmitter<AngularGestureState<'pinch'>>();
  @Output() onPinchEnd = new EventEmitter<AngularGestureState<'pinch'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.usePinch(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onPinchStart,
          main: this.onPinch,
          end: this.onPinchEnd
        }),
      this.usePinchConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
