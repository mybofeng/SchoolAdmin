'use strict';
//var URL = 'http://172.16.20.110:3000/';
//var URL = 'http://192.168.8.4:3000/';
//var URL = 'http://10.0.1.14:3232/';
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
    config(['$routeProvider','$httpProvider', function ($routeProvider,$httpProvider) {

        $routeProvider.otherwise({redirectTo: '/view2'});
        $httpProvider.defaults.withCredentials = true;
    }]). constant('SERVER', {
        // Local server
        URL: 'http://113.31.89.204:3030'
        // Public Heroku server
        //url: 'https://ionic-songhop.herokuapp.com'
    })

    .controller("appCtrl", function($scope,$http) {
        $scope.name =  window.localStorage['Name'];
        $scope.quit = function(){
            $http.get(URL+'logout',{params: {}})
                .success(function(data){
                    window.location.href='login.html';
                })

        }
    });


