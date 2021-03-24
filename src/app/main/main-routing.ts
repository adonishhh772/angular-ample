import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main.component';
import {BranchAddComponent} from '../branch/branch-add/branch-add.component';


const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children:[
            {path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule)},
            {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'branch/all', loadChildren: () => import('../branch/branch.module').then(m => m.BranchModule)},
            {path: 'branch/add', component: BranchAddComponent},
            {path: 'profile-details', loadChildren: () => import('../profile-details/profile-details.module').then(m => m.ProfileDetailsModule)},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule { }