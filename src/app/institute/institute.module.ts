import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InstituteRoutingModule} from './institute-routing';
import { AddInstituteComponent } from './add-institute/add-institute.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableExporterModule} from 'mat-table-exporter';
import {InstituteComponent} from './institute.component';
import { ViewInstituteComponent } from './view-institute/view-institute.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { LinkSuperAgentComponent } from './link-super-agent/link-super-agent.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { CoursesComponent } from './courses/courses.component';
import { IntakesComponent } from './intakes/intakes.component';
import { RequirementsComponent } from './requirements/requirements.component';



@NgModule({
  declarations: [InstituteComponent, AddInstituteComponent,
      ViewInstituteComponent, GeneralInfoComponent,
      LinkSuperAgentComponent, DashboardComponent,
      AddDialogComponent, CoursesComponent, IntakesComponent, RequirementsComponent],
  imports: [
    CommonModule,
      InstituteRoutingModule,
      MatTableModule,
      MatPaginatorModule,
      MatRadioModule,
      CKEditorModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      MatSortModule,
      MatTabsModule,
      MatTooltipModule,
      MatButtonModule,
      MatTableExporterModule,
      MatIconModule,
      MatSlideToggleModule,
      FormsModule,
      MatCardModule,
      ReactiveFormsModule,
      MatCheckboxModule
  ]
})
export class InstituteModule { }
