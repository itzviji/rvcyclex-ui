import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { ClaimResponse } from '../../../core/models';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatListModule, MatChipsModule],
  template: `
    <h2 mat-dialog-title>Claim Details - {{ data.claimNumber }}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item><strong>Patient:</strong>&nbsp;{{ data.patientName }}</mat-list-item>
        <mat-list-item><strong>Payer:</strong>&nbsp;{{ data.payerName }}</mat-list-item>
        <mat-list-item><strong>Status:</strong>&nbsp;{{ data.status }}</mat-list-item>
        <mat-list-item><strong>Total Billed:</strong>&nbsp;{{ data.totalBilledAmount | currency }}</mat-list-item>
        <mat-list-item><strong>Approved Amount:</strong>&nbsp;{{ data.approvedAmount | currency }}</mat-list-item>
        <mat-list-item><strong>Created:</strong>&nbsp;{{ data.createdAt | date:'medium' }}</mat-list-item>
        @if (data.previousStatus) {
          <mat-list-item><strong>Previous Status:</strong>&nbsp;{{ data.previousStatus }}</mat-list-item>
        }
        @if (data.statusChangedAt) {
          <mat-list-item><strong>Status Changed:</strong>&nbsp;{{ data.statusChangedAt | date:'medium' }}</mat-list-item>
        }
      </mat-list>
      @if (data.decisionReasons && data.decisionReasons.length > 0) {
        <h3>Decision Reasons</h3>
        <mat-chip-set>
          @for (reason of data.decisionReasons; track reason) {
            <mat-chip>{{ reason }}</mat-chip>
          }
        </mat-chip-set>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Close</button>
    </mat-dialog-actions>
  `
})
export class ClaimDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<ClaimDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClaimResponse
  ) {}
}
