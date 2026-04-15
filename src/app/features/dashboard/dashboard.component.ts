import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data: DashboardResponse | null = null;
  loading = true;

  paymentPieData: any;
  denialByReasonData: any;
  denialByCategoryData: any;
  claimStatusData: any;
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.data = res.data;
        this.buildCharts();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private buildCharts(): void {
    if (!this.data) return;

    const pie = this.data.paymentPieChart;
    if (pie) {
      this.paymentPieData = {
        labels: pie.labels,
        datasets: [{
          data: pie.values,
          backgroundColor: ['#1565C0', '#2E7D32', '#C62828']
        }]
      };
    }

    const reason = this.data.denialByReasonChart;
    if (reason) {
      this.denialByReasonData = {
        labels: reason.labels,
        datasets: [{
          label: reason.title || 'Denials by Reason',
          data: reason.values,
          backgroundColor: '#C62828'
        }]
      };
    }

    const category = this.data.denialByCategoryChart;
    if (category) {
      this.denialByCategoryData = {
        labels: category.labels,
        datasets: [{
          label: category.title || 'Denials by Category',
          data: category.values,
          backgroundColor: '#8E0000'
        }]
      };
    }

    const status = this.data.claimStatusChart;
    if (status) {
      this.claimStatusData = {
        labels: status.labels,
        datasets: [{
          label: status.title || 'Claims by Status',
          data: status.values,
          backgroundColor: ['#6B7280', '#1565C0', '#C62828', '#2E7D32']
        }]
      };
    }
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  }
}
