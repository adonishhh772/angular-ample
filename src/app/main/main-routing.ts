import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from './main.component';
import {NotFoundComponent} from '../not-found/not-found.component';


const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children:[
            {path: 'about', loadChildren: () => import('../about/about.module').then(m => m.AboutModule)},
            {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainRoutingModule { }