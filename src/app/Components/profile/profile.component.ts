import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private readonly apiUrl = `${environment.apiUrl}users/`;
  errorMessage = '';
  profile: any = [];
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();

  }

  logout(): void{
    this.authService.logout();
    this.router.navigate(['login']);
  }

    getUsers(): any{
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') };
        this.http.get<any>(`${this.apiUrl + localStorage.getItem('uid')}`, {headers}).subscribe({
            next: data => {
                this.profile = data.data;
            },
            error: error => {
                this.errorMessage =  error.message;
            }
        });
    }


    gotoProfile(): void{
      console.log('sdadasda');
    }



}
