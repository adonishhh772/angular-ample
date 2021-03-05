import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotFoundComponent} from './not-found.component';
import {ComponentModule} from '../Components/component.module';
import {NotFoundRoutingModule} from './not-found-routing';


@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
      ComponentModule,
      NotFoundRoutingModule
  ]
})
export class NotFoundModule { }
