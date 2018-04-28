//sub 'router' api for answering all calls the the website api
var express = require('express');
var events = require('events');
//require the two modules to handle admin api and author api
//var author = require('./author');
//instatiate the router
var bodyParser = require('body-parser');
var router = express.Router();
var news = require('./news_model');
var app = express();
var eventEmitter = new events.EventEmitter();

var mysql = require("mysql");
var connection = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'',
	database:'school_db',
	
});

router.use(bodyParser.json());

router.get('/news/:newsId', function(req,res,next){
    var news = req.params.newsId;
		
			connection.query('SELECT views, DOP FROM news WHERE id = ' + news, function (err, result) {
			    console.log(result);
			    var view = result[0].views + 1;
			    var tyme = result[0].DOP;
			    
			    var myDate = new Date(tyme)
			    var diff = Date.now() - myDate
			    var days = diff / 86400000
			    days = Math.floor(days)
			    var ans = Math.round(view / 33)
                
                console.log(ans);
                connection.query('UPDATE news set views = views + 1, views_rate = ' + ans +' where id =' + news, function (err, results) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('this news have just been viewed');
                    res.json({
                        result: results,
                        message: 'you just viewed this news '
                    });
                    res.end();

			});
			
			});
	 next();
	});
	router.get('/like_comment/:commentId/:userId', function(req,res,next){
	
		var checker = 0;
				console.log(req.params);
				var comment = req.params.commentId;
				var user = req.params.userId;
			connection.query('SELECT truth FROM t_table WHERE EXISTS(SELECT comment_id FROM user_comment WHERE comment_id =' + req.params.commentId + ' AND user_id =' + req.params.userId +')',
		function(err, result){
			if(err){
				console.log(err);
				return;
			}
		try{
			console.log(result[0].truth);
				checker = result[0].truth;
		}
		catch(err){
			console.log('error occured but we recovered')
			console.log(result)
		}
		finally{
			if(checker == 1){
				connection.query('UPDATE user_comment SET  likes = 1, dislikes = null  WHERE comment_id = ' + comment + ' AND user_id = ' + user,
					function(err, result){
						if(err){
						console.log(err);
						return;
					};
					if(result.changedRows == 0){
						console.log('you have already liked this news');
					
					}
					else{
						connection.query('UPDATE `comment` SET `likes`= `likes` + 1, `dislikes` = `dislikes` - 1 WHERE id = ' + comment, function(err,result){
							if(err){
								console.log(err);
								return;
								console.log(result)
							};
						})
					}
					res.json(result);
					res.end();
					next();
				});
	
			}
			else{
				connection.query('INSERT INTO `user_comment`(`user_id`, `comment_id`,  `likes`) VALUES (' + user + ',' + comment + ',1)',
					function(err, result){
						if(err){
							console.log(err);
							return;
						};
						connection.query('UPDATE `comment` SET `likes`= `likes` + 1 WHERE id = ' + comment, function(err,result){
							if(err){
								console.log(err);
								return;
								console.log(result)
							};
						})
						result.message = 'NEW ROW INSERTED';
						res.json(result);
						res.end();
						next();
				});
	
			}
			}	
		
				
		});
		
		 next();
		});
		router.get('/dislike_comment/:commentId/:userId', function(req,res,next){
			var checker = 0;
			var comment = req.params.commentId;
			var user = req.params.userId;
			connection.query('SELECT truth FROM t_table WHERE EXISTS(SELECT comment_id FROM user_comment WHERE comment_id =' + req.params.commentId + ' AND user_id =' + req.params.userId +')',
		function(err, result){
			if(err){
				console.log(err);
				return;
			};
			try{
				console.log(result[0].truth);
				checker = result[0].truth;
			}
			catch(err){
				console.log('error occured but we recovered')
				console.log(result)
		}
		finally{
			if(checker == 1){
				connection.query('UPDATE user_comment SET  likes = null, dislikes = 1  WHERE comment_id = ' + comment + ' AND user_id = ' + user,
					function(err, result){
						if(err){
							console.log(err);
							return;
					}
					if(result.changedRows == 0){
						console.log('you have already disliked this news');
					
					}
					else{
						connection.query('UPDATE `comment` SET `dislikes`= `dislikes` + 1, `likes` = `likes` - 1 WHERE id = ' + comment, function(err,result){
							if(err){
								console.log(err);
								return;
								console.log(result)
							};
						})
					}
					res.json(result);
					res.end();
					next();
			});
	
		}
			else{
			connection.query('INSERT INTO `user_comment`(`user_id`, `comment_id`,  `dislikes`) VALUES (' + user + ',' + comment + ',1)',
				function(err, result){
					if(err){
						console.log(err);
						return;
					};
					connection.query('UPDATE `comment` SET `dislikes`= `dislikes` + 1 WHERE id = ' + comment, function(err,result){
						if(err){
							console.log(err);
							return;
							console.log(result)
						};
					})
					result.message = 'NEW ROW INSERTED';
					res.json(result);
					res.end();
					next();
			});
	
		}
			}	
		
				
		});
		
		
			 next();
			});
	

module.exports = router;