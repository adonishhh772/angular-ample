import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ApplicationComponent} from './application.component';
import {TypesComponent} from './types/types.component';
import {AddComponent} from './add/add.component';
import {TrackerComponent} from './tracker/tracker.component';



const routes: Routes = [
    {
        path: '',
        component: ApplicationComponent
    } , {
        path: 'tracker',
        component: TrackerComponent
    } , {
        path: 'add',
        component: AddComponent
    }, {
        path: 'types',
        component: TypesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApplicationRoutingModule { }