'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
  .controller 'StoryListCtrl', ($scope, stories, $location) ->
    $scope.stories = []

    stories.query().$promise.then (sts)->
      $scope.stories = sts

    $scope.newStory = ()->
      stories.save({title:'Default'}).$promise.then (st)->
        $location.path('/story/' + st._id + '/edit')

