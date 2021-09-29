import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JwtModule} from '@auth0/angular-jwt';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {AuthService} from './Services/auth.service';
import {AuthGuard} from './auth.guard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ApplicationTypeService} from './Services/application-type.service';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}



@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatSnackBarModule,
        MatDialogModule,
        CKEditorModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['api.myunistudy.com'],
                disallowedRoutes: ['https://api.myunistudy.com/api/v1/']
                // allowedDomains: ['localhost:3000'],
                // disallowedRoutes: ['http://localhost:3000/api/v1/']
            }
        })

    ],
    exports: [],
    providers: [AuthService, ApplicationTypeService, AuthGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
