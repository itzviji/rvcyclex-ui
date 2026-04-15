import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DenialService } from '../../../core/services/denial.service';
import { DenialResponse } from '../../../core/models';

@Component({
  selector: 'app-denial-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, InputTextModule, InputTextareaModule, ToastModule],
  providers: [MessageService],
  templateUrl: './denial-verify.component.html',
  styleUrl: './denial-verify.component.scss'
})
export class DenialVerifyComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private denialService: DenialService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<DenialVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public denial: DenialResponse
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      reasonCode: ['', Validators.required],
      category: [''],
      detailedReason: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.denialService.verify(this.denial.denialId, this.form.value).subscribe({
      next: () => { this.dialogRef.close(true); },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed' });
      }
    });
  }
}
