import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../core/services/admin.service';
import { UserResponse } from '../../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, InputTextModule, DropdownModule, PasswordModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  roleOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Front Desk', value: 2 },
    { label: 'Doctor', value: 3 },
    { label: 'Medical Coder', value: 4 },
    { label: 'Biller', value: 5 },
    { label: 'Payment Poster', value: 6 },
    { label: 'Denial Analyst', value: 7 }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserResponse | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    const matchedRole = this.data ? this.roleOptions.find(r => r.label.toUpperCase().replace(/ /g, '_') === this.data!.roleName) : null;

    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phone: [this.data?.phone || ''],
      roleId: [matchedRole?.value || null, Validators.required],
      ...(!this.isEdit ? { password: ['', Validators.required] } : {})
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const obs = this.isEdit
      ? this.adminService.updateUser(this.data!.userId, {
          name: this.form.value.name, email: this.form.value.email,
          phone: this.form.value.phone, roleId: this.form.value.roleId
        })
      : this.adminService.createUser(this.form.value);

    obs.subscribe({
      next: () => { this.dialogRef.close(true); },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed' });
      }
    });
  }
}
