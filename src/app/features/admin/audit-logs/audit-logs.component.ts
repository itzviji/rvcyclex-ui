import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { AdminService } from '../../../core/services/admin.service';
import { AuditLog } from '../../../core/models';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, DropdownModule, SidebarModule, TooltipModule],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  logs: AuditLog[] = [];
  loading = true;
  filterVisible = false;
  filterEntity = '';
  filterAction = '';
  actionOptions = [
    { label: 'Create', value: 'CREATE' }, { label: 'Update', value: 'UPDATE' },
    { label: 'Delete', value: 'DELETE' }, { label: 'Status Change', value: 'STATUS_CHANGE' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAuditLogs(500).subscribe({
      next: (res) => { this.logs = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void { this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains'); }

  applyFilters(): void {
    this.dt.filter(this.filterEntity, 'entityType', 'contains');
    this.dt.filter(this.filterAction, 'actionType', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void { this.filterEntity = ''; this.filterAction = ''; this.dt.clear(); }

  get activeFilterCount(): number { return [this.filterEntity, this.filterAction].filter(v => !!v).length; }

  exportCSV(): void { this.dt.exportCSV(); }

  getActionSeverity(action: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (action) { case 'CREATE': return 'success'; case 'UPDATE': return 'warning'; case 'DELETE': return 'danger'; default: return 'info'; }
  }
}
