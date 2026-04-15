import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ClaimRequest, ClaimResponse, EncounterResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private url = `${environment.apiUrl}/claims`;

  constructor(private http: HttpClient) {}

  getEncountersForClaim(): Observable<ApiResponse<EncounterResponse[]>> {
    return this.http.get<ApiResponse<EncounterResponse[]>>(`${this.url}/encounters-for-claim`);
  }

  create(req: ClaimRequest): Observable<ApiResponse<ClaimResponse>> {
    return this.http.post<ApiResponse<ClaimResponse>>(this.url, req);
  }

  scrub(claimId: number): Observable<ApiResponse<ClaimResponse>> {
    return this.http.post<ApiResponse<ClaimResponse>>(`${this.url}/${claimId}/scrub`, {});
  }

  getAll(): Observable<ApiResponse<ClaimResponse[]>> {
    return this.http.get<ApiResponse<ClaimResponse[]>>(this.url);
  }

  getById(id: number): Observable<ApiResponse<ClaimResponse>> {
    return this.http.get<ApiResponse<ClaimResponse>>(`${this.url}/${id}`);
  }

  getByStatus(status: string): Observable<ApiResponse<ClaimResponse[]>> {
    return this.http.get<ApiResponse<ClaimResponse[]>>(`${this.url}/status/${status}`);
  }

  getHistory(id: number): Observable<ApiResponse<ClaimResponse>> {
    return this.http.get<ApiResponse<ClaimResponse>>(`${this.url}/${id}/history`);
  }
}
