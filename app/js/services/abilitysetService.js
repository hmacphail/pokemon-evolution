module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/abilitysets');
    },
    bulkCreate: function(data) {
      return $http.post('/api/abilitysets/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/abilitysets/' + id);
    },
  }
};
