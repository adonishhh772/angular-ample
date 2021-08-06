import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ClientStatusService} from '../../Services/client-status.service';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivityService} from '../../Services/activity.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotesService} from '../../Services/notes.service';

@Component({
    selector: 'app-general-info',
    templateUrl: './general-info.component.html',
    styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
    @Input() client: any = [];
    @Input() link: any = '';
    @Output() reminderEvent = new EventEmitter<string>();
    allStatus: any[] = [];
    hide = false;
    isSubmitted = false;
    clientId = '';
    isProcessing = false;
    isProcessingComment = false;
    errorMessage = '';
    categoryName = '';
    remindDate = '';
    comment = '';
    setReminder = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    isLoaded = false;
    allActivity: any[] = [];
    hasActivity = false;
    addCommentForm = new FormGroup({
        notes: new FormControl('', [Validators.required]),
    });
    constructor(public route: ActivatedRoute,
                public router: Router,
                private http: HttpClient,
                private elRef: ElementRef,
                private notesService: NotesService,
                private clientStatus: ClientStatusService,
                public activityService: ActivityService,
                private matDialog: MatDialog,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.categoryName = this.client[0].category;
        this.route.queryParams.subscribe(params => {
            this.clientId = params.id;
            this.getStatus(params.id);
            this.getActivity(params.id);
            // console.log(params);
        });
    }

    toggleStatus(): void {
        this.hide = !this.hide;
    }

    changeStatus(stat: string): any {
        this.isProcessing = true;
        let activityDetails: any;
        const statusId = this.allStatus[0]._id;
        const clientName = this.client[0].name;
        let statusDetails;
        statusDetails = {
            status: stat,
            changed_by: localStorage.getItem('userName'),
        };
        activityDetails = {
            client_id: this.clientId,
            user_id: localStorage.getItem('userId'),
            title: 'Client Status Updated',
            description: 'Status of Client ' + clientName + ' changed to ' + stat + ' Updated By ' + localStorage.getItem('userName'),
            type: 'Client',
            name: clientName,
            added_by: localStorage.getItem('userName'),
        };
        this.clientStatus.updateStatus(statusDetails, statusId).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (result) => {
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });
                this.addActivity(activityDetails);
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

    get errorControl(): any {
        return this.addCommentForm.controls;
    }

    private addActivity(activity: any): any {
        this.activityService.add(activity).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                this.getStatus(this.clientId);

                this.getActivity(this.clientId);
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

    private getStatus(id: any): any {
        this.http.get<any>(`${this.apiUrl + 'status/' + id}`).subscribe({
            next: data => {
                this.allStatus = (data.data);
                this.isLoaded = true;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    public getActivity(id: any): any {
        this.http.get<any>(this.apiUrl + 'activity/client/' + id).subscribe({
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

    setAll(checked: boolean): any {
        this.setReminder = checked;
        if (checked){
            this.addCommentForm.addControl('reminder_date', new FormControl('', Validators.required));
        }else{
            this.addCommentForm.removeControl('reminder_date');
        }
    }


    addComment(): any {
        this.isSubmitted = true;
        if (!this.addCommentForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        }else{
            this.addCommentForm.value.added_by = localStorage.getItem('userName');
            this.addCommentForm.value.reminder = false;
            this.addCommentForm.value.isComplete = false;
            this.addCommentForm.value.client_id = this.clientId;
            if (this.setReminder){
                this.addCommentForm.value.reminder = true;
                this.remindDate = ', Reminder Date: ' + this.addCommentForm.value.reminder_date;
            }
            this.isProcessingComment = true;
            let activityDetails: any;
            const clientName = this.client[0].name;
            activityDetails = {
                client_id: this.clientId,
                user_id: localStorage.getItem('userId'),
                title: localStorage.getItem('userName') + ' Added a note',
                description:  clientName + ' ' + this.addCommentForm.value.notes + ' ' + this.remindDate ,
                type: 'Note',
                name: clientName,
                added_by: localStorage.getItem('userName'),
            };
            this.notesService.add(this.addCommentForm.value).pipe(finalize(() => {
                this.isProcessingComment = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                    this.isSubmitted = false;
                    this.addCommentForm.reset();
                    this.addActivity(activityDetails);
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

    openClientDialog(assign: string, assignee: any, followUp: any, clientName: any, cat: any): void {
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {type: assign, name: assignee, follow: followUp, client: clientName, category: cat, id: this.clientId}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getStatus(this.clientId);
            this.getActivity(this.clientId);
            this.getCategory(this.clientId);
        });
    }


    getCategory(id: string): any{
        this.http.get<any>(`${this.apiUrl + 'users/' + id}`).subscribe({
            next: data => {
               this.categoryName = data.data.category;
                // console.log(data.data);
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    goToNotes(): any {
        this.reminderEvent.emit('Notes');
    }
}
