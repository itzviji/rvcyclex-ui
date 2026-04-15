import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin.service';
import { UserResponse } from '../../../core/models';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, TooltipModule, ConfirmDialogModule, ToastModule, SidebarModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  users: UserResponse[] = [];
  loading = true;
  filterVisible = false;
  filterName = '';
  filterEmail = '';
  filterRole = '';
  roleOptions = [
    { label: 'Admin', value: 'ADMIN' }, { label: 'Front Desk', value: 'FRONT_DESK' },
    { label: 'Doctor', value: 'DOCTOR' }, { label: 'Medical Coder', value: 'MEDICAL_CODER' },
    { label: 'Biller', value: 'BILLER' }, { label: 'Payment Poster', value: 'PAYMENT_POSTER' },
    { label: 'Denial Analyst', value: 'DENIAL_ANALYST' }
  ];

  constructor(private adminService: AdminService, private dialog: MatDialog, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (res) => { this.users = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void { this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  applyFilters(): void {
    this.dt.filter(this.filterName, 'name', 'contains');
    this.dt.filter(this.filterEmail, 'email', 'contains');
    this.dt.filter(this.filterRole, 'roleName', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterName = ''; this.filterEmail = ''; this.filterRole = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterName, this.filterEmail, this.filterRole].filter(v => !!v).length;
  }

  openForm(user?: UserResponse): void {
    const ref = this.dialog.open(UserFormComponent, { width: '500px', data: user || null });
    ref.afterClosed().subscribe(result => { if (result) this.loadUsers(); });
  }

  toggleActive(user: UserResponse): void {
    const action = user.isActive ? 'deactivate' : 'activate';
    this.confirmationService.confirm({
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`,
      header: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: user.isActive ? 'p-button-danger' : 'p-button-success',
      accept: () => {
        this.adminService.toggleActive(user.userId).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Done', detail: `User ${action}d` }); this.loadUsers(); },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed' })
        });
      }
    });
  }

  exportCSV(): void { this.dt.exportCSV(); }
}
