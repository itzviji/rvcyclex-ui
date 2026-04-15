import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, DenialResponse, VerifyDenialRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class DenialService {
  private url = `${environment.apiUrl}/denials`;

  constructor(private http: HttpClient) {}

  getOpen(): Observable<ApiResponse<DenialResponse[]>> {
    return this.http.get<ApiResponse<DenialResponse[]>>(`${this.url}/open`);
  }

  getAll(): Observable<ApiResponse<DenialResponse[]>> {
    return this.http.get<ApiResponse<DenialResponse[]>>(this.url);
  }

  getByStatus(status: string): Observable<ApiResponse<DenialResponse[]>> {
    return this.http.get<ApiResponse<DenialResponse[]>>(`${this.url}/status/${status}`);
  }

  getByClaim(claimId: number): Observable<ApiResponse<DenialResponse[]>> {
    return this.http.get<ApiResponse<DenialResponse[]>>(`${this.url}/claim/${claimId}`);
  }

  verify(id: number, req: VerifyDenialRequest): Observable<ApiResponse<DenialResponse>> {
    return this.http.patch<ApiResponse<DenialResponse>>(`${this.url}/${id}/verify`, req);
  }

  downloadReport(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/report`, { responseType: 'blob' });
  }
}
