import { Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiClientService } from '../../core/api-client.service';
import { AuthStore } from '../../core/auth.store';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <section class="card" aria-labelledby="login-title">
      <h1 id="login-title">Login / Register</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <label>
          Full name
          <input formControlName="fullName" placeholder="Viorel Gil Ruiz" />
        </label>

        <label>
          Email
          <input formControlName="email" type="email" placeholder="you@fitmenu.ai" />
        </label>

        <label>
          Password
          <input formControlName="password" type="password" placeholder="********" />
        </label>

        <div class="actions">
          <button type="button" (click)="onRegister()" [disabled]="loading()">Register</button>
          <button type="submit" [disabled]="loading()">Login</button>
        </div>
      </form>

      <p *ngIf="error()" class="error" role="alert">{{ error() }}</p>
    </section>
  `,
  styles: [
    `
      .card {
        max-width: 500px;
        margin: 2rem auto;
        background: #0d1d3d;
        border: 1px solid #24466f;
        border-radius: 16px;
        padding: 1.2rem;
      }
      label {
        display: block;
        margin-bottom: 0.75rem;
      }
      input {
        width: 100%;
        margin-top: 0.35rem;
        border-radius: 10px;
        border: 1px solid #2f5685;
        background: #081427;
        color: #e8eef9;
        padding: 0.65rem;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
      button {
        border: none;
        border-radius: 10px;
        padding: 0.7rem 1rem;
        background: linear-gradient(90deg, #31d7ff, #6ac2ff);
        color: #011427;
        font-weight: 700;
      }
      .error {
        color: #ff9da4;
      }
    `,
  ],
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onRegister(): void {
    this.error.set(null);

    if (this.form.invalid || !this.form.value.fullName) {
      this.error.set('Complete fullName, email and password');
      return;
    }

    this.loading.set(true);
    this.api.register({
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
      fullName: this.form.value.fullName,
    }).subscribe({
      next: (tokens) => {
        this.loading.set(false);
        this.authStore.setTokens(tokens.accessToken, tokens.refreshToken);
        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Register failed');
      },
    });
  }

  onSubmit(): void {
    this.error.set(null);

    if (this.form.invalid) {
      this.error.set('Email and password are required');
      return;
    }

    this.loading.set(true);
    this.api.login({
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    }).subscribe({
      next: (tokens) => {
        this.loading.set(false);
        this.authStore.setTokens(tokens.accessToken, tokens.refreshToken);
        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Login failed');
      },
    });
  }
}
