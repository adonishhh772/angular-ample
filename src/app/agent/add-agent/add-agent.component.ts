import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {AgentService} from '../../Services/agent.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent implements OnInit {
    isSubmitted = false;
    totalAgent = 0;
    invoiceTo = '';
    hidePass = true;
    agent: any;
    isEdit = false;
    isProcessing = false;
    private readonly apiUrl = `${environment.apiUrl}`;
    errorMessage = '';
    country: any[] = [];
    countryName = '';
    branches: any[] = [];
    streetName = '';
    state = '';
    addAgentForm = new FormGroup({
        agent_no: new FormControl(''),
        company_name: new FormControl('', [Validators.required]),
        phoneNo: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        agent_commisson: new FormControl('', [Validators.required, Validators.max(100)]),
        website: new FormControl(''),
        invoice_to: new FormControl(''),
        description: new FormControl(''),
        street: new FormControl(''),
        suburb: new FormControl(''),
        state: new FormControl(''),
        post_code: new FormControl(''),
        country: new FormControl(''),
        branch: new FormControl(''),
    });
  constructor(public router: Router, public http: HttpClient, public agentService: AgentService, private _snackBar: MatSnackBar, private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
      if (history.state.data !== undefined) {
          this.isEdit = true;
          this.agent = history.state.data;
          this.addAgentForm.controls.password.disable();
          this.addAgentForm.controls.password.clearValidators();
      }
      this.getAgentLength();
      this.getBranch();
      this.getCountryInfo();
      this.getAllCountries();
  }

  addAgent(): any{
    this.isSubmitted = true;
      if (!this.addAgentForm.valid) {
          const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
          if (invalidControl.length > 0) {
              invalidControl[0].focus();
          }
          return false;
      }else{
          this.addAgentForm.value.agent_no = (Number(this.totalAgent) + 1);
          this.addAgentForm.value.added_by = localStorage.getItem('userName');
          this.isProcessing = true;
          this.agentService.add(this.addAgentForm.value).pipe(finalize(() => {
              this.isProcessing = false;
          })).subscribe(
              (result) => {
                  // this.assignValuesAgain(result.data);
                  // this.profileName = result.data.name;
                  // this.naviagtionData.push(history.state.data[key]);
                  this._snackBar.open(result.message, '', {
                      duration: 2000,
                  });

                  this.changeNav();
                  // this.editAble = false;
                  this.router.navigate(['/agent/all']);
              },
              (error) => {
                  if (error.error !== undefined) {
                      this._snackBar.open(error.error.msg, '', {
                          duration: 2000,
                      });
                  } else {
                      // this.router.navigate([returnUrl]);
                  }
              }
          );
          // this.changeNav();
      }

  }

    updateAgent(): any {
        this.isSubmitted = true;
        if (!this.addAgentForm.valid) {
            const invalidControl = this.elRef.nativeElement.querySelectorAll('.mat-form-field .ng-invalid');
            if (invalidControl.length > 0) {
                invalidControl[0].focus();
            }
            return false;
        } else {
            this.isProcessing = true;
            this.agentService.updateAgent(this.addAgentForm.value, this.agent._id).pipe(finalize(() => {
                this.isProcessing = false;
            })).subscribe(
                (result) => {
                    this._snackBar.open(result.message, '', {
                        duration: 2000,
                    });

                    this.changeNav();
                    // this.editAble = false;
                    this.router.navigate(['/agent/all']);
                },
                (error) => {
                    if (error.error !== undefined) {
                        this._snackBar.open(error.error.msg, '', {
                            duration: 2000,
                        });
                    } else {
                        // this.router.navigate([returnUrl]);
                    }
                }
            );
        }
    }

    getAgentLength(): any{
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const el = selector.querySelector('.agent_badge');
        this.totalAgent = el.childNodes[0].innerHTML;
  }

    changeNav(): any{
        const selector = this.elRef.nativeElement.parentElement.parentElement.parentElement.parentElement;
        const selected = selector.querySelector('.selected_side_nav').previousSibling;
        const el = selector.querySelectorAll('.menu_item');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'selected_side_nav');
        });
        this.renderer.addClass(selected, 'selected_side_nav');
    }

    get errorControl(): any {

        return this.addAgentForm.controls;
    }

    assignInvoice(): any{
      this.addAgentForm.value.invoice_to = this.addAgentForm.value.company_name;
        this.invoiceTo =  this.addAgentForm.value.company_name;
    }

    private getAllCountries(): any {
        this.http.get<any>('https://restcountries.eu/rest/v2/all').subscribe({
            next: data => {
                this.country = data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getCountryInfo(): any {
        this.http.get<any>('http://ip-api.com/json').subscribe({
            next: data => {
                this.countryName = data.country;
                this.streetName = data.city;
                this.state = data.regionName;
                // this.currentCountry = ;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getBranch(): any {
        this.http.get<any>(this.apiUrl + 'branch/').subscribe({
            next: data => {
                this.branches = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    cancel(): any{
        this.changeNav();
        this.router.navigate(['/agent/all']);
    }

}
