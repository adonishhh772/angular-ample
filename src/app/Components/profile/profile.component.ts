import {Component, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @Input() profile: any = [];
    @Input() errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {}


  logout(): void{
    this.authService.logout();
    this.router.navigate(['login']);
  }



    gotoProfile(e: any): void{
      if(e.target.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.className.includes('show')){
          e.target.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.className = e.target.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.className.replace(' show', '');
      }
      
      this.router.navigate(['profile-details'], {state: {data: this.profile}});
    }




}
