import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {environment} from '../../../environments/environment';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {AgentService} from '../../Services/agent.service';
import {DialogComponent} from '../../Components/dialog/dialog.component';
import {NavigationExtras, Router} from '@angular/router';
export interface Agent {
    id: string;
    agent_id: string;
    agent_name: string;
    phone: string;
    email: string;
    website: string;
    branch: string;
    added: string;
    users: string;
}

@Component({
  selector: 'app-all-agent',
  templateUrl: './all-agent.component.html',
  styleUrls: ['./all-agent.component.css']
})
export class AllAgentComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['select', 'agent_id', 'agent_name', 'phone', 'email', 'website', 'branch', 'added', 'users', 'actions'];
    selection = new SelectionModel<Agent>(true, []);
    private readonly apiUrl = `${environment.apiUrl}agent/`;
    agent = [];
    agentId: string[] = [];
    isDelete = false;
    date = Date.now();
    agentCount = 0;
    numRows = 0;
    errorMessage = '';
    dataSource!: MatTableDataSource<Agent>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  constructor(private renderer: Renderer2, private router: Router, private agentService: AgentService, private elRef: ElementRef, private http: HttpClient, private matDialog: MatDialog) {
      this.getAllAgent();
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
    checkboxLabel(row?: Agent): string {
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
            this.agentId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.agentId, type: 'agent', title: 'Are you sure you want to delete selected agent?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllAgent();
        });

    }

    getAllAgent(): any {
        this.http.get<any>(`${this.apiUrl}`).subscribe({
            next: data => {
                this.agent = data.data;
                // return data.data;
                const agent = Array.from({length: this.agent.length}, (_, k) => this.createAgent(k, this.agent));
                this.agentCount = this.agent.length;
                const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
                const selected = selector.querySelector('.selected_side_nav').previousSibling;
                const el = selector.querySelector('.agent_badge');

                el.childNodes[0].innerHTML = this.agentCount;
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(agent);

                this.numRows = this.dataSource.data.length;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });

    }

    createAgent(index: any, data: any): any {
        const id = data[index]._id;
        const agent_id = data[index].agent_no;
        const agent_name = data[index].company_name;
        const phone = data[index].phoneNo;
        const email = data[index].email;
        const website = data[index].website;
        const branch = data[index].branch;
        const added = data[index].added_by;
        const users = data[index].users;
        return {
            id,
            agent_id,
            agent_name,
            phone,
            email,
            website,
            branch,
            added,
            users,
        };
    }

    openDialog(id: string): void {
        this.agentId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.agentId, type: 'agent', title: 'Are you sure you want to delete this agent?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllAgent();
        });

    }

    goToView(id: any): any {
        let navigationExtras: NavigationExtras = {
            queryParams: {id: id}
        };
        this.router.navigate(['agent/view'], navigationExtras);
    }
}
