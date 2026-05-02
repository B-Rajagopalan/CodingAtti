import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly endpoint = `${API_BASE_URL}/login`;

  constructor(private http: HttpClient) {}

  signIn(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.endpoint, credentials);
  }
}
