var app = angular.module('myApp',[]);
var logged = document.getElementById('logged').style;
	var	notlogged = document.getElementById('notlogged').style; 
	
	
app.run(function($rootScope){
		$rootScope.user = undefined;
		var jsonStrin = sessionStorage.getItem('user');
		
		$rootScope.user = JSON.parse(jsonStrin);
		
			if($rootScope.user == null){
				alert(null);
				
		
		notlogged.display = 'block';
		logged.display = 'none';
		alert('you have to be logged in to view this page');
		location.href = 'http://localhost:30/login';
		
		return;
	};
	
		notlogged.display = 'none';
		logged.display = 'block';
		
		
	});
var data = [{no:1,
			question:'who is the president of USA',
			subject :'current-affairs',
			answer : 'Donald Trump',
			options:[{name :'Donald Trump',
			color:'#007bff'},
			{name :'Hilary Cilton',
			color:'#007bff'},
			{name :'Barack Obama',
			color:'#007bff'},
			{name :'Mike Pence',
			color:'#007bff'}],
			choosen:''},
			{no:2,
			question:'Smallest state in Nigeria according to land mass',
			subject :'current-affairs',
			answer : 'Lagos',
			options:[{name :'Oyo',
			color:'#007bff'},
			{name :'Imo',
			color:'#007bff'},
			{name :'Lagos',
			color:'#007bff'},
			{name :'Sokoto',
			color:'#007bff'}],
			choosen:''},
			{no:3,
			question:'Hurincane Irma hits which US state in 2017',
			subject :'current-affairs',
			answer : 'Florida',
			options:[{name :'Wiscousin',
			color:'#007bff'},
			{name :'Texas',
			color:'#007bff'},
			{name :'Florida',
			color:'#007bff'},
			{name :'Alaska',
			color:'#007bff'}],
			choosen:''},
			{no:4,
			question:'How many moles of oxygen is needed to react with six moles of hydrogen when forming water',
			subject :'Chemistry',
			answer : '3',
			options:[{name :'2',
			color:'#007bff'},
			{name :'4',
			color:'#007bff'},
			{name :'6',
			color:'#007bff'},
			{name :'3',
			color:'#007bff'}],
			choosen:''},
			{no:5,
			question:'The capital city of Bangladesh is ...',
			subject :'Geography',
			answer : 'Dhaka',
			options:[{name :'Nassau',
			color:'#007bff'},
			{name :'Dhaka',
			color:'#007bff'},
			{name :'Vienna',
			color:'#007bff'},
			{name :'Minsk',
			color:'#007bff'}],
			choosen:''}];
			
app.controller('navCtrl',['$scope','$rootScope','$http',function($scope,$http,$rootScope){
		$scope.signout = function(){
			notlogged.display = 'block';
		logged.display = 'none';
		$rootScope.user = undefined;
		
		sessionStorage.removeItem('user');
		alert('good bye');
		location.href = 'http://localhost:30/allnews';
		}
		
	}]);

app.controller('cbt',function($scope){
	var opt;
	var opts;
	$scope.questions = data;
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
	alert('you scored '+ scores + ' out of 5');
	}
	}
	});