import {Component, OnInit} from '@angular/core';
import {CalendarOptions} from '@fullcalendar/angular';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    allTasks: any[] = [];
    today = Date.now();
    private readonly apiUrl = `${environment.apiUrl}`;
    branchName = localStorage.getItem('userBranch');
    errorMessage = '';
    branchId = '';
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridWeek',
    };

    constructor(public http: HttpClient) {
        this.getBranchByName();
    }

    ngOnInit(): void {
    }

    private getTasks(): any {
        const today = new Date(this.today);
        this.http.get<any>(this.apiUrl + 'tasks/').subscribe({
            next: data => {
                this.allTasks = data.data.filter((task: any) => {
                    return task.isCompleted !== true;
                });
                this.allTasks = this.allTasks.filter((task: any) => {
                    if (task.user !== '' || task.client !== '') {
                        return (task.user.includes(localStorage.getItem('userId')) ||
                            task.client.includes(localStorage.getItem('userId')));
                    } else if (task.branch !== '' || task.client !== '') {
                        return (task.branch.includes(this.branchId) ||
                            task.client.includes(localStorage.getItem('userId')));
                    }
                });

                const events: any[] = [];
                this.allTasks.forEach((cl: any, index: any) => {
                    const dueDate = formatDate(cl.due_date, 'yyyy-MM-dd', 'en-US');
                    events.push({title: cl.title, date: dueDate});
                    this.calendarOptions.events = events;
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getBranchByName(): any {
        this.http.get<any>(this.apiUrl + 'branch/getBranch/' + this.branchName).subscribe({
            next: data => {
                this.branchId = data.data[0]._id;
                this.getTasks();
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

}
