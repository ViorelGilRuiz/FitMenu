import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  register(payload: RegisterPayload) {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/register`, payload);
  }

  login(payload: LoginPayload) {
    return this.http.post<AuthTokens>(`${this.apiUrl}/auth/login`, payload);
  }

  me() {
    return this.http.get<{ id: string; email: string; fullName: string }>(
      `${this.apiUrl}/users/me`,
    );
  }

  enqueueAiMenu(payload: {
    goal: 'lose_fat' | 'maintain' | 'gain_muscle';
    activityLevel: 'low' | 'moderate' | 'high';
    mealsPerDay: number;
  }) {
    return this.http.post<{ id: string; status: string }>(
      `${this.apiUrl}/ai/generate-menu`,
      payload,
    );
  }

  aiJob(id: string) {
    return this.http.get<{
      id: string;
      status: string;
      resultJson?: Record<string, unknown>;
      errorMessage?: string;
    }>(`${this.apiUrl}/ai/jobs/${id}`);
  }
}
