import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CreateUserRequest, UpdateUserRequest, UserResponse, Payer, AuditLog } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private url = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  createUser(req: CreateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.url}/users`, req);
  }

  getUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.url}/users`);
  }

  getUser(id: number): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.url}/users/${id}`);
  }

  updateUser(id: number, req: UpdateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.url}/users/${id}`, req);
  }

  toggleActive(id: number): Observable<ApiResponse<UserResponse>> {
    return this.http.patch<ApiResponse<UserResponse>>(`${this.url}/users/${id}/toggle-active`, {});
  }

  getUsersByRole(roleName: string): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.url}/users/role/${roleName}`);
  }

  getPayers(): Observable<ApiResponse<Payer[]>> {
    return this.http.get<ApiResponse<Payer[]>>(`${this.url}/payers`);
  }

  getAuditLogs(limit = 100): Observable<ApiResponse<AuditLog[]>> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ApiResponse<AuditLog[]>>(`${this.url}/audit-logs`, { params });
  }

  getAuditLogsForEntity(type: string, id: number): Observable<ApiResponse<AuditLog[]>> {
    return this.http.get<ApiResponse<AuditLog[]>>(`${this.url}/audit-logs/entity/${type}/${id}`);
  }
}
