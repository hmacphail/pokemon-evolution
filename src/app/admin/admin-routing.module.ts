import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
    {
        path: "admin/abilities",
        component: AbilitiesComponent,
    },
    {
        path: "admin/abilitysets",
        component: AbilitysetsComponent,
    },
    {
        path: "admin/effectiveness",
        component: EffectivenessComponent,
    },
    {
        path: "admin/evolutions",
        component: EvolutionComponent,
    },
    {
        path: "admin/games",
        component: GamesComponent,
    },
    {
        path: "admin/generations",
        component: GenerationsComponent,
    },
    {
        path: "admin/items",
        component: ItemsComponent,
    },
    {
        path: "admin/learnsets",
        component: LearnsetsComponent,
    },
    {
        path: "admin/moves",
        component: MovesComponent,
    },
    {
        path: "admin/pokemon",
        component: PokemonComponent,
    },
    {
        path: "admin/types",
        component: TypesComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
