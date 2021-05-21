import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableExporterModule} from 'mat-table-exporter';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {TaskRoutingModule} from './task-routing';
import {TaskComponent} from './task.component';


@NgModule({
  declarations: [TaskComponent],
  imports: [
      CommonModule,
      MatBadgeModule,
      TaskRoutingModule,
      MatTableModule,
      MatTooltipModule,
      MatPaginatorModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      MatSortModule,
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
export class TaskModule { }
