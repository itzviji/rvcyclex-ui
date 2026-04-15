import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatSidenavModule, MatIconModule, MatButtonModule,
    MatTooltipModule, MatBadgeModule, MatMenuModule, MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  sidenavOpened = true;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['ADMIN', 'BILLER', 'PAYMENT_POSTER', 'DENIAL_ANALYST'] },
    { label: 'Patients', icon: 'people', route: '/patients', roles: ['ADMIN', 'FRONT_DESK', 'DOCTOR', 'MEDICAL_CODER', 'BILLER'] },
    { label: 'Encounters', icon: 'local_hospital', route: '/encounters', roles: ['ADMIN', 'DOCTOR', 'MEDICAL_CODER', 'BILLER'] },
    { label: 'Charges', icon: 'receipt', route: '/charges', roles: ['ADMIN', 'MEDICAL_CODER'] },
    { label: 'Claims', icon: 'description', route: '/claims', roles: ['ADMIN', 'BILLER', 'PAYMENT_POSTER', 'DENIAL_ANALYST'] },
    { label: 'Payments', icon: 'payment', route: '/payments', roles: ['ADMIN', 'PAYMENT_POSTER'] },
    { label: 'Denials', icon: 'cancel', route: '/denials', roles: ['ADMIN', 'DENIAL_ANALYST'] },
    { label: 'Users', icon: 'admin_panel_settings', route: '/admin/users', roles: ['ADMIN'] },
    { label: 'Audit Logs', icon: 'history', route: '/admin/audit-logs', roles: ['ADMIN'] },
  ];

  constructor(public authService: AuthService) {}

  get visibleNavItems(): NavItem[] {
    const role = this.authService.getRole();
    return this.navItems.filter(item => role && item.roles.includes(role));
  }

  get userInitial(): string {
    const name = this.authService.getUserName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
  }
}
