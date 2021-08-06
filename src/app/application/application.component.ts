import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ApplicationTypeService} from '../Services/application-type.service';

export interface Upcoming {
    id: string;
    application_no: string;
    client_name: string;
    college_name: string;
    phone: string;
    course_name: string;
    start_date: string;
    status: string;
}

export interface Complete {
    id: string;
    application_no: string;
    client_name: string;
    college_name: string;
    phone: string;
    course_name: string;
    completion_date: string;
}


@Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
    private readonly apiUrl = `${environment.apiUrl}`;
    isLoaded = false;
    hasActivity = false;
    allActivity: any[] = [];
    userName = localStorage.getItem('userId');
    links = ['Application Dashboard'];
    displayedColumns: string[] = ['application_id', 'client_name', 'phone', 'college_name', 'course_name', 'start_date', 'status', 'actions'];
    displayedColumnsComplete: string[] = ['application_id', 'client_name', 'phone', 'college_name', 'course_name', 'completion_date', 'actions'];
    activeLink = this.links[0];
    errorMessage = '';
    allApplicationType: any[] = [];
    chuckSize = 5;
    today = Date.now();
    isProcessing = false;
    allUpcomingApplication: any[] = [];
    allCompleteApplication: any[] = [];
    numRowsUpcoming = 0;
    application: any[] = [];
    numRowsComplete = 0;
    dataUpcomingSource!: MatTableDataSource<Upcoming>;
    dataCompletingSource!: MatTableDataSource<Complete>;
    @ViewChild(MatPaginator) paginatorUpcoming!: MatPaginator;
    @ViewChild(MatPaginator) paginatorComplete!: MatPaginator;
    @ViewChild(MatSort) sortUpcoming!: MatSort;
    @ViewChild(MatSort) sortComplete!: MatSort;

    constructor(private renderer: Renderer2,
                private router: Router,
                private elRef: ElementRef,
                private applicationTypeService: ApplicationTypeService,
                private http: HttpClient) {
    }

    ngOnInit(): void {
        this.getUpcomingApplication();
        this.getApplicationType();
        this.getActivity();
    }

    private getActivity(): any {
        this.http.get<any>(this.apiUrl + 'activity/' + this.userName).subscribe({
            next: data => {
                this.allActivity = data.data.sort((a: any, b: any) => {
                    return (new Date(b.created_date).getTime() > new Date(a.created_date).getTime() ? 1 : -1);
                });

                this.allActivity = this.allActivity.filter((application: any) => {
                    return application.type === 'Application';
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


    goToAdd(): void {
        this.router.navigate(['application/add']);
    }

    goToTracker(type: any): any {
        this.addNavBar(type);
        const navigationExtras: NavigationExtras = {
            queryParams: {id: type._id}
        };
        this.router.navigate(['application/tracker'], navigationExtras);
    }

    changeTab(link: string): void {
        this.activeLink = link;

        if (link === this.links[0]) {
            this.router.navigate(['application']);
        }
    }

    getApplicationType(): void {
        this.http.get<any>(this.apiUrl + 'applicationType/').subscribe({
            next: data => {
                this.isLoaded = true;
                this.application = data.data;
                for (let i = 0; i < data.data.length; i += this.chuckSize) {
                    this.allApplicationType.push(data.data.slice(i, i + this.chuckSize));
                }
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    applyFilter(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataUpcomingSource.filter = filterValue.trim().toLowerCase();

        if (this.dataUpcomingSource.paginator) {
            this.dataUpcomingSource.paginator.firstPage();
        }
    }

    applyFilterComplete(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataCompletingSource.filter = filterValue.trim().toLowerCase();

        if (this.dataCompletingSource.paginator) {
            this.dataCompletingSource.paginator.firstPage();
        }
    }

    private getUpcomingApplication(): void {
        const today = new Date(this.today);
        this.http.get<any>(this.apiUrl + 'application/').subscribe({
            next: data => {
                this.allUpcomingApplication = data.data.filter((contact: any) => {
                    const startDate = new Date(contact.start_date);
                    return startDate.getDay() > today.getDay();
                });
                const upcoming = Array.from({length: this.allUpcomingApplication.length}, (_, k) => this.createUpcoming(k, this.allUpcomingApplication));
                // Assign the data to the data source for the table to render
                this.dataUpcomingSource = new MatTableDataSource(upcoming);
                this.numRowsUpcoming = this.dataUpcomingSource.data.length;
                this.dataUpcomingSource.paginator = this.paginatorUpcoming;
                this.dataUpcomingSource.sort = this.sortUpcoming;


                this.allCompleteApplication = data.data.filter((contact: any) => {
                    const completeDate = new Date(contact.completion_date);
                    return completeDate.getDay() > today.getDay();
                });

                const completion = Array.from({length: this.allCompleteApplication.length}, (_, k) => this.createCompletion(k, this.allCompleteApplication));
                // Assign the data to the data source for the table to render
                this.dataCompletingSource = new MatTableDataSource(completion);
                this.numRowsComplete = this.dataCompletingSource.data.length;
                this.dataCompletingSource.paginator = this.paginatorComplete;
                this.dataCompletingSource.sort = this.sortComplete;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    createUpcoming(index: any, data: any): any {
        const id = data[index]._id;
        const cid = index + 1;
        const application_no = 'A000' + cid;
        const client_name = data[index].client_name;
        const college_name = data[index].college_name;
        const phone = data[index].phone;
        const course_name = data[index].course_name;
        const start_date = data[index].start_date;
        const status = data[index].branch;
        return {
            id,
            application_no,
            client_name,
            college_name,
            phone,
            course_name,
            start_date,
            status,
        };
    }


    createCompletion(index: any, data: any): any {
        const id = data[index]._id;
        const cid = index + 1;
        const application_no = 'A000' + cid;
        const client_name = data[index].client_name;
        const college_name = data[index].college_name;
        const phone = data[index].phone;
        const course_name = data[index].course_name;
        const completion_date = data[index].completion_date;
        return {
            id,
            application_no,
            client_name,
            college_name,
            phone,
            course_name,
            completion_date
        };
    }

    addNavBar(type: any): any {
        this.applicationTypeService.onNavChanged.emit(type);
    }
}
