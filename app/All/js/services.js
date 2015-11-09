var pencilboxServices = angular.module('pencilboxServices', ['ngResource']);

pencilboxServices.factory('Subjects', ['$resource',
  function($resource){
    return $resource('json/Subjects/:Subject/:Topic.json', {}, {
      query: {method:'GET', isArray:true }
    });
  }]);

pencilboxServices.factory('Apps', ['$resource',
  function($resource){
    return $resource('json/all.json', {}, {
      query: {method:'GET', isArray:true }
    });
  }]);
