import { Injectable, EventEmitter } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationTypeService {
    onFormSubmitted = new EventEmitter<any>();
    onNavChanged = new EventEmitter<any>();
    private readonly apiUrl = `${environment.apiUrl}applicationType/`;
  constructor(private http: HttpClient, private router: Router) { }

    add(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, data, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    delType(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl + id}`).pipe(
            map(result => {
                return result;
            })
        );
    }

    updateType(data: any, id: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl + id}`, data, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    return result;
                })
            );
    }
}
