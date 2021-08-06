import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main.component';

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
            {path: 'tasks', loadChildren: () => import('../task/task.module').then(m => m.TaskModule)},
            {path: 'leads', loadChildren: () => import('../leads/leads.module').then(m => m.LeadsModule)},
            {path: 'application', loadChildren: () => import('../application/application.module').then(m => m.ApplicationModule)},
            {path: 'contacts', loadChildren: () => import('../contacts/contacts.module').then(m => m.ContactsModule)},
            {path: 'profile-details', loadChildren: () => import('../profile-details/profile-details.module').then(m => m.ProfileDetailsModule)},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule { }