angular.module('controllers', [])

    .controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    })

    .controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    })

    .controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
    })

    .controller('todoController', ['$scope', 'Generations', function($scope, Generations) {
        //$scope.formData = {};

        // GET =====================================================================
        // when landing on the page, get all todos and show them
        // use the service to get all the todos
        Generations.get(function(data){
            $scope.generations = data;
        });

        // CREATE ==================================================================
        // when submitting the add form, send the text to the node API
        $scope.createGen = function() {
            // call the create function from our service (returns a promise object)
            Generations.create($scope.formData);
                // if successful creation, call our get function to get all the new todos
                /*.then(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.generations = data; // assign our new list of todos
                });*/
        };

        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.deleteGen = function(id) {
            Generations.delete(id);
                // if successful creation, call our get function to get all the new todos
                /*.success(function(data) {
                    $scope.generations = data; // assign our new list of todos
                });*/
        };
    }]);