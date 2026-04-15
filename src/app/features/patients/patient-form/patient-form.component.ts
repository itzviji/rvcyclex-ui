import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PatientService } from '../../../core/services/patient.service';
import { PatientInsuranceResponse } from '../../../core/models';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, InputTextModule, DropdownModule, CalendarModule, InputNumberModule, ToastModule],
  providers: [MessageService],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientInsuranceResponse | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      dob: [this.data?.dob ? new Date(this.data.dob) : null, Validators.required],
      gender: [this.data?.gender || '', Validators.required],
      phone: [this.data?.phone || '', Validators.required],
      email: [this.data?.email || ''],
      address: [this.data?.address || ''],
      payerName: [this.data?.payerName || '', Validators.required],
      policyNumber: [this.data?.policyNumber || '', Validators.required],
      coverageDetails: [this.data?.coverageDetails || '', Validators.required],
      coverageLimit: [this.data?.coverageLimit || null, Validators.required],
      eligibilityStatus: [this.data?.eligibilityStatus || 'ACTIVE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const val = this.form.value;
    const request = { ...val, dob: this.formatDate(val.dob) };

    const obs = this.isEdit
      ? this.patientService.update(this.data!.patientId, request)
      : this.patientService.register(request);

    obs.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEdit ? 'Patient updated' : 'Patient registered' });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Operation failed' });
      }
    });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }
}
