import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import type { UserHoverConfig } from '../core/types';
import { GestureService } from '../gesture.service';
import type { AngularGestureState, GestureDestroyFn } from '../types';

@Directive({
  selector: '[useHover]',
  standalone: true
})
export class UseHoverDirective implements OnInit, OnDestroy {
  @Input() useHoverConfig?: UserHoverConfig;
  @Output() onHover = new EventEmitter<AngularGestureState<'hover'>>();

  private destroy?: GestureDestroyFn;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly gestureService: GestureService
  ) {}

  public ngOnInit() {
    this.destroy = this.gestureService.useHover(
      this.elementRef.nativeElement,
      (state) => this.onHover.emit(state),
      this.useHoverConfig
    );
  }

  public ngOnDestroy() {
    this.destroy?.();
  }
}
