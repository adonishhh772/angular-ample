import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {AgentInstituteService} from '../../Services/agent-institute.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NavigationExtras, Router} from '@angular/router';

export interface DialogData {
    agents: any[];
    institute_id: string;
}


@Component({
  selector: 'app-link-super-agent',
  templateUrl: './link-super-agent.component.html',
  styleUrls: ['./link-super-agent.component.css']
})
export class LinkSuperAgentComponent implements OnInit {
    linkInstituteForm = new FormGroup({
        agent_id: new FormControl('',[Validators.required]),
        commission: new FormControl(''),
    });
    isSubmitted = false;
    isProcessing = false;
  constructor(public dialogRef: MatDialogRef<LinkSuperAgentComponent>,
              public elRef: ElementRef,
              public router: Router,
              public agentService: AgentInstituteService,
              private _snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

    onNoClick(): void {
        this.dialogRef.close();
    }

    linkInstitute(): any{
        this.isSubmitted = true;
        if (!this.linkInstituteForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        }else{
            this.linkInstituteForm.value.institute_id = this.data.institute_id;
            this.isProcessing = true;
            // console.log(this.linkInstituteForm.value);
            this.agentService.add(this.linkInstituteForm.value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this.dialogRef.close();
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
            // this.changeNav();
        }

    }

    get errorControl(): any {
        return this.linkInstituteForm.controls;
    }

}
