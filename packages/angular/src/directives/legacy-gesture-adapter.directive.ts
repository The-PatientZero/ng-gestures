import { Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { GestureService } from '../gesture.service';
import { FullGestureState } from '../core/types';
import { GestureDestroyFn } from '../types';

/**
 * HammerJS-style payload emitted by the legacy adapter directive.
 */
export interface HammerJSLikeEvent {
  deltaX: number;
  deltaY: number;
  isFinal: boolean;
  scale?: number;
  rotation?: number;
  srcEvent: UIEvent;
  [key: string]: any;
}

@Directive({
  selector: '[pan], [panstart], [panmove], [panend], [pinch], [swipe]',
  standalone: true
})
export class LegacyGestureAdapterDirective implements OnInit, OnDestroy {
  @Output() pan = new EventEmitter<HammerJSLikeEvent>();
  @Output() panstart = new EventEmitter<HammerJSLikeEvent>();
  @Output() panmove = new EventEmitter<HammerJSLikeEvent>();
  @Output() panend = new EventEmitter<HammerJSLikeEvent>();
  @Output() pinch = new EventEmitter<HammerJSLikeEvent>();
  @Output() swipe = new EventEmitter<HammerJSLikeEvent>();

  private destroyFn?: GestureDestroyFn;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroyFn = this.gestureService.useGesture(
      this.el.nativeElement,
      {
        onDrag: (state) => this.handleDrag(state),
        onPinch: (state) => this.handlePinch(state)
      },
      {
        drag: {}
      }
    );
  }

  public ngOnDestroy() {
    this.destroyFn?.();
  }

  private handleDrag(state: FullGestureState<'drag'>) {
    const event = this.transformStateToHammerEvent(state);

    if (state.first) {
      this.panstart.emit(event);
    }

    if (state.active) {
      this.pan.emit(event);
      this.panmove.emit(event);
    }

    if (state.last) {
      this.panend.emit(event);
      if (state.swipe[0] !== 0 || state.swipe[1] !== 0) {
        this.swipe.emit(event);
      }
    }
  }

  private handlePinch(state: FullGestureState<'pinch'>) {
    const event = this.transformStateToHammerEvent(state);
    this.pinch.emit(event);
  }

  /**
   * Maps an `ng-gestures` state object to the HammerJS-like payload expected
   * by legacy templates.
   */
  private transformStateToHammerEvent(state: FullGestureState<'drag'> | FullGestureState<'pinch'>): HammerJSLikeEvent {
    return {
      deltaX: state.delta[0],
      deltaY: state.delta[1],
      isFinal: state.last,
      scale: state.offset ? state.offset[0] : 1,
      rotation: state.offset ? state.offset[1] : 0,
      srcEvent: state.event,
      ...state
    };
  }
}
