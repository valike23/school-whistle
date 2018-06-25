(function () {
    var app = angular.module('newsPage', ['schoolnode.factory']);
    var logged = document.getElementById('logged').style;
    var notlogged = document.getElementById('notlogged').style;
    app.run(function ($rootScope, AUTHfactory, SSfactory, STRfactory, APIfactory) {
        $rootScope.user = undefined;


        //	var jsonStrin = sessionStorage.getItem('user');
        //	var newsStrng = sessionStorage.getItem('quiz');
        //	$rootScope.news = JSON.parse(newsStrng);
        //	$rootScope.user = JSON.parse(jsonStrin);
        $rootScope.user = AUTHfactory.getSessionUser();
         $rootScope.temp =  SSfactory.get('quiz');
        
         var news = $rootScope.temp
        
        APIfactory.get('http://localhost:30/api/news/' + news.id).then(function (res) {
            var news = res.data;
            $rootScope.news = news
            var snews = $('#newsBody'), html = $.parseHTML(news.content)
            snews.append(html)
            
            console.log(news)
        })
       
       

        
       
        APIfactory.get('http://localhost:30/api/comments/' + news.id).then(function (res) {
            $rootScope.comments = res.data;
        });

        APIfactory.get('http://localhost:30/api/news/' + news.category_id).then(function (res) {

        })


        if ($rootScope.user == null) {



            notlogged.display = 'block';
            logged.display = 'none';

            return;
        };

        notlogged.display = 'none';
        logged.display = 'block';


    });

    // the first controller

    app.controller('myCtrl', ['$scope', 'APIfactory', 'AUTHfactory', '$rootScope', '$http', function ($scope, APIfactory, AUTHfactory, $rootScope, $http) {
        var likedDisliked = false;
        var myNews = $rootScope.temp;
        APIfactory.get('http://localhost:30/api/related/' + myNews.school_id + '/' + myNews.category_id).then(function (res) {
            $rootScope.related = res.data;
        });
        // the code below is for registering every news view
        APIfactory.get('http://localhost:30/views/news/' + myNews.id).then(function (res) {
            console.log(res.data);
            console.log('added to views');
        });

        // the function below registers comments made by only logged in users
        $scope.sendComment = function () {

            if (AUTHfactory.isLoggedIn() === true) {

                var data = {
                    username: AUTHfactory.getSessionUser().username,
                    comment: $scope.comment,
                    newsId: myNews.id
                }

                APIfactory.send('http://localhost:30/api/comment', data).then(function () {
                    alert('comment sent successfully');
                    $scope.comment = '';
                })
                return;
            }
            alert('you have to be logged in first');

        };

        //functions to register likes and dislikes of comment

        $scope.likes = function (comment) {
            if (likedDisliked === true) {
                alert('you have already had your opinion')
                return;
            }
            if (AUTHfactory.isLoggedIn() === true) {

                var user = AUTHfactory.getSessionUser();
                alert(user.id);

                APIfactory.get('http://localhost:30/views/like_comment/' + comment.id + '/' + user.id).then(function (res) {
                    alert('comment liked successfully');
                    console.log(res.data)
                    likedDisliked = true;
                    comment.likes = comment.likes + 1;
                })
                return;
            }
            alert('you have to be logged in first');

        };
        $scope.dislikes = function (comment) {

            if (likedDisliked === true) {
                alert('you have already had your opinion')
                return;
            }
            if (AUTHfactory.isLoggedIn() === true) {
                var user = AUTHfactory.getSessionUser();
                alert(user.id)


                APIfactory.get('http://localhost:30/views/dislike_comment/' + comment.id + '/' + user.id).then(function (res) {
                    alert('comment disliked successfully');
                    console.log(res.data)
                    likedDisliked = true;
                    comment.dislikes = comment.dislikes + 1;
                })
                return;
            }
            alert('you have to be logged in first');

        };

        $scope.delete = function (comment) {
            APIfactory.remove('http://localhost:30/api/comments/' + comment.id).then(function (res) {
                alert('comment deleted');
                var test = $rootScope.comments;
                for (var i = 0; i < test.length; i++) {
                    if (test[i].id == comment.id) {
                        test.splice(i)
                    }

                }
                $rootScope.comments = test;

            })
        }

        $scope.edit = function (id) {
            $http.put('http://localhost:30/api/comments/' + id + '/' + $scope.editted).then(function (res) {
                $scope.test = true;
            })
        }



    }]);

    app.controller('navCtrl', ['$scope', '$rootScope', '$http', function ($scope, $http, $rootScope) {
        $scope.signout = function () {
            notlogged.display = 'block';
            logged.display = 'none';
            $rootScope.user = undefined;

            sessionStorage.removeItem('user');
        }

    }]);

})();
