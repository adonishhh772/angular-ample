import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../Components/dialog/dialog.component';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClientStatusService} from '../Services/client-status.service';
import {ActivityService} from '../Services/activity.service';

export interface FollowUp {
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
    selector: 'app-leads',
    templateUrl: './leads.component.html',
    styleUrls: ['./leads.component.css']
})


export class LeadsComponent implements OnInit, AfterViewInit {
    links = ['Leads Dashboard', 'Leads Tracker'];
    displayedColumns: string[] = ['client_id', 'client_name', 'phone', 'email', 'country', 'category', 'added', 'branch', 'actions'];
    activeLink = this.links[0];
    loaded = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    allFollowUp: any[] = [];
    date = Date.now();
    isProcessing = false;
    allFollowUpId: any[] = [];
    today = Date.now();
    followUpToday = 0;
    followUpWeek = 0;
    allClient: any[] = [];
    clientToday = 0;
    clientWeek = 0;
    allClosed: any[] = [];
    closedToday = 0;
    closedWeek = 0;
    allLeads: any[] = [];
    leadsToday = 0;
    leadsWeek = 0;
    allUsers: any[] = [];
    userWeek = 0;
    userToday = 0;
    numRowsFollow = 0;
    errorMessage = '';
    dataSourceFollow!: MatTableDataSource<FollowUp>;
    @ViewChild(MatPaginator) paginatorFollow!: MatPaginator;
    @ViewChild(MatSort) sortFollow!: MatSort;

    constructor(private renderer: Renderer2,
                private router: Router,
                private elRef: ElementRef,
                private _snackBar: MatSnackBar,
                private clientStatus: ClientStatusService,
                private activityService: ActivityService,
                private http: HttpClient, private matDialog: MatDialog) {
        if (this.router.url === '/leads/tracker') {
            this.activeLink = this.links[1];
        } else {
            this.activeLink = this.links[0];
        }
    }

    ngOnInit(): void {
        // setTimeout(() => {
            this.getClients();
        // }, 500);


    }

    ngAfterViewInit(): void {

        // let element = document.getElementsByClassName('mat-select-arrow') as HTMLElement;
        // const el = this.elRef.nativeElement.querySelector('.mat-select-arrow');
        // this.renderer.setStyle(el, 'margin', '0 4px');
    }

    goToAdd(): void {
        this.router.navigate(['leads/add']);
    }

    getClients(): void {
        this.http.get<any>(this.apiUrl + 'users/').subscribe({
            next: data => {
                this.allUsers = data.data;

                const allClientUser = this.allUsers.filter((contact: any) => {
                    return contact.role === 'Client';
                });

                this.allClient = [];
                this.allClosed = [];
                this.allFollowUp = [];
                this.allFollowUpId = [];
                this.allLeads = [];
                allClientUser.forEach((cl: any, index: any) => {
                    this.getClientStatus(cl._id);
                });

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    feedData($event: any): any {
        // setTimeout(() => {
        this.getClients();
        // }, 500);

    }

    getClientStatus(id: string): void {
        const today = new Date(this.today);
        this.http.get<any>(`${this.apiUrl + 'status/' + id}`).subscribe({
            next: data => {

                let result: any[] = [];
                const clients = data.data.filter((contact: any) => {
                    return contact.status === 'Client';
                });

                if (clients.length > 0) {
                    clients.forEach((cl: any, index: any) => {
                        this.allClient.push(clients[index]);
                    });
                    this.clientToday = this.allClient.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        return today.getDay() === createDate.getDay() || today.getDay() === modifyDate.getDay();
                    }).length;

                    this.clientWeek = this.allClient.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        const createTime = today.getTime() - createDate.getTime();
                        const createDays = createTime / (1000 * 3600 * 24);
                        const modifyTime = today.getTime() - modifyDate.getTime();
                        const modifyDays = modifyTime / (1000 * 3600 * 24);
                        return createDays <= 7 || modifyDays <= 7;
                    }).length;
                }

                const leads = data.data.filter((contact: any) => {
                    return contact.status === 'New Lead';
                });

                if (leads.length > 0) {
                    leads.forEach((cl: any, index: any) => {
                        this.allLeads.push(leads[index]);
                    });
                    this.leadsToday = this.allLeads.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        return today.getDay() === createDate.getDay() || today.getDay() === modifyDate.getDay();
                    }).length;

                    this.leadsWeek = this.allLeads.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        const createTime = today.getTime() - createDate.getTime();
                        const createDays = createTime / (1000 * 3600 * 24);
                        const modifyTime = today.getTime() - modifyDate.getTime();
                        const modifyDays = modifyTime / (1000 * 3600 * 24);
                        return createDays <= 7 || modifyDays <= 7;
                    }).length;
                }


                const closed = data.data.filter((contact: any) => {
                    return contact.status === 'Closed';
                });

                if (closed.length > 0) {
                    closed.forEach((cl: any, index: any) => {
                        this.allClosed.push(closed[index]);
                    });
                    this.closedToday = this.allClosed.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        return today.getDay() === createDate.getDay() || today.getDay() === modifyDate.getDay();
                    }).length;

                    this.closedWeek = this.allClosed.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        const createTime = today.getTime() - createDate.getTime();
                        const createDays = createTime / (1000 * 3600 * 24);
                        const modifyTime = today.getTime() - modifyDate.getTime();
                        const modifyDays = modifyTime / (1000 * 3600 * 24);
                        return createDays <= 7 || modifyDays <= 7;
                    }).length;
                }

                const follow = data.data.filter((contact: any) => {
                    return contact.status === 'Follow Up';
                });


                if (follow.length > 0) {
                    follow.forEach((cl: any, index: any) => {
                        this.allFollowUp.push(follow[index]);
                        this.allFollowUpId.push({
                            status: follow[index]._id,
                            client: follow[index].client_id
                        });
                    });
                    this.followUpToday = this.allFollowUp.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        return today.getDay() === createDate.getDay() || today.getDay() === modifyDate.getDay();
                    }).length;


                    this.followUpWeek = this.allFollowUp.filter((contact: any) => {
                        const createDate = new Date(contact.create_date);
                        const modifyDate = new Date(contact.modified_date);
                        const createTime = today.getTime() - createDate.getTime();
                        const createDays = createTime / (1000 * 3600 * 24);
                        const modifyTime = today.getTime() - modifyDate.getTime();
                        const modifyDays = modifyTime / (1000 * 3600 * 24);
                        return createDays <= 7 || modifyDays <= 7;
                    }).length;

                    result = this.allFollowUp.map((val: any) => {
                        return Object.assign({}, val, this.allUsers.filter((v: any) => {
                            return v._id === val.client_id;
                        })[0]);
                    });

                }
                const followUp = Array.from({length: result.length}, (_, k) => this.createFollowUp(k, result));
                // Assign the data to the data source for the table to render
                this.dataSourceFollow = new MatTableDataSource(followUp);
                this.numRowsFollow = this.dataSourceFollow.data.length;
                this.dataSourceFollow.paginator = this.paginatorFollow;
                this.dataSourceFollow.sort = this.sortFollow;


                this.loaded = true;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    createFollowUp(index: any, data: any): any {
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

    openDialog(id: string): void {
        const followup: any[] = [];
        followup.push(id);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: followup, type: 'contacts', title: 'Are you sure you want to delete this follow up?'}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getClients();
        });

    }

    goToView(id: any): any {
        const navigationExtras: NavigationExtras = {
            queryParams: {id}
        };
        this.router.navigate(['contacts/view'], navigationExtras);
    }

    changeTab(link: string): void {
        this.activeLink = link;

        if (link === this.links[1]) {
            this.router.navigate(['leads/tracker']);
        } else {
            this.router.navigate(['leads']);
        }
    }

    changeStatus(stat: string, data: any): any {

        const status = this.allFollowUpId.filter((contact: any) => {
            return contact.client === data.id;
        });

        this.isProcessing = true;
        let activityDetails: any;
        const statusId = status[0].status;
        const clientName = data.client_name;
        let statusDetails;
        statusDetails = {
            status: stat,
            changed_by: localStorage.getItem('userName'),
        };
        activityDetails = {
            client_id: data.id,
            user_id: localStorage.getItem('userId'),
            title: 'Client Status Updated',
            description: 'Status of Client ' + clientName + ' changed to ' + stat + ' Updated By ' + localStorage.getItem('userName'),
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
    }

    private addActivity(activity: any): any {
        this.activityService.add(activity).pipe(finalize(() => {
        })).subscribe(
            (res) => {
                // setTimeout(() => {
                this.getClients();
                // }, 500);

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

}
