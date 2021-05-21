import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserService} from '../../Services/user.service';

@Component({
    selector: 'app-add-contacts',
    templateUrl: './add-contacts.component.html',
    styleUrls: ['./add-contacts.component.css']
})
export class AddContactsComponent implements OnInit {
    hidePass = true;
    isSubmitted = false;
    totalContacts = 0;
    isProcessing = false;
    userRole = localStorage.getItem('userRole');
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    country: any[] = [];
    countryName = '';
    branches: any[] = [];
    managers: any[] = [];
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
        branch: new FormControl(''),
        marketing_manager: new FormControl(''),
        hasVisa: new FormControl(''),
        role: new FormControl('', [Validators.required]),
    });

    constructor(public router: Router, public http: HttpClient, public userService: UserService, private _snackBar: MatSnackBar, private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        this.getContactsLength();
        this.getBranch();
        this.getManager();
        this.getCountryInfo();
        this.getAllCountries();
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
            this.addContactsForm.value.added_by = localStorage.getItem('userName');
            if (this.addContactsForm.value.hasVisa === 'true') {
                this.addContactsForm.value.hasVisa = true;
            } else {
                this.addContactsForm.value.hasVisa = false;
            }
            this.isProcessing = true;
            this.userService.add(this.addContactsForm.value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    // this.assignValuesAgain(result.data);
                    // this.profileName = result.data.name;
                    // this.naviagtionData.push(history.state.data[key]);
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    this.changeNav();
                    // this.editAble = false;
                    this.router.navigate(['/contacts/all']);
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
            // this.changeNav();
        }

    }

    getContactsLength(): any {
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const el = selector.querySelector('.contact_badge');
        this.totalContacts = el.childNodes[0].innerHTML;
    }

    changeNav(): any {
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const selected = selector.querySelector('.selected_side_nav').previousSibling;
        const el = selector.querySelectorAll('.menu_item');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'selected_side_nav');
        });
        this.renderer.addClass(selected, 'selected_side_nav');
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

}
