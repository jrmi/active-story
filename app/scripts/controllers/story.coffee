'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
.controller 'StoryCtrl', ($scope, stories, $localStorage, $routeParams) ->

  stories.get(_id: $routeParams.storyUid).$promise.then (story)->
    $scope.currentStory = story

  $localStorage.context = {}
