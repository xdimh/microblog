var mongodb = require('./db'),
	ObjectID = require('mongodb').ObjectID;

function Post(post) {
	this.author = post.author;
	this.post_content = post.post_content;
	this.post_time = new Date().getTime();
	this.imgs = post.imgs;
	this.commentsNum = 0;
}

module.exports = Post;

Post.prototype.save = function(callback) {
	var post = {
		author : this.author,
		post_content : this.post_content,
		post_time : this.post_time,
		imgs : this.imgs,
		commentsNum : 0
	};

	mongodb.open(function(err,db){
		if(err) {
			return callback(err);
		}

		db.collection('post',function(err,collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}

			collection.insert(post,{safe:true},function(err,post){
				mongodb.close();
				callback(err,post);
			});
			
		});
	});
};

Post.getByAuthor = function(author,callback) {
	mongodb.open(function(err,db){
		if(err) {
			callback(err);
		}

		db.collection('post',function(err,collection){
			if(err) {
				mongodb.close();
				callback(err);
			}

			collection.find({author:author},{sort : [['post_time','desc']]}).toArray(function(err,posts){
				mongodb.close();
				callback(err,posts);
			});
		});
	});
};

Post.getByContent = function(post_contnet,callback) {

};


Post.getPostByAuthors = function(gz,callback) {
	mongodb.open(function(err,db){
		if(err) {
			callback(err);
		}

		db.collection('post',function(err,collection){
			if(err) {
				mongodb.close();
				callback(err);
			}

			collection.find({author:{$in:gz}},{sort : [['post_time','desc']]}).toArray(function(err,posts){
				mongodb.close();
				callback(err,posts);
			});
		});
	});
};


Post.addCommentsNum = function(postId) {
	mongodb.open(function(err,db){
		if(err) {
			throw err;
		}

		db.collection('post',function(err,collection){
			if(err) {
				mongodb.close();
				throw err;
			}

			collection.update({_id:ObjectID.createFromHexString(postId)},{$inc:{'commentsNum':1}}, function(err, numberUpdated){
				if(err) {
					throw err;
				}
			});
		});
	});
};

Post.minusCommentsNum = function(postId,num) {
	mongodb.open(function(err,db){
		if(err) {
			throw err;
		}

		db.collection('post',function(err,collection){
			if(err) {
				mongodb.close();
				throw err;
			}
			collection.update({_id:ObjectID.createFromHexString(postId)},{$inc:{'commentsNum':-num}}, function(err, numberUpdated){
				if(err) {
					throw err;
				}
			});
		});
	});
};