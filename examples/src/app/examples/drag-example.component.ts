import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-drag-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Drag Example</h1>
        <p>Click and drag the element or use keyboard arrows when focused</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Click and drag the red square to move it around</li>
            <li>Focus the element (click it) and use keyboard arrow keys</li>
            <li>Hold Shift for faster movement, Ctrl for slower movement</li>
            <li>Alt + arrows for diagonal movement</li>
          </ul>
        </div>

        <div class="drag-container" #dragContainer>
          <div
            #draggableElement
            class="draggable-item"
            [style.transform]="'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)'"
            [style.transition]="isDragging ? 'none' : 'transform 0.3s ease'"
            tabindex="0"
            useDrag
            [useDragConfig]="{ bounds: dragContainer }"
            (onDrag)="onDragEvent($event)"
          >
            <span>Drag Me!</span>
            <div class="drag-hint" *ngIf="!hasBeenDragged">👆</div>
          </div>
        </div>

        <div class="state-info" *ngIf="dragState">
          <h3>Drag State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Dragging:</strong>
              <span [class.active]="dragState.dragging">{{ dragState.dragging }}</span>
            </div>
            <div class="state-item">
              <strong>Position:</strong>
              {{ position.x || 0 | number: '1.0-0' }}, {{ position.y || 0 | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Movement:</strong>
              {{ dragState?.movement?.[0] || 0 | number: '1.0-0' }},
              {{ dragState?.movement?.[1] || 0 | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Velocity:</strong>
              {{ dragState?.velocity?.[0] || 0 | number: '1.0-0' }},
              {{ dragState?.velocity?.[1] || 0 | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Distance:</strong>
              {{ dragState?.distance?.[0] || 0 | number: '1.0-0' }},
              {{ dragState?.distance?.[1] || 0 | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Direction:</strong>
              {{ dragState?.direction?.[0] || 0 | number: '1.0-0' }},
              {{ dragState?.direction?.[1] || 0 | number: '1.0-0' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .example-container {
        min-height: 100vh;
        background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
        color: var(--brand-on-info);
      }

      .example-header {
        padding: 2rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }

      .back-button {
        position: absolute;
        left: 2rem;
        top: 2rem;
        color: var(--brand-on-info);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        transition: all 0.3s ease;
      }

      .back-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .example-header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 300;
        color: var(--brand-on-info);
      }

      .example-header p {
        margin: 1rem 0 0;
        opacity: 0.9;
        font-size: 1.1rem;
        color: var(--brand-on-info);
      }

      .demo-area {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .instructions {
        background: var(--overlay-bg);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
      }

      .instructions h3 {
        margin: 0 0 1rem;
        color: var(--brand-on-info);
      }

      .instructions ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .instructions li {
        margin-bottom: 0.5rem;
        opacity: 0.9;
        color: var(--brand-on-info);
      }

      .drag-container {
        background: var(--card-bg);
        border-radius: 20px;
        height: 400px;
        position: relative;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
      }

      .draggable-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
        border-radius: 20px;
        cursor: grab;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--brand-on-info);
        font-weight: bold;
        user-select: none;
        box-shadow: 0 4px 15px rgba(177, 5, 29, 0.3);
        outline: none;
      }

      .draggable-item:active {
        cursor: grabbing;
      }

      .draggable-item:focus {
        box-shadow:
          0 0 0 3px rgba(255, 255, 255, 0.5),
          0 4px 15px rgba(177, 5, 29, 0.3);
      }

      .drag-hint {
        position: absolute;
        top: -30px;
        font-size: 1.5rem;
        animation: bounce 1s infinite;
      }

      @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      .state-info {
        background: var(--overlay-bg);
        border-radius: 15px;
        padding: 1.5rem;
        backdrop-filter: blur(10px);
      }

      .state-info h3 {
        margin: 0 0 1rem;
        color: var(--brand-on-info);
      }

      .state-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .state-item {
        background: var(--overlay-bg);
        padding: 0.75rem;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 0.9rem;
      }

      .state-item strong {
        color: var(--brand-on-info);
      }

      .state-item span {
        opacity: 0.8;
        color: var(--brand-on-info);
      }

      .state-item span.active {
        color: var(--success-color);
        opacity: 1;
      }
    `
  ]
})
export class DragExampleComponent {
  @ViewChild('dragContainer') dragContainer!: ElementRef<HTMLElement>;

  position = { x: 50, y: 50 };
  isDragging = false;
  hasBeenDragged = false;
  dragState: any = null;
  private initialPosition = { x: 50, y: 50 };
  private startMousePosition: { x: number; y: number } | null = null;

  onDragEvent(event: any) {
    this.dragState = event;

    if (event.first) {
      this.isDragging = true;
      this.hasBeenDragged = true;
      this.initialPosition = { ...this.position };
      this.startMousePosition = { x: event.xy[0], y: event.xy[1] };
    }

    let deltaX = 0;
    let deltaY = 0;

    if (this.startMousePosition && event.xy) {
      deltaX = event.xy[0] - this.startMousePosition.x;
      deltaY = event.xy[1] - this.startMousePosition.y;
    }

    let newX = this.initialPosition.x + deltaX;
    let newY = this.initialPosition.y + deltaY;

    const containerEl = this.dragContainer?.nativeElement;
    if (containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const elementSize = 100;

      newX = Math.max(0, Math.min(newX, containerRect.width - elementSize));
      newY = Math.max(0, Math.min(newY, containerRect.height - elementSize));
    }

    this.position = { x: newX, y: newY };

    if (event.last) {
      this.isDragging = false;
      this.startMousePosition = null;
    }
  }
}
