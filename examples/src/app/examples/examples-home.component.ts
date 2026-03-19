import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ExampleRoute {
  path: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-examples-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="examples-home">
      <header class="hero">
        <h1>ng-gestures</h1>
        <p>Interactive Angular Gesture Examples</p>
      </header>

      <div class="examples-grid">
        <div *ngFor="let example of examples" class="example-card" (click)="navigateToExample(example.path)">
          <h3>{{ example.title }}</h3>
          <p>{{ example.description }}</p>
          <div class="arrow">→</div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .examples-home {
        min-height: 100vh;
        background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
        color: var(--brand-on-info);
        padding: 2rem;
      }

      .hero {
        text-align: center;
        margin-bottom: 4rem;
      }

      .hero h1 {
        font-size: 3rem;
        margin: 0;
        font-weight: 300;
        letter-spacing: -0.02em;
        color: var(--brand-on-info);
      }

      .hero p {
        font-size: 1.25rem;
        margin: 1rem 0;
        opacity: 0.9;
        color: var(--brand-on-info);
      }

      .examples-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .example-card {
        background: var(--overlay-bg);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
      }

      .example-card:hover {
        transform: translateY(-5px);
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 10px 30px rgba(177, 5, 29, 0.2);
      }

      .example-card h3 {
        margin: 0 0 1rem;
        font-size: 1.5rem;
        color: var(--brand-on-info);
      }

      .example-card p {
        margin: 0;
        opacity: 0.9;
        line-height: 1.6;
        color: var(--brand-on-info);
      }

      .arrow {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        font-size: 1.5rem;
        opacity: 0.7;
        transition: transform 0.3s ease;
        color: var(--brand-on-info);
      }

      .example-card:hover .arrow {
        transform: translateX(5px);
      }
    `
  ]
})
export class ExamplesHomeComponent {
  examples: ExampleRoute[] = [
    {
      path: 'drag',
      title: 'Drag Example',
      description: 'Interactive drag gestures with keyboard support and smooth animations'
    },
    {
      path: 'pinch',
      title: 'Pinch/Zoom Example',
      description: 'Multi-touch pinch and zoom gestures with scale constraints'
    },
    {
      path: 'scroll',
      title: 'Scroll Example',
      description: 'Custom scroll behaviors with momentum and boundaries'
    },
    {
      path: 'wheel',
      title: 'Wheel Example',
      description: 'Mouse wheel and trackpad gesture handling'
    },
    {
      path: 'move',
      title: 'Move Example',
      description: 'Pointer movement tracking and hover effects'
    },
    {
      path: 'hover',
      title: 'Hover Example',
      description: 'Advanced hover states with enter/leave animations'
    },
    {
      path: 'pull-to-refresh',
      title: 'Pull to Refresh Example',
      description: 'Mobile-friendly pull-to-refresh gesture with visual feedback'
    }
  ];

  constructor(private readonly router: Router) {}

  navigateToExample(path: string) {
    this.router.navigate(['/examples', path]);
  }
}
