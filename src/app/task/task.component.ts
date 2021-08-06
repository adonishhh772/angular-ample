import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {TaskService} from '../Services/task.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TaskCommentService} from '../Services/task-comment.service';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit {
    isSubmitted = false;
    isSubmittedComment = false;
    totalTask = 0;
    onlyDays = false;
    today = Date.now();
    isDue: any[] = [];
    taskId = '';
    branchName = localStorage.getItem('userBranch');
    branchId = '';
    taskIndex = 0;
    taskCommentCount: any[] = [];
    complete = false;
    taskTitle = '';
    assignedTo = '';
    addedBy = '';
    createdTime = '';
    assignedClient = 'None';
    taskDesc = '';
    taskDue = '';
    isAddTask = false;
    isEditTask = false;
    hasTask = false;
    users: any[] = [];
    clients: any[] = [];
    allTasks: any[] = [];
    tasks: any[] = [];
    branches: any[] = [];
    comments: any[] = [];
    isUser = true;
    isBranch = true;
    isProcessing = false;
    isProcessingComment = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    addTaskForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        due_date: new FormControl(''),
        userArr: new FormControl(''),
        clientArr: new FormControl(''),
        branchArr: new FormControl(''),
    });
    addCommentForm = new FormGroup({
        description: new FormControl('', [Validators.required]),
    });

    constructor(public router: Router,
                public route: ActivatedRoute,
                public taskService: TaskService,
                public taskCommentService: TaskCommentService,
                private _snackBar: MatSnackBar,
                public http: HttpClient, private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        if (this.branchName !== '') {
            this.getBranchByName();
        } else {
            this.getTasks();
        }

        this.getUsers();
        this.getBranch();

        if (this.route.snapshot.queryParamMap.get('isAdded') !== null) {
            this.isAddTask = true;
        } else {
            this.isAddTask = false;
        }
    }

    getUsers(): any {
        this.http.get<any>(`${this.apiUrl + 'users/'}`).subscribe({
            next: data => {
                this.users = data.data.filter((contact: any) => {
                    return contact.role !== 'Client';
                });

                this.clients = data.data.filter((contact: any) => {
                    return contact.role === 'Client';
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getTasks(): any {
        const today = new Date(this.today);
        this.http.get<any>(this.apiUrl + 'tasks/').subscribe({
            next: data => {
                this.allTasks = data.data.filter((task: any) => {
                    if (task.user !== '' || task.client !== '') {
                        return (task.user.includes(localStorage.getItem('userId')) ||
                            task.client.includes(localStorage.getItem('userId')));
                    } else if (task.branch !== '' || task.client !== '') {
                        return (task.branch.includes(this.branchId) ||
                            task.client.includes(localStorage.getItem('userId')));
                    }
                });
                this.tasks = data.data.filter((task: any) => {
                    if (task.user !== '' || task.client !== '') {
                        return (task.user.includes(localStorage.getItem('userId')) ||
                            task.client.includes(localStorage.getItem('userId')));
                    } else if (task.branch !== '' || task.client !== '') {
                        return (task.branch.includes(this.branchId) ||
                            task.client.includes(localStorage.getItem('userId')));
                    }
                });
                const allTaskLength = this.allTasks.length;
                this.totalTask = this.allTasks.filter((task: any) => {
                    return task.isCompleted !== true;
                }).length;
                if (this.totalTask > 0) {
                    this.hasTask = true;
                }
                this.incrementTasks(this.totalTask, allTaskLength);
                this.allTasks.forEach((cl: any, index: any) => {
                    const due = new Date(cl.due_date);
                    if (today.getTime() === due.getTime() || today.getTime() > due.getTime()) {
                        this.isDue[index] = true;
                    } else {
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

    showAddTask(): any {
        this.isAddTask = true;
        this.isEditTask = false;
        const taskList = this.elRef.nativeElement.querySelectorAll('.taskLists');
        taskList.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'background', '#f4f4f4');
        });
    }

    getBranch(): any {
        this.http.get<any>(this.apiUrl + 'branch/').subscribe({
            next: data => {
                this.branches = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    ngAfterViewInit(): void {
        const selected = this.elRef.nativeElement.querySelectorAll('.mat-form-field-wrapper');
        selected.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'padding', '0');
        });

        const underline = this.elRef.nativeElement.querySelectorAll('.mat-form-field-underline');
        underline.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'position', 'unset');
        });

        const label = this.elRef.nativeElement.querySelectorAll('.mat_select_form .mat-form-field-label-wrapper');
        label.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'text-align', 'center');
        });

    }

    changeSelection(select: any, value: any): any {
        switch (select) {
            case 'user':
                if (value.length !== 0) {
                    this.isBranch = false;
                } else {
                    this.isBranch = true;
                }
                break;
            case 'branch':
                if (value.length !== 0) {
                    this.isUser = false;
                } else {
                    this.isUser = true;
                }
                break;
        }
    }

    updateTask(data: any, e: any, i: any): any {
        this.isEditTask = true;
        this.isAddTask = false;
        this.createdTime = '';
        const taskList = this.elRef.nativeElement.querySelectorAll('.taskLists');
        taskList.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'background', '#f4f4f4');
        });
        if (e.target.className === 'taskLists') {
            this.renderer.setStyle(e.target, 'background', 'rgba(72, 56, 56, 0.39)');
        } else {
            const task = e.target.parentElement;
            this.renderer.setStyle(task, 'background', 'rgba(72, 56, 56, 0.39)');
        }
        this.taskTitle = data.title;
        this.taskDesc = data.description;
        this.taskId = data._id;
        this.taskIndex = i;
        this.taskDue = data.due_date;
        this.complete = data.isCompleted;
        this.addedBy = data.added_by;
        const createdDate = new Date(data.create_date);
        const currentDate = new Date();

        const totalSeconds = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const hours = totalHours - (totalDays * 24);
        const minutes = totalMinutes - (totalDays * 24 * 60) - (hours * 60);
        const seconds = totalSeconds - (totalDays * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

        if (totalDays !== 0) {
            this.onlyDays = true;
            this.createdTime = totalDays.toString() + ' days ';
        } else {
            this.onlyDays = false;
            if (hours !== 0) {
                this.createdTime += hours.toString() + ' hours ';
            }

            if (minutes !== 0) {
                this.createdTime += minutes.toString() + ' minutes ';
            }

            if (seconds !== 0) {
                this.createdTime += minutes.toString() + ' seconds';
            }
        }


        if (data.branch !== '' && data.branch !== undefined && data.branch !== null) {
            const branchArr = data.branch.split(',');
            const branchNameArr: any[] = [];
            branchArr.forEach((cl: any) => {
                branchNameArr.push(this.branches.find(x => x._id === cl).branch_name);
            });
            this.assignedTo = branchNameArr.join(',');
        }

        if (data.client !== '' && data.client !== undefined && data.client !== null) {
            const clientArr = data.client.split(',');
            const clientNameArr: any[] = [];
            clientArr.forEach((cl: any) => {
                clientNameArr.push(this.clients.find(x => x._id === cl).name);
            });
            this.assignedClient = clientNameArr.join(',');
        }

        if (data.user !== '' && data.user !== undefined && data.user !== null) {
            const userArr = data.user.split(',');
            const userNameArr: any[] = [];
            userArr.forEach((cl: any) => {
                userNameArr.push(this.users.find(x => x._id === cl).name);
            });
            this.assignedTo = userNameArr.join(',');
        }

        this.getComment(this.taskId, i);
    }


    addTasks(): any {
        this.isSubmitted = true;
        if (!this.addTaskForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            console.log(this.addTaskForm.value.branchArr.length);
            this.addTaskForm.value.isCompleted = false;
            this.addTaskForm.value.added_by = localStorage.getItem('userName');

            if (this.addTaskForm.value.userArr !== '') {
                if (this.addTaskForm.value.userArr.length > 0) {
                    this.addTaskForm.value.user = this.addTaskForm.value.userArr.join(',');
                } else {
                    this.addTaskForm.value.user = '';
                }
            }


            if (this.addTaskForm.value.branchArr !== '') {
                if (this.addTaskForm.value.branchArr.length > 0) {
                    this.addTaskForm.value.branch = this.addTaskForm.value.branchArr.join(',');
                } else {
                    this.addTaskForm.value.branch = '';
                }
            }


            if (this.addTaskForm.value.clientArr !== '') {
                if (this.addTaskForm.value.clientArr.length > 0) {
                    this.addTaskForm.value.client = this.addTaskForm.value.clientArr.join(',');
                } else {
                    this.addTaskForm.value.client = '';
                }
            }


            delete this.addTaskForm.value.userArr;
            delete this.addTaskForm.value.branchArr;
            delete this.addTaskForm.value.clientArr;
            this.isProcessing = true;
            this.taskService.add(this.addTaskForm.value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                    this.addTaskForm.reset();
                    this.getTasks();
                },
                (error) => {
                    if (error.error !== undefined) {
                        this._snackBar.open(error.error.msg, '', {
                            duration: 2000,
                        });
                    }
                }
            );
        }
    }

    get errorControlComment(): any {
        return this.addCommentForm.controls;
    }

    get errorControlTask(): any {
        return this.addTaskForm.controls;
    }

    addComment(): any {
        this.isSubmittedComment = true;
        if (!this.addCommentForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addCommentForm.value.added_by = localStorage.getItem('userName');
            this.addCommentForm.value.tasks_id = this.taskId;
            this.isProcessingComment = true;
            this.taskCommentService.add(this.addCommentForm.value).pipe(finalize(() => {
                this.isProcessingComment = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                    this.addCommentForm.reset();
                    this.getComment(this.taskId, this.taskIndex);
                },
                (error) => {
                    if (error.error !== undefined) {
                        this._snackBar.open(error.error.msg, '', {
                            duration: 2000,
                        });
                    }
                }
            );
        }
    }

    private incrementTasks(taskCount: number, allCount: number): any {
        const parent = this.elRef.nativeElement.parentElement.parentElement.offsetParent.offsetParent;
        const sideMenu = parent.querySelector('.task_badge');
        const topMenu = parent.querySelector('.task_notify');
        sideMenu.childNodes[0].innerHTML = allCount;
        topMenu.childNodes[1].innerHTML = taskCount;
    }

    private getComment(taskId: string, i: any): any {
        // const commentCount: any[] = [];
        this.http.get<any>(this.apiUrl + 'tasksComment/' + taskId).subscribe({
            next: data => {
                this.comments = data.data;
                this.taskCommentCount[i] = this.comments.length;
                this.comments.forEach((cl: any) => {
                    let commentTime = '';
                    const createdDate = new Date(cl.create_date);
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
                        if (hours !== 0) {
                            commentTime += hours.toString() + ' hours ';
                        }

                        if (minutes !== 0) {
                            commentTime += minutes.toString() + ' minutes ';
                        }

                        if (seconds !== 0) {
                            commentTime += minutes.toString() + ' seconds';
                        }
                    }

                    cl.create_date = commentTime;
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    completeTask(): void {
        this.http.get<any>(this.apiUrl + 'tasks/' + this.taskId).subscribe({
            next: data => {
                this.getTasks();
                this.complete = true;
                // this.taskCompleted[this.taskIndex] = true;
                this._snackBar.open(data.message, '', {
                    duration: 2000,
                });

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    filterTask(val: any): any {
        const today = new Date(this.today);
        this.allTasks = this.tasks;
        if (val === 'assigned_date') {
            this.allTasks = this.allTasks.sort((a, b) => {
                return (a.due_date === null) ? -1 : (b.due_date === null) ? 1 : 0;
            });

        } else if (val === 'due_date') {
            this.allTasks = this.allTasks.sort((a, b) => {
                return (new Date(b.due_date).getTime() > new Date(a.due_date).getTime() ? 1 : -1);
            });
        } else if (val === 'pending') {
            this.allTasks = this.allTasks.filter((task: any) => {
                return task.isCompleted !== true;
            });
        } else if (val === 'completed') {
            this.allTasks = this.allTasks.filter((task: any) => {
                return task.isCompleted === true;
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

    editTasks(): any {

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
