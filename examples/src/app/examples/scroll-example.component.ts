import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-scroll-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Scroll Example</h1>
        <p>Custom scroll behavior with momentum and boundaries</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Scroll within the container using mouse wheel or touch</li>
            <li>Notice the smooth momentum scrolling</li>
            <li>Scroll boundaries are enforced</li>
            <li>Try scrolling horizontally and vertically</li>
          </ul>
        </div>

        <div
          class="scroll-container"
          useScroll
          [useScrollConfig]="{ enabled: true }"
          (onScroll)="onScrollEvent($event)"
        >
          <div class="scrollable-content" [style.transform]="'translate3d(' + scrollX + 'px, ' + scrollY + 'px, 0)'">
            <div class="content-grid">
              <div class="content-item" *ngFor="let item of items; let i = index">
                <div class="item-number">{{ i + 1 }}</div>
                <div class="item-content">
                  <h4>Item {{ i + 1 }}</h4>
                  <p>This is scrollable content item {{ i + 1 }}. Try scrolling around to see all items.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="state-info" *ngIf="scrollState">
          <h3>Scroll State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Scrolling:</strong>
              <span [class.active]="scrollState.scrolling">{{ scrollState.scrolling }}</span>
            </div>
            <div class="state-item">
              <strong>Position:</strong>
              {{ scrollX | number: '1.0-0' }}, {{ scrollY | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Movement:</strong>
              {{ scrollState.movement?.[0] | number: '1.0-0' }},
              {{ scrollState.movement?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Velocity:</strong>
              {{ scrollState.velocity?.[0] | number: '1.0-0' }},
              {{ scrollState.velocity?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Direction:</strong>
              {{ scrollState.direction?.[0] | number: '1.0-0' }},
              {{ scrollState.direction?.[1] | number: '1.0-0' }}
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

      .scroll-container {
        background: var(--card-bg);
        border-radius: 20px;
        height: 400px;
        position: relative;
        overflow: auto;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
      }

      .scrollable-content {
        cursor: grab;
        user-select: none;
      }

      .scrollable-content:active {
        cursor: grabbing;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 2rem;
        width: 800px;
        height: 600px;
      }

      .content-item {
        background: linear-gradient(135deg, var(--brand-tertiary), var(--brand-base));
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 4px 15px rgba(177, 5, 29, 0.1);
        color: var(--brand-on-surface);
      }

      .item-number {
        background: var(--brand-primary);
        color: var(--brand-on-info);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
      }

      .item-content h4 {
        margin: 0 0 0.5rem;
        color: var(--brand-on-surface);
      }

      .item-content p {
        margin: 0;
        opacity: 0.8;
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--brand-secondary);
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
export class ScrollExampleComponent {
  scrollX = 0;
  scrollY = 0;
  scrollState: any = null;

  items = Array.from({ length: 12 }, (_, i) => ({ id: i }));

  constructor() {}

  onScrollEvent(event: any) {
    this.scrollState = event;

    if (event.movement) {
      this.scrollX += event.movement[0];
      this.scrollY += event.movement[1];

      // Constrain scrolling within bounds
      const maxScrollX = 0;
      const minScrollX = -400; // Content width - container width
      const maxScrollY = 0;
      const minScrollY = -200; // Content height - container height

      this.scrollX = Math.max(minScrollX, Math.min(maxScrollX, this.scrollX));
      this.scrollY = Math.max(minScrollY, Math.min(maxScrollY, this.scrollY));
    } else {
      // Try alternative properties that might exist
      if (event.delta) {
        // Handle delta-based scrolling if movement is not available
      }
      if (event.offset) {
        // Handle offset-based scrolling if movement is not available
      }
      if (event.xy) {
        // Handle xy-based scrolling if movement is not available
      }
    }
  }
}
