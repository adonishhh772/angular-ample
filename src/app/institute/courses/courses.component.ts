import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {environment} from '../../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {DialogComponent} from '../../Components/dialog/dialog.component';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';

export interface Courses {
    id: string;
    course_id: string;
    course_name: string;
    level: string;
    tution_fee: string;
    coe_fee: string;
    commission: string;
    broad_field: string;
    narrow_field: string;
    description: string;
}


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'course_id', 'course_name', 'level', 'tution_fee', 'coe_fee', 'commission', 'course_actions'];
    selection = new SelectionModel<Courses>(true, []);
    private readonly apiUrl = `${environment.apiUrl}`;
    courses = [];
    isDelete = false;
    date = Date.now();
    coursesCount = 0;
    numRows = 0;
    courseId: string[] = [];
    instituteId = '';
    errorMessage = '';
    dataSource!: MatTableDataSource<Courses>;
    @ViewChild('Paginator', { read: MatPaginator }) paginator!: MatPaginator;
    @ViewChild('Sort', { read: MatSort }) sort!: MatSort;

  constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
      this.route.queryParams.subscribe(params => {
          // console.log(params);
          this.instituteId = params.id;
          this.getAllInstituteCourses(params.id);
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
    checkboxLabel(row?: Courses): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    deleteSelected(): any {
        this.selection.selected.forEach((value, index) => {
            this.courseId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.courseId, type: 'instituteCourse', title: 'Are you sure you want to delete selected course?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllInstituteCourses(this.instituteId);
        });

    }

    getAllInstituteCourses(instituteId: string): any {
        this.http.get<any>(`${this.apiUrl + 'instituteCourses/' + instituteId}`).subscribe({
            next: data => {
                this.courses = data.data;
                // return data.data;
                const courses = Array.from({length: this.courses.length}, (_, k) => this.createinstitutecourses(k, this.courses));
                this.coursesCount = this.courses.length;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(courses);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createinstitutecourses(index: any, data: any): any {
        const id = data[index]._id;
        const course_id = 'C000' + (index + 1);
        const course_name = data[index].name;
        const level = data[index].level;
        const tution_fee = data[index].tution_fee;
        const coe_fee = data[index].coe_fee;
        const commission = data[index].commission;
        const broad_field = data[index].broad_field;
        const narrow_field = data[index].narrow_field;
        const description = data[index].description;
        return {
            id,
            course_id,
            course_name,
            level,
            tution_fee,
            coe_fee,
            commission,
            broad_field,
            narrow_field,
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
        this.courseId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.courseId, type: 'instituteCourse', title: 'Are you sure you want to delete this courses?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteCourses(this.instituteId);
        });

    }

    addDialog(dialogOptions: string, dialogType: string, row: any): any {
        const dialogRef = this.matDialog.open(AddDialogComponent, {
            data: {options: dialogOptions, type: dialogType, id: this.instituteId, selected: row }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getAllInstituteCourses(this.instituteId);
        });
    }

}
