'use strict';
//var URL = 'http://172.16.20.110:3000/';
//var URL = 'http://192.168.8.4:3000/';
//var URL = 'http://10.0.1.10:3232/';
var URL = 'http://113.31.89.205:3232/';
// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.doctor',
    'myApp.truancy',
    'myApp.version',
    'myApp.sign',
    'myApp.import',
    'myApp.student',
    'myApp.course'

]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view2'});
    }]). constant('SERVER', {
        // Local server
        URL: 'http://113.31.89.204:3030'
        // Public Heroku server
        //url: 'https://ionic-songhop.herokuapp.com'
    })
    .controller("appCtrl", function($scope) {
        $scope.name =  window.localStorage['Name'];
        $scope.quit = function(){
            window.location.href='login.html';
        }
    });


