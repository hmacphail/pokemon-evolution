module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/pokemon');
    },
    getById: function(id) {
      return $http.get('/api/pokemon/' + id)
    },
    bulkCreate: function(data) {
      return $http.post('/api/pokemon/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/pokemon/' + id);
    },
  }
};
