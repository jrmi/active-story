'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:AboutCtrl
 # @description
 # # AboutCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
  .controller 'AboutCtrl', ($scope) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
