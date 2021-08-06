import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {

    applicationStatus: any[] = [];
    chuckSize = 5;
    steps = '';
    title = '';
    errorMessage = '';
    isLoaded = false;
    private readonly apiUrl = `${environment.apiUrl}`;

    constructor(private renderer: Renderer2,
                private elRef: ElementRef,
                private _snackBar: MatSnackBar,
                private http: HttpClient,
                private router: Router,
                public route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.http.get<any>(`${this.apiUrl + 'applicationStatus/' + params.id}`).subscribe({
                next: data => {
                    const typeData: any[] = [];
                    if (data.data.length > 0) {
                        this.title = data.data[0].status;
                        this.steps = data.data[0].status;
                    }

                    for (let i = 0; i < data.data.length; i += this.chuckSize) {
                        typeData.push(data.data.slice(i, i + this.chuckSize));
                    }

                    this.applicationStatus = typeData;
                    this.isLoaded = true;
                    // console.log(data.data);
                },
                error: error => {
                    this.errorMessage = error.message;
                }
            });
        });
    }

    changeSteps(menu: string, e: any): void {
        const el = this.elRef.nativeElement.querySelectorAll('.track_viewer');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'active');
        });

        if (e.target.parentElement.className.includes('track_viewer')) {
            e.target.parentElement.className += ' active';
        } else {
            e.target.parentElement.parentElement.className += ' active';
        }
        this.steps = menu;
        this.title = menu;
    }

    goToAddApplication(): any{
        this.router.navigate(['application/add']);
    }


}
