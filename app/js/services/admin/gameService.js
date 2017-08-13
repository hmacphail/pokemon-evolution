module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/games');
    },
    create: function(data) {
      return $http.post('/api/games', data);
    },
    delete: function(id) {
      return $http.delete('/api/games/' + id);
    }
  }
};
