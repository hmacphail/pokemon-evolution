module.exports = function ($scope, Generations) {

    $scope.formData = {};

    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    Generations.get().then(function(res){
        $scope.generations = res.data;
    });

    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    $scope.createGen = function() {
        // call the create function from our service (returns a promise object)
        Generations.create($scope.formData)
            // if successful creation, call our get function to get all the new todos
            .then(function(res) {
                if (res.status == 200) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    console.log($scope.generations);
                    $scope.generations.push(res.data); // assign our new list of todos
                    console.log(res);
                }
            });
    };

    // DELETE ==================================================================
    // delete a todo after checking it
    $scope.deleteGen = function(id) {
        Generations.delete(id)
            // if successful creation, call our get function to get all the new todos
            .then(function(res) {
                $scope.generations = res.data; // assign our new list of todos
            });
    };
  };
