'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
.controller 'MainCtrl', ($scope, $routeParams, $localStorage, stories) ->

  $scope.editMode = false
  $scope.$localStorage = $localStorage

  stories.get($routeParams.storyUid).then (story)->
    $scope.currentStory = story
    if $localStorage.currentUid != story.uid
      $localStorage.currentUid = story.uid
      $localStorage.pages = story.pages
      $localStorage.context = {}

  if $routeParams.pageName?
    $scope.pageName = $routeParams.pageName
  else
    $scope.pageName = 'start'

  $scope.newPage = () ->
    $localStorage.pages[$scope.pageName] = "#Default text. \nReplace me..."
    $scope.editMode = true

  $scope.saveStory = () ->
    stories.save()
