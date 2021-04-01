import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main.component';
import {BranchAddComponent} from '../branch/branch-add/branch-add.component';
import {AllAgentComponent} from '../agent/all-agent/all-agent.component';
import {AddAgentComponent} from '../agent/add-agent/add-agent.component';
import {ViewAgentComponent} from '../agent/view-agent/view-agent.component';


const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children:[
            {path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule)},
            {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'branch', loadChildren: () => import('../branch/branch.module').then(m => m.BranchModule)},
            {path: 'institute', loadChildren: () => import('../institute/institute.module').then(m => m.InstituteModule)},
            {path: 'agent', loadChildren: () => import('../agent/agent.module').then(m => m.AgentModule)},
            {path: 'profile-details', loadChildren: () => import('../profile-details/profile-details.module').then(m => m.ProfileDetailsModule)},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule { }