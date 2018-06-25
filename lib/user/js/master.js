/// <reference path="factory.js" />
/// <reference path="../../js/angular-ui-router.js" />
var app = angular.module('master',['ui.router','schoolnode.factory']);
var logged = document.getElementById('logged').style;
	var	notlogged = document.getElementById('notlogged').style;
app.run(function($rootScope,$http, AUTHfactory){
	$http.get('http://localhost:30/api/recent-news').then(function(response){
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


	


app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home',{
		url:'/',
		templateUrl:'../lib/user/templates/home.htm',
		
	}).state('news',{
		url:'/news',
		templateUrl:'../lib/user/templates/login.htm'
		
		
	}).
	state('cbt',{
		url:'/cbt',
		templateUrl: '../lib/user/templates/cbt_home.htm'
		
	}).
	state('Register',{
		url: '/Register',
		templateUrl:'../lib/user/templates/register.htm'
		
	}).
	state('Login',{
		url:'/Login' ,
		templateUrl:'../lib/user/templates/login.htm'
	}).
	state('jamb',{
		url:'/jamb',
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
       

    }).
        state('exam', {

        url: '/exam',
        templateUrl: '../lib/user/templates/CBT.htm',
    }
       
    )
	$urlRouterProvider.otherwise('/');
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

app.controller('cbtCtrl',function($scope,APIfactory, $rootScope){
    // this code ensure that the first question get loaded into the view area...
    // the current variable holds the question that is currently in focus.
    
    var index = 0;
    var text = $rootScope.questions;
    var current = $rootScope.questions[0];
    $scope.data = current;
	var opt;
	var opts;

    //The set function is called when one of the navigation button is clicked	
    //this would set the current question into view


	$scope.set = function (data, numb) {
	    index = numb;
	    current = data;
	    $scope.data = current;
	   
	}

	$scope.prev = function () {
	    if (index > 0) {
	        $scope.set($rootScope.questions[index - 1], index - 1)
	    }
	   
	}
	$scope.next = function () {
	    if (index < text.length -1) {
	        $scope.set($rootScope.questions[index + 1], index + 1)
	    }

	}
    //the function we be called when a option is selected . This function simply 
    //1. Fix into the choosen property of the  current scope question the choosen option that was transferred to the function
    //2. It then intially sets all the color of the options to blue
    //3. sets the cplor of the choosen option to be khaki

	$scope.fix = function (option) {

        
	    current.choosen = option.name;
	    opts = current.options;
	    for (var i = 0 ; i < opts.length; i++) {
	        //blue color
	        opts[i].color = '#4682b4'
	    }
	    //khaki color

	    option.color = '#f0e68c'

	}
	var scores = 0;


    // this function handles the marking and result computation of the quiz
	$scope.submit = function () {
        // confirm if the user truly wanted to submit or it is a mistake
	    var test = confirm('are you sure you want to submit');
        // if the selection was done knowingly then do the below
	if (test){
		for (var i =0 ; i < $scope.questions.length; i++){
			var work = $scope.questions[i];
	
		
		if (work.answer == work.choosen){
			scores = scores + 1;
			for (var j =0 ; j < work.options.length; j++){
					var opt = work.options[j]; 
				if (opt.name == work.answer){
				
					opt.color = '#7cfc00'
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
				
				    opt.color = '#ff6347'
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
	
	
	// if logOut button is clicked this function will run
	$scope.signout = function(){
		notlogged.display = 'block';
		logged.display = 'none';
		$rootScope.user = undefined;
		
		sessionStorage.removeItem('user');
		
	};
	
	$scope.currentNews = function(news){
		
		var strngNews = JSON.stringify(news);
		
		sessionStorage.setItem("quiz",strngNews);
		location.href = 'http://localhost:30/news';
		
		
	};
	$scope.tutorial = function () {
        $state.go('welcome')
	}
	
	
	
	
	
});
app.controller('chCbtCtrl',function($scope,$http,$location,$state, $rootScope){

    $http.get('http://localhost:30/api/subjects').then(function (res) {
        $scope.subjects = res.data;
    });

    $scope.choose = function (subject) {
        $http.get('http://localhost:30/api/cbt').then(function (res) {
            $rootScope.questions = res.data;
            $state.go('exam')
        })

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

