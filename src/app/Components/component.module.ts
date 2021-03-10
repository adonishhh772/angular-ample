import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
    declarations: [HeaderComponent, ProfileComponent],
    imports: [
        MatIconModule,
        MatToolbarModule,
        CommonModule
    ],
    exports: [HeaderComponent, ProfileComponent]
})
export class ComponentModule { }
