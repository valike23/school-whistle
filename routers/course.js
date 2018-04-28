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

router.get('/courses', function (req, res, next) {
    console.log('we are here');
    connection.query('SELECT * FROM course ', function (err, results) {
        res.json(results);
        res.end()
       console.log(results)
    })

    
    next();
})



module.exports = router;