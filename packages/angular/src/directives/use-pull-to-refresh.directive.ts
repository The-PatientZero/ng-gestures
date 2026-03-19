import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserPullToRefreshConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';
import { emitGestureLifecycle } from './gesture-output';

@Directive({
  selector: '[usePullToRefresh]',
  standalone: true
})
export class UsePullToRefreshDirective implements OnInit, OnDestroy {
  @Input() usePullToRefreshConfig?: UserPullToRefreshConfig;
  @Output() onPullToRefreshStart = new EventEmitter<AngularGestureState<'pullToRefresh'>>();
  @Output() onPullToRefresh = new EventEmitter<AngularGestureState<'pullToRefresh'>>();
  @Output() onPullToRefreshEnd = new EventEmitter<AngularGestureState<'pullToRefresh'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.usePullToRefresh(
      this.elementRef.nativeElement,
      (state) =>
        emitGestureLifecycle(state, {
          start: this.onPullToRefreshStart,
          main: this.onPullToRefresh,
          end: this.onPullToRefreshEnd
        }),
      this.usePullToRefreshConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
