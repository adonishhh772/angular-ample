import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginRoutingModule} from './login-routing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {LoginComponent} from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
      LoginRoutingModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
  ]
})
export class LoginModule { }
