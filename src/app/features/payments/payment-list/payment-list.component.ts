import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from '../../../core/services/payment.service';
import { ClaimResponse } from '../../../core/models';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TooltipModule, ToastModule, SidebarModule],
  providers: [MessageService],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  approvedClaims: ClaimResponse[] = [];
  loading = true;
  filterVisible = false;
  filterClaimNumber = '';
  filterPatient = '';
  filterPayer = '';

  constructor(private paymentService: PaymentService, private dialog: MatDialog, private messageService: MessageService) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.loading = true;
    this.paymentService.getApprovedClaims().subscribe({
      next: (res) => { this.approvedClaims = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void { this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  applyFilters(): void {
    this.dt.filter(this.filterClaimNumber, 'claimNumber', 'contains');
    this.dt.filter(this.filterPatient, 'patientName', 'contains');
    this.dt.filter(this.filterPayer, 'payerName', 'contains');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterClaimNumber = ''; this.filterPatient = ''; this.filterPayer = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterClaimNumber, this.filterPatient, this.filterPayer].filter(v => !!v).length;
  }

  openPaymentForm(claim: ClaimResponse): void {
    const ref = this.dialog.open(PaymentFormComponent, { width: '500px', data: claim });
    ref.afterClosed().subscribe(result => { if (result) this.loadData(); });
  }

  exportCSV(): void { this.dt.exportCSV(); }
}
