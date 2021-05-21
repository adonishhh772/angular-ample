import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileDetailsComponent} from './profile-details.component';
import {ProfileDetailsRoutingModule} from './profile-details-routing';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [
    CommonModule,
      ProfileDetailsRoutingModule,
      MatButtonModule,
      MatTooltipModule,
      MatIconModule,
      MatInputModule,
      MatRadioModule,
      MatFormFieldModule,
      MatSelectModule,
      MatSnackBarModule,
      FormsModule,
      ReactiveFormsModule
  ]
})
export class ProfileDetailsModule { }
