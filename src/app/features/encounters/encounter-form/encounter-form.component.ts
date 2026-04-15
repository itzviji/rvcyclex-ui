import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EncounterService } from '../../../core/services/encounter.service';
import { PatientInsuranceResponse } from '../../../core/models';

@Component({
  selector: 'app-encounter-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, InputTextModule, InputTextareaModule, DropdownModule, CalendarModule, ToastModule],
  providers: [MessageService],
  templateUrl: './encounter-form.component.html',
  styleUrl: './encounter-form.component.scss'
})
export class EncounterFormComponent implements OnInit {
  form!: FormGroup;
  patientOptions: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private encounterService: EncounterService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<EncounterFormComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      patientId: [null, Validators.required],
      serviceDate: [new Date(), Validators.required],
      diagnosisNotes: ['']
    });

    this.encounterService.getPatientsForSelection().subscribe({
      next: (res) => {
        this.patientOptions = (res.data || []).map(p => ({ label: `${p.name} (ID: ${p.patientId})`, value: p.patientId }));
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const val = this.form.value;
    const request = {
      ...val,
      serviceDate: val.serviceDate instanceof Date ? val.serviceDate.toISOString().split('T')[0] : val.serviceDate
    };

    this.encounterService.create(request).subscribe({
      next: () => { this.dialogRef.close(true); },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed' });
      }
    });
  }
}
