import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {InstituteRequirementService} from '../../Services/institute-requirement.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit {
    public Editor = ClassicEditor;
    isSubmitted = false;
    isProcessing = false;
    errorMessage = '';
    requirementId = '';
    turnAroundTime = '';
    docRequirement = '';
    minRequirement = '';
    lodgementProcedure = '';
    commissionTime = '';
    otherNotes = '';
    isEdit = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    instituteId = '';
    requirementForm = new FormGroup({
        turnaround_time: new FormControl(''),
        document_requirement: new FormControl(''),
        minimum_requirement: new FormControl(''),
        lodgement_procedure: new FormControl(''),
        commission_time: new FormControl(''),
        other_notes: new FormControl(''),
    });

    constructor(private instituteReq: InstituteRequirementService, private renderer: Renderer2, private elRef: ElementRef, private router: Router, private route: ActivatedRoute, private http: HttpClient, private matDialog: MatDialog, private _snackBar: MatSnackBar) {
        this.route.queryParams.subscribe(params => {
            // console.log(params);
            this.instituteId = params.id;
            this.getAllInstituteRequirement(params.id);
        });
    }

    ngOnInit(): void {
    }

    addRequirement(): any {
        this.isSubmitted = true;
        this.isProcessing = true;
        this.requirementForm.value.institute_id = this.instituteId;
        this.instituteReq.add(this.requirementForm.value).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (result) => {
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

                this.getAllInstituteRequirement(this.instituteId);
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

    updateRequirement(): any{
        this.isSubmitted = true;
        this.isProcessing = true;
        this.instituteReq.updateRequirement(this.requirementForm.value, this.requirementId).pipe(finalize(() => {
            this.isProcessing = false;
        })).subscribe(
            (result) => {
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });

                this.getAllInstituteRequirement(this.instituteId);
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


    private getAllInstituteRequirement(id: any): any {
        this.http.get<any>(`${this.apiUrl + 'instituteRequirement/' + id}`).subscribe({
            next: data => {
                if (data.data.length > 0) {
                    this.isEdit = true;
                    this.requirementId = data.data[0]._id;
                    this.turnAroundTime = data.data[0].turnaround_time;
                    this.docRequirement = data.data[0].document_requirement;
                    this.minRequirement = data.data[0].minimum_requirement;
                    this.lodgementProcedure = data.data[0].lodgement_procedure;
                    this.commissionTime = data.data[0].commission_time;
                    this.otherNotes = data.data[0].other_notes;
                }

                // return data.data;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }
}
