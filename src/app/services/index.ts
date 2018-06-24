import { AbilitiesService } from "./abilities.service";
import { AbilitysetsService } from "./abilitysets.service";
import { EffectivenessService } from "./effectiveness.service";
import { EvolutionService } from "./evolution.service";
import { GamesService } from "./games.service";
import { GenerationsService } from "./generations.service";
import { ItemsService } from "./items.service";
import { LearnsetsService } from "./learnsets.service";
import { MovesService } from "./moves.service";
import { PokemonLearnsetsService } from "./pokemon-learnsets.service";
import { PokemonTypesService } from "./pokemon-types.service";
import { PokemonService } from "./pokemon.service";
import { TypesService } from "./types.service";

export const SERVICES: any[] = [
    AbilitiesService,
    AbilitysetsService,
    EffectivenessService,
    EvolutionService,
    GamesService,
    GenerationsService,
    ItemsService,
    LearnsetsService,
    MovesService,
    PokemonLearnsetsService,
    PokemonTypesService,
    PokemonService,
    TypesService,
];

export * from "./abilities.service";
export * from "./abilitysets.service";
export * from "./effectiveness.service";
export * from "./evolution.service";
export * from "./games.service";
export * from "./generations.service";
export * from "./items.service";
export * from "./learnsets.service";
export * from "./moves.service";
export * from "./pokemon-learnsets.service";
export * from "./pokemon-types.service";
export * from "./pokemon.service";
export * from "./types.service";
