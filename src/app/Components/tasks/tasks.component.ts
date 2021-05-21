import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

    allTasks: any[] = [];
    today = Date.now();
    isDue: any[] = [];
    taskCommentCount: any[] = [];
    branchName = localStorage.getItem('userBranch');
    branchId = '';
    hasTask = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    constructor(public router: Router, public http: HttpClient,  private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.getTasks();
        this.getBranchByName();
    }

    goTo(nav: any): any {
        if (nav === 'task') {
            this.router.navigate(['tasks']);
        } else if (nav === 'task_add') {
            this.router.navigate(['tasks'], {queryParams: {isAdded: true}});
        }
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

                if (this.allTasks.length > 0){
                    this.hasTask = true;
                }

                this.allTasks.forEach((cl: any, index: any) => {
                    const due = new Date(cl.due_date);
                    if (today.getTime() === due.getTime() || today.getTime() > due.getTime()){
                        this.isDue[index] = true;
                    }else{
                        this.isDue[index] = false;
                    }
                    this.getComment(cl._id, index);
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    filterTask(val: any): any{
        const today = new Date(this.today);
        if (val === 'assigned_date'){
            this.allTasks = this.allTasks.sort((a, b) => {
                return (a.due_date === null) ? -1 : (b.due_date === null) ? 1 : 0;
            });

        }else if (val === 'due_date'){
            this.allTasks = this.allTasks.sort((a, b) => {
                return (new Date(b.due_date).getTime() > new Date(a.due_date).getTime() ? 1 : -1)  ;
            });
        }

        this.allTasks.forEach((cl: any, index: any) => {
            const due = new Date(cl.due_date);
            if (today.getTime() === due.getTime() || today.getTime() > due.getTime()) {
                this.isDue[index] = true;
            } else {
                this.isDue[index] = false;
            }
            this.getComment(cl._id, index);
        });
    }

    private getComment(taskId: string, i: any): any {
        // const commentCount: any[] = [];
        this.http.get<any>(this.apiUrl + 'tasksComment/' + taskId).subscribe({
            next: data => {
                this.taskCommentCount[i] = data.data.length;
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
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }
}
