module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon-types');
    },
    create: function(data) {
      return $http.post('/api/pokemon-types', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon-types/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon-types/' + id);
    }
  }
};
