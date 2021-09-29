import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {finalize} from 'rxjs/operators';
import {ClientStatusService} from '../../Services/client-status.service';
import {ClientPassportService} from '../../Services/client-passport.service';
import {ActivityService} from '../../Services/activity.service';
import {UserService} from '../../Services/user.service';
import {InstituteAddressService} from '../../Services/institute-address.service';
import {InstituteService} from '../../Services/institute.service';

export interface DialogData {
    dialogType: any;
}

@Component({
    selector: 'app-dialogs',
    templateUrl: './dialogs.component.html',
    styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent implements OnInit {
    hidePass = true;
    country: any[] = [];
    countryName = '';
    isSubmitted = false;
    streetName = '';
    isProcessing = false;
    state = '';
    errorMessage = '';
    userRole = localStorage.getItem('userRole');
    private readonly apiUrl = `${environment.apiUrl}`;
    category: any[] = [];
    branches: any[] = [];
    managers: any[] = [];
    narrowField: any[] = [];
    isClient = true;
    totalInstitute = 0;
    instituteDetails = {};
    uploadedFiles: Array<File> = [];
    instituteAddress = {};
    invoiceTo = '';
    addClientForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        description: new FormControl(''),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        street: new FormControl(''),
        referred: new FormControl(''),
        category: new FormControl(''),
        passport_no: new FormControl(''),
        state: new FormControl(''),
        post_code: new FormControl(''),
        country: new FormControl(''),
        branch: new FormControl('', [Validators.required]),
        marketing_manager: new FormControl(''),
        hasVisa: new FormControl(''),
    });

    addInstituteForm = new FormGroup({
        institute_name: new FormControl('', [Validators.required]),
        street: new FormControl(''),
        short_name: new FormControl('', [Validators.required]),
        suburb: new FormControl(''),
        phoneNo: new FormControl('', [Validators.required]),
        state: new FormControl(''),
        website: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
        post_code: new FormControl(''),
        logo: new FormControl('', [Validators.required]),
        invoice_to: new FormControl('', [Validators.required]),
        country: new FormControl(''),
        email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    });

    addCourseForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        level: new FormControl('', [Validators.required]),
        tution_fee: new FormControl('', [Validators.required]),
        coe_fee: new FormControl('', [Validators.required]),
        commission: new FormControl('', [Validators.required]),
        broad_field: new FormControl('', [Validators.required]),
        narrow_field: new FormControl('', [Validators.required]),
        description: new FormControl(''),


    });

    addIntakesForm = new FormGroup({
        intake_date: new FormControl('', [Validators.required]),
        description: new FormControl(''),
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

    addAgentForm = new FormGroup({
        agent_no: new FormControl(''),
        company_name: new FormControl('', [Validators.required]),
        phoneNo: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        agent_commisson: new FormControl('', [Validators.required, Validators.max(100)]),
        website: new FormControl(''),
        invoice_to: new FormControl(''),
        description: new FormControl(''),
        street: new FormControl(''),
        suburb: new FormControl(''),
        state: new FormControl(''),
        post_code: new FormControl(''),
        country: new FormControl(''),
        branch: new FormControl('', [Validators.required]),
    });

    constructor(public dialogRef: MatDialogRef<DialogsComponent>,
                public elRef: ElementRef,
                public http: HttpClient,
                public activityService: ActivityService,
                private instituteAdd: InstituteAddressService,
                public instituteervice: InstituteService,
                public statusService: ClientStatusService,
                public userService: UserService,
                public clientPassportService: ClientPassportService,
                private _snackBar: MatSnackBar,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }


    assignInvoice(): any{
        this.addAgentForm.value.invoice_to = this.addAgentForm.value.company_name;
        this.invoiceTo =  this.addAgentForm.value.company_name;
    }

    ngOnInit(): void {
        this.getCountryInfo();
        this.getAllCountries();
        if (this.data.dialogType === 'Client') {
            this.getBranch();
            this.getManager();
            this.getVisaCategory();
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    addTypes(): void {

    }

    addContacts(): any {
        this.isSubmitted = true;
        if (!this.addClientForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            const contactDetail = {
                name: this.addClientForm.value.name,
                birthday: this.addClientForm.value.birthday,
                branch: this.addClientForm.value.branch,
                category: this.addClientForm.value.category,
                country: this.addClientForm.value.country,
                description: this.addClientForm.value.description,
                added_by: localStorage.getItem('userName'),
                email: this.addClientForm.value.email,
                gender: this.addClientForm.value.gender,
                marketing_manager: this.addClientForm.value.marketing_manager,
                password: this.addClientForm.value.password,
                phone: this.addClientForm.value.phone,
                post_code: this.addClientForm.value.post_code,
                referred: this.addClientForm.value.referred,
                role: 'Client',
                state: this.addClientForm.value.state,
                street: this.addClientForm.value.street,

            };
            // this.addContactsForm.value.added_by = localStorage.getItem('userName');
            this.isProcessing = true;
            this.userService.add(contactDetail).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    const clientCount = document.getElementsByClassName('contact_badge')[0].children[0].innerHTML;

                    const addCount = Number(clientCount) + 1;

                    document.getElementsByClassName('contact_badge')[0].children[0].innerHTML = addCount.toString();

                    this.addStatus(result.data);

                    if (this.addClientForm.value.passport_no !== '') {
                        const passportDetail = {
                            client_id: result.data._id,
                            passport: this.addClientForm.value.passport_no,
                            country: this.addClientForm.value.country,
                            birthPlace: 'N/A',
                            nationality: 'N/A',
                            placeOfIssue: 'N/A',
                            dateOfIssue: 'N/A',
                            dateOfexpiry: 'N/A',
                            hasVisa: false,
                            added_by: localStorage.getItem('userName'),
                        };

                        if (this.addClientForm.value.hasVisa === 'true') {
                            passportDetail.hasVisa = true;
                        } else {
                            passportDetail.hasVisa = false;
                        }

                        this.addPassport(passportDetail);
                    }


                    this.addActivity(result.data);

                },
                (error) => {
                    if (error.error !== undefined) {
                        this._snackBar.open(error.error.msg, '', {
                            duration: 2000,
                        });
                    }
                }
            );
            // this.changeNav();
        }

    }

    private addActivity(result: any): any {
        let activityDetails;
        activityDetails = {
            client_id: result._id,
            user_id: localStorage.getItem('userId'),
            title: 'New Client Created',
            description: '',
            type: 'Client',
            name: result.name,
            added_by: localStorage.getItem('userName'),
        };

        this.activityService.add(activityDetails).pipe(finalize(() => {
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

    private addStatus(result: any): any {
        let statusDetails;
        statusDetails = {
            client_id: result._id,
            status: 'Client',
            assigned_to: '',
            added_by: localStorage.getItem('userName'),
        };
        this.statusService.add(statusDetails).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (res) => {
                // this.assignValuesAgain(result.data);
                // this.profileName = result.data.name;
                // this.naviagtionData.push(history.state.data[key]);
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

    private addPassport(passportDetail: any): any {
        this.clientPassportService.add(passportDetail).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (res) => {
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

    addInstitute(): any {
        this.isSubmitted = true;
        if (!this.addInstituteForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteDetails = {
                institute_no: (Number(this.totalInstitute) + 1),
                added_by: localStorage.getItem('userName'),
                institute_name: this.addInstituteForm.value.institute_name,
                invoice_to: this.addInstituteForm.value.invoice_to,
                short_name: this.addInstituteForm.value.short_name,
                phoneNo: this.addInstituteForm.value.phoneNo,
                website: this.addInstituteForm.value.website,
                logo: 'institute_' + (Number(this.totalInstitute) + 1),
            };
            this.isProcessing = true;
            this.instituteervice.add(this.instituteDetails).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this.addAddress(result.data._id, result.message);
                    this.upload();
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

    private addAddress(id: any, message: any): any {
        this.instituteAddress = {
            institute_id: id,
            street: this.addInstituteForm.value.street,
            suburb: this.addInstituteForm.value.suburb,
            email: this.addInstituteForm.value.email,
            state: this.addInstituteForm.value.state,
            post_code: this.addInstituteForm.value.post_code,
            phone: this.addInstituteForm.value.phoneNo,
            country: this.addInstituteForm.value.country
        };

        // this.isProcessing = true;
        this.instituteAdd.add(this.instituteAddress).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (result) => {
                // this.addAddress(result._id);
                this._snackBar.open(message, '', {
                    duration: 2000,
                });
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



    get errorControl(): any {
        return this.addClientForm.controls;
    }

    get errorControlInstitute(): any {
        return this.addInstituteForm.controls;
    }

    get errorControlCourse(): any {
        return this.addCourseForm.controls;
    }

    get errorIntakesControl(): any {
        return this.addIntakesForm.controls;
    }

    get errorAddressControl(): any {
        return this.addAddressForm.controls;
    }

    get errorAgentControl(): any {
        return this.addAgentForm.controls;
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

    upload(): any {
        const formData = new FormData();
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            const filename = 'institute_' + (Number(this.totalInstitute) + 1) + '.jpg';
            formData.append('avatar', this.uploadedFiles[i], filename);
        }

        this.http.post(this.apiUrl + 'institute/upload', formData)
            .subscribe((response) => {
                console.log('response received is ', response);
            });
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

    getManager(): any {
        this.managers.push({
            manager_name: 'No Marketing Manager',
            manager: '',
        });
        this.http.get<any>(this.apiUrl + 'users/').subscribe({
            next: data => {
                data.data.forEach((cl: any) => {
                    if (cl.role === 'manager') {
                        this.managers.push({
                            manager_name: cl.name,
                            manager: cl.name,
                        });
                    }
                });
                // this.managers = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
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

    fileChange(element: any): any {
        this.uploadedFiles = element.target.files;
    }

}
