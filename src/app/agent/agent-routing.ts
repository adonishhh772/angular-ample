import {NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AgentComponent} from './agent.component';
import {ViewAgentComponent} from './view-agent/view-agent.component';
import {AddAgentComponent} from './add-agent/add-agent.component';
import {AllAgentComponent} from './all-agent/all-agent.component';

const routes: Routes = [
    {
        path: '',
        component: AgentComponent
    },
    {path: 'all', component: AllAgentComponent},
    {path: 'add', component: AddAgentComponent},
    {path: 'view', component: ViewAgentComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgentRoutingModule { }