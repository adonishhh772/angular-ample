import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InstituteContactService} from '../../Services/institute-contact.service';
import {finalize} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InstituteAddressService} from '../../Services/institute-address.service';
import {HttpClient} from '@angular/common/http';
import {InstituteCourseService} from '../../Services/institute-course.service';
import {InstituteIntakeService} from '../../Services/institute-intake.service';

export interface DialogData {
    id: string;
    type: string;
    options: string;
    selected: any;
}

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
    isSubmitted = false;
    isProcessing = false;
    country: any[] = [];
    address: any[] = [];
    narrowField: any[] = [];
    countryName = '';
    streetName = '';
    state = '';
    private readonly apiUrl = `${environment.apiUrl}instituteAddress/`;
    errorMessage = '';
    addContactForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        position: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    });

    addAddressForm = new FormGroup({
        street: new FormControl(''),
        suburb: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        post_code: new FormControl(''),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    });

    addCoursesForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        level: new FormControl('', [Validators.required]),
        tution_fee: new FormControl('', [Validators.required]),
        coe_fee: new FormControl('', [Validators.required]),
        commission: new FormControl(''),
        broad_field: new FormControl('', [Validators.required]),
        narrow_field: new FormControl('', [Validators.required]),
        description: new FormControl(''),
    });

    addIntakesForm = new FormGroup({
        intake_date: new FormControl('', [Validators.required]),
        description: new FormControl(''),
    });

    constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
                public elRef: ElementRef,
                public http: HttpClient,
                public instituteContact: InstituteContactService,
                public instituteAddress: InstituteAddressService,
                public instituteCourse: InstituteCourseService,
                public instituteIntake: InstituteIntakeService,
                private _snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        dialogRef.disableClose = true;
        if (this.data.selected !== null && this.data.options === 'address') {
            this.getAddressById(this.data.id);
        }
    }

    ngOnInit(): void {
        if (this.data.options === 'address') {
            this.getAllCountries();
            this.getCountryInfo();
        }

        if (this.data.selected !== null) {
            this.changeField(this.data.selected.broad_field);
        }

    }

    closePopup(): void {
        this.dialogRef.close();
    }

    changeField(val: any): any {
        let arrVal;
        switch (val) {
            case 'None':
                arrVal = ['None'];
                this.narrowField = arrVal;
                break;
            case 'Natural and Physical Sciences':
                arrVal = ['Natural and Physical Sciences',
                    'Mathematical Sciences',
                    'Physics and Astronomy',
                    'Chemical Sciences',
                    'Earth Sciences',
                    'Biological Sciences',
                    'Other Natural and Physical Sciences'];
                this.narrowField = arrVal;
                break;
            case 'Information Technology':
                arrVal = ['Information Technology',
                    'Computer Science',
                    'Information Systems',
                    'Other Information Technology'];
                this.narrowField = arrVal;
                break;
            case 'Engineering and Related Technologies':
                arrVal = ['Engineering and Related Technologies',
                    'Manufacturing Engineering and Technology',
                    'Process and Resources Engineering',
                    'Automotive Engineering and Technology',
                    'Mechanical and Industrial Engineering and Technology',
                    'Civil Engineering',
                    'Geomatic Engineering',
                    'Electrical and Electronic Engineering and Technology',
                    'Aerospace Engineering and Technology',
                    'Maritime Engineering and Technology',
                    'Other Engineering and Related Technologies'];
                this.narrowField = arrVal;
                break;
            case 'Architecture and Building':
                arrVal = ['Architecture and Building', 'Architecture and Urban Environment', 'Building'];
                this.narrowField = arrVal;
                break;
            case 'Agriculture, Environmental and Related Studies':
                arrVal = ['Agriculture', 'Horticulture and Viticulture', 'Forestry Studies', 'Fisheries Studies',
                    'Environmental Studies', 'Other Agriculture, Environmental and Related Studies'];
                this.narrowField = arrVal;
                break;
            case 'Health':
                arrVal = ['Health', 'Medical Studies', 'Nursing', 'Pharmacy', 'Dental Studies', 'Optical Science',
                    'Veterinary Studies', 'Public Health', 'Radiography', 'Rehabilitation Therapies', 'Complementary Therapies', 'Other Health'];
                this.narrowField = arrVal;
                break;
            case 'Education':
                arrVal = ['Education', 'Teacher Education', 'Curriculum and Education Studies', 'Other Education'];
                this.narrowField = arrVal;
                break;
            case 'Management and Commerce':
                arrVal = ['Management and Commerce', 'Accounting', 'Business and Management', 'Sales and Marketing', 'Tourism',
                    'Office Studies', 'Banking, Finance and Related Fields', 'Other Management and Commerce'];
                this.narrowField = arrVal;
                break;
            case 'Society and Culture':
                arrVal = ['Society and Culture', 'Political Science and Policy Studies', 'Studies in Human Society',
                    'Human Welfare Studies and Services', 'Behavioural Science', 'Law', 'Justice and Law Enforcement',
                    'Librarianship, Information Management and Curatorial Studies', 'Language and Literature', 'Philosophy and Religious Studies',
                    'Economics and Econometrics', 'Sport and Recreation', 'Other Society and Culture'];
                this.narrowField = arrVal;
                break;
            case 'Creative Arts':
                arrVal = ['Creative Arts', 'Performing Arts', 'Visual Arts and Crafts', 'Graphic and Design Studies', 'Communication and Media Studies',
                    'Other Creative Arts'];
                this.narrowField = arrVal;
                break;
            case 'Food, Hospitality and Personal Services':
                arrVal = ['Food and Hospitality', 'Personal Services'];
                this.narrowField = arrVal;
                break;
            case 'Mixed Field Programmes':
                arrVal = ['General Education Programmes', 'Social Skills Programmes', 'Employment Skills Programmes', 'Other Mixed Field Programmes'];
                this.narrowField = arrVal;
                break;
        }
    }

    addAddress(): any {
        this.isSubmitted = true;
        if (!this.addAddressForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addAddressForm.value.institute_id = this.data.id;
            this.instituteAddress.add(this.addAddressForm.value).pipe(finalize(() => {
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

    addContact(): any {
        this.isSubmitted = true;
        if (!this.addContactForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addContactForm.value.institute_id = this.data.id;
            this.instituteContact.add(this.addContactForm.value).pipe(finalize(() => {
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

    updateContact(): any {
        this.isSubmitted = true;
        if (!this.addContactForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteContact.updateContact(this.addContactForm.value, this.data.selected.id).pipe(finalize(() => {
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

    addCourses(): any {
        this.isSubmitted = true;
        if (!this.addCoursesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addCoursesForm.value.institute_id = this.data.id;
            this.instituteCourse.add(this.addCoursesForm.value).pipe(finalize(() => {
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

    updateCourses(): any{
        this.isSubmitted = true;
        if (!this.addCoursesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteAddress.updateAddress(this.addCoursesForm.value, this.data.selected.id).pipe(finalize(() => {
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

    updateAddress(): any {
        this.isSubmitted = true;
        if (!this.addAddressForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteAddress.updateAddress(this.addAddressForm.value, this.data.selected.id).pipe(finalize(() => {
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


    addIntakes(): any{
        this.isSubmitted = true;
        if (!this.addIntakesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addIntakesForm.value.institute_id = this.data.id;
            this.instituteIntake.add(this.addIntakesForm.value).pipe(finalize(() => {
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

    updateIntakes(): any{
        this.isSubmitted = true;
        if (!this.addIntakesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteIntake.updateIntake(this.addIntakesForm.value, this.data.selected.id).pipe(finalize(() => {
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

    get errorControl(): any {
        return this.addContactForm.controls;
    }

    get errorAddressControl(): any {
        return this.addAddressForm.controls;
    }

    get errorCoursesControl(): any {
        return this.addCoursesForm.controls;
    }

    get errorIntakesControl(): any {
        return this.addIntakesForm.controls;
    }

    private getAllCountries(): any {
        this.http.get<any>('https://restcountries.eu/rest/v2/all').subscribe({
            next: data => {
                this.country = data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getCountryInfo(): any {
        this.http.get<any>('http://ip-api.com/json').subscribe({
            next: data => {
                this.countryName = data.country;
                this.streetName = data.city;
                this.state = data.regionName;
                // this.currentCountry = ;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getAddressById(id: any): void {
        this.http.get<any>(this.apiUrl + id).subscribe({
            next: data => {
                this.address = data.data.filter((address: any) => {
                    return address._id === this.data.selected.id;
                });
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }
}
