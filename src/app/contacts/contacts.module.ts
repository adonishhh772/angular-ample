import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddContactsComponent } from './add-contacts/add-contacts.component';
import {ContactsComponent} from './contacts.component';
import {ContactsRoutingModule} from './contacts-routing';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [ContactsComponent, AddContactsComponent],
  imports: [
    CommonModule,
      ContactsRoutingModule,
      MatTooltipModule,
      MatSelectModule,
      MatCardModule,
      MatCheckboxModule,
      FormsModule,
      MatRadioModule,
      ReactiveFormsModule,
      MatSlideToggleModule,
      MatTableExporterModule,
      MatIconModule,
      MatButtonModule,
      MatSortModule,
      MatPaginatorModule,
      MatTableModule,
      MatInputModule,
      MatFormFieldModule
  ]
})
export class ContactsModule { }
