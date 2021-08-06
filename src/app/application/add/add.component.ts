import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

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
    }

    get errorControl(): any {
        return this.addApplicationForm.controls;
    }

    getAllClients(): any {
        this.http.get<any>(`${this.apiUrl + 'users/'}`).subscribe({
            next: data => {
                this.allClients = data.data.filter((contact: any) => {
                    return contact.role === 'Client';
                });

                console.log(this.allClients);
                this.isLoaded = true;
                // return data.data;
            },
            error: error => {
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
                this.errorMessage = error.message;
            }
        });

    }

    addApplication(): void{

    }

}
