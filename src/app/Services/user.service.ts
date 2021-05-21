import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}users/`;

  constructor(private http: HttpClient, private router: Router) { }

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

    delContact(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl + id}`).pipe(
            map(result => {
                return result;
            })
        );
    }
}
