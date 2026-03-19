import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GesturesModule } from 'ng-gestures';

@Component({
  selector: 'app-pull-to-refresh-example',
  standalone: true,
  imports: [CommonModule, RouterModule, GesturesModule],
  template: `
    <div class="example-container">
      <header class="example-header">
        <a routerLink="/examples" class="back-button">← Back to Examples</a>
        <h1>Pull to Refresh Example</h1>
        <p>Mobile-friendly pull-to-refresh gesture with visual feedback</p>
      </header>

      <div class="demo-area">
        <div class="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li><strong>Mobile:</strong> Pull down from the top of the content area to trigger refresh</li>
            <li><strong>Desktop:</strong> Click and drag down from the top of the content area</li>
            <li>Watch the progress indicator as you pull/drag</li>
            <li>Release when the indicator shows "Release to refresh"</li>
            <li>The refresh action will add new items to the list</li>
            <li><strong>Tip:</strong> Make sure to start the gesture from the very top of the content area</li>
          </ul>
        </div>

        <div
          class="pull-to-refresh-container"
          usePullToRefresh
          [usePullToRefreshConfig]="pullToRefreshConfig"
          (onPullToRefresh)="onPullToRefresh($event)"
        >
          <div class="refresh-indicator" [style.transform]="refreshTransform" [style.opacity]="refreshOpacity">
            <div class="refresh-icon" [class.refreshing]="isRefreshing">
              {{ isRefreshing ? '⟳' : '↓' }}
            </div>
            <div class="refresh-text">
              {{ refreshText }}
            </div>
          </div>

          <div class="pull-hint" [class.hidden]="hasInteracted">
            <div class="hint-icon">👆</div>
            <div class="hint-text">Click and drag down to refresh<br /><small>(or swipe down on mobile)</small></div>
          </div>

          <div class="content" [class.scrolled]="isScrolled">
            <div class="scroll-indicator" *ngIf="!isAtTop">Scroll to top to enable pull-to-refresh</div>
            <div
              class="item"
              *ngFor="let item of items; trackBy: trackByIndex; let i = index"
              [class.new-item]="newItemIndices.includes(i)"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <div class="state-info" *ngIf="debugInfo">
          <h3>Pull to Refresh State:</h3>
          <div class="state-grid">
            <div class="state-item">
              <strong>Active:</strong>
              <span [class.active]="debugInfo.active">{{ debugInfo.active }}</span>
            </div>
            <div class="state-item">
              <strong>Should Refresh:</strong>
              <span [class.active]="debugInfo.shouldRefresh">{{ debugInfo.shouldRefresh }}</span>
            </div>
            <div class="state-item">
              <strong>Progress:</strong>
              {{ debugInfo.progress }}%
            </div>
            <div class="state-item">
              <strong>Movement Y:</strong>
              {{ debugInfo.movementY }}px
            </div>
            <div class="state-item">
              <strong>Is Refreshing:</strong>
              <span [class.active]="isRefreshing">{{ isRefreshing }}</span>
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

      .pull-to-refresh-container {
        background: var(--card-bg);
        border-radius: 20px;
        height: 400px;
        position: relative;
        overflow: hidden;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(177, 5, 29, 0.1);
      }

      .refresh-indicator {
        position: absolute;
        top: -60px;
        left: 0;
        right: 0;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: linear-gradient(135deg, var(--brand-info), var(--brand-info-light));
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        transition: opacity 0.2s ease;
        color: var(--brand-on-info);
        box-shadow: 0 2px 10px rgba(177, 5, 29, 0.2);
      }

      .refresh-icon {
        font-size: 24px;
        margin-bottom: 4px;
        transition: transform 0.3s ease;
      }

      .refresh-icon.refreshing {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .refresh-text {
        font-size: 12px;
        opacity: 0.9;
        font-weight: 500;
      }

      .pull-hint {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: var(--brand-secondary);
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 10;
      }

      .pull-hint.hidden {
        opacity: 0;
      }

      .hint-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        animation: bounce 2s infinite;
      }

      .hint-text {
        font-size: 0.9rem;
        opacity: 0.8;
      }

      .hint-text small {
        font-size: 0.8rem;
        opacity: 0.6;
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

      .content {
        height: 100%;
        overflow-y: auto;
        padding: 20px;
        color: var(--brand-on-surface);
        cursor: grab;
      }

      .content:active {
        cursor: grabbing;
      }

      .scroll-indicator {
        position: sticky;
        top: 0;
        background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light));
        color: var(--brand-on-info);
        text-align: center;
        padding: 8px;
        margin: -20px -20px 10px -20px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 5;
      }

      .item {
        padding: 15px 20px;
        border-bottom: 1px solid var(--brand-tertiary);
        background: var(--brand-surface);
        margin-bottom: 1px;
        transition: all 0.3s ease;
      }

      .item:hover {
        background: var(--brand-base);
      }

      .item:last-child {
        border-bottom: none;
      }

      .item.new-item {
        background: linear-gradient(135deg, var(--brand-info), var(--brand-info-light));
        color: var(--brand-on-info);
        animation: slideInFromTop 0.5s ease-out;
        box-shadow: 0 2px 10px rgba(177, 5, 29, 0.2);
      }

      @keyframes slideInFromTop {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
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

      .state-item .active {
        color: var(--success-color);
        font-weight: bold;
      }

      @media (max-width: 768px) {
        .demo-area {
          padding: 1rem;
        }

        .example-header {
          padding: 1rem;
        }

        .back-button {
          left: 1rem;
          top: 1rem;
        }

        .example-header h1 {
          font-size: 2rem;
        }

        .state-grid {
          grid-template-columns: 1fr;
        }

        .pull-hint .hint-text {
          font-size: 0.8rem;
        }

        .content {
          cursor: default;
        }

        .content:active {
          cursor: default;
        }
      }

      @media (min-width: 769px) {
        .pull-to-refresh-container:hover {
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
        }

        .content {
          user-select: none;
        }

        .hint-text::after {
          content: ' 🖱️';
        }
      }
    `
  ]
})
export class PullToRefreshExampleComponent {
  items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
  isRefreshing = false;
  hasInteracted = false;
  isScrolled = false;
  isAtTop = true;
  newItemIndices: number[] = [];

  constructor() {}

  debugInfo = {
    active: false,
    shouldRefresh: false,
    progress: 0,
    movementY: 0
  };

  refreshTransform = 'translateY(0px)';
  refreshOpacity = 0;
  refreshText = 'Pull to refresh';

  pullToRefreshConfig = {
    threshold: 60,
    maxDistance: 100,
    resistance: 2,
    requireScrollTop: false,
    axis: 'y' as const,
    preventDefault: true
  };

  onPullToRefresh(event: any) {
    if (!this.hasInteracted && event.active) {
      this.hasInteracted = true;
    }

    this.debugInfo = {
      active: event.active,
      shouldRefresh: event.shouldRefresh,
      progress: Math.round(event.progress),
      movementY: Math.round(event.movement[1])
    };

    const pullDistance = event.movement[1];
    this.refreshTransform = `translateY(${Math.min(pullDistance, 100)}px)`;
    this.refreshOpacity = Math.min(pullDistance / 60, 1);

    if (event.shouldRefresh && !this.isRefreshing) {
      this.refreshText = 'Release to refresh';
    } else if (event.active) {
      this.refreshText = 'Pull to refresh';
    }

    if (event.last && event.shouldRefresh && !this.isRefreshing) {
      this.startRefresh();
    } else if (event.last) {
      this.resetRefreshIndicator();
    }

    if (event.last && !event.shouldRefresh && !this.isRefreshing) {
      this.refreshText = 'Pull to refresh';
    }
  }

  private startRefresh() {
    this.isRefreshing = true;
    this.refreshText = 'Refreshing...';

    setTimeout(() => {
      const newItems = Array.from({ length: 3 }, (_, i) => `New Item ${Date.now()}-${i + 1}`);
      this.items = [...newItems, ...this.items];

      this.newItemIndices = [0, 1, 2];

      setTimeout(() => {
        this.newItemIndices = [];
      }, 2000);

      this.isRefreshing = false;
      this.resetRefreshIndicator();
    }, 2000);
  }

  private resetRefreshIndicator() {
    this.refreshTransform = 'translateY(0px)';
    this.refreshOpacity = 0;
    this.refreshText = 'Pull to refresh';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
