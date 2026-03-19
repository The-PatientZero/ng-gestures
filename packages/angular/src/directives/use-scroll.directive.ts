import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserScrollConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[useScroll]',
  standalone: true
})
export class UseScrollDirective implements OnInit, OnDestroy {
  @Input() useScrollConfig?: UserScrollConfig;
  @Output() onScrollStart = new EventEmitter<AngularGestureState<'scroll'>>();
  @Output() onScroll = new EventEmitter<AngularGestureState<'scroll'>>();
  @Output() onScrollEnd = new EventEmitter<AngularGestureState<'scroll'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.useScroll(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onScrollStart,
          main: this.onScroll,
          end: this.onScrollEnd
        }),
      this.useScrollConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
