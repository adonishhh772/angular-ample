import {Component, OnInit, OnDestroy, AfterViewInit, HostListener} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthService} from '../Services/auth.service';
import {Router, ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
    hideLoginPass = true;
    hidePass = true;
    private subscription: Subscription | undefined;
    hideRePass = true;
    myStyles: any;
    isAgent = false;
    isInForgotPassword = false;
    isSubmitted = false;
    error = '';
    isValidated = false;
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
    resetForm = new FormGroup({
        resEmail: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        resPass: new FormControl('', [Validators.required, Validators.minLength(8)]),
        conformPass: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    constructor(private auth: AuthService,
                private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {
        if (localStorage.getItem('userId')) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit(): void {
        this.myStyles = {height: ((window.innerHeight) - 5) + 'px',  width: ((window.innerWidth) / 2) + 'px'};
    }

    toggleLogin(): void {
        if (!this.isInForgotPassword) {
            this.isInForgotPassword = true;
        } else {
            this.isInForgotPassword = false;
        }

    }

    @HostListener('window:resize')
    onWindowResize(): void {
        if (window.innerWidth > 1000) {
            this.myStyles = {height: ((window.innerHeight) - 5) + 'px', width: ((window.innerWidth) / 2) + 'px'};
        } else {
            this.myStyles = {};
        }

        // console.log(window.innerWidth);
    }

    login(): any {
        this.isSubmitted = true;
        if (!this.loginForm.valid) {
            return false;
        } else {
            this.isValidated = true;
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
            this.auth.login(this.loginForm.value.email, this.loginForm.value.password, this.isAgent)
                .pipe(finalize(() => (this.isSubmitted = false)))
                .subscribe(
                    () => {
                        this.router.navigate([returnUrl]);
                    },
                    (error) => {
                        if (error.error !== undefined) {
                            this._snackBar.open(error.error.msg, '', {
                                duration: 2000,
                            });
                        } else {
                            this.router.navigate([returnUrl]);
                        }
                    }
                );
            return true;
        }

    }

    agentChecked(e: any): any {
        if (e.checked) {
            this.isAgent = true;
        } else {
            this.isAgent = false;
        }
    }

    resetPass() {

    }


    get errorControl(): any {
        return this.loginForm.controls;
    }

    get err(): any {
        return this.resetForm.controls;
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    ngAfterViewInit(): void {
    }

}
