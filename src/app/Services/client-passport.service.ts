import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientPassportService {

    private readonly apiUrl = `${environment.apiUrl}passport/`;

    branch = 0;
    constructor(private http: HttpClient, private router: Router) {
    }

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

    delPassport(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl + id}`).pipe(
            map(result => {
                return result;
            })
        );
    }

    updatePassport(data: any, id: string): Observable<any> {
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
