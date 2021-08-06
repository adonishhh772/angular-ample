import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TrackerComponent} from './tracker/tracker.component';
import {AddLeadsComponent} from './add-leads/add-leads.component';
import {LeadsComponent} from './leads.component';
import {CategoryComponent} from './category/category.component';


const routes: Routes = [
    {
        path: '',
        component: LeadsComponent
    } , {
        path: 'tracker',
        component: LeadsComponent
    } , {
        path: 'add',
        component: AddLeadsComponent
    }, {
        path: 'category',
        component: CategoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LeadsRoutingModule { }