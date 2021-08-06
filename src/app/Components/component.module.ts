import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';
import {MatCardModule} from '@angular/material/card';
import { EventsComponent } from './events/events.component';
import { RecentComponent } from './recent/recent.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { UploadDocumentComponent } from './upload-document/upload-document.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    interactionPlugin
]);

@NgModule({
    declarations: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent, DialogComponent, UploadDocumentComponent],
    imports: [
        MatIconModule,
        MatBadgeModule,
        MatToolbarModule,
        CommonModule,
        FullCalendarModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    exports: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent, DialogComponent]
})
export class ComponentModule { }
