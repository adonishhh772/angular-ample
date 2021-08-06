import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerComponent } from './tracker/tracker.component';
import { AddLeadsComponent } from './add-leads/add-leads.component';
import {LeadsRoutingModule} from './leads-routing';
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
import {MatTableExporterModule} from 'mat-table-exporter';
import {MatInputModule} from '@angular/material/input';
import {LeadsComponent} from './leads.component';
import { CategoryComponent } from './category/category.component';
import {ContactsModule} from '../contacts/contacts.module';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  declarations: [LeadsComponent, TrackerComponent, AddLeadsComponent, CategoryComponent, DialogComponent],
  imports: [
    CommonModule,
      LeadsRoutingModule,
      MatTableModule,
      MatPaginatorModule,
      MatRadioModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      MatSortModule,
      MatTabsModule,
      MatTooltipModule,
      MatButtonModule,
      ContactsModule,
      MatTableExporterModule,
      MatIconModule,
      MatSlideToggleModule,
      FormsModule,
      MatCardModule,
      ReactiveFormsModule,
      MatCheckboxModule
  ]
})
export class LeadsModule { }
