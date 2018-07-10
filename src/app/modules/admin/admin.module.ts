import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';

import { AbilitiesComponent } from './abilities/abilities.component';
import { AbilitysetsComponent } from './abilitysets/abilitysets.component';
import { EffectivenessComponent } from './effectiveness/effectiveness.component';
import { EvolutionComponent } from './evolution/evolution.component';
import { GamesComponent } from './games/games.component';
import { GenerationsComponent } from './generations/generations.component';
import { ItemsComponent } from './items/items.component';
import { LearnsetsComponent } from './learnsets/learnsets.component';
import { MovesComponent } from './moves/moves.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { TypesComponent } from './types/types.component';

@NgModule({
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        NgxDatatableModule,
        ReactiveFormsModule,
    ],
    declarations: [
        AdminComponent,
        AbilitiesComponent,
        AbilitysetsComponent,
        EffectivenessComponent,
        EvolutionComponent,
        GamesComponent,
        GenerationsComponent,
        ItemsComponent,
        LearnsetsComponent,
        MovesComponent,
        PokemonComponent,
        TypesComponent,
    ],
})
export class AdminModule { }
