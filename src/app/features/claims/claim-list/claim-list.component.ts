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
import { ClaimService } from '../../../core/services/claim.service';
import { ClaimResponse } from '../../../core/models';
import { ClaimDetailComponent } from '../claim-detail/claim-detail.component';
import { ClaimCreateComponent } from '../claim-detail/claim-create.component';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, TooltipModule, ConfirmDialogModule, ToastModule, SidebarModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})
export class ClaimListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  claims: ClaimResponse[] = [];
  loading = true;
  filterVisible = false;
  filterClaimNumber = '';
  filterPatient = '';
  filterPayer = '';
  filterStatus = '';
  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Denied', value: 'DENIED' },
    { label: 'Paid', value: 'PAID' }
  ];

  constructor(private claimService: ClaimService, private dialog: MatDialog, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void { this.loadClaims(); }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getAll().subscribe({
      next: (res) => { this.claims = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void { this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  applyFilters(): void {
    this.dt.filter(this.filterClaimNumber, 'claimNumber', 'contains');
    this.dt.filter(this.filterPatient, 'patientName', 'contains');
    this.dt.filter(this.filterPayer, 'payerName', 'contains');
    this.dt.filter(this.filterStatus, 'status', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterClaimNumber = ''; this.filterPatient = ''; this.filterPayer = ''; this.filterStatus = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterClaimNumber, this.filterPatient, this.filterPayer, this.filterStatus].filter(v => !!v).length;
  }

  openCreate(): void {
    const ref = this.dialog.open(ClaimCreateComponent, { width: '500px' });
    ref.afterClosed().subscribe(result => { if (result) this.loadClaims(); });
  }

  viewDetail(claim: ClaimResponse): void { this.dialog.open(ClaimDetailComponent, { width: '600px', data: claim }); }

  scrubClaim(claim: ClaimResponse): void {
    this.confirmationService.confirm({
      message: `Scrub claim ${claim.claimNumber}? This will validate and set status.`,
      header: 'Scrub Claim', icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.claimService.scrub(claim.claimId).subscribe({
          next: (res) => { this.messageService.add({ severity: res.data.status === 'APPROVED' ? 'success' : 'warn', summary: 'Scrubbed', detail: `Claim ${res.data.status}` }); this.loadClaims(); },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Scrub failed' })
        });
      }
    });
  }

  exportCSV(): void { this.dt.exportCSV(); }

  getStatusSeverity(status: string): 'success' | 'danger' | 'info' | 'warning' {
    switch (status) { case 'APPROVED': return 'success'; case 'DENIED': return 'danger'; case 'PAID': return 'info'; default: return 'warning'; }
  }
}
