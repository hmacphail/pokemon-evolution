module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/items');
    },
    create: function(data) {
      return $http.post('/api/items', data);
    },
    delete: function(id) {
      return $http.delete('/api/items/' + id);
    }
  }
};
