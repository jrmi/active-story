'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
  .controller 'MainCtrl', ($scope, $routeParams, $localStorage) ->
    if $routeParams.pageName?
      $scope.pageName = $routeParams.pageName
    else
      $scope.pageName = 'start'

    $scope.editMode = false

    $scope.$localStorage = $localStorage

    $scope.newPage = () ->
      $localStorage['page__' + $scope.pageName] = "#Default text. \nReplace me..."
      $scope.editMode = true
