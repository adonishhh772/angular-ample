import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HeaderComponent} from './header/header.component';



@NgModule({
    declarations: [HeaderComponent],
    imports: [
        MatIconModule,
        MatToolbarModule,
        CommonModule
    ],
    exports: [HeaderComponent]
})
export class ComponentModule { }
