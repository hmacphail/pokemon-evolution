module.exports = class DataStore {
  constructor() {
    this.generations = null;
    this.pokemon = null;
    this.evolutions = null;
    this.types = null;
    this.effectiveness = null;
    this.abilities = null;
    this.abilitysets = null;
    this.moves = null;
    this.learnsets = null;
    this.items = null;
    this.pokemonLearnsets = null;
    this.pokemonTypes = null;
    this.games = null;
  }

  getGenerations(Generations) {
    Generations.get().then((res) => {
      this.generations = res.data;
    });
  }

  getPokemon(Pokemon) {
    Pokemon.get().then((res) => {
      this.pokemon = res.data;
    });
  }

  getEvolutions(Evolutions) {
    Evolutions.get().then((res) => {
      this.evolutions = res.data;
    });
  }

  getTypes(Types) {
    Types.get().then((res) => {
      this.types = res.data;
    });
  }

  getEffectiveness(Effectiveness) {
    Effectiveness.get().then((res) => {
      this.effectiveness = res.data;
    });
  }

  getAbilities(Abilities) {
    Abilities.get().then((res) => {
      this.abilities = res.data;
    });
  }

  getAbilitysets(Abilitysets) {
    Abilitysets.get().then((res) => {
      this.abilitysets = res.data;
    });
  }

  getMoves(Moves) {
    Moves.get().then((res) => {
      this.moves = res.data;
    });
  }

  getLearnsets(Learnsets) {
    Learnsets.get().then((res) => {
      this.learnsets = res.data;
    });
  }

  getItems(Items) {
    Items.get().then((res) => {
      this.items = res.data;
    });
  }

  getPokemonLearnsets(PokemonLearnsets) {
    PokemonLearnsets.get().then((res) => {
      this.pokemonLearnsets = res.data;
    });
  }

  getPokemonTypes(PokemonTypes) {
    PokemonTypes.get().then((res) => {
      this.pokemonTypes = res.data;
    });
  }

  getGames(Games) {
    Games.get().then((res) => {
      this.games = res.data;
    });
  }
};