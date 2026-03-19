import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-hover-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Hover Example</h1>
        <p>Advanced hover states with enter/leave animations</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Hover over each card to see different animations</li>
            <li>Notice the smooth enter/leave transitions</li>
            <li>Each card has unique hover behavior</li>
            <li>Hover events track enter and leave states</li>
          </ul>
        </div>

        <div class="hover-container">
          <div
            class="hover-card card-1"
            [class.hovered]="hoveredCard === 1"
            useHover
            (onHover)="onHoverEvent($event, 1)"
          >
            <div class="card-content">
              <div class="card-icon">🚀</div>
              <h3>Card 1</h3>
              <p>Grow animation</p>
            </div>
            <div class="hover-indicator" [style.width.%]="hoverProgress1 * 100"></div>
          </div>

          <div
            class="hover-card card-2"
            [class.hovered]="hoveredCard === 2"
            useHover
            (onHover)="onHoverEvent($event, 2)"
          >
            <div class="card-content">
              <div class="card-icon">🎨</div>
              <h3>Card 2</h3>
              <p>Color shift</p>
            </div>
            <div class="hover-indicator" [style.width.%]="hoverProgress2 * 100"></div>
          </div>

          <div
            class="hover-card card-3"
            [class.hovered]="hoveredCard === 3"
            useHover
            (onHover)="onHoverEvent($event, 3)"
          >
            <div class="card-content">
              <div class="card-icon">⚡</div>
              <h3>Card 3</h3>
              <p>Rotate effect</p>
            </div>
            <div class="hover-indicator" [style.width.%]="hoverProgress3 * 100"></div>
          </div>

          <div
            class="hover-card card-4"
            [class.hovered]="hoveredCard === 4"
            useHover
            (onHover)="onHoverEvent($event, 4)"
          >
            <div class="card-content">
              <div class="card-icon">🌟</div>
              <h3>Card 4</h3>
              <p>Shadow glow</p>
            </div>
            <div class="hover-indicator" [style.width.%]="hoverProgress4 * 100"></div>
          </div>
        </div>

        <div class="state-info" *ngIf="hoverState">
          <h3>Hover State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Hovered:</strong>
              <span [class.active]="hoverState.hovering">{{ hoverState.hovering }}</span>
            </div>
            <div class="state-item">
              <strong>Active Card:</strong>
              {{ hoveredCard === 0 ? 'None' : 'Card ' + hoveredCard }}
            </div>
            <div class="state-item">
              <strong>Position:</strong>
              {{ hoverState.xy?.[0] | number: '1.0-0' }},
              {{ hoverState.xy?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Enter:</strong>
              <span [class.active]="hoverState.first">{{ hoverState.first }}</span>
            </div>
            <div class="state-item">
              <strong>Leave:</strong>
              <span [class.active]="hoverState.last">{{ hoverState.last }}</span>
            </div>
            <div class="state-item">
              <strong>Progress:</strong>
              {{ currentProgress | percent: '1.0-0' }}
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

      .hover-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .hover-card {
        background: var(--card-bg);
        border-radius: 20px;
        padding: 2rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--brand-on-surface);
      }

      .hover-card.hovered {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(177, 5, 29, 0.2);
      }

      .card-1.hovered {
        transform: translateY(-10px) scale(1.05);
      }

      .card-2.hovered {
        background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
        color: var(--brand-on-info);
      }

      .card-3.hovered {
        transform: translateY(-10px) rotate(5deg);
      }

      .card-4.hovered {
        box-shadow: 0 20px 60px rgba(177, 5, 29, 0.3);
      }

      .card-content {
        text-align: center;
        z-index: 1;
        position: relative;
      }

      .card-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .card-content h3 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
        font-weight: 300;
      }

      .card-content p {
        margin: 0;
        opacity: 0.8;
        font-size: 1rem;
      }

      .hover-indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--brand-primary), var(--brand-info));
        transition: width 0.3s ease;
        border-radius: 0 0 20px 20px;
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
export class HoverExampleComponent {
  hoveredCard = 0;
  hoverProgress1 = 0;
  hoverProgress2 = 0;
  hoverProgress3 = 0;
  hoverProgress4 = 0;
  hoverState: any = null;
  currentProgress = 0;

  onHoverEvent(event: any, cardNumber: number) {
    this.hoverState = event;

    if (event.hovering) {
      this.hoveredCard = cardNumber;
      this.currentProgress = 1;
    } else {
      this.hoveredCard = 0;
      this.currentProgress = 0;
    }

    // Update progress bars
    switch (cardNumber) {
      case 1:
        this.hoverProgress1 = event.hovering ? 1 : 0;
        break;
      case 2:
        this.hoverProgress2 = event.hovering ? 1 : 0;
        break;
      case 3:
        this.hoverProgress3 = event.hovering ? 1 : 0;
        break;
      case 4:
        this.hoverProgress4 = event.hovering ? 1 : 0;
        break;
    }
  }
}
