import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChargeService } from '../../../core/services/charge.service';
import { IcdMaster, CptMaster } from '../../../core/models';

@Component({
  selector: 'app-charge-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, InputTextModule, InputNumberModule, AutoCompleteModule, ToastModule],
  providers: [MessageService],
  templateUrl: './charge-form.component.html',
  styleUrl: './charge-form.component.scss'
})
export class ChargeFormComponent implements OnInit {
  form!: FormGroup;
  icdSuggestions: IcdMaster[] = [];
  cptSuggestions: CptMaster[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private chargeService: ChargeService,
    private messageService: MessageService,
    public dialogRef: MatDialogRef<ChargeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { encounterId: number }
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      icdCode: ['', Validators.required],
      cptCode: ['', Validators.required],
      units: [1, [Validators.required, Validators.min(1)]]
    });
  }

  searchIcd(event: any): void {
    this.chargeService.searchIcd(event.query).subscribe(res => this.icdSuggestions = res.data || []);
  }

  searchCpt(event: any): void {
    this.chargeService.searchCpt(event.query).subscribe(res => this.cptSuggestions = res.data || []);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const request = { encounterId: this.data.encounterId, ...this.form.value };

    this.chargeService.create(request).subscribe({
      next: () => { this.dialogRef.close(true); },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed' });
      }
    });
  }
}
