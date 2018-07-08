import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PokemonRoutingModule } from './pokemon-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PokemonRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: []
})
export class PokemonModule { }
