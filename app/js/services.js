angular.module('services', [])

    // super simple service
    // each function returns a promise object
    .factory('Generations', ['$http', function($http) {
        return {
            get: function(callback) {
                $http.get('/api/generations').then(function(obj) {
                    callback(obj.data);
                });
            },
            create: function(newData) {
                $http.post('/api/generations', newData).then(function(obj) {
                    console.log(obj);
                });
            },
            delete: function(id) {
                $http.delete('/api/generations/' + id).then(function(obj) {
                    console.log(obj);
                });
            }
        }
    }]);