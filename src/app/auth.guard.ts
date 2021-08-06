import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './Services/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService) {
    }


    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        if (this.authService.loggedIn) {
            return true;
        } else {
            this.router.navigate(['/login'], {
                queryParams: {returnUrl: state.url},
            });
            return false;
        }
    }

}
