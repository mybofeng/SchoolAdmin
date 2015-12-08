(function() {

	'use strict';

	var app = angular.module('cipchk', []);

	app.directive('downFile', ['$http', function($http) {
		return {
			restrict: 'A',
			scope: {
				httpType: '@',
				fileName: '@',
				httpData: '='
			},
			link: function(scope, element, attr) {
				var ele = angular.element(element);
				ele.on('click', function(e) {
					ele.prop('disabled', true);
					e.preventDefault();

					var isPost = scope.httpType && scope.httpType.toLowerCase() === 'post',
						reqParam = {
							method: isPost ? 'POST' : 'GET',
							url: attr.downFile,
							responseType: 'arraybuffer'
						};
					if (isPost)
						reqParam.data = scope.httpData;
					else
						reqParam.params = scope.httpData;

					$http(reqParam).success(function(data, status, headers) {
						ele.prop('disabled', false);
						var type;
						switch (attr.downFileType) {
							case 'xlsx':
								type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
								break;
							case 'txt':
								type = 'text/plain;charset=utf-8';
								break;
							default:
								throw '无效类型';
								break;
						}
						saveAs(new Blob([data], {
							type: type
						}), decodeURI(attr.fileName || headers()["x-filename"]));
					}).error(function(data, status) {
						ele.prop('disabled', false);
					});
				});
			}
		};
	}]);

})();