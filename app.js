
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var userinfo = require('./routes/userinfo');
var http = require('http');
var path = require('path');
var MongoStore = require("connect-mongo")(express);
var settings = require("./setting");
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret : settings.cookieSecret,
	store : new MongoStore({
		db : settings.db
	})
}));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'picsdir')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',routes.checkLogin,routes.index);
app.get('/users', user.list);
app.all('/userinfo',userinfo.display);
app.get('/reg',routes.reg);
app.post('/reg',routes.postReg);
app.post('/login',routes.login);
app.get('/user/:name',routes.checkNotLogin,routes.user);

app.get('/logout',routes.checkNotLogin,routes.logout);

app.post('/post',routes.postWeibo);
app.post('/picupload',routes.uploadImages);

app.post('/deleteImg',routes.deleteImg);
app.post('/displayAllPost',routes.displayAllPost);
app.post('/displayMyPost',routes.displayMyPost);

app.post('/dsc',routes.displayAllCommentsByPostId);
app.post('/svc',routes.saveComment);
app.post('/delc',routes.delCommentById);
app.get('/test',routes.test);
app.get('/getprize',routes.getprize);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
 