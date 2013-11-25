
/*
 * GET home page.
 */

 var crypto = require('crypto');
 var User = require('../models/User');

exports.index = function(req, res){
  res.render('index', {
  		 title: 'Express',
  		 pageTag:'首页'
	});
};

exports.reg = function(req,res) {
	res.render('reg',{
		title : 'Express',
		 pageTag: '用户注册'
	});
}; 

exports.postReg = function(req,res) {

	console.log(req.body.password);
	console.log(req.body['password-repeat']);

	if(req.body['password'] != req.body['password-repeat']) {
		req.flash("error",'两次密码输入不一致');
		return res.redirect('/reg');
	}

	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body['password']).digest('base64');


	var newUser = new User({
		name : req.body.username,
		password : password
	});

	User.get(newUser.name,function(err,user){
		if(user) {
			req.flash('error','用户名已经存在');
			return res.redirect('/reg');
		}

		if(err) {
			req.flash('error',err);
			return res.redirect('/reg');
		}

		newUser.save(function(err){
			if(err) {
				req.flash('error',err);
				return res.flash('/reg');
			}

			req.session.user = newUser;
			req.flash('success','用户注册成功');
			return res.redirect('/');
		});
	});
};


exports.user = function(req,res) {
	var username = req.params.name;
	res.render('userhome',{
		title : username + '的微博'
	});
};

exports.login = function(req,res) {
	var username = req.body.username,
		md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('base64');
	console.log("password:" + password);

	User.get(username,function(err,user){
		if(!user) {
			req.flash('error','用户名不存在');
			return res.redirect('/');
		} else if(user.password != password) {
			req.flash('error','密码不正确');
			return res.redirect('/');
		}

		if(err) {
			req.flash('error',err);
			return res.redirect('/');
		}


		req.session.user = user;
		res.redirect('/user/' + username);
	});
};

exports.logout = function(req,res) {
	req.session.user = null;
	res.redirect('/');
}