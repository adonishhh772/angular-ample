import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import { MainComponent } from './main.component';
import {MainRoutingModule} from './main-routing';
import {ComponentModule} from '../Components/component.module';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
      MatIconModule,
      MainRoutingModule,
      MatSidenavModule,
      MatListModule,
      MatBadgeModule,
      MatExpansionModule,
      MatProgressBarModule,
      MatMenuModule,
      MatToolbarModule,
      MatInputModule,
      ComponentModule
  ]
})
export class MainModule { }
