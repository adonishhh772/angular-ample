import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BranchComponent} from './branch.component';
import {BranchAddComponent} from './branch-add/branch-add.component';

const routes: Routes = [
    {
        path: 'all',
        component: BranchComponent
    },
    {path: 'add', component: BranchAddComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BranchRoutingModule { }