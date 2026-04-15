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
import { PatientService } from '../../../core/services/patient.service';
import { PatientInsuranceResponse } from '../../../core/models';
import { PatientFormComponent } from '../patient-form/patient-form.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, ButtonModule, InputTextModule, TagModule,
    DropdownModule, TooltipModule, ConfirmDialogModule, ToastModule, SidebarModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  patients: PatientInsuranceResponse[] = [];
  loading = true;
  filterVisible = false;

  // Filter models
  filterName = '';
  filterPhone = '';
  filterPayer = '';
  filterGender = '';
  filterStatus = '';

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void { this.loadPatients(); }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAll().subscribe({
      next: (res) => { this.patients = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  applyFilters(): void {
    this.dt.filter(this.filterName, 'name', 'contains');
    this.dt.filter(this.filterPhone, 'phone', 'contains');
    this.dt.filter(this.filterPayer, 'payerName', 'contains');
    this.dt.filter(this.filterGender, 'gender', 'equals');
    this.dt.filter(this.filterStatus, 'eligibilityStatus', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterName = '';
    this.filterPhone = '';
    this.filterPayer = '';
    this.filterGender = '';
    this.filterStatus = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterName, this.filterPhone, this.filterPayer, this.filterGender, this.filterStatus]
      .filter(v => !!v).length;
  }

  openForm(patient?: PatientInsuranceResponse): void {
    const ref = this.dialog.open(PatientFormComponent, { width: '600px', data: patient || null });
    ref.afterClosed().subscribe(result => { if (result) this.loadPatients(); });
  }

  deletePatient(patient: PatientInsuranceResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${patient.name}?`,
      header: 'Delete Patient',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.patientService.delete(patient.patientId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Patient deleted' });
            this.loadPatients();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Delete failed' })
        });
      }
    });
  }

  exportCSV(): void { this.dt.exportCSV(); }

  getStatusSeverity(status: string): 'success' | 'danger' {
    return status === 'ACTIVE' ? 'success' : 'danger';
  }
}
