'use strict';

/**
* ludashiApp Modul
*/

var app = angular.module('ludashiApp', []);

app.controller('MainListCtrl', function($scope, $http, $sce, listService) {
	listService.getList().then(
		function(data){
			// $scope.listData = $sce.trustAsHtml(data); 
			// 当需要把html插入到dom中时要信任此内容才可以，为了安全。

			$scope.listData  = data;
		},
		function(err){
			console.log(err);
		});

});

app.service('listService', ['$http', '$q', 'BaseUrl', function($http, $q, BaseUrl){
	var base_url = BaseUrl;
	var part_url = '/html/part/9.html';
	var replace_token = '/html/article';
	this.getList = function(){
		var deferred = $q.defer();
		$http.get(base_url + part_url).success(function(data){
			// var jq = angular.element(data);
			// var dataList = jq.find("div")[1].children[0].innerHTML;
			var dataList = $("div>ul>li>a", data);
			var returnItemList = [];
			for (var i = dataList.length - 1; i >= 0; i--) {
				var nodeStr = dataList[i];
				// console.log(nodeStr, typeof(nodeStr));
				returnItemList.push(
				{	
					'title': nodeStr.text,
					'url': nodeStr.href.split('file://').join(base_url)

				});
			};
			// console.log(returnItemList);
			deferred.resolve(returnItemList);
		}).error(function(err) {
			deferred.reject(err);
		})

		return deferred.promise;
	}
	
}]);

app.service('getPicsService', ['$http', '$q', function($http, $q){
	this.getPicsList = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(data){
			// console.log(data);
			var returnPicItems = [];
			var dataList = $("div>p>img", data);

			for (var i = dataList.length - 1; i >= 0; i--) {
				var imgTag = dataList[i];
				var img = {
					'url': imgTag.src
				}
				returnPicItems.push(img);
			}

			deferred.resolve(returnPicItems);

		}).error(function(err){
			console.log(err);
			deferred.reject(err);
		})
		return deferred.promise;
	}
}])

app.directive('sexPictures',function(BaseUrl, getPicsService){
	// Runs during compile
	return {
		scope: {
			url: '@'
		}, 
		controller: function($scope, $element, $attrs) {
			getPicsService.getPicsList($scope.url).then(function(data){
				$scope.pics = data;
			},function(err){
				console.log(err);
			})
		},
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div ng-repeat="pic in pics"><img ng-src={{pic.url}}></div>',
		// template: '<div ng-repeat="pic in pics">{{pic.url}}</div>'
		//replace: true // 报错：(evaluating 'element.setAttribute(name, value)'
	};
});

app.constant('BaseUrl', 'http://www.baise888.com');