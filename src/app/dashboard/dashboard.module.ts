import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComponentModule} from '../Components/component.module';
import {DashboardComponent} from './dashboard.component';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import {DashboardRoutingModule} from './dashboard-routing';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
      DashboardRoutingModule,
      ComponentModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
  ],

})
export class DashboardModule { }
