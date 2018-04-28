var app = angular.module('allnews',[]);
 var logged = document.getElementById('logged').style;
	var	notlogged = document.getElementById('notlogged').style;
		

app.run(function($rootScope,$http){
	$http.get('http://localhost:30/api/news').then(function(response){
		$rootScope.news = response.data;
		$rootScope.user = undefined;
		var jsonStrin = sessionStorage.getItem('user');
		
		$rootScope.user = JSON.parse(jsonStrin);
		
			if($rootScope.user == null){
			
				
		
		notlogged.display = 'block';
		logged.display = 'none';
		
		return;
	};
	
		notlogged.display = 'none';
		logged.display = 'block';
		
		
	
});
});




app.controller('myCtrl',function($scope, $http,$rootScope,$interval){


	/*
	it seems like the controller loads before the response object interval app.run()
	is available making it impossible to handle it. A need to delay the function
	execution was necccesary so an angular $interval was used to execute every 3 
	secs 4 times to ensure that we keep on checking checking when the AJAX promise
	would be ready
	*/
	$interval(function(){
		
		
		$scope.snews = $rootScope.news[4];
		var news = $rootScope.news;
		$scope.newsone = news[2];
		$scope.newstwo = news[3];
		$scope.newsthree = news[6];
		
	}, 5000,4);	
	
	// if logOut button is clicked this function will run
	$scope.signout = function(){
		notlogged.display = 'block';
		logged.display = 'none';
		$rootScope.user = undefined;
		
		sessionStorage.removeItem('user');
		
	};
	
	$scope.currentNews = function(news){
		alert(news.title);
		var strngNews = JSON.stringify(news);
		alert(strngNews);
		sessionStorage.setItem("quiz",strngNews);
		location.href = 'http://localhost:30/news';
		
		
	};
	
	
	
	
	
});




