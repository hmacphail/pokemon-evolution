module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/evolutions');
    },
    bulkCreate: function(data) {
      return $http.post('/api/evolutions/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/evolutions/' + id);
    },
  }
};
