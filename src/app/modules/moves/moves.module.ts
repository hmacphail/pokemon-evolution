import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { MovesRoutingModule } from './moves-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MovesRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
  ],
  declarations: []
})
export class MovesModule { }
