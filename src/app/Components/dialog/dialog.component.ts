import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BranchService} from '../../Services/branch.service';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AgentService} from '../../Services/agent.service';
import {InstituteService} from '../../Services/institute.service';
import {AgentInstituteService} from '../../Services/agent-institute.service';
import {InstituteContactService} from '../../Services/institute-contact.service';
import {UserService} from '../../Services/user.service';
import {InstituteAddressService} from '../../Services/institute-address.service';
import {InstituteCourseService} from '../../Services/institute-course.service';
import {InstituteIntakeService} from '../../Services/institute-intake.service';

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
                public instituteService: InstituteService,
                public agentInstituteService: AgentInstituteService,
                public contactService: UserService,
                public instituteContact: InstituteContactService,
                public instituteCourse: InstituteCourseService,
                public instituteAddress: InstituteAddressService,
                public instituteIntake: InstituteIntakeService,
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
            switch (type){
                case 'branch':
                    this.branchDelete(keys);
                    break;
                case 'agent':
                    this.agentDelete(keys);
                    break;
                case 'institute':
                    this.instituteDelete(keys);
                    break;
                case 'instituteAgent':
                    this.instituteAgentDelete(keys, true);
                    break;
                case 'contacts':
                    this.contactDelete(keys);
                    break;
                case 'instituteContact':
                    this.instituteContactDelete(keys);
                    break;
                case 'instituteAddress':
                    this.instituteAddressDelete(keys);
                    break;
                case 'instituteCourse':
                    this.instituteCourseDelete(keys);
                    break;
                case 'instituteIntake':
                    this.instituteIntakeDelete(keys);
                    break;
            }
        }
    }

    contactDelete(id: string): void{
        this.contactService.delContact(id).pipe(finalize(() => {
            this.isDeleting = false;
            this.dialogRef.close();
        })).subscribe(
            (result) => {
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

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
        })).subscribe(
            (result) => {
                this.dialogRef.close();
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

    private instituteDelete(id: string): any {
        this.instituteService.delInstitute(id).pipe(finalize(() => {
            this.isDeleting = false;
            this.dialogRef.close();
        })).subscribe(
            (result) => {
                this.instituteAgentDelete(id, false);
                // this.assignValuesAgain(result.data);
                // this.profileName = result.data.name;
                // this.naviagtionData.push(history.state.data[key]);
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

                // this.editAble = false;
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

    private instituteAgentDelete(id: string, showsnackbar: boolean): any {
        this.agentInstituteService.removeAgentLink(id).pipe(finalize(() => {
            this.isDeleting = false;
            this.dialogRef.close();
        })).subscribe(
            (result) => {
                // this.assignValuesAgain(result.data);
                // this.profileName = result.data.name;
                // this.naviagtionData.push(history.state.data[key]);
                if (showsnackbar){
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                }

                return result;

                // this.editAble = false;
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

    private instituteContactDelete(id: string): void {
        this.instituteContact.delInstituteContact(id).pipe(finalize(() => {
            this.isDeleting = false;
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
                } else {
                    // this.router.navigate([returnUrl]);
                }
            }
        );
    }

    private instituteAddressDelete(id: string): void {
        this.instituteAddress.delInstituteAddress(id).pipe(finalize(() => {
            this.isDeleting = false;
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
                } else {
                    // this.router.navigate([returnUrl]);
                }
            }
        );
    }

    private instituteCourseDelete(id: string): void {
        this.instituteCourse.delInstituteCourse(id).pipe(finalize(() => {
            this.isDeleting = false;
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

    private instituteIntakeDelete(id: string): void {
        this.instituteIntake.delInstituteIntake(id).pipe(finalize(() => {
            this.isDeleting = false;
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
