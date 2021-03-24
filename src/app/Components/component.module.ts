import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';
import {MatCardModule} from '@angular/material/card';
import { EventsComponent } from './events/events.component';
import { RecentComponent } from './recent/recent.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';



@NgModule({
    declarations: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent],
    imports: [
        MatIconModule,
        MatToolbarModule,
        CommonModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatTreeModule,
    ],
    exports: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent]
})
export class ComponentModule { }
