import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BranchComponent} from './branch.component';
import {BranchRoutingModule} from './branch-routing';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BranchAddComponent } from './branch-add/branch-add.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [BranchComponent, BranchAddComponent],
    imports: [
        CommonModule,
        BranchRoutingModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule
    ]
})
export class BranchModule {
}
