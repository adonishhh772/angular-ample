import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContactsComponent} from './contacts.component';
import {AddContactsComponent} from './add-contacts/add-contacts.component';


const routes: Routes = [
    {path: 'all', component: ContactsComponent},
    {path: 'add', component: AddContactsComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContactsRoutingModule { }