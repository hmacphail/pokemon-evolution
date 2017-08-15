module.exports = function($http) {
  return {
    get: function() {
      return $http.get('/api/learnsets');
    },
    create: function(data) {
      return $http.post('/api/learnsets', data);
    },
    bulkCreate: function(data) {
      return $http.post('/api/learnsets/bulk', data);
    },
    update: function(id, data) {
      return $http.put('/api/learnsets/' + id, data);
    },
    delete: function(id) {
      return $http.delete('/api/learnsets/' + id);
    }
  }
};
