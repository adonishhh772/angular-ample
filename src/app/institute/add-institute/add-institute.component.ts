import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {InstituteService} from '../../Services/institute.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {InstituteAddressService} from '../../Services/institute-address.service';

@Component({
    selector: 'app-add-institute',
    templateUrl: './add-institute.component.html',
    styleUrls: ['./add-institute.component.css']
})
export class AddInstituteComponent implements OnInit {
    isSubmitted = false;
    totalInstitute = 0;
    isProcessing = false;
    errorMessage = '';
    isEdit = false;
    institute: any;
    instituteId = '';
    uploadedFiles: Array<File> = [];
    country: any[] = [];
    countryName = '';
    instituteDetails = {};
    instituteAddress = {};
    streetName = '';
    changeFlag = false;
    img = '';
    state = '';
    private readonly apiUrl = `${environment.apiUrl}`;
    addInstituteForm = new FormGroup({
        institute_no: new FormControl(''),
        institute_name: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        short_name: new FormControl('', [Validators.required]),
        phoneNo: new FormControl('', [Validators.required]),
        website: new FormControl('', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
        invoice_to: new FormControl('', [Validators.required]),
        street: new FormControl(''),
        suburb: new FormControl(''),
        state: new FormControl(''),
        post_code: new FormControl(''),
        country: new FormControl(''),
        email: new FormControl('', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    });

    constructor(public http: HttpClient, private instituteAdd: InstituteAddressService, private router: Router, public elRef: ElementRef, public instituteervice: InstituteService, private _snackBar: MatSnackBar, private renderer: Renderer2) {
    }

    ngOnInit(): void {
        if (history.state.data !== undefined) {
            this.isEdit = true;
            this.institute = history.state.data;
            if (this.institute._id) {
                this.instituteId = this.institute._id;
            } else {
                this.instituteId = this.institute.id;
            }

            this.addInstituteForm.controls.logo.clearValidators();
        }
        this.getAllCountries();
        this.getCountryInfo();
        this.getInstituteLength();
    }


    get errorControl(): any {
        return this.addInstituteForm.controls;
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

    updateInstitute(): any {
        this.isSubmitted = true;
        if (!this.addInstituteForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.instituteDetails = {
                institute_name: this.addInstituteForm.value.institute_name,
                invoice_to: this.addInstituteForm.value.invoice_to,
                short_name: this.addInstituteForm.value.short_name,
                phoneNo: this.addInstituteForm.value.phoneNo,
                website: this.addInstituteForm.value.website,
            };
            this.isProcessing = true;
            this.instituteervice.updateInstitute(this.instituteDetails, this.instituteId).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    this.changeNav();
                    this.router.navigate(['/institute/all']);
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

    upload(): any {
        let formData = new FormData();
        for (let i = 0; i < this.uploadedFiles.length; i++) {
            const filename = 'institute_' + (Number(this.totalInstitute) + 1) + '.jpg';
            formData.append('avatar', this.uploadedFiles[i], filename);
        }

        this.http.post(this.apiUrl + 'institute/upload', formData)
            .subscribe((response) => {
                console.log('response received is ', response);
            });
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

    getInstituteLength(): any {
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const el = selector.querySelector('.institute_badge');
        this.totalInstitute = el.childNodes[0].innerHTML;
        // console.log(this.totalInstitute);
    }


    private getAllCountries(): any {
        this.http.get<any>('https://restcountries.com/v3.1/all').subscribe({
            next: data => {
                this.country = data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    addFilter(countryName: string) {
        this.img = this.country.filter((country: any) => {
            return country.name.common === countryName;
        })[0].flags.svg;

        this.changeFlag = true;
    }

    updateFlag(event: any): any {
        this.addFilter(event.value);
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

                this.changeNav();
                this.router.navigate(['/institute/all']);
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

    cancel(): any{
        this.changeNav();
        this.router.navigate(['/institute/all']);
    }

    fileChange(element: any): any {
        this.uploadedFiles = element.target.files;
    }
}
