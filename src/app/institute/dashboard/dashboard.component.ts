import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Institute} from '../institute.component';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../environments/environment';
import {DialogComponent} from '../../Components/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';

export interface ContactPerson {
    id: string;
    contact_name: string;
    contact_position: string;
    contact_phone: string;
    contact_email: string;
    contact_gender: string;
}

export interface Address {
    id: string;
    address: string;
    state: string;
    phone: string;
    email: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'contact_name', 'contact_position', 'contact_phone', 'contact_email', 'contact_gender', 'contact_actions'];
    displayedAddressColumns: string[] = ['select', 'address', 'state', 'phone', 'email', 'actions'];
    selection = new SelectionModel<ContactPerson>(true, []);
    selectionAddress = new SelectionModel<Address>(true, []);
    private readonly apiUrl = `${environment.apiUrl}`;
    contactPerson = [];
    instituteAddress = [];
    instituteId = '';
    contactPersonId: string[] = [];
    instituteAddressId: string[] = [];
    isDelete = false;
    isDeleteAddress = false;
    date = Date.now();
    contactPersonCount = 0;
    instituteAddressCount = 0;
    numRows = 0;
    numRowsAddress = 0;
    errorMessage = '';
    dataContactSource!: MatTableDataSource<ContactPerson>;
    @ViewChild('contactPaginator', { read: MatPaginator }) contactPaginator!: MatPaginator;
    @ViewChild('contactSort', { read: MatSort }) contactSort!: MatSort;
    dataAddressSource!: MatTableDataSource<Address>;
    @ViewChild('addressPaginator', { read: MatPaginator }) addressPaginator!: MatPaginator;
    @ViewChild('addressSort', { read: MatSort }) addressSort!: MatSort;

    constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
        this.route.queryParams.subscribe(params => {
            // console.log(params);
            this.instituteId = params.id;
            this.getAllInstituteContact(params.id);
            this.getAllInstituteAddress(params.id);
        });


    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        const el = this.elRef.nativeElement.querySelectorAll('.mat-select-arrow');
        el.forEach((cl: any) => {
            this.renderer.setStyle(cl, 'margin', '0 4px');
            // this.renderer.removeClass(cl, 'selected_side_nav');
        });
    }

    applyFilter(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataContactSource.filter = filterValue.trim().toLowerCase();

        if (this.dataContactSource.paginator) {
            this.dataContactSource.paginator.firstPage();
        }
    }

    applyFilterAddress(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataAddressSource.filter = filterValue.trim().toLowerCase();

        if (this.dataAddressSource.paginator) {
            this.dataAddressSource.paginator.firstPage();
        }
    }

    isAllSelected(): any {
        const numSelected = this.selection.selected.length;
        const numRows = this.numRows;
        return numSelected === numRows;
    }

    isAllSelectedAddress(): any {
        const numSelected = this.selectionAddress.selected.length;
        const numRows = this.numRowsAddress;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): any {
        if (this.isAllSelected()) {
            this.isDelete = false;
            this.selection.clear();
        } else {
            this.isDelete = true;
            this.dataContactSource.data.forEach(row => this.selection.select(row));
        }
    }

    masterToggleAddress(): any {
        if (this.isAllSelectedAddress()) {
            this.isDeleteAddress = false;
            this.selectionAddress.clear();
        } else {
            this.isDeleteAddress = true;
            this.dataAddressSource.data.forEach(row => this.selectionAddress.select(row));
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: ContactPerson): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    checkboxLabelAddress(row?: Address): string {
        if (!row) {
            return `${this.isAllSelectedAddress() ? 'select' : 'deselect'} all`;
        }
        return `${this.selectionAddress.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    deleteSelected(): any {
        this.selection.selected.forEach((value, index) => {
            this.contactPersonId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactPersonId, type: 'instituteContact', title: 'Are you sure you want to delete selected contact?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllInstituteContact(this.instituteId);
        });

    }

    deleteSelectedAddress(): any {
        this.selectionAddress.selected.forEach((value, index) => {
            this.instituteAddressId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.instituteAddressId, type: 'instituteAddress', title: 'Are you sure you want to delete selected address?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDeleteAddress = false;
            this.getAllInstituteAddress(this.instituteId);
        });

    }

    getAllInstituteContact(instituteId: string): any {
        this.http.get<any>(`${this.apiUrl + 'instituteContact/' + instituteId}`).subscribe({
            next: data => {
                this.contactPerson = data.data;
                // return data.data;
                const contact = Array.from({length: this.contactPerson.length}, (_, k) => this.createinstitutecontact(k, this.contactPerson));
                this.contactPersonCount = this.contactPerson.length;
                // Assign the data to the data source for the table to render
                this.dataContactSource = new MatTableDataSource(contact);

                this.numRows = this.dataContactSource.data.length;
                this.dataContactSource.paginator = this.contactPaginator;
                this.dataContactSource.sort = this.contactSort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createinstitutecontact(index: any, data: any): any {
        const id = data[index]._id;
        const contact_name = data[index].name;
        const contact_position = data[index].position;
        const contact_phone = data[index].phone;
        const contact_email = data[index].email;
        const contact_gender = data[index].gender;
        return {
            id,
            contact_name,
            contact_position,
            contact_phone,
            contact_email,
            contact_gender,
        };
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

    selectBoxAddress(e: any, row: any): any {
        if (e) {
            this.selectionAddress.toggle(row);
            if (this.selectionAddress.isSelected(row)) {
                this.isDeleteAddress = true;
            } else {
                if (this.selectionAddress.selected.length === 0) {
                    this.isDeleteAddress = false;
                }

            }
        } else {
            return null;
        }

    }

    openDialog(id: string): void {
        this.contactPersonId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactPersonId, type: 'instituteContact', title: 'Are you sure you want to delete this contact?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteContact(this.instituteId);
        });

    }

    openDialogAddress(id: string): void {
        this.instituteAddressId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.instituteAddressId, type: 'instituteAddress', title: 'Are you sure you want to delete this address?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteAddress(this.instituteId);
        });

    }

    getAllInstituteAddress(instituteId: string): any {
        this.http.get<any>(`${this.apiUrl + 'instituteAddress/' + instituteId}`).subscribe({
            next: data => {
                this.instituteAddress = data.data;
                // return data.data;
                const address = Array.from({length: this.instituteAddress.length}, (_, k) => this.createinstituteaddress(k, this.instituteAddress));
                this.instituteAddressCount = this.instituteAddress.length;
                // Assign the data to the data source for the table to render
                this.dataAddressSource = new MatTableDataSource(address);

                this.numRowsAddress = this.dataAddressSource.data.length;
                this.dataAddressSource.paginator = this.addressPaginator;
                this.dataAddressSource.sort = this.addressSort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createinstituteaddress(index: any, data: any): any {
        const id = data[index]._id;
        const address = data[index].street;
        const state = data[index].state;
        const phone = data[index].phone;
        const email = data[index].email;
        return {
            id,
            address,
            state,
            phone,
            email,
        };
    }

    addDialog(dialogOptions: string, dialogType: string, row: any): any {
        const dialogRef = this.matDialog.open(AddDialogComponent, {
            data: {options: dialogOptions, type: dialogType, id: this.instituteId, selected: row }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (dialogOptions === 'contacts'){
                this.getAllInstituteContact(this.instituteId);
            }else if (dialogOptions === 'address'){
                this.getAllInstituteAddress(this.instituteId);
            }
        });
    }
}
