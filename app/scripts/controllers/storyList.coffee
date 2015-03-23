'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
  .controller 'StoryListCtrl', ($scope, stories) ->
    $scope.stories = stories
