import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../environments/environment.dit';
import { CommonPayload } from '../payload/common-payload';
import { AdminModel } from '../models/admin-model';
import { ErrorModel } from '../models/error-model';
import { CreateAdminPayload } from '../payload/admins/admin/create-admin-payload';
import { CommonDeletePayload } from '../payload/common-delete-payload';

@Injectable({
  providedIn: 'root',
})

export class AdminService {
    private baseApiUrl = `${environment.apiUrl}`
    private imageURL = `${environment.imageURL}`
    private readonly adminURL  = `${this.baseApiUrl}/admin/new-admin`;
    private readonly updateURL = `${this.baseApiUrl}admin/update/new-admin/@`;
    private readonly deleteVariantURL = `${this.baseApiUrl}/inventory/variant/delete`;
    private readonly getVariantListAllUrl = `${this.baseApiUrl}/inventory/variant/list-all`;

    constructor(private http: HttpClient) {}

    getListDataFilter(filter: CommonPayload, token: string): Observable<AdminModel> {
        const params = new HttpParams()
        .set('page', filter.page?.toString() || '25')
        .set('per_page', filter.per_page || '')
        .set('search_name', filter.search_name || '');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json', // optional but recommended
        });

         return this.http.get<AdminModel>(this.adminURL, { params, headers }).pipe(
            catchError((err: HttpErrorResponse) => {
            const errorResponse: ErrorModel
             = {
                success: err.error?.success ?? false,
                message: err.error?.message ?? 'Something went wrong. Please try again.',
            };
            return throwError(() => errorResponse);
            })
        );
    }

    createData(data: CreateAdminPayload, token: string): Observable<AdminModel> {
        const formData = new FormData()
        formData.set('full_name', data.full_name)
        formData.set('email', data.email)
        formData.set('mobile_number', data.mobile_number)
        formData.set('username', data.username)
        formData.set('password', data.password)

        if(data.imagePath){
            formData.append('image_path', data.imagePath as File);
        }
      

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        });

         return this.http.post<AdminModel>(this.adminURL, formData, { headers }).pipe(
            catchError((err: HttpErrorResponse) => {
                const errorResponse: ErrorModel = {
                    success: err.error?.success ?? false,
                    message: err.error?.message ?? 'Something went wrong. Please try again.',
                };
                return throwError(() => errorResponse);
            })
        );
    }

    updateData(data: CreateAdminPayload, token: string): Observable<AdminModel> {
        const formData = new FormData()
        formData.set('full_name', data.full_name)
        formData.set('email', data.email)
        formData.set('mobile_number', data.mobile_number)
        formData.set('username', data.username)
        formData.set('password', data.password)

        if(data.imagePath){
            formData.append('image_path', data.imagePath as File);
        }
      

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        });

        const newURL = this.updateURL.replace('@', data.id.toString())

         return this.http.post<AdminModel>(newURL, formData, { headers }).pipe(
            catchError((err: HttpErrorResponse) => {
            const errorResponse: ErrorModel = {
                success: err.error?.success ?? false,
                message: err.error?.message ?? 'Something went wrong. Please try again.',
            };
            return throwError(() => errorResponse);
            })
        );
    }

    deleteData(data: CommonDeletePayload, token: string): Observable<AdminModel> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

        const jsonData = JSON.stringify(data)

         return this.http.post<AdminModel>(this.deleteVariantURL, jsonData, { headers }).pipe(
            catchError((err: HttpErrorResponse) => {
            const errorResponse: ErrorModel = {
                success: err.error?.success ?? false,
                message: err.error?.message ?? 'Something went wrong. Please try again.',
            };
            return throwError(() => errorResponse);
            })
        );
    }

    getImageURL(): string {
        return this.imageURL;
    }

    getListDataAll(data: CommonPayload, token: string): Observable<AdminModel> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
    
        const options = {
            headers: headers
        }
    
        return this.http.post<AdminModel>(this.getVariantListAllUrl, data, options).pipe(
          catchError((err: HttpErrorResponse) => {
            const errorResponse: ErrorModel = {
              success: err.error?.success ?? false,
              message: err.error?.message ?? 'Something went wrong. Please try again.',
            };
            return throwError(() => errorResponse);
          })
        );
    }
}