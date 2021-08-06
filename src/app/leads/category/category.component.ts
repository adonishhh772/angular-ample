import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {ActivityService} from '../../Services/activity.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../dialog/dialog.component';

export interface Category {
    id: string;
    cat_id: string;
    name: string;
}

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['cat_id', 'name', 'actions'];
    private readonly apiUrl = `${environment.apiUrl}`;
    numRows = 0;
    uName = localStorage.getItem('userName');
    errorMessage = '';
    dataSource!: MatTableDataSource<Category>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private renderer: Renderer2,
                private router: Router,
                private elRef: ElementRef,
                public activityService: ActivityService,
                private _snackBar: MatSnackBar,
                private http: HttpClient,
                private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.getAllCategory();
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

    getAllCategory(): any {
        this.http.get<any>(this.apiUrl + 'category/').subscribe({
            next: data => {
                const contact = Array.from({length: data.data.length}, (_, k) => this.createContact(k, data.data));
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
        const id = data[index]._id;
        const name = data[index].name;
        const cat_id = index + 1;
        return {
            id,
            name,
            cat_id
        };
    }

    openDialog(row: any): void {
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {selected: row}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllCategory();
        });

    }


}
