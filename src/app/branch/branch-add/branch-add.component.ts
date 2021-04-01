import {Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {BranchService} from '../../Services/branch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
    selector: 'app-branch-add',
    templateUrl: './branch-add.component.html',
    styleUrls: ['./branch-add.component.css']
})
export class BranchAddComponent implements OnInit {
    isSubmitted = false;
    totalBranch = 0;
    isProcessing = false;
    addBranchForm = new FormGroup({
        branch_name: new FormControl('', [Validators.required]),
        branch_address: new FormControl('', [Validators.required]),
        is_secondary: new FormControl(''),
    });

    constructor(public router: Router, public branchSerivce: BranchService, private _snackBar: MatSnackBar, private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit(): void {
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

    getBranchLength(): any{
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const el = selector.querySelector('.branch_badge');
        this.totalBranch = el.childNodes[0].innerHTML;
    }

    changeNav(): any{
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

}
