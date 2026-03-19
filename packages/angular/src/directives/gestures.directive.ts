import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { AnyHandlerEventTypes, GestureHandlers, UserGestureConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';

@Directive({
  selector: '[gestures]',
  standalone: true
})
export class GesturesDirective implements OnInit, OnDestroy {
  @Input() gesturesConfig?: UserGestureConfig;
  @Input() gesturesHandlers?: GestureHandlers<AnyHandlerEventTypes>;

  @Output() onDragStart = new EventEmitter<AngularGestureState<'drag'>>();
  @Output() onDrag = new EventEmitter<AngularGestureState<'drag'>>();
  @Output() onDragEnd = new EventEmitter<AngularGestureState<'drag'>>();
  @Output() onPinchStart = new EventEmitter<AngularGestureState<'pinch'>>();
  @Output() onPinch = new EventEmitter<AngularGestureState<'pinch'>>();
  @Output() onPinchEnd = new EventEmitter<AngularGestureState<'pinch'>>();
  @Output() onWheelStart = new EventEmitter<AngularGestureState<'wheel'>>();
  @Output() onWheel = new EventEmitter<AngularGestureState<'wheel'>>();
  @Output() onWheelEnd = new EventEmitter<AngularGestureState<'wheel'>>();
  @Output() onScrollStart = new EventEmitter<AngularGestureState<'scroll'>>();
  @Output() onScroll = new EventEmitter<AngularGestureState<'scroll'>>();
  @Output() onScrollEnd = new EventEmitter<AngularGestureState<'scroll'>>();
  @Output() onMoveStart = new EventEmitter<AngularGestureState<'move'>>();
  @Output() onMove = new EventEmitter<AngularGestureState<'move'>>();
  @Output() onMoveEnd = new EventEmitter<AngularGestureState<'move'>>();
  @Output() onHover = new EventEmitter<AngularGestureState<'hover'>>();
  @Output() onPullToRefreshStart = new EventEmitter<AngularGestureState<'pullToRefresh'>>();
  @Output() onPullToRefresh = new EventEmitter<AngularGestureState<'pullToRefresh'>>();
  @Output() onPullToRefreshEnd = new EventEmitter<AngularGestureState<'pullToRefresh'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    let handlers: GestureHandlers<AnyHandlerEventTypes> = {};

    if (this.gesturesHandlers) {
      handlers = this.gesturesHandlers;
    } else {
      const EmitterMap = {
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onDragEnd: this.onDragEnd,
        onPinchStart: this.onPinchStart,
        onPinch: this.onPinch,
        onPinchEnd: this.onPinchEnd,
        onWheelStart: this.onWheelStart,
        onWheel: this.onWheel,
        onWheelEnd: this.onWheelEnd,
        onScrollStart: this.onScrollStart,
        onScroll: this.onScroll,
        onScrollEnd: this.onScrollEnd,
        onMoveStart: this.onMoveStart,
        onMove: this.onMove,
        onMoveEnd: this.onMoveEnd,
        onHover: this.onHover,
        onPullToRefreshStart: this.onPullToRefreshStart,
        onPullToRefresh: this.onPullToRefresh,
        onPullToRefreshEnd: this.onPullToRefreshEnd
      };

      for (const key in EmitterMap) {
        const emitter = EmitterMap[key as keyof typeof EmitterMap];
        if (emitter.observed) {
          handlers[key as keyof typeof EmitterMap] = (event: any) => emitter.emit(event);
        }
      }
    }

    this.destroy = this.gestureService.useGesture(this.elementRef.nativeElement, handlers, this.gesturesConfig);
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
