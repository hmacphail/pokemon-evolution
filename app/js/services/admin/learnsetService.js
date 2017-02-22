module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/learnsets');
    },
    bulkCreate: function(data) {
      return $http.post('/api/learnsets/bulk', data);
    },
    delete: function(id) {
      return $http.delete('/api/learnsets/' + id);
    }
  }
};
