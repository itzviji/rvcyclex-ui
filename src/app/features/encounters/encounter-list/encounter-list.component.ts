import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { MatDialog } from '@angular/material/dialog';
import { EncounterService } from '../../../core/services/encounter.service';
import { EncounterResponse } from '../../../core/models';
import { EncounterFormComponent } from '../encounter-form/encounter-form.component';

@Component({
  selector: 'app-encounter-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, TagModule, TooltipModule, SidebarModule, DropdownModule],
  templateUrl: './encounter-list.component.html',
  styleUrl: './encounter-list.component.scss'
})
export class EncounterListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  encounters: EncounterResponse[] = [];
  loading = true;
  filterVisible = false;
  filterPatient = '';
  filterDoctor = '';
  filterCharged = '';
  chargedOptions = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }];

  constructor(private encounterService: EncounterService, private dialog: MatDialog) {}

  ngOnInit(): void { this.loadEncounters(); }

  loadEncounters(): void {
    this.loading = true;
    this.encounterService.getAll().subscribe({
      next: (res) => { this.encounters = res.data || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onGlobalFilter(event: Event): void {
    this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  applyFilters(): void {
    this.dt.filter(this.filterPatient, 'patientName', 'contains');
    this.dt.filter(this.filterDoctor, 'doctorName', 'contains');
    if (this.filterCharged) this.dt.filter(this.filterCharged === 'true', 'charged', 'equals');
    this.filterVisible = false;
  }

  clearFilters(): void {
    this.filterPatient = ''; this.filterDoctor = ''; this.filterCharged = '';
    this.dt.clear();
  }

  get activeFilterCount(): number {
    return [this.filterPatient, this.filterDoctor, this.filterCharged].filter(v => !!v).length;
  }

  openForm(): void {
    const ref = this.dialog.open(EncounterFormComponent, { width: '500px' });
    ref.afterClosed().subscribe(result => { if (result) this.loadEncounters(); });
  }

  exportCSV(): void { this.dt.exportCSV(); }
}
