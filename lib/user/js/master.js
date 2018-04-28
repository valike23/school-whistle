/// <reference path="factory.js" />
/// <reference path="../../js/angular-ui-router.js" />
var app = angular.module('master',['ui.router','schoolnode.factory']);
var logged = document.getElementById('logged').style;
	var	notlogged = document.getElementById('notlogged').style;
app.run(function($rootScope,$http, AUTHfactory){
	$http.get('http://localhost:30/api/news').then(function(response){
		$rootScope.news = response.data;
		$rootScope.user = undefined;
	
			if(AUTHfactory.isLoggedIn() == false){
			
				
		
	notlogged.display = 'block';
	logged.display = 'none';
		
		return;
};
	$rootScope.user = AUTHfactory.getPermanentUser();
	$rootScope.user = AUTHfactory.getSessionUser();
	notlogged.display = 'none';
	logged.display = 'block';
		
		
	
});
	$http.get('http://localhost:30/api/trending').then(function (res) {
	    $rootScope.trending = res.data;
	})
});


	


app.config(function($stateProvider){
	$stateProvider.state('home',{
		url:'/',
		templateUrl:'../lib/user/templates/home.htm',
		
	}).state('news',{
		url:'/news',
		templateUrl:'../lib/user/templates/login.htm'
		
		
	}).
	state('cbt',{
		url:'/cbt',
		templateUrl:'../lib/user/templates/cbt_home.htm'
		
	}).
	state('Register',{
		url: '/Register',
		templateUrl:'../lib/user/templates/register.htm'
		
	}).
	state('Login',{
		url:'/Login' ,
		templateUrl:'../lib/user/templates/login.htm'
	}).
	state('choice',{
		url:'/choice',
		templateUrl:'../lib/user/templates/choice.htm'

	

}).
state('user',{
	url:'/user',
	templateUrl:'../lib/user/templates/client_user.htm',
	abstract: true
}).
state('user.profile',{
	url:'/profile',
	templateUrl:'../lib/user/templates/sub_template/profile.htm'

}).
state('user.page',{
	url:'/page',
	templateUrl:'../lib/user/templates/sub_template/user_page.htm'

}).
    state('user.message', {
        url: '/message',
        templateUrl: '../lib/user/templates/sub_template/messages.htm',
        controller:'msgCtrl',
        resolve: {
            messages: function ($http, $rootScope) {
                $http.get('http://localhost:30/api/messages').then(function (res) {
                    $rootScope.msg = res.data;
                });
                
            }
        },
        abstract: true
    }).
    state('user.message.read', {
        
        url: '/read',
        templateUrl: '../lib/user/templates/sub_template/read.htm'

    }).
     state('user.message.send', {

         url: '/send',
         templateUrl: '../lib/user/templates/sub_template/send.htm'

     }).
    state('user.message.main', {

        
        templateUrl: '../lib/user/templates/sub_template/main.htm'

    }).
    state('user.friends', {

        url:'/friends',
        templateUrl: '../lib/user/templates/sub_template/friends.htm'

    }).
    state('search', {

        url: '/search_results',
        templateUrl: '../lib/user/templates/search.htm',
        controller: 'searchCtrl'

    }).
    state('welcome', {

        url: '/tutorial_welcome',
        templateUrl: '../lib/user/templates/welcome.htm',
       

    }).state('exam', {

        url: '/exam',
        templateUrl: '../lib/user/templates/CBT.htm',
    }
       
    )
});

app.controller('navCtrl', function($scope,$rootScope, $http ,$state){
		// if logOut button is clicked this function will run
	$scope.signout = function(){
		notlogged.display = 'block';
		logged.display = 'none';
		$rootScope.user = undefined;
		
		sessionStorage.removeItem('user');
		
	};
	$scope.search = function () {
	    $http.get('http://localhost:30/api/search/' + $scope.news_item).then(function (res) {
            alert($scope.news_item)
	        $rootScope.search_results = res.data;
            alert('all went well')
	        $state.go('search');
	    })
	}
});






app.controller('loginCtrl',function($scope, APIfactory,AUTHfactory,NAVfactory){
	$scope.submit = function(){
		user ={
			username:'',
			password:'',
			mode:'login'
		};
		user.username = $scope.username;
		user.password = $scope.password;
		APIfactory.send('http://localhost:30/api/user',user).then(function(res){
			
			if (res.data == ''){
				alert('username or password incorrect');
				return;
			}
			
			
			var currentUser = res.data[0];
		
		
			AUTHfactory.setSessionUser(currentUser);
			
			location.href = 'http://localhost:30/#/';
	
	
});
	}
});

app.controller('cbtCtrl',function($scope,APIfactory){
	APIfactory.get('http://localhost:30/api/cbt').then(function(res){
			
			if (res.data){
				$scope.questions = res.data;
			}
			
			
			
	
	
});
	var opt;
	var opts;
	
	$scope.set = function(current){
		$scope.data = current;
	$scope.fix = function(option){
		current.choosen = option.name;
		 opts = current.options;
	for (var i =0 ; i < opts.length; i++){
		opts[i].color = 'blue'
	}
			
		option.color ='#007b00'
		
	}
	}
	var scores = 0;

	$scope.submit = function(){
	var test =	confirm('are you sure you want to submit');
	if (test){
		for (var i =0 ; i < $scope.questions.length; i++){
			var work = $scope.questions[i];
	
		
		if (work.answer == work.choosen){
			scores = scores + 1;
			for (var j =0 ; j < work.options.length; j++){
					var opt = work.options[j]; 
				if (opt.name == work.answer){
				
					opt.color = '#ff6b10'
				}
			}
		}
		else{
			for (var j =0 ; j < work.options.length; j++){
					var opt = work.options[j]; 
					
				if (opt.name == work.choosen){
				
					opt.color = '#ffdd10'
				}
				if (opt.name == work.answer){
				
					opt.color = '#ff6b10'
				}
				
			}
			
		}
	}
	alert('you scored '+ scores + ' out of ' + $scope.questions.length);
	}
	}
	});



app.controller('regCtrl',function($scope,$http,$location){
	var user = {
		firstName:'',
		lastName:'',
		email:'',
		phone:'',
		userName:'',
		password:'',
		mode:'register'
	};
	$scope.submit = function(){
	user.firstName = $scope.firstName;
	user.lastName = $scope.lastName;
	user.email = $scope.email;
	user.phone = $scope.phone;
	user.userName = $scope.userName;
	user.password = $scope.password;
	$http.post('http://localhost:30/api/user',user).then(function(res){
		alert('user created');
		location.href = 'http://localhost:30/#/Login'
		
	});
	}
	
});


app.controller('errorCtrl',function($scope,$http,$location,$state){
	
});
app.controller('homeCtrl',function($scope,$http,$location,$interval,$rootScope, $state){
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
		
	}, 2000,4);	
	
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
	$scope.tutorial = function () {
        $state.go('welcome')
	}
	
	
	
	
	
});
app.controller('chCbtCtrl',function($scope,$http,$location,$state){

	$scope.waec = function(){
		alert('navigating to choice page')
		$state.go('choice')
	}
	
	
});

app.controller('msgCtrl', function (messages) {


});

app.controller('readCtrl', function ($scope, $state) {
    $scope.trash = function (msg) {
        alert('deleted')
    };
    $scope.read = function (msg) {
        alert('deleted and read');
        $state.go('user.message.main', msg);

    }
});

app.controller('mainCtrl', function (msg) {
    alert(msg)
});
app.controller('searchCtrl', function ($scope, $http, $rootScope) {
    $scope.search = function () {
        $http.get('http://localhost:30/api/search/' + $scope.news_item).then(function (res) {

            $rootScope.search_results = res.data;

        })
    }
});

