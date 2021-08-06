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
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { OverviewComponent } from './overview/overview.component';
import { DialogComponent } from './dialog/dialog.component';
import { NotesComponent } from './notes/notes.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';




@NgModule({
  declarations: [ContactsComponent,
      AddContactsComponent,
      ViewContactComponent,
      GeneralInfoComponent,
      OverviewComponent, DialogComponent, NotesComponent, PersonalDetailsComponent],
  imports: [
    CommonModule,
      ContactsRoutingModule,
      MatTooltipModule,
      MatSelectModule,
      MatCardModule,
      MatMenuModule,
      MatTabsModule,
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
  ],
    exports: [AddContactsComponent]
})
export class ContactsModule { }
