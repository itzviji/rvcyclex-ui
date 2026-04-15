import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { ChargeService } from '../../../core/services/charge.service';
import { EncounterService } from '../../../core/services/encounter.service';
import { ChargeEntryResponse, EncounterResponse } from '../../../core/models';
import { ChargeFormComponent } from '../charge-form/charge-form.component';

@Component({
  selector: 'app-charge-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DropdownModule, TooltipModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './charge-list.component.html',
  styleUrl: './charge-list.component.scss'
})
export class ChargeListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  encounters: EncounterResponse[] = [];
  encounterOptions: any[] = [];
  charges: ChargeEntryResponse[] = [];
  selectedEncounterId: number | null = null;
  loading = false;

  constructor(
    private chargeService: ChargeService,
    private encounterService: EncounterService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.encounterService.getAll().subscribe({
      next: (res) => {
        this.encounters = res.data || [];
        this.encounterOptions = this.encounters.map(e => ({ label: `#${e.encounterId} - ${e.patientName} (${e.serviceDate})`, value: e.encounterId }));
      }
    });
  }

  onEncounterChange(): void {
    if (!this.selectedEncounterId) { this.charges = []; return; }
    this.loadCharges();
  }

  loadCharges(): void {
    if (!this.selectedEncounterId) return;
    this.loading = true;
    this.chargeService.getByEncounter(this.selectedEncounterId).subscribe({
      next: (res) => { this.charges = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openForm(): void {
    const ref = this.dialog.open(ChargeFormComponent, { width: '500px', data: { encounterId: this.selectedEncounterId } });
    ref.afterClosed().subscribe(result => { if (result) this.loadCharges(); });
  }

  deleteCharge(charge: ChargeEntryResponse): void {
    this.confirmationService.confirm({
      message: `Delete charge #${charge.chargeId}?`,
      header: 'Delete Charge',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.chargeService.delete(charge.chargeId).subscribe({
          next: () => { this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Charge deleted' }); this.loadCharges(); },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Delete failed' })
        });
      }
    });
  }

  exportCSV(): void { this.dt.exportCSV(); }
}
