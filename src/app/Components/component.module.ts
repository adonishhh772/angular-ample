import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { TasksComponent } from './tasks/tasks.component';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import { EventsComponent } from './events/events.component';
import { RecentComponent } from './recent/recent.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import { DialogComponent } from './dialog/dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { UploadDocumentComponent } from './upload-document/upload-document.component';



@NgModule({
    declarations: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent, DialogComponent, UploadDocumentComponent],
    imports: [
        MatIconModule,
        MatBadgeModule,
        MatToolbarModule,
        CommonModule,
        MatSelectModule,
        MatCardModule,
        MatStepperModule,
        MatButtonModule,
        MatTreeModule,
        MatProgressSpinnerModule,
    ],
    exports: [HeaderComponent, ProfileComponent, TasksComponent, EventsComponent, RecentComponent, DialogComponent]
})
export class ComponentModule { }
