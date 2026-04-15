import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../../core/models';

interface DevUser {
  label: string;
  role: string;
  icon: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    InputTextModule, PasswordModule, ButtonModule, DividerModule, RippleModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  showDevLogin = environment.devLogin;

  devUsers: DevUser[] = [
    { label: 'Admin', role: 'ADMIN', icon: 'pi pi-shield' },
    { label: 'Front Desk', role: 'FRONT_DESK', icon: 'pi pi-id-card' },
    { label: 'Doctor', role: 'DOCTOR', icon: 'pi pi-heart' },
    { label: 'Medical Coder', role: 'MEDICAL_CODER', icon: 'pi pi-code' },
    { label: 'Biller', role: 'BILLER', icon: 'pi pi-file-edit' },
    { label: 'Payment Poster', role: 'PAYMENT_POSTER', icon: 'pi pi-credit-card' },
    { label: 'Denial Analyst', role: 'DENIAL_ANALYST', icon: 'pi pi-times-circle' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: res.message || 'Invalid credentials' });
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.message || 'Unable to connect to server' });
      }
    });
  }

  devLogin(devUser: DevUser): void {
    const mockAuth: AuthResponse = {
      token: 'dev-token-' + devUser.role.toLowerCase(),
      tokenType: 'Bearer',
      userId: 1,
      name: 'Dev ' + devUser.label,
      email: devUser.role.toLowerCase() + '@dev.local',
      role: devUser.role
    };
    localStorage.setItem('token', mockAuth.token);
    localStorage.setItem('user', JSON.stringify(mockAuth));
    window.location.href = '/dashboard';
  }

  get emailInvalid(): boolean {
    const ctrl = this.loginForm.get('email');
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  get passwordInvalid(): boolean {
    const ctrl = this.loginForm.get('password');
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
