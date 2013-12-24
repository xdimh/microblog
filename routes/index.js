
/*
 * GET home page.
 */

 var crypto = require('crypto'),
	 User = require('../models/User'),
	 Post = require('../models/Post'),
	 imgHandler = require('../utils/imageclip'),
	 Comment = require('../models/Comment'),
	 fs = require('fs'),
	 path = require("path"),
	 uuid = require('node-uuid'),
	 formidable = require("formidable"),
	 sys = require('sys');



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
		password : password,
		gz : []
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

exports.postWeibo = function(req,res) {
	var content = req.body.content,
		author = req.session.user.name,
		imgs = req.body.imgs.split('*'),
		time = new Date().getTime();
		console.log(imgs);

	if(!content || !content.trim()) {
		return res.send({'error':'发送内容不能为空'});
	}

	if(imgs == "") {
		imgs = [];
	}
	var newPost = new Post({author:author,post_content:content,post_time:time,imgs:imgs});

	newPost.save(function(err,post){
		if(err) {
			res.send({'error':err});
		}
		res.send(post);
	});
};


exports.checkLogin = function(req,res,next) {
	if(req.session.user) {
		return res.redirect('/user/' + req.session.user.name);
	} 
	next();
}

exports.checkNotLogin = function(req,res,next) {
	if(!req.session.user) {
		return res.redirect('/');
	}

	next();
}

exports.uploadImages = function(req,res) {

	console.log(req.files);
	console.log(sys.inspect({"files":req.files,"isAvatar":req.body.isAvatarImg}));
	console.log(path.extname('we.e.e.jpg'));

	var isAvatarImg = req.body.isAvatarImg,
		fileName = req.files.file.originalFilename,
		newFileName = uuid.v1() + path.extname(fileName),
		filePath = req.files.file.path,
		username = req.session.user.name,
		newPicDir = path.normalize(__dirname + path.sep + '../picsdir'),
		newUserPicDir = newPicDir + path.sep + username,
		newUserAvtaPicDir = newUserPicDir + path.sep + 'avatar',
		newImgFilePath = newUserPicDir + path.sep + newFileName;


	console.log(newPicDir);
	console.log(newUserPicDir);



	if(!fs.existsSync(newPicDir)) {
		fs.mkdirSync(newPicDir);
	}

	if(!fs.existsSync(newUserPicDir)) {
		fs.mkdirSync(newUserPicDir);
	}

	if(isAvatarImg) {
		if(!fs.existsSync(newUserAvtaPicDir)) {
			fs.mkdirSync(newUserAvtaPicDir);
		} else {
			files = fs.readdirSync(newUserAvtaPicDir);
			if(files.length != 0) {
				files.forEach(function(file){
					var fullname = path.join(newUserAvtaPicDir,file);
					fs.unlinkSync(fullname);
				});
			}
		}
		newImgFilePath = newUserAvtaPicDir + path.sep + 'big' + path.extname(fileName);	
	} 

	fs.readFile(filePath, function(err,data){
		if(err) {
			throw err;
		}
		fs.writeFile(newImgFilePath,data,function(err){
			if(err) {
				throw err;
			}
			console.log("img saved");
		});
	});

	if(isAvatarImg) {
		//头像的剪裁和更新user信息
		imgHandler.resizeImg(newImgFilePath,30,30,"small");
		imgHandler.resizeImg(newImgFilePath,64,64,"middle");
		res.redirect('/user/' + username);
	}

	console.log(fileName);

	res.send('/' + username + '/' + newFileName);

};


exports.deleteImg = function(req,res) {
	var fileName = req.body.filename,
		username = req.session.user.name,
		filePath = path.normalize(__dirname + path.sep + '..'+ path.sep + 'picsdir' + path.sep + fileName);

	console.log('filePath:' + filePath);
	if(fs.existsSync(filePath)) {
		fs.unlink(filePath, function (err) {
			  if (err) throw err;
			  console.log('successfully deleted ' + fileName + 'in user ' + username + ' space');
		});
	}

	res.send('ok');
}


exports.displayAllPost = function(req,res) {
	var author = req.session.user.name,
		gz;
	User.get(author,function(err,user){
		if(err) {
			throw err;
		}
		console.log(user);
		gz = user.gz;

		gz.push(author);
		Post.getPostByAuthors(gz,function(err,posts){
			if(err) throw err;
			res.send(posts);
		})
	});
};

exports.displayMyPost = function(req,res) {
	var author = req.session.user.name;
	Post.getByAuthor(author,function(err,posts){
		if(err) {
			throw err;
		}
		res.send(posts);
	});
};

exports.displayAllCommentsByPostId = function(req,res) {
	var postid =  req.body.postid;
		

	Comment.getAllCommentsByPostId(postid,function(err,comments){
		if(err) {
			throw err;
		}
		res.send(comments);
	});
};

exports.saveComment = function(req,res) {
	var commentId = req.body.commentId,
		commt = {
			content : req.body.replyContent,
			postid : req.body.postId,
			reviewer : req.session.user.name,
			whobereplied : req.body.whobereplied,
			posttime : new Date().getTime(),
			favor : 0
		},
		newComment = new Comment(commt);
	console.log("commentId:" + commentId);
	Comment.getCommentById(commentId,function(err,comment){
		if(err) {
			throw err;
		}
		console.log("comment:" + comment);
		if(comment) {
			newComment.whobereplied = comment.reviewer;
		} else {
			newComment.whobereplied = null;
		}
		
		newComment.save(function(err,comment){
			if(err) {
				res.send({'error':err});
			}
			Post.addCommentsNum(req.body.postId);
			res.send(comment[0]);
		});				
	});
		
};

