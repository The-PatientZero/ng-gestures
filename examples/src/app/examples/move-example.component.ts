import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-move-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Move Example</h1>
        <p>Pointer movement tracking and hover effects</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Move your mouse over the colored areas</li>
            <li>Notice the smooth tracking of pointer movement</li>
            <li>Each area responds differently to movement</li>
            <li>Move events are fired continuously while moving</li>
          </ul>
        </div>

        <div class="move-container">
          <div
            class="move-area area-1"
            [style.transform]="'scale(' + scale1 + ') rotate(' + rotation1 + 'deg)'"
            useMove
            (onMove)="onMoveEvent($event, 1)"
          >
            <div class="area-content">
              <span class="area-icon">🎯</span>
              <p>Area 1</p>
            </div>
          </div>

          <div
            class="move-area area-2"
            [style.transform]="'translate(' + translateX2 + 'px, ' + translateY2 + 'px)'"
            useMove
            (onMove)="onMoveEvent($event, 2)"
          >
            <div class="area-content">
              <span class="area-icon">🎪</span>
              <p>Area 2</p>
            </div>
          </div>

          <div
            class="move-area area-3"
            [style.background]="'linear-gradient(' + angle3 + 'deg, #ff9ff3, #f368e0)'"
            useMove
            (onMove)="onMoveEvent($event, 3)"
          >
            <div class="area-content">
              <span class="area-icon">🌈</span>
              <p>Area 3</p>
            </div>
          </div>
        </div>

        <div class="state-info" *ngIf="moveState">
          <h3>Move State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Moving:</strong>
              <span [class.active]="moveState.moving">{{ moveState.moving }}</span>
            </div>
            <div class="state-item">
              <strong>Position:</strong>
              {{ moveState.xy?.[0] | number: '1.0-0' }},
              {{ moveState.xy?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Velocity:</strong>
              {{ moveState.velocity?.[0] | number: '1.0-0' }},
              {{ moveState.velocity?.[1] | number: '1.0-0' }}
            </div>
            <div class="state-item">
              <strong>Active Area:</strong>
              {{ activeArea }}
            </div>
            <div class="state-item">
              <strong>Scale 1:</strong>
              {{ scale1 | number: '1.2-2' }}
            </div>
            <div class="state-item">
              <strong>Translate 2:</strong>
              {{ translateX2 | number: '1.0-0' }}, {{ translateY2 | number: '1.0-0' }}
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

      .move-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .move-area {
        background: var(--card-bg);
        border-radius: 20px;
        height: 200px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: crosshair;
        transition: all 0.3s ease;
      }

      .move-area:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 50px rgba(177, 5, 29, 0.2);
      }

      .area-1 {
        background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
      }

      .area-2 {
        background: linear-gradient(135deg, var(--brand-info), var(--brand-info-light));
      }

      .area-3 {
        background: linear-gradient(135deg, var(--brand-secondary), var(--brand-secondary-light));
      }

      .area-content {
        text-align: center;
        color: var(--brand-on-info);
        z-index: 1;
      }

      .area-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      .area-content p {
        margin: 0;
        font-weight: bold;
        font-size: 1.1rem;
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
export class MoveExampleComponent {
  scale1 = 1;
  rotation1 = 0;
  translateX2 = 0;
  translateY2 = 0;
  angle3 = 0;
  moveState: any = null;
  activeArea = 'None';

  onMoveEvent(event: any, areaNumber: number) {
    this.moveState = event;
    this.activeArea = `Area ${areaNumber}`;

    if (event.moving && event.velocity) {
      const speed = Math.sqrt(event.velocity[0] ** 2 + event.velocity[1] ** 2);

      switch (areaNumber) {
        case 1:
          // Scale and rotate based on movement speed
          this.scale1 = Math.max(0.8, Math.min(1.5, 1 + speed * 0.001));
          this.rotation1 += speed * 0.1;
          break;
        case 2:
          // Translate based on pointer position
          if (event.xy) {
            this.translateX2 = (event.xy[0] - 300) * 0.1;
            this.translateY2 = (event.xy[1] - 200) * 0.1;
          }
          break;
        case 3:
          // Change gradient angle based on movement
          this.angle3 += speed * 0.5;
          break;
      }
    }
  }
}
