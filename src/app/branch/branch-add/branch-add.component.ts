import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {BranchService} from '../../Services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-branch-add',
    templateUrl: './branch-add.component.html',
    styleUrls: ['./branch-add.component.css']
})
export class BranchAddComponent implements OnInit {
    isSubmitted = false;
    totalBranch = 0;
    branch: any;
    country: any[] = [];
    countryName = '';
    isEdit = false;
    changeFlag = false;
    img = '';
    errorMessage = '';
    isProcessing = false;
    addBranchForm = new FormGroup({
        branch_name: new FormControl('', [Validators.required]),
        branch_address: new FormControl('', [Validators.required]),
        is_secondary: new FormControl(''),
        number:  new FormControl('', [Validators.required]),
        authorised_name:  new FormControl('', [Validators.required]),
        email:  new FormControl('', [Validators.required]),
        assigned_country:  new FormControl('', [Validators.required]),
    });

    constructor(public router: Router, public http: HttpClient, public branchSerivce: BranchService, private _snackBar: MatSnackBar, private elRef: ElementRef, private renderer: Renderer2) {
        this.getCountryInfo();
        this.getAllCountries();
    }

    ngOnInit(): void {
        if (history.state.data !== undefined) {
            this.isEdit = true;
            this.branch = history.state.data;
        }

        this.getBranchLength();
    }

    addBranch(): any {
        this.isSubmitted = true;
        if (!this.addBranchForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            if (this.addBranchForm.value.is_secondary === '') {
                this.addBranchForm.value.is_secondary = false;
            }

            this.addBranchForm.value.branch_no = (Number(this.totalBranch) + 1);

            this.isProcessing = true;
            this.branchSerivce.add(this.addBranchForm.value).pipe(finalize(() => {
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
                    this.router.navigate(['/branch/all']);
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

    updateFlag(event: any): any {
        this.addFilter(event.value);
    }

    getBranchLength(): any {
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const el = selector.querySelector('.branch_badge');
        this.totalBranch = el.childNodes[0].innerHTML;
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
        return this.addBranchForm.controls;
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

    private getCountryInfo(): any {
        this.countryName = 'Loading';
        this.http.get<any>('http://ip-api.com/json').subscribe({
            next: data => {
                this.countryName = data.country;
                this.addFilter(this.countryName);
                // this.currentCountry = ;
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


    updateBranch(): any {
        this.isSubmitted = true;
        if (!this.addBranchForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            if (this.addBranchForm.value.is_secondary === '') {
                this.addBranchForm.value.is_secondary = false;
            }

            this.isProcessing = true;
            this.branchSerivce.updateBranch(this.addBranchForm.value, this.branch.id).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                    this.changeNav();
                    this.router.navigate(['/branch/all']);
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

    cancel(): any {
        this.changeNav();
        this.router.navigate(['/branch/all']);
    }
}
