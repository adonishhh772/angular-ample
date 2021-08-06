import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContactsComponent} from './contacts.component';
import {AddContactsComponent} from './add-contacts/add-contacts.component';
import {ViewContactComponent} from './view-contact/view-contact.component';


const routes: Routes = [
    {path: 'all', component: ContactsComponent},
    {path: 'add', component: AddContactsComponent},
    {path: 'view', component: ViewContactComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContactsRoutingModule { }