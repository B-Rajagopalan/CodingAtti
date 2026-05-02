import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  statusMessage = '';
  isSubmitting = false;

  constructor(private loginService: LoginService, 
              private router: Router
  ) {}

  login() {
    if (!this.user.email || !this.user.password) {
      this.statusMessage = 'Please enter both email and password.';
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = 'Signing in...';

    this.loginService.signIn(this.user).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.statusMessage = response.message ?? `Logged in as ${this.user.email}`;
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.statusMessage =
          error?.error?.message ?? 'Login failed. Please check your credentials and try again.';
        this.isSubmitting = false;
      }
    });
  }
}
