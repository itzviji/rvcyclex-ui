import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ChargeEntryRequest, ChargeEntryResponse, IcdMaster, CptMaster } from '../models';

@Injectable({ providedIn: 'root' })
export class ChargeService {
  private url = `${environment.apiUrl}/charges`;

  constructor(private http: HttpClient) {}

  create(req: ChargeEntryRequest): Observable<ApiResponse<ChargeEntryResponse>> {
    return this.http.post<ApiResponse<ChargeEntryResponse>>(this.url, req);
  }

  getByEncounter(encounterId: number): Observable<ApiResponse<ChargeEntryResponse[]>> {
    return this.http.get<ApiResponse<ChargeEntryResponse[]>>(`${this.url}/encounter/${encounterId}`);
  }

  delete(chargeId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.url}/${chargeId}`);
  }

  searchIcd(keyword?: string): Observable<ApiResponse<IcdMaster[]>> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<IcdMaster[]>>(`${this.url}/icd`, { params });
  }

  searchCpt(keyword?: string): Observable<ApiResponse<CptMaster[]>> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<ApiResponse<CptMaster[]>>(`${this.url}/cpt`, { params });
  }
}
