import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {finalize} from 'rxjs/operators';
import {ApplicationTypeService} from '../../Services/application-type.service';
import {ApplicationStatusService} from '../../Services/application-status.service';
import {MatTableDataSource} from '@angular/material/table';

export interface DialogData {
    result: any;
    statusType: any;
}

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

    private readonly apiUrl = `${environment.apiUrl}applicationStatus/`;
    errorMessage = '';
    addTypesForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        status_1: new FormControl('', [Validators.required]),
    });

    updateTypesForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
    });

    updateStatusForm = new FormGroup({
        status_1: new FormControl('', [Validators.required])
    });

    isSubmitted = false;
    statusArr: any = [1];
    allStatus: any = [];
    isProcessing = false;

    constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
                public elRef: ElementRef,
                public http: HttpClient,
                private _snackBar: MatSnackBar,
                private applicationType: ApplicationTypeService,
                private applicationStatus: ApplicationStatusService,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
        if (this.data.result !== null) {
            this.getTrackerStatus(this.data.result.id);
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addTypes(): any {
        this.isSubmitted = true;
        if (!this.addTypesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            const applicationType = {
                title: this.addTypesForm.value.title,
                added_by: localStorage.getItem('userName'),
                description: this.addTypesForm.value.description,
            };
            this.isSubmitted = false;
            this.isProcessing = true;
            this.applicationType.add(applicationType).subscribe(
                (result) => {
                    this.addStatus(result.data._id, result.message);
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

    addStatus(id: any, message: any): any {
        const statusDetails: any = [];

        this.statusArr.forEach((cl: any, index: any) => {
            const status = 'status_' + cl;
            statusDetails[index] = {
                application_id: id,
                status: this.addTypesForm.value[status],
                position: cl,
                added_by: localStorage.getItem('userName')
            };
        });

        statusDetails.forEach((value: any) => {
            this.applicationStatus.add(value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(message, '', {
                        duration: 2000,
                    });
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
        });
    }

    get errorControl(): any {
        if (this.data.result === null) {
            return this.addTypesForm.controls;
        } else {
            if (this.data.statusType === 'type') {
                return this.updateTypesForm.controls;
            } else {
                return this.updateStatusForm.controls;
            }
        }
    }

    addStatusList(data: any, added: boolean): any {
        let position = 0;
        let arrLength = 0;
        if (data === null) {
            arrLength = this.statusArr.length;
        } else {
            arrLength = data.length;
        }

        if (added) {
            position = arrLength + 1;
            this.statusArr.push(position);
        } else {
            // position = arrLength;
            data.forEach((cl: any, index: any) => {
                this.statusArr[index] = index + 1;
                this.updateStatusForm.addControl('status_' + (index + 1), new FormControl('', Validators.required));
            });
        }


        if (this.data.result === null) {
            this.addTypesForm.addControl('status_' + position, new FormControl('', Validators.required));
        } else {
            this.updateStatusForm.addControl('status_' + position, new FormControl('', Validators.required));
        }

    }

    deleteStatusList(index: number): any {
        this.statusArr.pop();
        this.addTypesForm.removeControl('status_' + index);
    }

    private getTrackerStatus(id: any): any {
        this.http.get<any>(`${this.apiUrl + id}`).subscribe({
            next: data => {
                this.allStatus = data.data;
                this.addStatusList(data.data, false);

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    updateTypes(): any {
        this.isSubmitted = true;
        if (!this.updateTypesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            const applicationType = {
                title: this.updateTypesForm.value.title,
                added_by: localStorage.getItem('userName'),
                description: this.updateTypesForm.value.description,
            };
            this.isSubmitted = false;
            this.isProcessing = true;
            this.applicationType.updateType(applicationType, this.data.result.id).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
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
    }

    updateStatus(): any {
        this.isSubmitted = true;
        if (!this.updateStatusForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.statusArr.forEach((cl: any, index: any) => {
                this.isProcessing = true;
                const status = 'status_' + cl;
                if (this.allStatus[index] === undefined) {
                    const addStatusDetails = {
                        application_id: this.data.result.id,
                        status: this.updateStatusForm.value[status],
                        position: cl,
                        added_by: localStorage.getItem('userName')
                    };
                    this.applicationStatus.add(addStatusDetails).pipe(finalize(() => {
                        this.isProcessing = false;
                    })).subscribe(
                        (result) => {
                            this._snackBar.open(result.message, '', {
                                duration: 2000,
                            });
                        },
                        (error) => {
                            if (error.error !== undefined) {
                                this._snackBar.open(error.error.msg, '', {
                                    duration: 2000,
                                });
                            }
                        }
                    );
                } else {
                    const updateStatusDetails = {
                        status: this.updateStatusForm.value[status],
                        position: cl
                    };
                    this.applicationStatus.updateStatus(updateStatusDetails, this.allStatus[index]._id).pipe(finalize(() => {
                        this.isProcessing = false;
                    })).subscribe(
                        (result) => {
                            this._snackBar.open(result.message, '', {
                                duration: 2000,
                            });
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
            });
            this.dialogRef.close();


        }
    }
}
