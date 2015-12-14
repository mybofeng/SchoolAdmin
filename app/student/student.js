/**
 * Created by yuguihu on 15/7/23.
 */


angular.module('myApp.student', ['pickadate','ngRoute', 'NewfileDialog', 'datePicker', 'angularModalService', 'ngFileUpload', 'cgBusy', 'ngRoute', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.treeView', 'ui.grid.selection', 'ui.grid.pagination'])

    .config(['$routeProvider','$httpProvider', function ($routeProvider,$httpProvider) {

        $routeProvider.when('/student', {
            templateUrl: 'student/student.html',
            controller: 'studentCtrl'
        });
        $httpProvider.defaults.withCredentials = true;
    }])
    .controller('studentCtrl', function ($scope, $http,ModalService) {
        //
        if(window.localStorage['Purview'] == '4'){
            alert('不好意思，您的权限不够');
            window.location.href='index.html';
        }else{
            $scope.Message = {
                CollegeId: '',
                ProfessionId: '',
                ClassId: '',
                TeacherId: window.localStorage['TeacherId']
            }
            $scope.College = '';
            $scope.Profession = '';
            $scope.Classes ='';
            $scope.Student ='';

            var paginationOptions = {
                pageNumber: 1,
                pageSize: 25,
                totalPage: 1
            };


            $scope.delDoctor = function (entity) {
                //
                //
                console.log(entity._id + 'dsfsd');
                $scope.myPromise = $http.delete(URL+'DeleteStudent', {params:{StudentId: entity._id}}).success(function (data) {
                    //
                    $http.get(URL+'ViewStudents', {params: {ClassId: window.localStorage['DeleteId']}})
                        .success(function (data) {
                            $scope.gridOptions.data = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });

                }).error(function (data) {

                });
                //
            }

            $scope.gridOptions = {
                paginationPageSizes: [25, 50, 75],
                paginationPageSize: 25,
                enableCellEditOnFocus: true,
                showColumnFooter: true,
                useExternalPagination: true,
                columnDefs: [
                    {
                        name: '学号',
                        field: 'Number',
                        footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                    },
                    {
                        name: '姓名',
                        field: 'StudentName',
                        footerCellTemplate: '<div class="ui-grid-cell-contents" ng-click="" ><a ng-click=" $event.stopPropagation();grid.appScope.add()">增加</a></div>'
                    },

                    {
                        name: '头像',
                        cellTemplate: '<img width="30" height="30" ng-src="http://huyugui.eicp.net:4343/images/{{row.entity.Photo}}">'

                    },
                    {
                        name: '性别',
                        field: 'Sex'

                    },
                    {
                        name: '删除',
                        cellTemplate: '<a ng-if="row.entity.$$treeLevel != 0" class="btn" ng-click="$event.stopPropagation();grid.appScope.delDoctor(row.entity)">删除</a>'
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

                    });
                }
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
            $scope.change2 = function (e) {
                window.localStorage['DeleteId'] = e;
                console.log($scope.Message.ClassId)
                $scope.myPromise = $http.get(URL+'ViewStudents', {params: {ClassId: e}})
                    .success(function (data) {
                        $scope.gridOptions.data = data;
                    }).error(function (data) {

                    }).finally(function () {

                    });
            }
            $scope.add = function () {
                ModalService.showModal({
                    templateUrl: "student/addstudent.html",
                    controller: "addstudentCtrl",
                    scope: $scope
                }).then(function (modal) {
                    //$scope.datemodal = modal;
                    modal.element.modal();
                    modal.close.then(function (result) {
                        console.log(result)

                    });
                });
            }
            $scope.modify = function () {
                ModalService.showModal({
                    templateUrl: "student/modifystudent.html",
                    controller: "modifystudentCtrl",
                    scope: $scope
                }).then(function (modal) {
                    //$scope.datemodal = modal;
                    modal.element.modal();
                    modal.close.then(function (result) {
                        console.log(result)
                        $http.post(URL+'AddStudent', result)
                            .success(function (data) {
                                alert("保存成功")

                            }).error(function (data) {

                            }).finally(function () {

                            });
                    });
                });
            }
        }


        //
    })
    .controller('addstudentCtrl',function($scope,close,$http){

        $scope.StudentMess = {
            Classes:'',
            Colleges:'',
            FatherPhone:'',
            ID_card:'',
            MotherPhone:'',
            Native:'',
            Number:'',
            Phone:'',
            Professions:'',
            QQ:'',
            Sex:'',
            StudentName:'',
            Dorm:'',
            ClassTeacher:window.localStorage['TeacherId']
        }
        $scope.College = '';
        $scope.Profession = '';
        $scope.Classes ='';
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
            $scope.myPromise = $http.get(URL+'ViewClasses', {params: {ProfessionId: e}})
                .success(function (data) {
                    $scope.Classes = data;
                }).error(function (data) {

                }).finally(function () {

                });
        }


        $scope.closeModal1 = function (result) {
            if(result.StudentName == '' ||
                result.Sex == '' ||
                result.Classes == '' ||
                result.Colleges == '' ||
                result.FatherPhone == '' ||
                result.ID_card == '' ||
                result.MotherPhone == '' ||
                result.Native == '' ||
                result.Number == '' ||
                result.Phone == '' ||
                result.Profession == '' ||
                result.QQ == '' ||
                result.Dorm == ''
            ){
                alert("请完善信息再提交")
            }else{
                $http.post(URL+'AddStudent', result)
                    .success(function (data) {
                        alert(data)
                    }).error(function (data) {

                    }).finally(function () {

                    });
            }

        };
    })
    .controller('modifystudentCtrl',function($scope,close,$http){
        $scope.ff = true;
        $scope.kk = false;
        $scope.College = '';
        $scope.Profession = '';
        $scope.Classes ='';
        $scope.Findstudent = {
            Number:''
        }
        $scope.student = ''
        $scope.findstudent = function (e) {

            $scope.myPromise = $http.get(URL+'FindStudent', {params: {Number: e.Number}})
                .success(function (data) {
                    $scope.student = data;
                    $scope.ff = false;
                    $scope.kk = true;
                    $scope.myPromise = $http.get(URL+'ViewProfession', {params: {CollegeId: $scope.student.Colleges._id}})
                        .success(function (data) {
                            $scope.Profession = data;
                        }).error(function (data) {

                        }).finally(function () {

                        });

                        $scope.myPromise = $http.get(URL+'ViewClasses', {params: {ProfessionId: $scope.student.Professions._id}})
                            .success(function (data) {
                                $scope.Classes = data;
                            }).error(function (data) {

                            }).finally(function () {

                            });

                }).error(function (data) {
                    alert("输入的学号不对")
                }).finally(function () {

                });
        }

        $scope.myPromise = $http.get(URL+'ViewCollege', {}).success(function (data) {
            $scope.College = data
        }).error(function (data) {
            alert("服务器错误")
        }).finally(function () {

        });



        //修改方法

        $scope.modify = function (e) {

            switch (e) {
                case 1:
                        $scope.myPromise = $http.put(URL+'UpdateStudent', {

                            id: $scope.student._id,
                            val: $scope.student.StudentName,
                            tag: "StudentName"

                        })
                            .success(function (data) {
                                alert(data)
                            }).error(function (data) {

                            });

                case 2:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.Number,
                        tag: "Number"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 3:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.QQ,
                        tag: "QQ"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 4:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.Phone,
                        tag: "Phone"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 5:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.ClassTeacher,
                        tag: "ClassTeacher"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 6:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.Dorm,
                        tag: "Dorm"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 7:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.FatherPhone,
                        tag: "FatherPhone"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 8:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.MotherPhone,
                        tag: "MotherPhone"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 9:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.Native,
                        tag: "Native"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

                case 10:
                    $scope.myPromise = $http.put(URL+'UpdateStudent', {

                        id: $scope.student._id,
                        val: $scope.student.ID_card,
                        tag: "ID_card"

                    })
                        .success(function (data) {

                        }).error(function (data) {

                        });

            }

        }
        $scope.closemodel = function (result) {
            close(result, 500);
        };
    })