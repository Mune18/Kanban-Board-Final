// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
  }

  onSubmit() {
    this.message = ''; // Clear previous messages
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
          response => {
            if (response.token) {
              this.authService.saveToken(response.token);
              this.router.navigate(['/task-list']);
            } else {
              this.message = 'Login failed: Try Again';
            }
          },
          error => {
            this.message = error.message || 'Login failed';
            console.error(error);
          }
        );
      }
    } else {
      if (this.registerForm.valid) {
        this.authService.register(
          this.registerForm.value.name,
          this.registerForm.value.email,
          this.registerForm.value.password
        ).subscribe(
          response => {
            if (response.token) {
              this.authService.saveToken(response.token);
              this.router.navigate(['/task-list']);
            } else {
              this.message = 'Registration failed';
            }
          },
          error => {
            this.message = error.message || 'Registration failed';
            console.error(error);
          }
        );
      }
    }
  }
}