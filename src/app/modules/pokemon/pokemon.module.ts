import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { PokemonRoutingModule } from './pokemon-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PokemonRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
  ],
  declarations: []
})
export class PokemonModule { }
