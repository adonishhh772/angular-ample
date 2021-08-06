import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientStatusService} from '../../Services/client-status.service';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivityService} from '../../Services/activity.service';
import {UserService} from '../../Services/user.service';
import {TaskService} from '../../Services/task.service';

export interface DialogData {
    id: string;
    type: string;
    name: string;
    follow: string;
    client: string;
    category: string;
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
    allAssignee: any[] = [];
    isSubmitted = false;
    assigneeName = '';
    followDate = '';
    setFollow = false;
    category: any[] = [];
    errorMessage = '';
    isProcessing = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    asigneeForm = new FormGroup({
        assigned_to: new FormControl('', [Validators.required]),
        followUp: new FormControl(''),
    });

    catForm = new FormGroup({
        category: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private http: HttpClient,
        private clientStatus: ClientStatusService,
        private userService: UserService,
        private activityService: ActivityService,
        public taskService: TaskService,
        private elRef: ElementRef,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
        this.getVisaCategory();
        if (this.data.type === 'assign') {
            this.getAllContacts();
            if (this.data.name !== null) {
                this.assigneeName = this.data.name;
            }


            if (this.data.follow !== undefined && this.data.follow !== '' && this.data.follow !== null) {
                this.setFollow = true;
                this.followDate = this.data.follow;
            }
        }


    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getVisaCategory(): void {
        this.http.get<any>(this.apiUrl + 'category/').subscribe({
            next: data => {
                this.category = data.data;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }


    assignClient(): any {
        this.isSubmitted = true;
        if (!this.asigneeForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.isProcessing = true;
            let activityDetails: any;
            this.http.get<any>(this.apiUrl + 'status/' + this.data.id).subscribe({
                next: data => {
                    const statusId = data.data[0]._id;
                    const clientName = this.data.client;
                    let statusDetails;
                    statusDetails = {
                        assigned_to: this.asigneeForm.value.assigned_to,
                        followUp: '',
                        changed_by: localStorage.getItem('userName'),
                    };

                    if (this.setFollow) {
                        statusDetails.followUp = this.asigneeForm.value.followUp;
                    }
                    activityDetails = {
                        client_id: this.data.id,
                        user_id: localStorage.getItem('userId'),
                        title: 'Client Assigned to ' + this.asigneeForm.value.assigned_to,
                        description: this.asigneeForm.value.assigned_to + ' Assigned to ' + clientName + ' By ' + localStorage.getItem('userName'),
                        type: 'Assignee',
                        name: clientName,
                        added_by: localStorage.getItem('userName'),
                    };

                    const taskDetails = {
                        title: 'Client Assigned to ' + this.asigneeForm.value.assigned_to,
                        description: this.asigneeForm.value.assigned_to + ' Assigned to ' + clientName + ' By ' + localStorage.getItem('userName'),
                        due_date: statusDetails.followUp,
                        user: localStorage.getItem('userId'),
                        added_by: localStorage.getItem('userName'),
                        client: this.data.id,
                    };
                    this.clientStatus.updateAssignee(statusDetails, statusId).pipe(finalize(() => {
                        this.isProcessing = false;
                    })).subscribe(
                        (result) => {
                            this._snackBar.open(result.message, '', {
                                duration: 2000,
                            });
                            this.addActivity(activityDetails);
                            this.addTasks(taskDetails);
                        },
                        (error) => {
                            if (error.error !== undefined) {
                                this._snackBar.open(error.error.msg, '', {
                                    duration: 2000,
                                });
                            }
                        }
                    );
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });
        }
    }

    private addActivity(activity: any): any {
        this.activityService.add(activity).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                this.dialogRef.close();
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

    private getAllContacts(): void {
        this.http.get<any>(this.apiUrl + 'users/').subscribe({
            next: data => {
                this.allAssignee = data.data.filter((contact: any) => {
                    return contact.role !== 'Client';
                });

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    get errorControl(): any {
        return this.asigneeForm.controls;
    }

    setFollowup(checked: boolean): any {
        this.setFollow = checked;
    }

    updateCategory(): any {
        this.isProcessing = true;
        let activityDetails: any;
        const clientName = this.data.client;
        activityDetails = {
            client_id: this.data.id,
            user_id: localStorage.getItem('userId'),
            title: 'Category updated',
            description: clientName + ' category updated by ' + localStorage.getItem('userName'),
            type: 'Category',
            name: clientName,
            added_by: localStorage.getItem('userName'),
        };
        this.userService.updateCategory(this.catForm.value, this.data.id).pipe(finalize(() => {
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

    private addTasks(taskDetails: any): any {
        this.taskService.add(taskDetails).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                // this.dialogRef.close();
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
