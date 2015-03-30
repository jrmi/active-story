'use strict'

###*
 # @ngdoc function
 # @name activeStoryApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the activeStoryApp
###
angular.module('activeStoryApp')
.controller 'MainCtrl', ($scope, $routeParams, $localStorage, stories, pages) ->

  $scope.editMode = false
  $scope.$localStorage = $localStorage

  if $routeParams.pageName?
    $scope.pageName = $routeParams.pageName
  else
    $scope.pageName = 'start'

  stories.get(_id: $routeParams.storyUid).$promise.then (story)->

    $scope.currentStory = story
    if $localStorage.currentUid != story._id
      $localStorage.currentUid = story._id
      $localStorage.context = {}

    $scope.page = null
    pages.query({story: story._id, name: $scope.pageName}).$promise.then (pages)->
      if pages
        $scope.page = pages[0]

  $scope.newPage = () ->
    $scope.page = new pages({
      content: "#Default text. \nReplace me..."
      name: $scope.pageName
      story: $scope.currentStory._id
    })
    $scope.editMode = true


  $scope.switchEditMode = ()->
    if $scope.editMode
      if $scope.page.content
        $scope.page.$save()
      else
        pages.delete($scope.page)

    $scope.editMode = !$scope.editMode
