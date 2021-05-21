import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AgentComponent} from './agent.component';
import {AgentRoutingModule} from './agent-routing';
import { AllAgentComponent } from './all-agent/all-agent.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { ViewAgentComponent } from './view-agent/view-agent.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [AgentComponent, AllAgentComponent, AddAgentComponent, ViewAgentComponent],
  imports: [
    CommonModule,
      AgentRoutingModule,
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
export class AgentModule { }
