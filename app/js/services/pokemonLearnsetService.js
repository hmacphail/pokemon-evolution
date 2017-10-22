module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon-learnsets');
    },
    create: function(data) {
      return $http.post('/api/pokemon-learnsets', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon-learnsets/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/pokemon-learnsets/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon-learnsets/' + id);
    },
  }
};
