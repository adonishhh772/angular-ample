import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';


interface LoginResult {
    token: string;
    userName: string;
    branch: string;
    userId: string;
    userRole: string;
}

interface AgentResult {
    token: string;
    company_name: string;
    branch: string;
    userId: string;
    userRole: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}`;
    private timer: Subscription | undefined;

    constructor(private http: HttpClient, private router: Router) {
    }

    login(email: string, password: string, isAgent: boolean): Observable<any> {
        if (!isAgent) {
            return this.http.post<LoginResult>(`${this.apiUrl}users/login`, {
                email: email,
                password: password
            }, {
                headers:
                    {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            })
                .pipe(
                    map(result => {
                        this.setLocalStorage(result, false);
                        this.startTokenTimer();
                        return result;
                    })
                );
        } else {
            return this.http.post<AgentResult>(`${this.apiUrl}agent/login`, {
                email: email,
                password: password
            }, {
                headers:
                    {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            })
                .pipe(
                    map(result => {
                        console.log(result);
                        this.setLocalStorage(result, true);
                        this.startTokenTimer();
                        return result;
                    })
                );
        }

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

    private setLocalStorage(result: any, isAgent: boolean): any {
        localStorage.setItem('access_token', result.token);
        localStorage.setItem('userId', result.userId);
        if (isAgent) {
            localStorage.setItem('userName', result.company_name);
        } else {
            localStorage.setItem('userName', result.userName);
        }

        localStorage.setItem('userRole', result.userRole);
        localStorage.setItem('userBranch', result.branch);
    }

    public get userId(): any {
        return (localStorage.getItem('userId'));
    }

    public get userName(): any {
        return (localStorage.getItem('userName'));
    }

    public get userRole(): any {
        return (localStorage.getItem('userRole'));
    }

    private clearStorage() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('branch');
    }
}
