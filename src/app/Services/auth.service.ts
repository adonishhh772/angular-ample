import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';



interface LoginResult {
    token: string;
    userName: string;
    userId: string;
    userRole: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}users/`;
    private timer: Subscription | undefined;

    constructor(private http: HttpClient, private router: Router) {
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post<LoginResult>(`${this.apiUrl}login`, {
            email: email,
            password: password
        }, {
            headers:
                {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        })
            .pipe(
                map(result => {
                    this.setLocalStorage(result);
                    this.startTokenTimer();
                    return result;
                })
            );
    }

    logout(): any {
        this.clearStorage();
        this.stopTokenTimer();
    }

    public get loggedIn(): boolean {
        return (localStorage.getItem('access_token') !== null);
    }

    private getTokenRemainingTime() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            return 0;
        }
        const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        return expires.getTime() - Date.now();
    }

    //
    private startTokenTimer() {
        const timeout = this.getTokenRemainingTime();
        this.timer = of(true)
            .pipe(
                delay(timeout),
                tap(() => {
                        this.refreshToken();
                    }
                )
            )
            .subscribe();
    }

    //
    private stopTokenTimer() {
        this.timer?.unsubscribe();
    }

    refreshToken() {
        this.logout();
        this.router.navigate(['/login']);
    }

    private setLocalStorage(result: any): any {
        localStorage.setItem('access_token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userName', result.userName);
        localStorage.setItem('userRole', result.userRole);
    }

    public get userId(): any{
        return (localStorage.getItem('userId'));
    }

    public get userName(): any{
        return (localStorage.getItem('userName'));
    }

    public get userRole(): any{
        return (localStorage.getItem('userRole'));
    }

    private clearStorage() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
    }
}
