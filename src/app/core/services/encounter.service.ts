import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, EncounterRequest, EncounterResponse, PatientInsuranceResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class EncounterService {
  private url = `${environment.apiUrl}/encounters`;

  constructor(private http: HttpClient) {}

  getPatientsForSelection(): Observable<ApiResponse<PatientInsuranceResponse[]>> {
    return this.http.get<ApiResponse<PatientInsuranceResponse[]>>(`${this.url}/patients-for-selection`);
  }

  getAll(): Observable<ApiResponse<EncounterResponse[]>> {
    return this.http.get<ApiResponse<EncounterResponse[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<EncounterResponse>> {
    return this.http.get<ApiResponse<EncounterResponse>>(`${this.url}/${id}`);
  }

  create(req: EncounterRequest): Observable<ApiResponse<EncounterResponse>> {
    return this.http.post<ApiResponse<EncounterResponse>>(this.url, req);
  }

  getByPatient(patientId: number): Observable<ApiResponse<EncounterResponse[]>> {
    return this.http.get<ApiResponse<EncounterResponse[]>>(`${this.url}/patient/${patientId}`);
  }
}
