var DataStore = {

  getAllGenerations(Generations) {
    return Generations.get().then(function(res){
      return res.data;
    });
  },


}

module.exports = DataStore;