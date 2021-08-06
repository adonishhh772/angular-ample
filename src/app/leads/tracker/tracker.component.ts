import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogComponent} from '../../Components/dialog/dialog.component';
import {ClientStatusService} from '../../Services/client-status.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {ActivityService} from '../../Services/activity.service';
import {environment} from '../../../environments/environment';
import {NavigationExtras, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

export interface Users {
    id: string;
    client_no: string;
    client_name: string;
    country: string;
    phone: string;
    email: string;
    category: string;
    branch: string;
    added: string;
}

@Component({
    selector: 'app-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
    @Input() leads: any = [];
    @Input() allUser: any = [];
    @Input() followUp: any = [];
    @Input() clients: any = [];
    @Input() closed: any = [];
    @Output() statusEvent = new EventEmitter<string>();

    constructor(private renderer: Renderer2,
                private elRef: ElementRef,
                private _snackBar: MatSnackBar,
                private http: HttpClient,
                private router: Router,
                private clientStatus: ClientStatusService,
                private activityService: ActivityService,
                private matDialog: MatDialog) {
    }

    displayedColumns: string[] = ['select', 'client_id', 'client_name', 'phone', 'email', 'country', 'category', 'added', 'branch', 'actions'];
    errorMessage = '';
    isProcessing = true;
    isProcessingAssignee = true;
    contactId: string[] = [];
    isDelete = false;
    allId: any[] = [];
    date = Date.now();
    steps = 'lead';
    allAssignee: any[] = [];
    convert = '';
    assignee = '';
    title = 'New Lead';
    private readonly apiUrl = `${environment.apiUrl}`;
    numRows = 0;
    selection = new SelectionModel<Users>(true, []);
    dataSource!: MatTableDataSource<Users>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
        setTimeout(() => {
            this.getAllContacts(this.steps);
        }, 500);

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

    applyFilter(event: Event): any {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Users): string {
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
            this.contactId.push(value.id);
        });
        // console.log(this.agentId);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactId, type: 'contacts', title: 'Are you sure you want to delete selected contacts?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.selection.clear();
            this.isDelete = false;
            this.getAllContacts(this.steps);
        });

    }

    getAllContacts(steps: string): any {
        // console.log('here');
        let user: any[] = [];
        this.allAssignee = this.allUser.filter((v: any) => {
            return v.role !== 'Client';
        });
        switch (steps) {
            case 'lead':
                const leadsId: any[] = [];
                this.leads.forEach((cl: any, index: any) => {
                    leadsId.push({
                        status: this.leads[index]._id,
                        client: this.leads[index].client_id
                    });
                });
                this.allId = leadsId;
                user = this.leads.map((val: any) => {
                    return Object.assign({}, val, this.allUser.filter((v: any) => {
                        return v._id === val.client_id;
                    })[0]);
                });
                this.title = 'New Lead';
                break;
            case 'follow_up':
                const followId: any[] = [];
                this.followUp.forEach((cl: any, index: any) => {
                    followId.push({
                        status: this.followUp[index]._id,
                        client: this.followUp[index].client_id
                    });
                });
                this.allId = followId;
                user = this.followUp.map((val: any) => {
                    return Object.assign({}, val, this.allUser.filter((v: any) => {
                        return v._id === val.client_id;
                    })[0]);
                });
                this.title = 'Follow Up';
                break;
            case 'clients':
                const clientId: any[] = [];
                this.clients.forEach((cl: any, index: any) => {
                    clientId.push({
                        status: this.clients[index]._id,
                        client: this.clients[index].client_id
                    });
                });
                this.allId = clientId;
                user = this.clients.map((val: any) => {
                    return Object.assign({}, val, this.allUser.filter((v: any) => {
                        return v._id === val.client_id;
                    })[0]);
                });
                this.title = 'Clients';
                break;
            case 'closed':
                const closedId: any[] = [];
                this.closed.forEach((cl: any, index: any) => {
                    closedId.push({
                        status: this.closed[index]._id,
                        client: this.closed[index].client_id
                    });
                });
                this.allId = closedId;
                user = this.closed.map((val: any) => {
                    return Object.assign({}, val, this.allUser.filter((v: any) => {
                        return v._id === val.client_id;
                    })[0]);
                });
                this.title = 'Closed';
                break;
        }

        // console.log(this.allId);


        const contact = Array.from({length: user.length}, (_, k) => this.createContact(k, user));
        // Assign the data to the data source for the table to render
        this.dataSource = new MatTableDataSource(contact);

        this.numRows = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    }

    openDialog(id: string): void {
        this.contactId.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.contactId, type: 'contacts', title: 'Are you sure you want to delete this contact?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getAllContacts(this.steps);
        });

    }

    goToView(id: any): any {
        const navigationExtras: NavigationExtras = {
            queryParams: {id: id}
        };
        this.router.navigate(['contacts/view'], navigationExtras);
    }

    covertValue(sel: string): any {
        this.convert = sel;
        if (this.convert !== '') {
            this.isProcessing = false;
        }
    }

    createContact(index: any, data: any): any {
        const id = data[index]._id;
        const cid = index + 1;
        const client_no = 'C000' + cid;
        const client_name = data[index].name;
        const country = data[index].country;
        const phone = data[index].phone;
        const email = data[index].email;
        const category = data[index].category;
        const branch = data[index].branch;
        const added = data[index].added_by;
        return {
            id,
            client_no,
            client_name,
            country,
            phone,
            email,
            category,
            branch,
            added,
        };
    }


    private addActivity(activity: any): any {
        this.activityService.add(activity).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                this.selection.clear();
                this.isDelete = false;

            },
            (error) => {
                if (error.error !== undefined) {
                    this._snackBar.open(error.error.msg, '', {
                        duration: 2000,
                    });
                }
            }
        );

    }

    sendData(): any {
        this.statusEvent.emit('users');
    }

    changeTracker(menu: string, e: any): void {
        const el = this.elRef.nativeElement.querySelectorAll('.lead_viewer');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'active');
        });

        if (e.target.parentElement.className.includes('lead_viewer')) {
            e.target.parentElement.className += ' active';
        } else {
            e.target.parentElement.parentElement.className += ' active';
        }
        this.steps = menu;
        this.selection.clear();
        this.isDelete = false;
        this.getAllContacts(this.steps);
    }

    assignValue(sel: string): any {
        this.assignee = sel;
        if (this.assignee !== '') {
            this.isProcessingAssignee = false;
        }
    }

    updateStatus(): any {
        this.isProcessing = true;
        let activityDetails: any;
        this.selection.selected.forEach((value, index) => {
            this.http.get<any>(this.apiUrl + 'status/' + value.id).subscribe({
                next: data => {
                    const statusId = data.data[0]._id;
                    const clientName = value.client_name;
                    let statusDetails;
                    statusDetails = {
                        status: this.convert,
                        changed_by: localStorage.getItem('userName'),
                    };
                    activityDetails = {
                        client_id: value.id,
                        user_id: localStorage.getItem('userId'),
                        title: 'Client Status Updated',
                        description: 'Status of Client ' + clientName + ' changed to ' + this.convert + ' Updated By ' + localStorage.getItem('userName'),
                        type: 'Client',
                        name: clientName,
                        added_by: localStorage.getItem('userName'),
                    };
                    this.clientStatus.updateStatus(statusDetails, statusId).pipe(finalize(() => {
                        this.isProcessing = false;
                    })).subscribe(
                        (result) => {
                            this._snackBar.open(result.message, '', {
                                duration: 2000,
                            });
                            this.addActivity(activityDetails);
                        },
                        (error) => {
                            if (error.error !== undefined) {
                                this._snackBar.open(error.error.msg, '', {
                                    duration: 2000,
                                });
                            }
                        }
                    );
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });
        });

        this.sendData();
        setTimeout(() => {
            this.getAllContacts(this.steps);
        }, 500);
    }

    updateAssignee(): any {
        this.isProcessingAssignee = true;
        let activityDetails: any;
        this.selection.selected.forEach((value, index) => {
            this.http.get<any>(this.apiUrl + 'status/' + value.id).subscribe({
                next: data => {
                    const statusId = data.data[0]._id;
                    const clientName = value.client_name;
                    let statusDetails;
                    statusDetails = {
                        assigned_to: this.assignee,
                        changed_by: localStorage.getItem('userName'),
                    };
                    activityDetails = {
                        client_id: value.id,
                        user_id: localStorage.getItem('userId'),
                        title: 'Client Assigned to ' + this.assignee,
                        description: this.assignee + 'Assigned to ' + clientName + ' By ' + localStorage.getItem('userName'),
                        type: 'Assignee',
                        name: clientName,
                        added_by: localStorage.getItem('userName'),
                    };
                    this.clientStatus.updateAssignee(statusDetails, statusId).pipe(finalize(() => {
                        this.isProcessingAssignee = false;
                    })).subscribe(
                        (result) => {
                            this._snackBar.open(result.message, '', {
                                duration: 2000,
                            });
                            this.addActivity(activityDetails);
                        },
                        (error) => {
                            if (error.error !== undefined) {
                                this._snackBar.open(error.error.msg, '', {
                                    duration: 2000,
                                });
                            }
                        }
                    );
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });
        });
    }

}
