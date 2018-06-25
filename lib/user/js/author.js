/// <reference path="factory.js" />
/// <reference path="../../js/angular-ui-router.js" />
var app = angular.module('user', ['ui.router', 'schoolnode.factory']);


app.run(function ($rootScope, $http, AUTHfactory) {
    if (AUTHfactory.isLoggedIn() == false) {
        alert('you got to be logged in');
        location.href = 'http://localhost:30/#/Login';
    }
    if (AUTHfactory.isAuthorizedAuthor() == false) {
        alert('you not authorized to view this page');
        location.href = 'http://localhost:30';
    }
    var user = AUTHfactory.getSessionUser();
    $rootScope.user = user;
    $http.get('http://localhost:30/api/anews/' + user.id).then(function (response) {
        $rootScope.news = response.data;

    });
    $http.get('http://localhost:30/api/schools').then(function (res) {
        $rootScope.schools = res.data;
    });
    $http.get('http://localhost:30/api/notifications/' + user.id).then(function (res) {
        $rootScope.notifications = res.data;
        console.log(res.data)
    });
    $http.get('http://localhost:30/api/messages/' + user.id).then(function (res) {
        $rootScope.messages = res.data;
        console.log(res.data)
    })
   
});



app.config(function ($stateProvider) {
    $stateProvider.state('user', {
    url: '/user',
    templateUrl: '../lib/user/templates/client_user.htm',
    abstract: true
}).
state('profile', {
    url: '/profile',
    templateUrl: '../lib/user/templates/sub_template/profile.htm'

}).
state('user.page', {
    url: '/page',
    templateUrl: '../lib/user/templates/sub_template/user_page.htm'

}).
    state('mail', {
        url: '/mailBox',
        templateUrl: '../lib/user/templates/sub_template/messages.htm',
        controller: 'msgCtrl',
        resolve: {
            messages: function ($http, $rootScope) {
                $http.get('http://localhost:30/api/messages').then(function (res) {
                    $rootScope.msg = res.data;
                });

            }
        },
        abstract: true
    }).
    state('mail.inbox', {

        url: '/read',
        templateUrl: '../lib/user/templates/sub_template/read.htm'

    }).
     state('mail.send', {

         url: '/compose',
         templateUrl: '../lib/user/templates/sub_template/send.htm'

     }).
    state('user.message.main', {


        templateUrl: '../lib/user/templates/sub_template/main.htm'

    }).
    state('user.friends', {

        url: '/friends',
        templateUrl: '../lib/user/templates/sub_template/friends.htm'

    }).
   
    state('news', {
        abstract: true,
    }).
    state('news.compose', {
        url: '/compose_news',
        templateUrl: '../lib/user/templates/news.htm',
        controller: 'newsCtrl'
    }).
    
    state('news.manage', {
        url: '/manage_news',
        templateUrl: '../lib/user/templates/all_news.htm',
        
    })
});

// controllers

app.controller('msgCtrl', function (messages) {


});

app.controller('navCtrl', function ($scope, $rootScope, $http, $state) {
    // if logOut button is clicked this function will run
    $scope.signout = function () {
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

app.controller('sidebarCtrl', function ($scope, AUTHfactory, $state) {
    $scope.author = AUTHfactory.isAuthorizedAuthor();
})






app.controller('loginCtrl', function ($scope, APIfactory, AUTHfactory, NAVfactory) {
    $scope.submit = function () {
        user = {
            username: '',
            password: '',
            mode: 'login'
        };
        user.username = $scope.username;
        user.password = $scope.password;
        APIfactory.send('http://localhost:30/api/user', user).then(function (res) {

            if (res.data == '') {
                alert('username or password incorrect');
                return;
            }


            var currentUser = res.data[0];


            AUTHfactory.setSessionUser(currentUser);
            var url = NAVfactory.getURL()
            location.href = url;


        });
    }
});

app.controller('cbtCtrl', function ($scope, APIfactory) {
    APIfactory.get('http://localhost:30/api/cbt').then(function (res) {

        if (res.data) {
            $scope.questions = res.data;
        }





    });
    var opt;
    var opts;

    $scope.set = function (current) {
        $scope.data = current;
        $scope.fix = function (option) {
            current.choosen = option.name;
            opts = current.options;
            for (var i = 0 ; i < opts.length; i++) {
                opts[i].color = 'blue'
            }

            option.color = '#007b00'

        }
    }
    var scores = 0;

    $scope.submit = function () {
        var test = confirm('are you sure you want to submit');
        if (test) {
            for (var i = 0 ; i < $scope.questions.length; i++) {
                var work = $scope.questions[i];


                if (work.answer == work.choosen) {
                    scores = scores + 1;
                    for (var j = 0 ; j < work.options.length; j++) {
                        var opt = work.options[j];
                        if (opt.name == work.answer) {

                            opt.color = '#ff6b10'
                        }
                    }
                }
                else {
                    for (var j = 0 ; j < work.options.length; j++) {
                        var opt = work.options[j];

                        if (opt.name == work.choosen) {

                            opt.color = '#ffdd10'
                        }
                        if (opt.name == work.answer) {

                            opt.color = '#ff6b10'
                        }

                    }

                }
            }
            alert('you scored ' + scores + ' out of ' + $scope.questions.length);
        }
    }
});



app.controller('regCtrl', function ($scope, $http, $location) {
    var user = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        userName: '',
        password: '',
        mode: 'register'
    };
    $scope.submit = function () {
        user.firstName = $scope.firstName;
        user.lastName = $scope.lastName;
        user.email = $scope.email;
        user.phone = $scope.phone;
        user.userName = $scope.userName;
        user.password = $scope.password;
        $http.post('http://localhost:30/api/user', user).then(function (res) {
            alert('user created');
            location.href = 'http://localhost:30/#/Login'

        });
    }

});


app.controller('errorCtrl', function ($scope, $http, $location) {

});
app.controller('homeCtrl', function ($scope, $http, $location, $interval, $rootScope) {
    /*
it seems like the controller loads before the response object interval app.run()
is available making it impossible to handle it. A need to delay the function
execution was necccesary so an angular $interval was used to execute every 3 
secs 4 times to ensure that we keep on checking checking when the AJAX promise
would be ready
*/
    $interval(function () {


        $scope.snews = $rootScope.news[4];
        var news = $rootScope.news;
        $scope.newsone = news[2];
        $scope.newstwo = news[3];
        $scope.newsthree = news[6];

    }, 2000, 4);

    // if logOut button is clicked this function will run
    $scope.signout = function () {
        notlogged.display = 'block';
        logged.display = 'none';
        $rootScope.user = undefined;

        sessionStorage.removeItem('user');

    };

    $scope.currentNews = function (news) {
        
        var strngNews = JSON.stringify(news);
        
        sessionStorage.setItem("quiz", strngNews);
        location.href = 'http://localhost:30/news';


    };





});
app.controller('chCbtCtrl', function ($scope, $http, $location, $state) {

    $scope.waec = function () {
        alert('navigating to choice page')
        $state.go('choice')
    }


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
})

// controller for create news page
app.controller('newsCtrl', function ($scope, $http, AUTHfactory) {
    var category;
    $scope.newLine = function () {
        $scope.content += " #"
    }
    $scope.schoo = function (school) {
        $scope.mysch = school;
    }

    $scope.showImage = function () {
        var data = document.getElementById('files');
        img = data.files[0];
        var url = URL.createObjectURL(img);
        var image = document.getElementById('image');
        image.src = url;
        
      
    };

    $scope.newLine = function () {
        $scope.content = $scope.content + "</p><p style='text-align: justify;'>"
    }
    $scope.opt = function () {
        if ($scope.test == 'quote') { $scope.content = $scope.content + "<blockquote><p>" }

    }
    $scope.category = function (cat) {
        category = cat;
        

    }
    $scope.submit = function () {
        var con = $scope.content
        if (con[0] != '<') {
            $scope.content = "<p style='text-align: justify;'>" + $scope.content + "</p>"
        }
       

        alert($scope.content)
        blobUtil.blobToDataURL(img).
        then(function (imgstr) {
            
            var datam = {
                title: '',
                content: '',
                image: '',
                category_id: null,
                author_id: null,
                school_id : null
            };
            datam.title = $scope.title;
            datam.content = $scope.content;
            datam.image = imgstr;
            datam.category_id = category;
            datam.author_id = AUTHfactory.getSessionUser().id;
            datam.school_id = $scope.mysch.id;
            datam.summary = $scope.summary;
            

           $http.post('http://localhost:30/api/news',datam).then(function(res){
            	alert('news was successfully created');
            	$scope.content ='';

           }, function () {
               alert('something went wrong')
           })
        })

    }


});
// manage news controller
app.controller('allCtrl', function ($scope, APIfactory) {
   

    $scope.remove = function (singleNews) {
        //not working yet

        var deleteConfirm = confirm('Are you sure you want tp delete this news....'
        + ' Note after delete the news cannot be retrieed again');
        if (deleteConfirm === true) {
            for (var i = 0; i <= news.length; i++) {

                if (news[i].id === singleNews.id) {
                    news.splice(i, 1);

                    $scope.news = news;
                    APIfactory.delete('http://localhost:30/api/news/' + singleNews.id).then(function (res) {
                        var response = res.data;
                        alert(response.message);
                    })

                }

            }
        }


    };
});

