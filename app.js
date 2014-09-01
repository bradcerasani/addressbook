var myApp = angular.module('Katz',[]);

var url = "http://now.winnipeg.ca/conStruct/export/?format=json&dataset=http%3A%2F%2Fnow.winnipeg.ca%2Fdatasets%2FProperty_addresses%2F--Property_Addresses&slicesize=500&slice=1";
var sampleResponse = "sample-response.json";

myApp.service('dataService', function($http) {
  $http.defaults.useXDomain = true;
  $http.defaults.withCredentials = true;
  delete $http.defaults.headers.common["X-Requested-With"];
  $http.defaults.headers.common["Accept"] = "application/json";
  $http.defaults.headers.common["Content-Type"] = "application/json";

  this.getData = function(callbackFunc) {
    $http.get(url).success(function(data) {
      var arr = data.resultset.subject;
      var addresses = [];

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].predicate[4]["ns0:assessmentAssessedValue"]) {
          address = arr[i].predicate[0]["iron:prefLabel"];
          price = arr[i].predicate[4]["ns0:assessmentAssessedValue"];
          addresses.push({
            address: address,
            price: Number(price.replace(/[^0-9\.]+/g,""))
          });
        }
      }
      callbackFunc(addresses);
    });
  };
});

myApp.controller('MainController', function($scope, dataService) {
  $scope.data = null;
  dataService.getData(function(dataResponse) {
    $scope.data = dataResponse;
  });
});
