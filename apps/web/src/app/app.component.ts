import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">FitMenu AI</a>
      <nav aria-label="Main navigation">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      </nav>
    </header>

    <main class="layout">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        background: #0b1a35;
        border-bottom: 1px solid #21426f;
      }
      .brand {
        color: #fff;
        text-decoration: none;
        font-weight: 700;
      }
      nav a {
        color: #c7dcff;
        text-decoration: none;
        margin-left: 1rem;
      }
      nav a.active {
        color: #31d7ff;
      }
      .layout {
        padding: 1rem;
        max-width: 1100px;
        margin: 0 auto;
      }
    `,
  ],
})
export class AppComponent {}
