import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {finalize} from 'rxjs/operators';
import {CategoryService} from '../../Services/category.service';

export interface DialogData {
    selected: any;
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        private http: HttpClient,
        private elRef: ElementRef,
        private _snackBar: MatSnackBar,
        private categoryService: CategoryService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
    }


    isSubmitted = false;
    isProcessing = false;
    uName = localStorage.getItem('userName');
    private readonly apiUrl = `${environment.apiUrl}category/`;
    errorMessage = '';
    addCategoryForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
    });

    ngOnInit(): void {
        console.log(this.data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addCategory(): any {
        this.isSubmitted = true;
        if (!this.addCategoryForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addCategoryForm.value.added_by = this.uName;
            this.categoryService.add(this.addCategoryForm.value).pipe(finalize(() => {
                this.isProcessing = false;
                this.dialogRef.close();
            })).subscribe(
                (result) => {
                    // this.addAddress(result._id);
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    // this.changeNav();
                    // this.router.navigate(['/institute/all']);
                },
                (error) => {
                    if (error.error !== undefined) {
                        this._snackBar.open(error.error.msg, '', {
                            duration: 2000,
                        });
                    } else {
                        // this.router.navigate([returnUrl]);
                    }
                }
            );
        }
    }

    closePopup(): void {
        this.dialogRef.close();
    }

    get errorControl(): any {
        return this.addCategoryForm.controls;
    }

    updateCat(): any {
        this.isSubmitted = true;
        if (!this.addCategoryForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addCategoryForm.value.added_by = this.uName;
            this.categoryService.updateCategory(this.addCategoryForm.value, this.data.selected.id).pipe(finalize(() => {
                this.isProcessing = false;
                this.dialogRef.close();
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
    }

}
