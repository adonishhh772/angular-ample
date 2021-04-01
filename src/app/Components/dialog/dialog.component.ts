import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BranchService} from '../../Services/branch.service';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Output, EventEmitter} from '@angular/core';
import {AgentService} from '../../Services/agent.service';

export interface DialogData {
    id: string;
    type: string;
    title: string;
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    isDeleting = false;

    constructor(public router: Router,
                private _snackBar: MatSnackBar,
                public branchService: BranchService,
                public agentService: AgentService,
                public dialogRef: MatDialogRef<DialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        dialogRef.disableClose = true;
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    deleteBranch(id: any, type: any): void {
        this.isDeleting = true;
        for (const keys of id) {
            if (type === 'branch') {
                this.branchDelete(keys);
            } else {
                this.agentDelete(keys);
            }

        }
    }

    branchDelete(id: string): void {
        this.branchService.delBranch(id).pipe(finalize(() => {
            this.isDeleting = false;
            this.dialogRef.close();
        })).subscribe(
            (result) => {
                // this.assignValuesAgain(result.data);
                // this.profileName = result.data.name;
                // this.naviagtionData.push(history.state.data[key]);
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

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

    agentDelete(id: string): void {
        this.agentService.delAgent(id).pipe(finalize(() => {
            this.isDeleting = false;
            this.dialogRef.close();
        })).subscribe(
            (result) => {
                // this.assignValuesAgain(result.data);
                // this.profileName = result.data.name;
                // this.naviagtionData.push(history.state.data[key]);
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

                // this.editAble = false;
                this.router.navigate(['/agent/all']);
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
