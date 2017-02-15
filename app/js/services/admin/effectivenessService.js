module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/effectiveness');
    },
    bulkCreate: function(data) {
      return $http.post('/api/effectiveness/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/effectiveness/' + id);
    }
  }
};
