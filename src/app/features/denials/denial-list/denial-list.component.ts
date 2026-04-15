import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { DenialService } from '../../../core/services/denial.service';
import { DenialResponse } from '../../../core/models';
import { DenialVerifyComponent } from '../denial-verify/denial-verify.component';

@Component({
  selector: 'app-denial-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, TooltipModule, ToastModule, SidebarModule],
  providers: [MessageService],
  templateUrl: './denial-list.component.html',
  styleUrl: './denial-list.component.scss'
})
export class DenialListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  denials: DenialResponse[] = [];
  loading = true;
  filterVisible = false;
  filterClaimNumber = '';
  filterPatient = '';
  filterReason = '';
  filterCategory = '';
  filterStatus = '';
  statusOptions = [{ label: 'Open', value: 'OPEN' }, { label: 'Verified', value: 'DENIAL_VERIFIED' }];

  constructor(private denialService: DenialService, private dialog: MatDialog, private messageService: MessageService) {}

  ngOnInit(): void { this.loadDenials(); }

  loadDenials(): void {
    this.loading = true;
    this.denialService.getAll().subscribe({
      next: (res) => { this.denials = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void { this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  applyFilters(): void {
    this.dt.filter(this.filterClaimNumber, 'claimNumber', 'contains');
    this.dt.filter(this.filterPatient, 'patientName', 'contains');
    this.dt.filter(this.filterReason, 'reasonCode', 'contains');
    this.dt.filter(this.filterCategory, 'category', 'contains');
    this.dt.filter(this.filterStatus, 'status', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterClaimNumber = ''; this.filterPatient = ''; this.filterReason = ''; this.filterCategory = ''; this.filterStatus = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterClaimNumber, this.filterPatient, this.filterReason, this.filterCategory, this.filterStatus].filter(v => !!v).length;
  }

  openVerify(denial: DenialResponse): void {
    const ref = this.dialog.open(DenialVerifyComponent, { width: '600px', data: denial });
    ref.afterClosed().subscribe(result => { if (result) this.loadDenials(); });
  }

  downloadReport(denial: DenialResponse): void {
    this.denialService.downloadReport(denial.denialId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `denial-report-${denial.claimNumber}.pdf`; a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to download report' })
    });
  }

  exportCSV(): void { this.dt.exportCSV(); }

  getStatusSeverity(status: string): 'success' | 'danger' { return status === 'OPEN' ? 'danger' : 'success'; }
}
