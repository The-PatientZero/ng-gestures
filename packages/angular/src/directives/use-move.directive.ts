import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserMoveConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[useMove]',
  standalone: true
})
export class UseMoveDirective implements OnInit, OnDestroy {
  @Input() useMoveConfig?: UserMoveConfig;
  @Output() onMoveStart = new EventEmitter<AngularGestureState<'move'>>();
  @Output() onMove = new EventEmitter<AngularGestureState<'move'>>();
  @Output() onMoveEnd = new EventEmitter<AngularGestureState<'move'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.useMove(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onMoveStart,
          main: this.onMove,
          end: this.onMoveEnd
        }),
      this.useMoveConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
