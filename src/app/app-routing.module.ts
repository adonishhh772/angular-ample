import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    },
    { path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
    {path: '**', redirectTo: '404'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
