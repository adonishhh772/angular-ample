import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../environments/environment';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {ApplicationTypeService} from '../../Services/application-type.service';

export interface Type {
    id: string;
    sn: string;
    status: string;
    description: string;
}

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['sn', 'status', 'description', 'actions'];
    private readonly apiUrl = `${environment.apiUrl}applicationType/`;
    type = [];
    date = Date.now();
    typeId: string[] = [];
    numRows = 0;
    errorMessage = '';
    dataSource!: MatTableDataSource<Type>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  constructor(private router: Router,
              private renderer: Renderer2,
              private elRef: ElementRef,
              private http: HttpClient,
              private applicationService: ApplicationTypeService,
              private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllTypes();
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

    getAllTypes(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {
                this.type = data.data;
                // return data.data;
                const types = Array.from({length: this.type.length}, (_, k) => this.createType(k, this.type));
                this.dataSource = new MatTableDataSource(types);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.addSideBar();
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createType(index: any, data: any): any {
        const id = data[index]._id;
        const sn = index + 1;
        const status = data[index].title;
        const description = data[index].description;
        return {
            id,
            sn,
            status,
            description,
        };
    }

    openAddDialog(row: any, stat: any): void{
        const dialogRef = this.matDialog.open(AddDialogComponent, {
            data: {result: row, statusType: stat}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllTypes();
        });
    }

    editType(row: any): any {
        this.router.navigate(['application/add'], {state: {data: row}});
    }

    editStatus(row: any): any {
        this.router.navigate(['application/add'], {state: {data: row}});
    }

    addSideBar(): any {
        this.applicationService.onFormSubmitted.emit();
    }

}
