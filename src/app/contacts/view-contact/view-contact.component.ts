import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit, AfterViewInit {
    naviagtionData: any[] = [];
    links = ['Client Overview', 'Personal Details', 'College Application', 'Visa Applications', 'Accounts', 'Documents', 'Tasks', 'Notes'];
    activeLink = this.links[0];
    errorMessage = '';
    isLoaded = false;
    private readonly apiUrl = `${environment.apiUrl}`;
  constructor(public route: ActivatedRoute,  private http: HttpClient, private renderer: Renderer2, private elRef: ElementRef) { }

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
          // console.log(params);
          this.http.get<any>(`${this.apiUrl + 'users/' + params.id}`).subscribe({
              next: data => {
                  const userData = data.data;
                  this.naviagtionData = [];
                  this.naviagtionData.push(userData);
                  this.isLoaded = true;
                  // console.log(data.data);
              },
              error: error => {
                  this.errorMessage = error.message;
              }
          });
      });
  }

    ngAfterViewInit(): void {
      // console.log(this.elRef.nativeElement.querySelector('.mat-ink-bar'));
        // const el = this.elRef.nativeElement.querySelector('.mat-ink-bar');
        // this.renderer.setStyle(el, 'background-color', 'transparent');
    }

    changeTabs($event: any): any {
        this.activeLink = $event;
    }
}
