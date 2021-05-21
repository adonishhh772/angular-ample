import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../environments/environment';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {DialogComponent} from '../Components/dialog/dialog.component';
import {NavigationExtras, Router} from '@angular/router';


export interface Contacts {
    id: string;
    contact_id: string;
    name: string;
    phone: string;
    email: string;
    dob: string;
    country: string;
    referred: string;
    added: string;
    branch: string;
    type: string;
}

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'contact_id', 'name', 'phone', 'email', 'dob', 'country', 'referred', 'added', 'branch', 'type', 'actions'];
    selection = new SelectionModel<Contacts>(true, []);
    private readonly apiUrl = `${environment.apiUrl}users/`;
    contacts = [];
    userRole = localStorage.getItem('userRole');
    contactId: string[] = [];
    isDelete = false;
    date = Date.now();
    contactCount = 0;
    numRows = 0;
    uName = localStorage.getItem('userName');
    errorMessage = '';
    dataSource!: MatTableDataSource<Contacts>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private renderer: Renderer2, private router: Router, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getAllContacts();
    }

    ngAfterViewInit(): void {
        const el = this.elRef.nativeElement.querySelector('.mat-select-arrow');
        this.renderer.setStyle(el, 'margin', '0 4px');
    }

    applyFilter(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    isAllSelected(): any {
        const numSelected = this.selection.selected.length;
        const numRows = this.numRows;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): any {
        if (this.isAllSelected()) {
            this.isDelete = false;
            this.selection.clear();
        } else {
            this.isDelete = true;
            this.dataSource.data.forEach(row => this.selection.select(row));
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Contacts): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    selectBox(e: any, row: any): any {
        if (e) {
            this.selection.toggle(row);
            if (this.selection.isSelected(row)) {
                this.isDelete = true;
            } else {
                if (this.selection.selected.length === 0) {
                    this.isDelete = false;
                }

            }
        } else {
            return null;
        }

    }

    getAllContacts(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {

                if (this.userRole === 'Super Admin' || this.userRole === 'Admin') {
                    this.contacts = data.data.filter((contact: any) => {
                        return contact.name !== this.uName;
                    });
                } else {
                    this.contacts = data.data.filter((contact: any) => {
                        return contact.role === 'Client';
                    });
                }

                const contact = Array.from({length: this.contacts.length}, (_, k) => this.createContact(k, this.contacts));
                this.contactCount = this.contacts.length;
                const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
                const selected = selector.querySelector('.selected_side_nav').previousSibling;
                const el = selector.querySelector('.contact_badge');

                el.childNodes[0].innerHTML = this.contactCount;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(contact);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createContact(index: any, data: any): any {
        let cid = index + 1;
        const id = data[index]._id;
        const contact_id = 'C000' + cid;
        const name = data[index].name;
        const phone = data[index].phone;
        const email = data[index].email;
        const dob = data[index].birthday;
        const country = data[index].country;
        const branch = data[index].branch === undefined ? data[index].secondary_branch : data[index].branch;
        const referred = data[index].referred;
        const added = data[index].added_by;
        const type = data[index].role;
        return {
            id,
            contact_id,
            name,
            phone,
            email,
            dob,
            country,
            branch,
            referred,
            added,
            type,
        };
    }

    openDialog(id: string): void {
        this.contactId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactId, type: 'contacts', title: 'Are you sure you want to delete this contact?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllContacts();
        });

    }

    deleteSelected(): any {
        this.selection.selected.forEach((value, index) => {
            this.contactId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactId, type: 'contacts', title: 'Are you sure you want to delete selected contacts?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllContacts();
        });

    }

    goToView(id: any): any {
        let navigationExtras: NavigationExtras = {
            queryParams: {id: id}
        };
        this.router.navigate(['contacts/view'], navigationExtras);
    }

}
