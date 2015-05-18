'use strict';

/**
* ludashiApp Modul
*/

var app = angular.module('ludashiApp', []);

app.controller('MainListCtrl', function($scope, $http, $sce, listService) {
	listService.getList().then(
		function(data){
			$scope.listData  = data;
		},
		function(err){
			console.log(err);
		});
});

app.service('listService', ['$http', '$q', 'BaseUrl', function($http, $q, BaseUrl){
	var base_url = BaseUrl;
	var part_url = '/html/gndy/dyzz/index.html';
	var replace_token = '/html/article';
	this.getList = function(){
		var deferred = $q.defer();
		$http.get(base_url + part_url).success(function(data){
			// var jq = angular.element(data);
			// var dataList = jq.find("div")[1].children[0].innerHTML;

			// var dataList = $("div>ul>table>tbody>tr>td>a", data);
			// get ... <a href="/11/">音乐歌舞题材电影</a>

			var dataList = $("div>ul>table>tbody>tr>td>b>a", data);

			// console.log(dataList);

			var returnItemList = [];
			for (var i = 0; i < dataList.length; i++) {
				var nodeStr = dataList[i];
				// console.log(nodeStrtab, typeof(nodeStr));
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

app.service('getDownloadLinkService', ['$http', '$q', function($http, $q){
	this.getDownloadLink = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(data){
			// console.log(data);
			var downloadLink = $("div>div>ul>div>table>tbody>tr>td>a", data);
			
			if(downloadLink.length > 1) {
				// console.log('before:' , downloadLink);
				downloadLink = downloadLink.slice(-1); 
				// console.log('after:' , downloadLink);

			}

			deferred.resolve(downloadLink.text());

		}).error(function(err){
			console.log(err);
			deferred.reject(err);
		})
		return deferred.promise;
	}
}])

app.directive('onekeyDownload',function(BaseUrl, getDownloadLinkService){
	// Runs during compile
	return {
		scope: {
			url: '@'
		}, 
		controller: function($scope, $element, $attrs) {
			getDownloadLinkService.getDownloadLink($scope.url).then(function(data){
				$scope.link = data;
			},function(err){
				console.log(err);
			})
		},
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<a ng-href="{{ link }}">{{link}}</a>',
		// template: '<div ng-repeat="pic in pics">{{pic.url}}</div>'
		//replace: true // 报错：(evaluating 'element.setAttribute(name, value)'
	};
});

app.constant('BaseUrl', 'http://www.dy2018.com');