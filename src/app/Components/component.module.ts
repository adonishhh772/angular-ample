import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {HeaderComponent} from './header/header.component';



@NgModule({
    declarations: [HeaderComponent],
    imports: [
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatSidenavModule,
        CommonModule
    ],
    exports: [HeaderComponent]
})
export class ComponentModule { }
