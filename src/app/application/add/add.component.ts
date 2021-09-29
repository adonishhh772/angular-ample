import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DialogsComponent} from '../dialogs/dialogs.component';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

    title = 'Add Application';
    isProcessing = false;
    isLoaded = false;
    isSubmitted = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    type: any[] = [];
    allClients: any[] = [];
    courses: any[] = [];
    allAgent: any[] = [];
    email = '';
    editRequirement = false;
    notify = false;
    subAgent: any[] = [];
    consultant: any[] = [];
    requirement: any[] = [];
    intakes: any[] = [];
    address: any[] = [];
    selectedInstitute: any[] = [];
    allInstitute: any[] = [];
    addApplicationForm = new FormGroup({
        application_type: new FormControl('', [Validators.required]),
        client: new FormControl('', [Validators.required]),
        institute: new FormControl('', [Validators.required]),
        course: new FormControl('', [Validators.required]),
        start_date: new FormControl('', [Validators.required]),
        location: new FormControl('', [Validators.required]),
        finish_date: new FormControl('', [Validators.required]),
        tution_fee: new FormControl(''),
        student_id: new FormControl(''),
        super_agent: new FormControl(''),
        sub_agent: new FormControl(''),
        consultant: new FormControl(''),
        notify: new FormControl('')
    });

    constructor(private router: Router,
                private renderer: Renderer2,
                private elRef: ElementRef,
                private http: HttpClient,
                private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getAllTypes();
        this.getAllClients();
        this.getAllInstitute();
        this.getAllAgents();
    }

    get errorControl(): any {
        return this.addApplicationForm.controls;
    }


    setClientMail(e: any): any {
        const client = this.allClients.filter((contact: any) => {
            return contact.name === e;
        });

        this.email = client[0].email;

        this.notify = true;
    }

    openApplicationDialog(type: string): any{
        const dialogRef = this.matDialog.open(DialogsComponent, {
            data: {dialogType: type}
        });
        dialogRef.afterClosed().subscribe(result => {
            // this.getAllTypes();
            // this.getAllClients();
            // this.getAllInstitute();
            // this.getAllAgents();
        });
    }

    getAllAgents(): any {
        this.http.get<any>(`${this.apiUrl + 'agent/'}`).subscribe({
            next: data => {
                this.allAgent = data.data;
                this.subAgent = this.allAgent.filter((agent => {
                    return agent.is_subAgent;
                }));
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getAllInstitute(): any {
        this.http.get<any>(`${this.apiUrl + 'institute/'}`).subscribe({
            next: data => {
                this.allInstitute = data.data;
                this.isLoaded = true;
                // return data.data;
            },
            error: error => {
                this.isLoaded = false;
                this.errorMessage = error.message;
            }
        });
    }

    setInstituteDetail(event: any): any {
        this.selectedInstitute = this.allInstitute.filter((instute: any) => {
            return instute.institute_name === event;
        });

        this.http.get<any>(`${this.apiUrl + 'instituteCourses/' + this.selectedInstitute[0]._id}`).subscribe({
            next: data => {
                this.courses = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

        this.http.get<any>(`${this.apiUrl + 'instituteIntake/' + this.selectedInstitute[0]._id}`).subscribe({
            next: data => {
                this.intakes = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

        this.http.get<any>(`${this.apiUrl + 'instituteAddress/' + this.selectedInstitute[0]._id}`).subscribe({
            next: data => {
                this.address = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

        this.http.get<any>(`${this.apiUrl + 'instituteRequirement/' + this.selectedInstitute[0]._id}`).subscribe({
            next: data => {
                this.requirement = data.data;
                this.editRequirement = true;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    goToInstitute(): any{
        const navigationExtras: NavigationExtras = {
            queryParams: {id: this.selectedInstitute[0]._id, action: 'requirement'}
        };
        this.router.navigate(['institute/view'], navigationExtras);
    }

    getAllClients(): any {
        this.http.get<any>(`${this.apiUrl + 'users/'}`).subscribe({
            next: data => {
                this.allClients = data.data.filter((contact: any) => {
                    return contact.role === 'Client';
                });

                this.consultant = data.data.filter((contact: any) => {
                    return contact.role !== 'Client';
                });

                this.isLoaded = true;
                // return data.data;
            },
            error: error => {
                this.isLoaded = false;
                this.errorMessage = error.message;
            }
        });
    }

    getAllTypes(): any {
        this.http.get<any>(`${this.apiUrl + 'applicationType/'}`).subscribe({
            next: data => {
                this.type = data.data;
                this.isLoaded = true;
                // return data.data;
            },
            error: error => {
                this.isLoaded = false;
                this.errorMessage = error.message;
            }
        });

    }

    addApplication(): void {

    }

}
