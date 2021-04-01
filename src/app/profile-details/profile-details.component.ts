import {Component, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../Services/user.service';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../environments/environment';


@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
    profileName = '';
    profileRole = '';
    private _jsonURL = 'assets/timezones.json';
    memberDate = '';
    padding = 'pt-7';
    editAble = false;
    isSubmitted = false;
    isProcessing = false;
    today: string | null = new DatePipe('en-US').transform(new Date(), 'MM/dd/yyyy');
    naviagtionData: any[] = [];
    country: any[] = [];
    timeZone: any[] = [];
    private readonly apiUrl = `${environment.apiUrl}branch/`;
    branches: any[] = [];
    currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    updateProfileForm!: FormGroup;
    errorMessage = '';
    public ctrls: { [name: string]: FormControl } = {};

    constructor(public userSerivce: UserService, private http: HttpClient, private _snackBar: MatSnackBar) {
        this.getAllCountries();
        this.getAllBranches();
        this.getJSON().subscribe(data => {
            this.timeZone = data;
        });

    }

    public getJSON(): Observable<any> {
        return this.http.get(this._jsonURL);
    }

    ngOnInit(): void {
        if (history.state.data !== undefined) {
            for (let key in history.state.data) {
                if (history.state.data.hasOwnProperty(key)) {
                    this.assignValues(key);
                    // this.naviagtionData.push(history.state.data[key]);
                }
            }

            this.assignFirstValues();

            this.profileName = history.state.data.name;
            this.profileRole = history.state.data.role;
            this.memberDate = history.state.data.create_date;

        }

    }

    private assignValues(key: string): any {
        switch (key) {
            case 'name':
                this.naviagtionData.push(
                    {
                        key: 'Full Name',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'person',
                        required: true,
                        disabled: false,
                        inputType: 'text'
                    }
                );
                break;
            case 'email':
                this.naviagtionData.push(
                    {
                        key: 'Email',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'email',
                        required: true,
                        disabled: true,
                        inputType: 'email'
                    }
                );
                break;
            case 'gender':
                this.naviagtionData.push(
                    {
                        key: 'Gender',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'transgender',
                        required: true,
                        disabled: false,
                        inputType: 'radio'
                    }
                );
                break;
            case 'birthday':
                this.naviagtionData.push(
                    {
                        key: 'Birthday',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'calendar_today',
                        required: true,
                        disabled: false,
                        inputType: 'date'
                    }
                );
                break;
            case 'reply_email':
                this.naviagtionData.push(
                    {
                        key: 'Reply Email',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'drafts',
                        required: true,
                        disabled: false,
                        inputType: 'email'
                    }
                );
                break;
            case 'phone':
                this.naviagtionData.push(
                    {
                        key: 'Phone',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'stay_current_portrait',
                        required: true,
                        disabled: false,
                        inputType: 'number'
                    }
                );
                break;
            case 'secondary_branch':
                this.naviagtionData.push(
                    {
                        key: 'Secondary Branch',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'group_work',
                        required: false,
                        disabled: false,
                        inputType: 'select'
                    }
                );
                break;
            case 'street':
                this.naviagtionData.push(
                    {
                        key: 'Street',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'traffic',
                        required: false,
                        disabled: false,
                        inputType: 'text'
                    }
                );
                break;
            case 'state':
                this.naviagtionData.push(
                    {
                        key: 'State',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'location_city',
                        required: false,
                        disabled: false,
                        inputType: 'text'
                    }
                );
                break;
            case 'postal_code':
                this.naviagtionData.push(
                    {
                        key: 'Post Code',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'local_shipping',
                        required: false,
                        disabled: false,
                        inputType: 'text'
                    }
                );
                break;
            case 'country':
                this.naviagtionData.push(
                    {
                        key: 'Country',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'flag',
                        required: false,
                        disabled: false,
                        inputType: 'select'
                    }
                );
                break;
            case 'timezone':
                this.naviagtionData.push(
                    {
                        key: 'Time Zone',
                        nameKey: key,
                        value: history.state.data[key],
                        icon: 'schedule',
                        required: false,
                        disabled: false,
                        inputType: 'select'
                    }
                );
                break;

        }
    }

    private assignFirstValues(): any {
        if (this.naviagtionData.find(x => x.nameKey === 'birthday').nameKey !== 'birthday') {
            this.naviagtionData.push({
                key: 'Birthday',
                nameKey: 'birthday',
                value: this.today,
                icon: 'calendar_today',
                required: true,
                disabled: false,
                inputType: 'date'
            });
        }

        if (this.naviagtionData.find(x => x.nameKey === 'gender').nameKey !== 'gender') {
            this.naviagtionData.push({
                key: 'Gender',
                nameKey: 'gender',
                value: '',
                icon: 'transgender',
                required: true,
                disabled: false,
                inputType: 'radio'
            });
        }

        if (this.naviagtionData.find(x => x.nameKey === 'reply_email').nameKey !== 'reply_email') {
            this.naviagtionData.push({
                key: 'Reply Email',
                nameKey: 'reply_email',
                value: history.state.data.email,
                icon: 'drafts',
                required: true,
                disabled: false,
                inputType: 'email'
            });
        }

        if (this.naviagtionData.find(x => x.nameKey === 'phone').nameKey !== 'phone') {
            this.naviagtionData.push({
                key: 'Phone',
                nameKey: 'phone',
                value: '',
                icon: 'stay_current_portrait',
                disabled: false,
                required: true,
                inputType: 'number'
            });
        }


        if (this.naviagtionData.find(x => x.nameKey === 'secondary_branch').nameKey !== 'secondary_branch') {
            this.naviagtionData.push({
                key: 'Secondary Branch',
                nameKey: 'secondary_branch',
                value: '',
                icon: 'group_work',
                required: false,
                disabled: false,
                inputType: 'text'
            });
        }

        if (this.naviagtionData.find(x => x.nameKey === 'street').nameKey !== 'street') {
            this.naviagtionData.push({
                key: 'Street',
                nameKey: 'street',
                value: '',
                icon: 'traffic',
                disabled: false,
                required: false,
                inputType: 'select'
            });
        }


        if (this.naviagtionData.find(x => x.nameKey === 'postal_code').nameKey !== 'postal_code') {
            this.naviagtionData.push({
                key: 'Post Code',
                nameKey: 'postal_code',
                value: '',
                icon: 'local_shipping',
                required: false,
                disabled: false,
                inputType: 'text'
            });
        }
        if (this.naviagtionData.find(x => x.nameKey === 'country').nameKey !== 'country' || this.naviagtionData.find(x => x.nameKey === 'state').nameKey !== 'state') {
            this.getCountryInfo();
        }

        if (this.naviagtionData.find(x => x.nameKey === 'timezone').nameKey !== 'timezone') {
            this.naviagtionData.push({
                key: 'Time Zone',
                nameKey: 'timezone',
                value: this.currentTimezone,
                icon: 'schedule',
                required: false,
                disabled: false,
                inputType: 'select'
            });
        }
    }

    toggleEdit(): any {
        this.editAble = !this.editAble;
        if (this.editAble) {
            for (const keys of this.naviagtionData) {
                this.addFormControl(keys);
            }
            this.padding = 'pt-15';
        } else {
            this.padding = 'pt-7';
        }
    }

    updateProfile(): any {
        // console.log(this.updateProfileForm.controls);
        this.isSubmitted = true;
        if (!this.updateProfileForm.valid) {
            return false;
        } else {
            this.isProcessing = true;
            this.userSerivce.updateProfile(this.updateProfileForm.value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                    (result) => {
                        this.assignValuesAgain(result.data);
                        this.profileName = result.data.name;
                        // this.naviagtionData.push(history.state.data[key]);
                        this._snackBar.open(result.message, '', {
                            duration: 2000,
                        });

                        this.editAble = false;
                        // this.router.navigate([returnUrl]);
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

    addFormControl(key: any): any {
        switch (key.nameKey) {
            case 'reply_email':
                this.ctrls[key.nameKey] = new FormControl(key.value, {
                    validators: [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]
                });
                break;
            case 'phone':
                this.ctrls[key.nameKey] = new FormControl(key.value, {
                    validators: [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
                });
                break;
            case 'name':
                this.ctrls[key.nameKey] = new FormControl(key.value, {
                    validators: [Validators.required, Validators.pattern('^[A-Za-z ]+$')]
                });
                break;
            case 'gender':
                this.ctrls[key.nameKey] = new FormControl(key.value, {
                    validators: [Validators.required]
                });
                break;
            case 'birthday':
                this.ctrls[key.nameKey] = new FormControl(key.value, {
                    validators: [Validators.required]
                });
                break;
            default:
                this.ctrls[key.nameKey] = new FormControl(key.value);
                break;
        }
        // this.ctrls[key] = new FormControl(this.data[key], {
        //     validators: [Validators.required]
        // });

        this.updateProfileForm = new FormGroup(this.ctrls);
    }

    get errorControl(): any {
        return this.updateProfileForm.controls;
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
                this.naviagtionData.push({
                        key: 'Country',
                        nameKey: 'country',
                        value: data.country,
                        icon: 'flag',
                        required: false,
                        disabled: false,
                        inputType: 'select'
                    },
                    {
                        key: 'State',
                        nameKey: 'state',
                        value: data.regionName,
                        icon: 'location_city',
                        required: false,
                        disabled: false,
                        inputType: 'text'
                    });
                // this.currentCountry = ;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }


    private assignValuesAgain(data: any): any {
        for (const keys of this.naviagtionData) {
            keys.value = data[keys.nameKey];
        }
    }

    private getAllBranches(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {
                this.branches = data.data;
                // this.currentCountry = ;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }
}
