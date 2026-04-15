import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClaimService } from '../../../core/services/claim.service';
import { AdminService } from '../../../core/services/admin.service';
import { EncounterResponse, Payer } from '../../../core/models';

@Component({
  selector: 'app-claim-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>Create Claim</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-column">
        <mat-form-field appearance="outline">
          <mat-label>Encounter</mat-label>
          <mat-select formControlName="encounterId">
            @for (e of encounters; track e.encounterId) {
              <mat-option [value]="e.encounterId">
                #{{ e.encounterId }} - {{ e.patientName }} ({{ e.serviceDate }})
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Payer</mat-label>
          <mat-select formControlName="payerId">
            @for (p of payers; track p.payerId) {
              <mat-option [value]="p.payerId">{{ p.payerName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading || form.invalid">
        {{ loading ? 'Creating...' : 'Create Claim' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.form-column { display: flex; flex-direction: column; min-width: 400px; } mat-form-field { width: 100%; }`]
})
export class ClaimCreateComponent implements OnInit {
  form!: FormGroup;
  encounters: EncounterResponse[] = [];
  payers: Payer[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ClaimCreateComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      encounterId: ['', Validators.required],
      payerId: ['', Validators.required]
    });
    this.claimService.getEncountersForClaim().subscribe(res => this.encounters = res.data || []);
    this.adminService.getPayers().subscribe(res => this.payers = res.data || []);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.claimService.create(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Claim created', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Failed to create claim', 'Close', { duration: 3000 });
      }
    });
  }
}
