import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-pinch-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Pinch/Zoom Example</h1>
        <p>Use two fingers to pinch and zoom the image</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Use two fingers to pinch in/out on touch devices</li>
            <li>Hold Ctrl + mouse wheel on desktop</li>
            <li>Zoom is constrained between 0.5x and 3x</li>
            <li>The image will scale smoothly with momentum</li>
          </ul>
        </div>

        <div class="pinch-container">
          <div
            class="zoomable-image"
            [style.transform]="'scale(' + scale + ')'"
            [style.transition]="isPinching ? 'none' : 'transform 0.3s ease'"
            usePinch
            [usePinchConfig]="{ scaleBounds: { min: 0.5, max: 3 } }"
            (onPinch)="onPinchEvent($event)"
          >
            <div class="image-content">
              <div class="placeholder-image">
                <span>🖼️</span>
                <p>Pinch to Zoom</p>
              </div>
            </div>
          </div>
        </div>

        <div class="state-info" *ngIf="pinchState">
          <h3>Pinch State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Pinching:</strong>
              <span [class.active]="pinchState.pinching">{{ pinchState.pinching }}</span>
            </div>
            <div class="state-item">
              <strong>Scale:</strong>
              {{ scale | number: '1.2-2' }}
            </div>
            <div class="state-item">
              <strong>Origin:</strong>
              {{ pinchState.origin?.[0] | number: '1.0-0' }},
              {{ pinchState.origin?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Offset:</strong>
              {{ pinchState.offset?.[0] | number: '1.0-0' }},
              {{ pinchState.offset?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Distance:</strong>
              {{ pinchState.distance | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Turns:</strong>
              {{ pinchState.turns | number: '1.0-0' }}
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

      .pinch-container {
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

      .zoomable-image {
        transform-origin: center;
        cursor: grab;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(177, 5, 29, 0.1);
      }

      .zoomable-image:active {
        cursor: grabbing;
      }

      .image-content {
        width: 300px;
        height: 200px;
        background: linear-gradient(135deg, var(--brand-info), var(--brand-info-light));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: var(--brand-on-info);
        font-weight: bold;
      }

      .placeholder-image {
        text-align: center;
      }

      .placeholder-image span {
        font-size: 3rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      .placeholder-image p {
        margin: 0;
        font-size: 1.1rem;
        opacity: 0.9;
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
export class PinchExampleComponent {
  scale = 1;
  isPinching = false;
  pinchState: any = null;
  private initialScale = 1;

  onPinchEvent(event: any) {
    this.pinchState = event;

    if (event.first) {
      this.isPinching = true;
      this.initialScale = this.scale;
    }

    if (event.offset) {
      this.scale = this.initialScale * event.offset[0];
      // Clamp scale between 0.5 and 3
      this.scale = Math.max(0.5, Math.min(3, this.scale));
    }

    if (event.last) {
      this.isPinching = false;
    }
  }
}
