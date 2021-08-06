import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'app-recent',
    templateUrl: './recent.component.html',
    styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {
    allActivity: any[] = [];
    userName = localStorage.getItem('userId');
    hasActivity = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';

    constructor(public router: Router, public http: HttpClient, private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.getActivity();
    }

    private getActivity(): any {
        this.http.get<any>(this.apiUrl + 'activity/' + this.userName).subscribe({
            next: data => {
                this.allActivity = data.data.sort((a: any, b: any) => {
                    return (new Date(b.created_date).getTime() > new Date(a.created_date).getTime() ? 1 : -1);
                });
                if (this.allActivity.length > 0) {
                    this.hasActivity = true;
                }
                this.allActivity.forEach((cl: any) => {
                    let commentTime = '';
                    const createdDate = new Date(cl.created_date);
                    const currentDate = new Date();

                    const totalSeconds = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000);
                    const totalMinutes = Math.floor(totalSeconds / 60);
                    const totalHours = Math.floor(totalMinutes / 60);
                    const totalDays = Math.floor(totalHours / 24);

                    const hours = totalHours - (totalDays * 24);
                    const minutes = totalMinutes - (totalDays * 24 * 60) - (hours * 60);
                    const seconds = totalSeconds - (totalDays * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

                    if (totalDays !== 0) {
                        commentTime = totalDays.toString() + ' days ';
                    } else {
                        if (seconds !== 0) {
                            commentTime = minutes.toString() + ' seconds';
                        }

                        if (minutes !== 0) {
                            commentTime = minutes.toString() + ' minutes';
                        }

                        if (hours !== 0) {
                            commentTime = hours.toString() + ' hours';
                        }
                    }

                    if (commentTime === '') {
                        cl.time = 'Just now';
                    } else {
                        cl.time = commentTime + ' ago';
                    }

                    cl.description = cl.description.split(',');
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    goToClient(clientId: any): any {
        const navigationExtras: NavigationExtras = {
            queryParams: {id: clientId}
        };
        this.router.navigate(['contacts/view'], navigationExtras);
    }
}
