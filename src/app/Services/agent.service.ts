import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

    private readonly apiUrl = `${environment.apiUrl}agent/`;

    agent = 0;
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

    delAgent(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl + id}`).pipe(
            map(result => {
                return result;
            })
        );
    }

    updateProfile(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl + localStorage.getItem('userId')}`, data, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    updateAgent(data: any, id: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl + 'update/' + id}`, data, {
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
