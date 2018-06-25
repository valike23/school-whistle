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
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'school_db',

});

router.use(bodyParser.json());

var errorFunction = function (res, err) {
    console.log(err);
    res.json({
        message: 'the resources is not available'
    })
    return
}



//news section
//function to get recent news 10 recent news
// api for the mobile app and web : this api would retrieve the ten (10) most trending news in the database at development it /will be producing only two.
router.get('/trending', function (req, res, next) {
    connection.query('SELECT id,title, DOP,category_id,school_id,summary FROM news ORDER BY views_rate DESC LIMIT 0,5', function (err, resul) {
        if (err) {
           errorFunction(res,err)
        }
        //setting the header to allow CORS: this would only make this response available to mobile app users and other users.
        res.header('Access-Control-Allow-Origin', '*')
        res.json(resul)
        res.end()
    })
});
router.get('/recent-news', function (req, res, next) {
    connection.query('SELECT * FROM news ORDER BY DOP DESC LIMIT 0,9 ', function (err, results) {
        if (err) {
            errorFunction(res, err);
            return;
            //setting the header to allow CORS: this would only make this response available to mobile app users and other users.

        }
        res.header('Access-Control-Allow-Origin', '*')
        res.json(results);
        res.end();
    })
})

// for the author window: gets all news that is related to an author
router.get('/anews/:author', function (req, res, next) {
    connection.query('select * from news WHERE author_id = ' + req.params.author, function (err, results) {

        if (err) {
            errorFunction(res, err);
            return;
        }
        res.json(results);
        res.end(); 
    })
})
//takes a news id and return is news details

router.get('/news/:id', function (req, res, next) {
    var news = {}
    connection.query('select * from news WHERE id = ' + req.params.id, function (err, results) {

        if (err) {
            errorFunction(res, err);
            return;
        }
        news = results[0];
        console.log(news.category_id)
        connection.query('select * from category where id = ' + news.category_id, function (err, result) {
            if (err) {
                errorFunction(res, err);
                return;
            }
            news.category = result[0].category;
            connection.query('select username, firstname, lastname from user where id = ' + news.author_id, function (err, resul) {
                if (err) {
                    errorFunction(res, err);
                    return;
                }
                news.author = resul[0].firstname + ' ' + resul[0].lastname;
                news.authorUsername = resul[0].username;
                connection.query('select name, sabbrv from school where id = ' + news.school_id, function (err, resu) {
                    if (err) {
                        errorFunction(res, err);
                        return
                    }
                    news.school = resu[0].name;
                    news.sabbrv = resu[0].sabbrv;
                    res.json(news);
                    res.end();
                })

            })


        })


    });


    next();
});



//POST new news item
router.post('/news', function (req, res, next) {

    //	console.log('got  hit!!!!');
    connection.query('INSERT INTO news set ?', req.body, function (err, results) {

        if (err) {
           errorFunction(res,err)
            return;
        }
        //		console.log(results);
        //	console.log('its crazy');
        res.json(results);
        res.end();

    });
    next();
});

router.delete('/news/:newsId', function (req, res, next) {

    //	console.log('got  hit!!!!');
    connection.query('DELETE FROM news WHERE id =' + req.params.newsId, function (err, results) {

        if (err) {
            console.log(err);
            return;
        }
        //		console.log(results);
        console.log('data deleted');
        res.json({
            result: results,
            message: 'your delete operation was successful'
        });
        res.end();

    });
    next();
});











//cbt section

router.get('/cbt', function (req, res, next) {
    questions = [];
    connection.query('select * FROM question',
    function (err, results) {

        if (err) {
            console.log(err);
            return;
        }
        for (var j = 0 ; j < results.length; j++) {
            question = {
                id: '',
                quiz: '',
                answer: '',
                image: '',
                subject: '',
                options: []
            };
            question.id = j + 1;
            question.quiz = results[j].quiz;
            question.answer = results[j].ans;
            question.image = results[j].image;
            question.subject = results[j].subject;
            var opt = {};
            opt.name = results[j].opt1;
            opt.color = '#4682b4';
            question.options.push(opt);
            opt = {};
            opt.name = results[j].opt2;
            opt.color = '#4682b4';
            question.options.push(opt);
            opt = {};
            opt.name = results[j].opt3;
            opt.color = '#4682b4';
            question.options.push(opt);
            opt = {};
            opt.name = results[j].opt4;
            opt.color = '#4682b4';
            question.options.push(opt);
            questions.push(question);
        }
        res.json(questions);
        res.end();


    });

    next();
});

//get comments for a sepcific news
router.get('/comments/:newsId', function (req, res, next) {

    connection.query('select * from comment where newsId =' + req.params.newsId,
function (err, results) {

    //console.log('result returned well');
    res.json(results);
    res.end();
});
    next();

});
router.delete('/comments/:commentId', function (req, res, next) {

    connection.query('delete from comment where id =' + req.params.commentId,
function (err, results) {

    //console.log('result returned well');
    res.json(results);
    res.end();
});
    next();

});

router.put('/comments/:commentId/:comment', function (req, res, next) {

    connection.query('UPDATE comment SET comment = ' + req.params.comment + ', DOE= CURRENT_TIMESTAMP WHERE id = ' + req.params.commentId,
function (err, results) {

    console.log('result returned well');

    res.end();
});
    next();

});
//get comment that is a child of a given comment
router.get('/subcomments/:commentId', function (req, res, next) {
    //console.log(req.params.newsId);
    connection.query('select * from comment where commentId =' + req.params.commentId,
function (err, results) {
    //console.log('result returned well');
    res.json(results);
    res.end();
});
    next();

});
//register new comment
router.post('/comment', function (req, res, next) {

    console.log(req.body);
    connection.query('INSERT INTO comment set username =?,comment=?,newsId=?,commentId=?', [req.body.username, req.body.comment, req.body.newsId, req.body.commentId], function (err, results) {

        if (err) {
            console.log(err);
            return;
        }
        //		console.log(results);
        //		console.log('its crazy');
        res.json(results);
        res.end();

    });
    next();
});
/*router.use(function(req,res,next){
	res.status(401).json({
		message : 'you requested an unavailable api '
	});
	return;
	res.end();
	next();
});*/







//user section
router.post('/user', function (req, res, next) {
    if (req.body.mode === 'login') {
        connection.query('select * from user where username=? AND password=?',
        [req.body.username, req.body.password], function (err, results) {
            console.log('request body ' + req.body.username + ',password:' + req.body.password);
            if (err) {
                console.log(err);
                return;
            }
            console.log(results);
            console.log('its crazy in user');
            res.json(results);
            res.end();

        });


        next();
    }
    else {
        console.log('register');
        connection.query('INSERT INTO user set username =?,email=?,firstname=?,lastname=?,' +
         'phone=?,password=?,authorized=?',
        [req.body.userName, req.body.email, req.body.firstName,
        req.body.lastName, req.body.phone, req.body.password, 'user'], function (err, results) {

            if (err) {
                console.log(err);
                return;
            }
            //		console.log(results);
            //		console.log('its crazy');
            res.json(results);
            res.end();

        });

        next();
    }
});



router.get('/search/:news', function (req, res, next) {
    console.log('logged')
    var search = req.params.news;
    console.log(search)
    connection.query("select * FROM news where title LIKE '%" + search + "%'", function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(result);
        res.end();
    })


    next();
});


router.get('/related/:school/:category', function (req, res, next) {
    console.log('its okay')
    var school = req.params.school; var category = req.params.category;

    connection.query('SELECT * FROM news WHERE school_id = ' + school + ' OR category_id = ' + category + '  ORDER BY views_rate DESC LIMIT 0,5 ', function (err, resultes) {

        res.json(resultes)

        res.end()
    })
})

// Group of module that handles the object SUBJECT
// retrieve of all subjects
router.get('/subjects', function (req, res, next) {
    connection.query('SELECT `subject`.`sub`, `subject`.`abbrv`, `school`.`name`, `school`.`sabbrv` FROM subject INNER JOIN school ON `subject`.`schoolId` = `school`.`id`', function (err, results) {
        if (err) {
            console.log(err)
        }
        res.json(results)
        res.end();

    })
});

// modules for school
//retrieve school data

router.get('/schools', function (req, res, next) {
    connection.query('SELECT * FROM school', function (err, result) {
        if (err) {
            console.log(err)
        }
        res.json(result)
        res.end();
    })
})

//nootification section
//select all unread notification by a particular user
router.get('/notifications/:userId', function (req, res, next) {

    connection.query('SELECT * from notification WHERE viewed = false AND userId = ' + req.params.userId, function (err, results) {
        if (err) {
            errorFunction(res, err);
            return;
        }
        res.json(results);
        res.end();
    })
})

//message section
//get unread messages for a particular user
router.get('/messages/:userId', function (req, res, next) {
   
    connection.query('SELECT  message.id, message.subject, message.content,message.dop,user.username FROM message INNER JOIN user ON message.sender = user.id WHERE message.seen = false AND message.reciever = ' + req.params.userId, function (err, results) {
        if (err) {
            errorFunction(res, err);
            return;
        }
        
        res.json(results)
        res.end()
    })
});



module.exports = router;

