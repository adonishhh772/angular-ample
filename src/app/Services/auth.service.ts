import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}users/`;

    constructor(private http: HttpClient) {
    }

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<{ token: string, userId: string }>(`${this.apiUrl}login`, {email: email, password: password}, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    localStorage.setItem('access_token', result.token);
                    localStorage.setItem('uid', result.userId);
                    return true;
                })
            );
    }

    logout(): any {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
    }

    public get loggedIn(): boolean {
        return (localStorage.getItem('access_token') !== null);
    }






}
