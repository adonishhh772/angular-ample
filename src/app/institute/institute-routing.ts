import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InstituteComponent} from './institute.component';
import {AddInstituteComponent} from './add-institute/add-institute.component';
import {ViewInstituteComponent} from './view-institute/view-institute.component';

const routes: Routes = [
    {
        path: 'all',
        component: InstituteComponent
    } , {
        path: 'add',
        component: AddInstituteComponent
    }, {
        path: 'view',
        component: ViewInstituteComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InstituteRoutingModule { }