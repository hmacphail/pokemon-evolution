module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/effectiveness');
    },
    create: function(data) {
      return $http.post('/api/effectiveness', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/effectiveness/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/effectiveness/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/effectiveness/' + id);
    },
  }
};
