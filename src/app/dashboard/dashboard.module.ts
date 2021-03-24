import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {ComponentModule} from '../Components/component.module';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
      DashboardRoutingModule,
      ComponentModule,
      MatTabsModule
  ],

})
export class DashboardModule { }
