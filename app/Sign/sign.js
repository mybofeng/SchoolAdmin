/**
 * Created by fish on 15/10/23.
 */
'use strict';

angular.module('myApp.sign', ['pickadate','ngRoute', 'NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/sign', {
            templateUrl: 'Sign/sign.html',
            controller: 'signCtrl'
        });
    }])

    .controller('signCtrl', function ($scope, $http,ModalService) {

        $scope.BeginDay = '';
        $scope.ClassName = '';

        $scope.ff = {
            BeginDay : '',
            ClassName : '',
            time: [

                {
                    BeginWeek: '0',
                    EndWeek: '0',
                    BeginSubjectDate: '0',
                    EndSubjectDate: '0',
                    SubjectName: 'Subject',
                    SubjectTeacher: 'teacher',
                    Build: '0',
                    ClassRoom: '0',
                    TodayWeek: '0'
                }
            ]

        }

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 25,
            totalPage: 1
        };

        //增加行数
        $scope.addData = function() {
            var n = $scope.gridOptions.data.length + 1;
            $scope.ff.time.push({
                BeginWeek: "New",
                EndWeek:"New",
                BeginSubjectDate:'0',
                EndSubjectDate:'0',
                SubjectName:'blank',
                SubjectTeacher:'blank',
                Build:'0',
                ClassRoom:'blank',
                TodayWeek:'0'
            });
            console.log($scope.gridOptions.data);
            console.log($scope.gridOptions.data[2])
        };
        //删除数据
        $scope.deldata = function (entity) {

            var i;
            for(i =0; i<$scope.gridOptions.data.length; i++) //n为数组长度
            {
                if($scope.gridOptions.data[i] == entity) //temp为要查找 的元素
                {
                    //alert(i);
                    var j=i+1;
                    $scope.gridOptions.data.splice(i,j);
                }
            }
    }

        //创建表格
        $scope.gridOptions = {
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enableCellEditOnFocus: true,
            showColumnFooter: false,
            useExternalPagination: true,

            columnDefs: [
                {
                    name: '课程名',
                    field: 'SubjectName'
                    //footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click="add()">增加</a></div>'
                },
                {
                    name: '星期',
                    field: 'TodayWeek',
                    cellTemplate: '<select ng-model="row.entity.TodayWeek" style="background-color:white;width: 100%;border-radius: 0;height: 100%;border: 0;"><option value="0">请选择</option><option  value ="1">星期一</option><option value ="2">星期二</option><option value="3">星期三</option><option value="4">星期四</option><option value="5">星期五</option> </select>  '
                },
                {
                    name:'上课时间',
                    field: 'BeginSubjectDate',
                    cellTemplate:'<select ng-model="row.entity.BeginSubjectDate" style="background-color:white;width: 100%;border-radius: 0;height: 100%;border: 0;"><option value="0">请选择</option><option value="8:10">第一节</option><option value="10:10">第三节</option><option value="14:30">第五节</option><option value="19:00">第八节</option><option value="14:30">中午4节开始上课</option><option value="18:30">晚上4节开始上课</option></select>'

                },
                {
                    name:'下课时间',
                    field: 'EndSubjectDate',
                    cellTemplate:'<select ng-model="row.entity.EndSubjectDate" style="background-color:white;width: 100%;border-radius: 0;height: 100%;border: 0;"><option value="0">请选择</option><option value="9:50">第二节</option><option value="10:55">第三节</option><option value="11:50">第四节</option><option value="16:10">第六节</option><option value="17:05">第七节</option><option value="20:40">第九节</option><option value="21:40">第十节</option><option value="17:55">中午4节下课</option><option value="21:50">晚上4节下课</option></select>'


                },
                {
                    name:'起始周',
                    field: 'BeginWeek'

                },
                {
                    name:'结束周',
                    field: 'EndWeek'

                },
                {
                    name:'任课老师',
                    field: 'SubjectTeacher'

                },
                {
                    name:'上课地点',
                    field: 'Build',
                    cellTemplate:'<select ng-model="row.entity.Build" style="background-color:white;width: 100%;border-radius: 0;height: 100%;border: 0;"><option value="0">请选择</option><option value="J1">J1</option><option value="J2">J2</option><option value="J3">J3</option><option value="S1">S1</option><option value="S2">S2</option><option value="S3">S3</option><option value="S4">S4</option></select>'


                },
                {
                    name:'具体教室',
                    field: 'ClassRoom'
                },
                {
                    name:'删除',
                    enableCellEdit: false,
                    cellTemplate: '<button class="btn btn-link" style="color: red" ng-click="$event.stopPropagation();grid.appScope.deldata(row.entity)">删除</button>'
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
                    //loaction();
                    //console.log(time)
                });
                $scope.gridOptions.data = $scope.ff.time;
            }

        }

        $scope.opendateModal = function () {
            ModalService.showModal({
                templateUrl: "Sign/datepick.html",
                controller: "datepickCtrl",
                scope: $scope
            }).then(function (modal1) {
                modal1.element.modal();
                modal1.close.then(function (result) {
                console.log(result);
                    if(result !== ''){
                       $scope.ff.BeginDay = result;
                        console.log($scope.ff.BeginDay)
                    }
                });
            });
        }

        $scope.determinemodal = function () {
            var Fill = 0;
            var n = $scope.gridOptions.data.length;
            console.log("n="+n);
            for(var i=0;i<n;i++){
                if($scope.gridOptions.data[i].BeginWeek == 'New'
                || $scope.gridOptions.data[i].EndWeek == 'New'
                || $scope.gridOptions.data[i].BeginSubjectDate == '0'
                || $scope.gridOptions.data[i].EndSubjectDate == '0'
                || $scope.gridOptions.data[i].SubjectName == 'blank'
                || $scope.gridOptions.data[i].SubjectTeacher == 'blank'
                || $scope.gridOptions.data[i].Build == '0'
                || $scope.gridOptions.data[i].ClassRoom == 'blank'
                || $scope.gridOptions.data[i].TodayWeek == '0'
                || $scope.ff.BeginDay == ''
                || $scope.ff.ClassName == '')
                {
                    Fill = 1;
                    break;
                }
            }
            if(Fill == '1'){
                window.localStorage['ngshow']  = '1';
                ModalService.showModal({
                    templateUrl: "Sign/determinemodal.html",
                    controller: "DetermineCtrl"
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (result) {
                    });
                });
            }else{
                window.localStorage['ngshow'] = '2';
                ModalService.showModal({
                    templateUrl: "Sign/determinemodal.html",
                    controller: "DetermineCtrl"
                }).then(function (modal) {

                    modal.element.modal();
                    modal.close.then(function (result) {
                        if (result == "Yes") {
                            //
                            $http.post(URL + 'ImportSignIn', $scope.ff)
                                .success(function (data) {

                                    if(data=='finish'){
                                        alert("保存成功");
                                        $scope.gridOptions.data.splice(0,100000000);
                                    }else{
                                        alert('保存失败');
                                    }

                                }).error(function (data) {

                                }).finally(function () {

                                });

                        }
                    });
                });
            }
        }
        $scope.myPromise = $http.get(URL + 'ViewCollege', {}).success(function (data) {
            $scope.College = data
        }).error(function (data) {
            alert("服务器错误")
        }).finally(function () {

        });
        $scope.change = function (e) {

            $scope.myPromise = $http.get(URL + 'ViewProfession', {params: {CollegeId: e}})
                .success(function (data) {
                    $scope.Profession = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.change1 = function (e) {
            console.log($scope.Message.ProfessionId)
            $scope.myPromise = $http.get(URL + 'ViewClasses', {params: {ProfessionId: e}})
                .success(function (data) {
                    $scope.Classes = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.myClassName = function(){
            console.log($scope.ClassName)
        }

    })
    .controller('DetermineCtrl',function($scope,close){
        $scope.ngshow = window.localStorage['ngshow'];
        $scope.closeModal = function (result) {
            window.localStorage['ngshow'] = '';
            close(result, 500);
        };
    })

