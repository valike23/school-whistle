/// <reference path="../../js/angular.js" />
/// <reference path="../../js/angular-ui-router.js" />
/// <reference path="../../js/utils.js" />

var app = angular.module('course', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '../lib/user/templates/course_home.htm'
    }).
    state('courses', {
        url: '/courses',
        templateUrl: '../lib/user/templates/course_courses.htm'
    }).
    state('courses.home', {
        url: '/',
        templateUrl: '../lib/user/templates/sub_template/courses_home.htm'
    }).
    state('introduction', {
        url: '/summary',
        templateUrl: '../lib/user/templates/summary.htm',
        controller: 'sumCtrl'
    }).
    state('content', {
        url: '/content',
        templateUrl: '../lib/user/templates/content.htm',
        
    }).
    state('content.course', {
        url: '/course_content',
        templateUrl: '../lib/user/templates/sub_template/content.htm'
    }).
     state('content.discussion', {
         url: '/forum',
         templateUrl: '../lib/user/templates/sub_template/forum.htm'
     }).
    
    state('content.info', {
        url: '/course_info',
        templateUrl: '../lib/user/templates/sub_template/info.htm'
    })

    $urlRouterProvider.otherwise('/');
});

app.run(function ($rootScope, $http) {
    $http.get('http://localhost:30/courses-api/courses').then(function (res) {
        $rootScope.courses = res.data
    })

});


app.controller('sumCtrl', function ($rootScope) {
    var myCourse = $rootScope.courses;
    var snews = $('#about'), html = $.parseHTML(myCourse[0].about_course);
    snews.append(html)
})