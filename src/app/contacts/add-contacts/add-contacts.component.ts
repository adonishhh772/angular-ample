import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserService} from '../../Services/user.service';
import {ActivityService} from '../../Services/activity.service';
import {ClientStatusService} from '../../Services/client-status.service';
import {ClientPassportService} from '../../Services/client-passport.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-add-contacts',
    templateUrl: './add-contacts.component.html',
    styleUrls: ['./add-contacts.component.css']
})
export class AddContactsComponent implements OnInit {
    @Input() isLeads = false;
    hidePass = true;
    isSubmitted = false;
    totalContacts = 0;
    isProcessing = false;
    userRole = localStorage.getItem('userRole');
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    isClient = false;
    country: any[] = [];
    countryName = '';
    title = 'Contact Details';
    branches: any[] = [];
    managers: any[] = [];
    category: any[] = [];
    streetName = '';
    state = '';
    addContactsForm = new FormGroup({
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
        role: new FormControl('', [Validators.required]),
    });

    constructor(public router: Router,
                public http: HttpClient,
                public activityService: ActivityService,
                public statusService: ClientStatusService,
                public userService: UserService,
                public clientPassportService: ClientPassportService,
                private _snackBar: MatSnackBar,
                private elRef: ElementRef,
                private renderer: Renderer2) {
    }

    ngOnInit(): void {
        if (this.isLeads) {
            this.title = 'Leads Detail';
        } else {
            this.title = 'Contact Details';
        }
        this.getContactsLength();
        this.getBranch();
        this.getManager();
        this.getCountryInfo();
        this.getAllCountries();
        this.getVisaCategory();
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

    addContacts(): any {
        this.isSubmitted = true;
        if (!this.addContactsForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            const contactDetail = {
                name: this.addContactsForm.value.name,
                birthday: this.addContactsForm.value.birthday,
                branch: this.addContactsForm.value.branch,
                category: this.addContactsForm.value.category,
                country: this.addContactsForm.value.country,
                description: this.addContactsForm.value.description,
                added_by: localStorage.getItem('userName'),
                email: this.addContactsForm.value.email,
                gender: this.addContactsForm.value.gender,
                marketing_manager: this.addContactsForm.value.marketing_manager,
                password: this.addContactsForm.value.password,
                phone: this.addContactsForm.value.phone,
                post_code: this.addContactsForm.value.post_code,
                referred: this.addContactsForm.value.referred,
                role: this.addContactsForm.value.role,
                state: this.addContactsForm.value.state,
                street: this.addContactsForm.value.street,

            };
            if (this.isLeads) {
                contactDetail.role = 'Client';
            }
            // this.addContactsForm.value.added_by = localStorage.getItem('userName');
            this.isProcessing = true;
            this.userService.add(contactDetail).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    this.addStatus(result.data);

                    if (this.addContactsForm.value.passport_no !== '') {
                        const passportDetail = {
                            client_id: result.data._id,
                            passport: this.addContactsForm.value.passport_no,
                            country: this.addContactsForm.value.country,
                            birthPlace: '',
                            nationality: '',
                            placeOfIssue: '',
                            dateOfIssue: '',
                            dateOfexpiry: '',
                            hasVisa: false,
                            added_by: localStorage.getItem('userName'),
                        };

                        if (this.addContactsForm.value.hasVisa === 'true') {
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

    getContactsLength(): any {
        if (this.isLeads) {
            const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            const el = selector.querySelector('.contact_badge');
            this.totalContacts = el.childNodes[0].innerHTML;
        } else {
            const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
            const el = selector.querySelector('.contact_badge');
            this.totalContacts = el.childNodes[0].innerHTML;
        }
    }

    changeNav(): any {
        if (this.isLeads) {
            const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            const selected = selector.querySelector('.selected_side_nav').previousSibling;
            const el = selector.querySelectorAll('.menu_item');
            el.forEach((cl: any) => {
                this.renderer.removeClass(cl, 'selected_side_nav');
            });
            this.renderer.addClass(selected, 'selected_side_nav');
        } else {
            const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
            const selected = selector.querySelector('.selected_side_nav').previousSibling;
            const el = selector.querySelectorAll('.menu_item');
            el.forEach((cl: any) => {
                this.renderer.removeClass(cl, 'selected_side_nav');
            });
            this.renderer.addClass(selected, 'selected_side_nav');

        }
    }

    get errorControl(): any {
        return this.addContactsForm.controls;
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

    checkClient(type: any): any {
        if (type.value === 'Client') {
            this.isClient = true;
        } else {
            this.isClient = false;
        }
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
                this.changeNav();
                if (this.isLeads) {
                    this.router.navigate(['/leads']);
                } else {
                    this.router.navigate(['/contacts/all']);
                }

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
        if (this.isLeads) {
            statusDetails.status = 'New Lead';
        }
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
}
