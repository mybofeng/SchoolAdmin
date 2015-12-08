/**
 * Created by fish on 15/10/29.
 */
angular.module('myApp.import', ['ngRoute', 'cipchk', 'NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/import', {
            templateUrl: 'import/import.html',
            controller: 'importCtrl'
        });
    }])
    .controller('importCtrl', function ($scope, $http, fileDialog, Upload) {


        var vm = this;

        vm.gridOptions = {};

        $scope.Message = {
            CollegeId: '',
            ProfessionId: '',
            ClassId: ''
        }
        $scope.myPromise = $http.get(URL+'ViewCollege', {}).success(function (data) {
            $scope.College = data
        }).error(function (data) {
            alert("服务器错误")
        }).finally(function () {

        });
        $scope.change = function (e) {

            $scope.myPromise = $http.get(URL+'ViewProfession', {params: {CollegeId: e}})
                .success(function (data) {
                    $scope.Profession = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.change1 = function (e) {
            console.log($scope.Message.ProfessionId)
            $scope.myPromise = $http.get(URL+'ViewClasses', {params: {ProfessionId: e}})
                .success(function (data) {
                    $scope.Classes = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }
        $scope.classname = function(e){
            window.localStorage['fileClassId']=e;
        }
        $scope.yuan = '';
        $scope.ye = '';

        $scope.changePortait = function () {
            fileDialog.openFile(function (e) {
                var files = e.target.files;
                window.localStorage['files'] = files;
                console.log(e.target.files[0]);
                $scope.myPromise = Upload.upload({
                    url: URL + 'UploadExcel',
                    fields: {'ClassId': window.localStorage['fileClassId']},
                    file: files[0]
                })
                    .progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        if (progressPercentage === 100) {
                            alert("导入成功");
                        }

                    }).success(function (data, status, headers, config) {
                        console.log($scope.Message.ClassId);

                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
            });
        }



        $scope.send = function () {
            if($scope.Message.CollegeId == '' || $scope.Message.ProfessionId == '' || $scope.Message.ClassId == '' || window.localStorage['files'] == ''){
                if($scope.Message.ClassId == ''){
                    alert('请先选择班级')
                }else if( window.localStorage['files'] == ''){
                    alert('请选择xls文件');
                }else{
                    alert('请完善信息再保存')
                }

            }else{
                $http.post(URL + 'AddStudentIntoDB', $scope.Message)
                    .success(function (data) {
                        alert("保存成功")
                        window.localStorage['files'] == '';
                    }).error(function (data) {

                    }).finally(function () {

                    });
            }


        }


    })



