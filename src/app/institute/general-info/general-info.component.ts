import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LinkSuperAgentComponent} from '../link-super-agent/link-super-agent.component';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {DialogComponent} from '../../Components/dialog/dialog.component';

@Component({
    selector: 'app-general-info',
    templateUrl: './general-info.component.html',
    styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {

    @Input() institute: any = [];
    @Input() agentData: any [] = [];
    @Input() isLoaded: boolean = false;
    @Input() hideAgent: boolean = false;
    @Input() errorMessage = '';
    @Input() agentCount = 0;
    agent: any[] = [];
    loaded = false;
    agentInstituteId: string[] = [];
    hasAgents = false;
    dialogConfig = new MatDialogConfig();
    private readonly apiUrl = `${environment.apiUrl}`;
    imgUrl = `${environment.imgUrl}`;
    imageUrl = '';
    constructor(private matDialog: MatDialog, private http: HttpClient, private router: Router, public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        // this.imageUrl = this.imgUrl + this.institute[0].logo;
        this.getAllAgent();
    }

    getAllAgent(): any {
        this.http.get<any>(this.apiUrl + 'agent/').subscribe({
            next: data => {
                this.loaded = true;
                this.agent = data.data;
                if (this.agentData.length === this.agent.length) {
                    if (this.agentData.sort().join(',') === this.agent.sort().join(',')) {
                        this.hasAgents = true;
                    }
                }
                for (let key in this.agentData) {
                    let this_id = this.agentData[key].agent_id;
                    this.agentData[key].agent_name = (this.agent.find(x => x._id === this_id).company_name + ' (' + this.agent.find(x => x._id === this_id).agent_no + ')');

                    if (this.agent.find(x => x._id === this_id)) {
                        this.agent.splice(this.agent.findIndex(x => x._id === this_id), 1);
                    }
                }

                this.dialogConfig.data = {agents: this.agent, institute_id: this.institute[0]._id};
                this.dialogConfig.width = '600px';


            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    removeAgent(agentid: string): any{
        this.agentInstituteId.push(agentid);
        const dialogRef = this.matDialog.open(DialogComponent, {
            data: {id: this.agentInstituteId, type: 'instituteAgent', title: 'Are you sure you want to delete this agent?'}
        });

        dialogRef.afterClosed().subscribe(result => {
                this.getInstituteAgent();
                this.getAllAgent();
        });
    }


    openAgent(): any {
        const dialogRef = this.matDialog.open(LinkSuperAgentComponent, this.dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            this.getInstituteAgent();
            this.getAllAgent();
        });
    }

    private getInstituteAgent(): any {
        this.route.queryParams.subscribe(params => {
            // console.log(params);
            this.http.get<any>(`${this.apiUrl + 'instituteAgent/' + params.id}`).subscribe({
                next: data => {
                    this.agentData = (data.data);
                    this.agentCount = data.data.length;
                    this.isLoaded = true;
                    // console.log(data.data);
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });

        });
    }

    updateInstitute(): any {
        this.router.navigate(['institute/add'], {state: {data: this.institute[0]}});
    }
}
