import {Component, AfterViewInit, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {NavigationExtras, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {InstituteService} from '../Services/institute.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../Components/dialog/dialog.component';
export interface Institute {
    id: string;
    institute_id: string;
    institute_name: string;
    short_name: string;
    phoneNo: string;
    email: string;
    website: string;
    invoice_to: string;
    direct: string;
    added: string;
}

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})

export class InstituteComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'institute_id', 'institute_name', 'short_name', 'phone', 'email', 'website', 'added', 'actions'];
    selection = new SelectionModel<Institute>(true, []);
    private readonly apiUrl = `${environment.apiUrl}institute/`;
    institute = [];
    instituteId: string[] = [];
    isDelete = false;
    date = Date.now();
    instituteCount = 0;
    numRows = 0;
    errorMessage = '';
    dataSource!: MatTableDataSource<Institute>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    constructor(private renderer: Renderer2, private router: Router, private instituteService: InstituteService, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
        this.getAllInstitute();
    }

  ngOnInit(): void {
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
    checkboxLabel(row?: Institute): string {
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

    deleteSelected(): any{
        this.selection.selected.forEach((value, index) => {
            this.instituteId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.instituteId, type: 'institute', title: 'Are you sure you want to delete selected institute?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllInstitute();
        });

    }

    getAllInstitute(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {
                this.institute = data.data;
                // return data.data;
                const institute = Array.from({length: this.institute.length}, (_, k) => this.createinstitute(k, this.institute));
                this.instituteCount = this.institute.length;
                const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
                const selected = selector.querySelector('.selected_side_nav').previousSibling;
                const el = selector.querySelector('.institute_badge');

                el.childNodes[0].innerHTML = this.instituteCount;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(institute);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createinstitute(index: any, data: any): any {
        const id = data[index]._id;
        const institute_id = data[index].institute_no;
        const institute_name = data[index].institute_name;
        const phoneNo = data[index].phoneNo;
        const invoice_to = data[index].invoice_to;
        const email = data[index].email;
        const website = data[index].website;
        const short_name = data[index].short_name;
        const added = data[index].created_by;
        const users = data[index].users;
        return {
            id,
            institute_id,
            institute_name,
            phoneNo,
            email,
            website,
            invoice_to,
            short_name,
            added,
            users,
        };
    }

    openDialog(id: string): void {
        this.instituteId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.instituteId, type: 'institute', title: 'Are you sure you want to delete this institute?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstitute();
        });

    }

    goToView(id: any): any {
        let navigationExtras: NavigationExtras = {
            queryParams: {id: id}
        };
        this.router.navigate(['institute/view'], navigationExtras);
    }

    ngAfterViewInit(): void {
        const el = this.elRef.nativeElement.querySelector('.mat-select-arrow');
        this.renderer.setStyle(el, 'margin', '0 4px');
    }

    updateInstitute(row: any): any {
        this.router.navigate(['institute/add'], {state: {data: row}});
    }

}
