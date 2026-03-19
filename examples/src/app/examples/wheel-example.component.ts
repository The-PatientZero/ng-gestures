import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-wheel-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Wheel Example</h1>
        <p>Mouse wheel and trackpad gesture handling</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Use mouse wheel for vertical scrolling</li>
            <li>Hold Shift + wheel for horizontal scrolling</li>
            <li>Hold Ctrl/Cmd + wheel to zoom in/out</li>
            <li>Notice the smooth wheel delta tracking</li>
            <li>Wheel events are captured and processed</li>
          </ul>
        </div>

        <div class="wheel-container">
          <div
            class="wheel-target"
            [style.transform]="'scale(' + scale + ') translate(' + translateX + 'px, ' + translateY + 'px)'"
            [style.transition]="isWheeling ? 'none' : 'transform 0.3s ease'"
            useWheel
            [useWheelConfig]="wheelConfig"
            (onWheel)="onWheelEvent($event)"
          >
            <div class="wheel-content">
              <div class="wheel-icon">🖱️</div>
              <h3>Wheel Gesture</h3>
              <p>Scroll to interact</p>
            </div>
          </div>
        </div>

        <div class="state-info" *ngIf="wheelState">
          <h3>Wheel State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Wheeling:</strong>
              <span [class.active]="wheelState.wheeling">{{ wheelState.wheeling }}</span>
            </div>
            <div class="state-item">
              <strong>Scale:</strong>
              {{ scale | number: '1.2-2' }}
            </div>
            <div class="state-item">
              <strong>Translate:</strong>
              {{ translateX | number: '1.0-0' }}, {{ translateY | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Delta:</strong>
              {{ wheelState.delta?.[0] | number: '1.0-0' }},
              {{ wheelState.delta?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Direction:</strong>
              {{ wheelState.direction?.[0] | number: '1.0-0' }},
              {{ wheelState.direction?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Velocity:</strong>
              {{ wheelState.velocity?.[0] | number: '1.0-0' }},
              {{ wheelState.velocity?.[1] | number: '1.0-0' }}
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

      .wheel-container {
        background: var(--card-bg);
        border-radius: 20px;
        height: 400px;
        position: relative;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wheel-target {
        transform-origin: center;
        cursor: default;
        user-select: none;
      }

      .wheel-content {
        background: linear-gradient(135deg, var(--brand-secondary), var(--brand-secondary-light));
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        color: var(--brand-on-info);
        box-shadow: 0 8px 25px rgba(177, 5, 29, 0.2);
        min-width: 200px;
      }

      .wheel-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .wheel-content h3 {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
        font-weight: 300;
        color: var(--brand-on-info);
      }

      .wheel-content p {
        margin: 0;
        opacity: 0.9;
        font-size: 1.1rem;
        color: var(--brand-on-info);
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
export class WheelExampleComponent {
  scale = 1;
  translateX = 0;
  translateY = 0;
  isWheeling = false;
  wheelState: any = null;
  private initialScale = 1;
  private initialTranslateX = 0;
  private initialTranslateY = 0;

  wheelConfig = {
    preventDefault: true
  };

  onWheelEvent(event: any) {
    this.wheelState = event;

    if (event.first) {
      this.isWheeling = true;
      this.initialScale = this.scale;
      this.initialTranslateX = this.translateX;
      this.initialTranslateY = this.translateY;
    }

    if (event.delta) {
      // Check if shift is pressed for horizontal scrolling
      if (event.event?.shiftKey) {
        // Use vertical delta for horizontal scrolling when shift is pressed
        this.translateX += event.delta[1] * 0.5;
      } else if (event.event?.ctrlKey || event.event?.metaKey) {
        // Normal wheel behavior - zoom with ctrl, scroll without
        const zoomFactor = 1 - event.delta[1] * 0.001;
        this.scale = Math.max(0.5, Math.min(3, this.initialScale * zoomFactor));
      } else {
        this.translateY += event.delta[1] * 0.5;
      }

      // Constrain translation
      this.translateX = Math.max(-100, Math.min(100, this.translateX));
      this.translateY = Math.max(-100, Math.min(100, this.translateY));
    }

    if (event.last) {
      this.isWheeling = false;
    }
  }
}
