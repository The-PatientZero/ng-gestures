import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserDragConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[useDrag]',
  standalone: true
})
export class UseDragDirective implements OnInit, OnDestroy {
  @Input() useDragConfig?: UserDragConfig;
  @Output() onDragStart = new EventEmitter<AngularGestureState<'drag'>>();
  @Output() onDrag = new EventEmitter<AngularGestureState<'drag'>>();
  @Output() onDragEnd = new EventEmitter<AngularGestureState<'drag'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.useDrag(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onDragStart,
          main: this.onDrag,
          end: this.onDragEnd
        }),
      this.useDragConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
