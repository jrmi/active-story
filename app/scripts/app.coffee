'use strict'

###*
 # @ngdoc overview
 # @name activeStoryApp
 # @description
 # # activeStoryApp
 #
 # Main module of the application.
###
angular
.module('activeStoryApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
.config ($routeProvider) ->
  $routeProvider
  .when '/',
    templateUrl: 'views/stories.html'
    controller: 'StoryListCtrl'
  .when '/story/:storyUid/edit/',
    templateUrl: 'views/story.html'
    controller: 'StoryCtrl'
  .when '/story/:storyUid/page/:pageName',
    templateUrl: 'views/page.html'
    controller: 'MainCtrl'
  .otherwise
      redirectTo: '/'

