import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    hideLoginPass = true;
    hidePass = true;
    hideRePass = true;
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
  constructor(private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

    toggleLogin(): void{
    if(!this.isInForgotPassword){
        this.isInForgotPassword = true;
    }else{
        this.isInForgotPassword = false;
    }

    }

    login(){
        this.isSubmitted = true;
        if (!this.loginForm.valid) {
            return false;
        } else {
            this.isValidated = true;
            this.auth.login(this.loginForm.value.email,this.loginForm.value.password)
                .pipe(first())
                .subscribe(
                    result => {
                        this.router.navigate(['/']);
                        },
                    err => {
                        console.log(err.error.msg);
                        this.isSubmitted = false;
                        this._snackBar.open(err.error.msg, '',{
                            duration: 2000,
                        });

                    }
                );
            return true;
        }

    }

    resetPass(){

    }


    get errorControl() {
        return this.loginForm.controls;
    }

    get err(){
      return this.resetForm.controls;
    }

}
