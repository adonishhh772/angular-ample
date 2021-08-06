import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackerComponent} from './tracker/tracker.component';
import {AddComponent} from './add/add.component';
import {TypesComponent} from './types/types.component';
import {ApplicationRoutingModule} from './application-routing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableExporterModule} from 'mat-table-exporter';
import {MatInputModule} from '@angular/material/input';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import {ApplicationComponent} from './application.component';


@NgModule({
    declarations: [ApplicationComponent, TrackerComponent, AddComponent, TypesComponent, AddDialogComponent],
    imports: [
        ApplicationRoutingModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatMenuModule,
        MatRadioModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatCardModule,
        MatTableExporterModule,
        MatCheckboxModule,
        MatSelectModule,
        MatIconModule,
        MatTooltipModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class ApplicationModule {
}
