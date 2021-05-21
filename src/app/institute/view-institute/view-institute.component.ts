import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-view-institute',
  templateUrl: './view-institute.component.html',
  styleUrls: ['./view-institute.component.css']
})
export class ViewInstituteComponent implements OnInit {
    naviagtionData: any[] = [];
    agentData: any[] = [];
    errorMessage = '';
    agentCount = 0;
    isLoaded = false;
    hideAgent = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    constructor(public route: ActivatedRoute,  private http: HttpClient) {
    }


  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
          // console.log(params);
          this.http.get<any>(`${this.apiUrl + 'institute/' + params.id}`).subscribe({
              next: data => {
                  this.naviagtionData.push(data.data);
                  this.isLoaded = true;
                  // console.log(data.data);
              },
              error: error => {
                  this.errorMessage = error.message;
              }
          });

          this.http.get<any>(`${this.apiUrl + 'instituteAgent/' + params.id}`).subscribe({
              next: data => {
                  this.agentData = (data.data);
                  this.agentCount = data.data.length;
                  this.isLoaded = true;
                  // console.log(data.data);
              },
              error: error => {
                  this.errorMessage = error.message;
              }
          });

      });
  }

    onTabChanged(e: any): any{
        if(e.index != 0){
            this.hideAgent = true;
        }else{
            this.hideAgent = false;
        }
    }
}
