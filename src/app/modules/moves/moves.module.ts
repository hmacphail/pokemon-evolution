import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MovesRoutingModule } from './moves-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MovesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: []
})
export class MovesModule { }
