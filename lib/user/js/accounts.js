var myApp = angular.module('accounts',['schoolnode.factory']);
myApp.controller('loginCtrl',function($scope, $http, AUTHfactory){
	$scope.submit = function(){
		alert($scope.password,$scope.password);
		user ={
			username:'',
			password:'',
			mode:'login'
		};
		user.username = $scope.username;
		user.password = $scope.password;
		$http.post('http://localhost:30/api/user',user).then(function(res){
			
			if (res.data == ''){
				alert('username or password incorrect');
				return;
			}
			
			
			var test = res.data[0];
			alert(test.id)
			AUTHfactory.setSessionUser(test);
			location.href = 'http://localhost:30/#/'
	
	
});
	}
});