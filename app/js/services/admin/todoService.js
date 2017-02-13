module.exports = function($http) {
    return {
      get: function() {
        return $http.get('/api/generations');
      },
      create: function(data) {
        return $http.post('/api/generations', data);
      },
      delete: function(id) {
        return $http.delete('/api/generations/' + id);
      }
    }
  };
