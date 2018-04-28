var express = require('express');
var app  = express();

var api = require('./routers/api');

var views = require('./routers/views');
var course = require('./routers/course')

//var admin = require('./routers/admin');


//app.use(logger('short'));
app.use(function(req,res,next){
	
		next()});

app.use('/lib',express.static('lib'));
app.use('/api',api);
app.use('/views', views);
app.use('/courses-api', course);
//app.use('/admin',admin);
//app.use('/author',author);

//get master page
app.get('/',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\master.html');
});

//get course page
app.get('/course', function (req, res) {
    res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\course.html')
})
//to retrieve news page
app.get('/news',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\news.html');
});
//to login page
app.get('/login',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\login.html');
});
// to registration page
app.get('/register',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\register.html');
});
app.get('/author',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\dashboard.html');
});
app.get('/cbt',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\CBT.html');
});
app.get('/allnews',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\allnews.html');
});
app.get('/admin',function(req,res){
res.sendFile('C:\\Users\\valike23\\Desktop\\new website\\allnews.html');
});

app.use(function(req,res){
	console.log('request ip ' + req.ip)
	
});


 app.listen(30);