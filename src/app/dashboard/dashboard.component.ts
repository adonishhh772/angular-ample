import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  uName: any;
  constructor(private authSerive: AuthService) { }

  ngOnInit(): void {
    this.uName = this.authSerive.userName;
    console.log(this.uName);
  }

}
