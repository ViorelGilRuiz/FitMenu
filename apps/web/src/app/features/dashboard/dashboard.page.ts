import { Component, inject, signal } from '@angular/core';
import { NgIf, JsonPipe } from '@angular/common';
import { ApiClientService } from '../../core/api-client.service';

@Component({
  standalone: true,
  imports: [NgIf, JsonPipe],
  template: `
    <section class="grid">
      <article class="card">
        <h1>AI Menu Generator</h1>
        <p>Asynchronous generation with BullMQ and Redis.</p>
        <button (click)="generate()" [disabled]="loading()">Generate menu</button>
        <p *ngIf="jobId()">Job id: <code>{{ jobId() }}</code></p>
        <p *ngIf="status()">Status: {{ status() }}</p>
      </article>

      <article class="card" *ngIf="result()">
        <h2>AI Result</h2>
        <pre>{{ result() | json }}</pre>
      </article>
    </section>
  `,
  styles: [
    `
      .grid {
        display: grid;
        gap: 1rem;
      }
      .card {
        background: #0d1d3d;
        border: 1px solid #24466f;
        border-radius: 16px;
        padding: 1rem;
      }
      button {
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1rem;
        background: linear-gradient(90deg, #31d7ff, #6ac2ff);
        color: #011427;
        font-weight: 700;
      }
      pre {
        overflow: auto;
      }
    `,
  ],
})
export class DashboardPageComponent {
  private readonly api = inject(ApiClientService);

  readonly loading = signal(false);
  readonly jobId = signal<string | null>(null);
  readonly status = signal<string | null>(null);
  readonly result = signal<Record<string, unknown> | null>(null);

  generate(): void {
    this.loading.set(true);
    this.api
      .enqueueAiMenu({
        goal: 'maintain',
        activityLevel: 'moderate',
        mealsPerDay: 4,
      })
      .subscribe({
        next: (job) => {
          this.jobId.set(job.id);
          this.status.set(job.status);
          this.poll(job.id);
        },
        error: () => this.loading.set(false),
      });
  }

  private poll(jobId: string): void {
    const timer = window.setInterval(() => {
      this.api.aiJob(jobId).subscribe({
        next: (job) => {
          this.status.set(job.status);
          if (job.status === 'done' || job.status === 'failed') {
            window.clearInterval(timer);
            this.loading.set(false);
            this.result.set(job.resultJson ?? null);
          }
        },
        error: () => {
          window.clearInterval(timer);
          this.loading.set(false);
        },
      });
    }, 1500);
  }
}
