import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.css']
})
export class ViewAgentComponent implements OnInit {
    naviagtionData: any[] = [];
    errorMessage = '';
    isLoaded = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    constructor(
        public router: Router,
        public route: ActivatedRoute,  private http: HttpClient) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
          // console.log(params);
            this.http.get<any>(`${this.apiUrl + 'agent/' + params.id}`).subscribe({
                next: data => {
                    this.naviagtionData.push(data.data);
                    this.isLoaded = true;
                    // console.log(data.data);
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });

        });
    }

    updateAgent(): any{
        this.router.navigate(['agent/add'], {state: {data: this.naviagtionData[0]}});
    }
}
