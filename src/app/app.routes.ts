import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [roleGuard(['ADMIN', 'BILLER', 'PAYMENT_POSTER', 'DENIAL_ANALYST'])],
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        canActivate: [roleGuard(['ADMIN', 'FRONT_DESK', 'DOCTOR', 'MEDICAL_CODER', 'BILLER'])],
        loadComponent: () => import('./features/patients/patient-list/patient-list.component').then(m => m.PatientListComponent)
      },
      {
        path: 'encounters',
        canActivate: [roleGuard(['ADMIN', 'DOCTOR', 'MEDICAL_CODER', 'BILLER'])],
        loadComponent: () => import('./features/encounters/encounter-list/encounter-list.component').then(m => m.EncounterListComponent)
      },
      {
        path: 'charges',
        canActivate: [roleGuard(['ADMIN', 'MEDICAL_CODER'])],
        loadComponent: () => import('./features/charges/charge-list/charge-list.component').then(m => m.ChargeListComponent)
      },
      {
        path: 'claims',
        canActivate: [roleGuard(['ADMIN', 'BILLER', 'PAYMENT_POSTER', 'DENIAL_ANALYST'])],
        loadComponent: () => import('./features/claims/claim-list/claim-list.component').then(m => m.ClaimListComponent)
      },
      {
        path: 'payments',
        canActivate: [roleGuard(['ADMIN', 'PAYMENT_POSTER'])],
        loadComponent: () => import('./features/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent)
      },
      {
        path: 'denials',
        canActivate: [roleGuard(['ADMIN', 'DENIAL_ANALYST'])],
        loadComponent: () => import('./features/denials/denial-list/denial-list.component').then(m => m.DenialListComponent)
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/admin/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'admin/audit-logs',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/admin/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
