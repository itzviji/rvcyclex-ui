import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PatientInsuranceRequest, PatientInsuranceResponse, InsuranceResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private url = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<PatientInsuranceResponse[]>> {
    return this.http.get<ApiResponse<PatientInsuranceResponse[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<PatientInsuranceResponse>> {
    return this.http.get<ApiResponse<PatientInsuranceResponse>>(`${this.url}/${id}`);
  }

  register(req: PatientInsuranceRequest): Observable<ApiResponse<PatientInsuranceResponse>> {
    return this.http.post<ApiResponse<PatientInsuranceResponse>>(`${this.url}/register`, req);
  }

  update(id: number, req: PatientInsuranceRequest): Observable<ApiResponse<PatientInsuranceResponse>> {
    return this.http.put<ApiResponse<PatientInsuranceResponse>>(`${this.url}/${id}`, req);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`);
  }

  getInsurance(patientId: number): Observable<ApiResponse<InsuranceResponse[]>> {
    return this.http.get<ApiResponse<InsuranceResponse[]>>(`${this.url}/${patientId}/insurance`);
  }
}
