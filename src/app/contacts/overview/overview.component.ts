import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    @Input() allActivity: any = [];
    @Input() hasActivity: boolean = false;

    constructor(public route: ActivatedRoute, public router: Router, public http: HttpClient) {
    }

    ngOnInit(): void {

    }


}
