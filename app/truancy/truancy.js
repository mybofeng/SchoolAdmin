'use strict';

angular.module('myApp.truancy', ['ngRoute','NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/truancy', {
    templateUrl: 'truancy/truancy.html',
    controller: 'truancyCtrl'
  });
}])

.controller('truancyCtrl', function($scope,$http,$filter) {
        $scope.startdate = '';
        $scope.enddate = '';
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            totalPage: 1
        };

        $scope.gridOptions = {
            paginationPageSizes: [20, 50, 75],
            paginationPageSize: 25,
            enableCellEditOnFocus: true,
            showColumnFooter: true,
            useExternalPagination: true,
            columnDefs: [
                {
                    name: '姓名',
                    field: 'Name'
                    //footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                },
                {
                    name: '旷课次数',
                    field: 'Ctnot'
                    //footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                }


            ],
            onRegisterApi: function (gridApi) {

                gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                    rowEntity[colDef.field] = newValue;
                    //updateDoctor(rowEntity);
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if (paginationOptions.pageSize != pageSize) {
                        paginationOptions.pageNumber = 1;
                        paginationOptions.pageSize = pageSize;
                    } else {
                        paginationOptions.pageNumber = newPage;
                    }
                    loaction();
                });
            }
        }

        var loaction = function () {


            $scope.myPromise = $http.get(URL+'ViewCollege', {}).success(function (data) {
                $scope.College = data
            }).error(function (data) {
                alert("服务器错误")
            }).finally(function () {

            });

            $scope.change = function (e) {
                if($scope.startdate == '' || $scope.enddate == ''){
                    alert("请选择起止日期");
                    $scope.Message.CollegeId = '';
                }else{
                    $scope.myPromise = $http.get(URL+'ViewProfession', {params: {CollegeId: e}})
                        .success(function (data) {
                            console.log(data)
                            $scope.Profession = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });
                    var BeginDay = $filter('date')($scope.startdate, 'yyyy-MM-dd');
                    var EndDay = $filter('date')($scope.enddate, 'yyyy-MM-dd');
                    $scope.myPromise = $http.get(URL+'getAbsenteeismForProfession', {params: {CollegeId: e,BeginDay:BeginDay,EndDay:EndDay}})
                        .success(function (data) {
                            console.log(data)
                            $scope.gridOptions.data = data;

                        }).error(function (data) {

                        }).finally(function () {

                        });
                }


            }
            $scope.change1 = function (e) {
                if($scope.startdate == '' || $scope.enddate == ''){
                    alert("请选择起止日期");
                    $scope.Message.ClassId = '';
                }else{
                    $scope.myPromise = $http.get(URL+'ViewClasses', {params: {ProfessionId: e}})
                        .success(function (data) {
                            console.log(data)
                            $scope.Classes = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });
                    console.log($scope.Message.ProfessionId)
                    var BeginDay = $filter('date')($scope.startdate, 'yyyy-MM-dd');
                    var EndDay = $filter('date')($scope.enddate, 'yyyy-MM-dd');
                    $scope.myPromise = $http.get(URL+'getAbsenteeismForClass', {params: {ProfessionId: e,BeginDay:BeginDay,EndDay:EndDay}})
                        .success(function (data) {
                            console.log(data)
                            $scope.gridOptions.data = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });

                }

            }
            $scope.change2 = function(e){
                if($scope.startdate == '' || $scope.enddate == ''){
                    alert("请选择起止日期");
                    $scope.Message.ClassId = '';
                }else{
                    var BeginDay = $filter('date')($scope.startdate, 'yyyy-MM-dd');
                    var EndDay = $filter('date')($scope.enddate, 'yyyy-MM-dd');
                    $scope.myPromise = $http.get(URL+'getAbsenteeism', {params: {ClassId: e,BeginDay:BeginDay,EndDay:EndDay}})
                        .success(function (data) {
                            console.log(data);
                            $scope.gridOptions.data = data;
                        }).error(function (data) {
                            console.log('服务器错误');
                        }).finally(function () {

                        });
                }

            }
        }
        loaction();
});