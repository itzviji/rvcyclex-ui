import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ClaimResponse, PaymentRequest, PaymentResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getApprovedClaims(): Observable<ApiResponse<ClaimResponse[]>> {
    return this.http.get<ApiResponse<ClaimResponse[]>>(`${this.url}/approved-claims`);
  }

  create(req: PaymentRequest): Observable<ApiResponse<PaymentResponse>> {
    return this.http.post<ApiResponse<PaymentResponse>>(this.url, req);
  }

  getByClaim(claimId: number): Observable<ApiResponse<PaymentResponse[]>> {
    return this.http.get<ApiResponse<PaymentResponse[]>>(`${this.url}/claim/${claimId}`);
  }

  getById(id: number): Observable<ApiResponse<PaymentResponse>> {
    return this.http.get<ApiResponse<PaymentResponse>>(`${this.url}/${id}`);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/${id}/invoice`, { responseType: 'blob' });
  }
}
