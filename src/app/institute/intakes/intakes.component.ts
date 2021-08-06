import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {DialogComponent} from '../../Components/dialog/dialog.component';
import {formatDate} from '@angular/common';

export interface Intake {
    id: string;
    intake_id: string;
    intake_date: string;
    description: string;
}

@Component({
  selector: 'app-intakes',
  templateUrl: './intakes.component.html',
  styleUrls: ['./intakes.component.css']
})
export class IntakesComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'intake_id', 'intake_date', 'description', 'actions'];
    selection = new SelectionModel<Intake>(true, []);
    private readonly apiUrl = `${environment.apiUrl}`;
    intakes = [];
    isDelete = false;
    date = Date.now();
    intakeCount = 0;
    numRows = 0;
    intakeId: string[] = [];
    instituteId = '';
    errorMessage = '';
    dataSource!: MatTableDataSource<Intake>;
    @ViewChild('Paginator', { read: MatPaginator }) paginator!: MatPaginator;
    @ViewChild('Sort', { read: MatSort }) sort!: MatSort;
  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
      this.route.queryParams.subscribe(params => {
          // console.log(params);
          this.instituteId = params.id;
          this.getAllInstituteIntake(params.id);
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
    checkboxLabel(row?: Intake): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    deleteSelected(): any {
        this.selection.selected.forEach((value, index) => {
            this.intakeId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.intakeId, type: 'instituteIntake', title: 'Are you sure you want to delete selected intakes?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllInstituteIntake(this.instituteId);
        });

    }

    getAllInstituteIntake(instituteId: string): any {
        this.http.get<any>(`${this.apiUrl + 'instituteIntake/' + instituteId}`).subscribe({
            next: data => {
                this.intakes = data.data;
                // return data.data;
                const intake = Array.from({length: this.intakes.length}, (_, k) => this.createInstituteIntake(k, this.intakes));
                this.intakeCount = this.intakes.length;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(intake);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createInstituteIntake(index: any, data: any): any {
        const id = data[index]._id;
        const intakeDate = formatDate(data[index].intake_date, 'yyyy-MM-dd', 'en-US');
        const intake_id = 'I000' + (index + 1);
        const intake_date = intakeDate;
        const description = data[index].description;
        return {
            id,
            intake_id,
            intake_date,
            description,
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

    openDialog(id: string): void {
        this.intakeId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.intakeId, type: 'instituteIntake', title: 'Are you sure you want to delete this intake?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteIntake(this.instituteId);
        });

    }

    addDialog(dialogOptions: string, dialogType: string, row: any): any {
        const dialogRef = this.matDialog.open(AddDialogComponent, {
            data: {options: dialogOptions, type: dialogType, id: this.instituteId, selected: row }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteIntake(this.instituteId);
        });
    }

}
