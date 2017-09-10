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

  // TODO: Send errors instead of null, then use try/catch?

  //====== Get Data Object from ID =======
  getPokemonNameById(pokemonId) {
    if (this.pokemon) {
      for (let i = 0; i < this.pokemon.length; i++){
        if (this.pokemon[i].id == [pokemonId]){
          return this.pokemon[i].name + (this.pokemon[i].form == 'alolan' ? '*' : '');
        }
      }
    }
    return null;
  }

  getAbilityNameById(abilityId) {
    if (this.abilities) {
      for (let i = 0; i < this.abilities.length; i++){
        if (this.abilities[i].id == [abilityId]){
          return this.abilities[i].name;
        }
      }
    }
    return null;
  }

  getItemNameById(itemId) {
    if (this.items) {
      for (let i = 0; i < this.items.length; i++){
        if (this.items[i].id == [itemId]){
          return this.items[i].name;
        }
      }
    }
    return null;
  }


  //====== Get ID from Name =======
  getGenerationIdByName(generationName) {
    if (this.generations) {
      for (let i = 0; i < this.generations.length; i++){
        if (this.generations[i].name == generationName){
          return this.generations[i].id;
        }
      }
    }
    return null;
  }

  getTypeIdByName(typeName) {
    if (this.types) {
      for (let i = 0; i < this.types.length; i++){
        if (this.types[i].name == typeName){
          return this.types[i].id
        }
      }
    }
    return null;
  }

  getAbilityIdByName(abilityName) {
    if (this.abilities) {
      abilityName = abilityName.replace('*', '');
      for (let i = 0; i < this.abilities.length; i++){
        if (this.abilities[i].name == abilityName){
          return this.abilities[i].id;
        }
      }
    }
    return null;
  }

  getItemIdByName(itemName) {
    if (this.items) {
      for (let i = 0; i < this.items.length; i++){
        if (this.items[i].name == itemName){
          return this.items[i].id
        }
      }
    }
    return null;
  }


  //====== Get/Refresh Data Arrays from Database =======
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