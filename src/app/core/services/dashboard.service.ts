import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, DashboardResponse, PieChartData, BarChartData } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ApiResponse<DashboardResponse>> {
    return this.http.get<ApiResponse<DashboardResponse>>(this.url);
  }

  getPaymentPieChart(): Observable<ApiResponse<PieChartData>> {
    return this.http.get<ApiResponse<PieChartData>>(`${this.url}/payment-pie-chart`);
  }

  getDenialByReasonChart(): Observable<ApiResponse<BarChartData>> {
    return this.http.get<ApiResponse<BarChartData>>(`${this.url}/denial-by-reason-chart`);
  }

  getDenialByCategoryChart(): Observable<ApiResponse<BarChartData>> {
    return this.http.get<ApiResponse<BarChartData>>(`${this.url}/denial-by-category-chart`);
  }
}
