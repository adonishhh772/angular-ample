import {AfterViewInit, ViewChild, Component, OnInit, Renderer2, ElementRef} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {DialogComponent} from '../Components/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {BranchService} from '../Services/branch.service';
import {Router} from '@angular/router';

export interface Branch {
    id: string;
    branch_no: string;
    branch_name: string;
    branch_address: string;
    is_secondary: boolean;
}


@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html',
    styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'branch_no', 'branch_name', 'branch_address', 'is_secondary', 'actions'];
    selection = new SelectionModel<Branch>(true, []);
    private readonly apiUrl = `${environment.apiUrl}branch/`;
    branch = [];
    date = Date.now();
    branchId: string[] = [];
    isDelete = false;
    branchCount = 0;
    numRows = 0;
    errorMessage = '';
    dataSource!: MatTableDataSource<Branch>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private renderer: Renderer2,
                private router: Router,
                private branchService: BranchService,
                private elRef: ElementRef,
                private http: HttpClient,
                private matDialog: MatDialog) {
        this.getAllBranch();
    }

    ngOnInit(): void {
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

    getAllBranch(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {
                this.branch = data.data;
                // return data.data;
                const branch = Array.from({length: this.branch.length}, (_, k) => this.createBranch(k, this.branch));
                this.branchCount = this.branch.length;
                const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
                const selected = selector.querySelector('.selected_side_nav').previousSibling;
                const el = selector.querySelector('.branch_badge');

                el.childNodes[0].innerHTML = this.branchCount;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(branch);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

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
    checkboxLabel(row?: Branch): string {
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

    deleteSelected(): any {
        this.selection.selected.forEach((value, index) => {
            this.branchId.push(value.id);
        });
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.branchId, type: 'branch', title: 'Are you sure you want to delete selected branch?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllBranch();
        });

    }

    createBranch(index: any, data: any): any {
        const branch_name = data[index].branch_name;
        const branch_no = data[index].branch_no;
        const id = data[index]._id;
        const branch_address = data[index].branch_address;
        const is_secondary = data[index].is_secondary;
        return {
            id,
            branch_no,
            branch_name,
            branch_address,
            is_secondary,
        };
    }

    openDialog(id: string): void {
        this.branchId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.branchId, type: 'branch', title: 'Are you sure you want to delete this branch?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllBranch();
        });

    }

    editBranch(row: any): any {
        this.router.navigate(['branch/add'], {state: {data: row}});
    }
}



