import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {NotesService} from '../../Services/notes.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {ActivityService} from '../../Services/activity.service';
import {DialogComponent} from '../../Components/dialog/dialog.component';

export interface Notes {
    id: string;
    added_by: string;
    notes: string;
    remind: string;
    remind_date: string;
    isComplete: boolean;
}

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit, AfterViewInit {
    @Input() clientName = '';
    displayedColumns: string[] = ['added_by', 'notes', 'remind', 'remind_date', 'actions'];
    addNotesForm = new FormGroup({
        notes: new FormControl('', [Validators.required]),
    });
    isSubmitted = false;
    remindDate = '';
    notesId: string[] = [];
    clientId = '';
    isProcessing = false;
    isProcessingComplete = false;
    isChecked = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    notes = [];
    numRows = 0;
    errorMessage = '';
    dataSource!: MatTableDataSource<Notes>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private renderer: Renderer2,
                private router: Router,
                private route: ActivatedRoute,
                private elRef: ElementRef,
                private _snackBar: MatSnackBar,
                private http: HttpClient,
                private activityService: ActivityService,
                private noteService: NotesService,
                private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.clientId = params.id;
            this.getAllNotes(params.id);
            // console.log(params);
        });

    }

    ngAfterViewInit(): void {
        const el = this.elRef.nativeElement.querySelector('.mat-select-arrow');
        this.renderer.setStyle(el, 'margin', '0 4px');
    }

    addNotes(): any {
        this.isSubmitted = true;
        if (!this.addNotesForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.addNotesForm.value.added_by = localStorage.getItem('userName');
            this.addNotesForm.value.reminder = false;
            this.addNotesForm.value.isComplete = false;
            this.addNotesForm.value.client_id = this.clientId;
            if (this.isChecked) {
                this.addNotesForm.value.reminder = true;
                this.remindDate = '<br><b>Reminder Date: </b>' + this.addNotesForm.value.reminder_date;
            }
            this.isProcessing = true;
            let activityDetails: any;
            const clientName = this.clientName;
            activityDetails = {
                client_id: this.clientId,
                user_id: localStorage.getItem('userId'),
                title: localStorage.getItem('userName') + ' Added a note',
                description: clientName + ' ' + this.addNotesForm.value.notes + ' ' + this.remindDate,
                type: 'Note',
                name: clientName,
                added_by: localStorage.getItem('userName'),
            };
            this.noteService.add(this.addNotesForm.value).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });
                    this.isSubmitted = false;
                    this.addNotesForm.reset();
                    this.addActivity(activityDetails);
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

    private addActivity(activity: any): any {
        this.activityService.add(activity).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                this.getAllNotes(this.clientId);
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

    setRemind(checked: boolean): any {
        this.isChecked = checked;
        if (checked) {
            this.addNotesForm.addControl('reminder_date', new FormControl('', Validators.required));
        } else {
            this.addNotesForm.removeControl('reminder_date');
        }
    }

    completeNotes(id: string, note: string): any {
        this.isProcessingComplete = true;
        let activityDetails: any;
        const noteStatus = {
            isComplete: true
        };
        const clientName = this.clientName;
        activityDetails = {
            client_id: this.clientId,
            user_id: localStorage.getItem('userId'),
            title: note + ' note completed by ' + localStorage.getItem('userName'),
            description: '',
            type: 'Note',
            name: clientName,
            added_by: localStorage.getItem('userName'),
        };
        this.noteService.completeNotes(noteStatus, id).pipe(finalize(() => {
            this.isProcessingComplete = false;
        })).subscribe(
            (result) => {
                this._snackBar.open(result.message, '', {
                    duration: 2000,
                });
                this.isSubmitted = false;
                this.addNotesForm.reset();
                this.addActivity(activityDetails);
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

    openDialog(id: string): any {
        this.notesId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.notesId, type: 'notes', title: 'Are you sure you want to delete this note?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllNotes(this.clientId);
        });
    }


    get errorControl(): any {
        return this.addNotesForm.controls;
    }

    private getAllNotes(id: any): any {
        this.http.get<any>(this.apiUrl + 'notes/' + id).subscribe({
            next: data => {

                this.notes = data.data;

                this.changeNotify(this.notes);
                const note = Array.from({length: this.notes.length}, (_, k) => this.createNotes(k, this.notes));
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(note);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createNotes(index: any, data: any): any {
        const id = data[index]._id;
        const added_by = data[index].added_by;
        const notes = data[index].notes;
        let remind = 'no';
        if (data[index].reminder) {
            remind = 'yes';
        }
        const remind_date = data[index].reminder_date;
        const isComplete = data[index].isComplete;
        return {
            id,
            added_by,
            notes,
            remind,
            remind_date,
            isComplete,
        };
    }

    private changeNotify(notes: any): any {
        let reminder: any[] = [];
        reminder = notes.filter((remind: any) => {
            return remind.isComplete === false;
        });

        reminder = reminder.filter((remind: any) => {
            return remind.reminder === true;
        });

        reminder = reminder.filter((remind: any) => {
            return remind.added_by === localStorage.getItem('userName') || remind.client_id === localStorage.getItem('userId');
        });


        const reminderCount = reminder.length;

        const parent = this.elRef.nativeElement.parentElement.parentElement.offsetParent.offsetParent;
        const topMenu = parent.querySelector('.reminder_notify');
        topMenu.childNodes[1].innerHTML = reminderCount;
    }
}
