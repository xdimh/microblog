var mongodb = require('./db');

function Post(post) {
	this.author = post.author;
	this.post_content = post.post_content;
	this.post_time = new Date().getTime();
	this.imgs = post.imgs;
}

module.exports = Post;

Post.prototype.save = function(callback) {
	var post = {
		author : this.author,
		post_content : this.post_content,
		post_time : this.post_time,
		imgs : this.imgs
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
}

Post.getByAuthor = function(autor,callback) {
	mongodb.open(function(err,db){
		if(err) {
			callback(err);
		}

		db.collection(post,function(err,collection){
			if(err) {
				mongodb.close();
				callback(err);
			}

			collection.find({author:author,sort : [['post_time','desc']]}).toArray(function(err,posts){
				mongodb.close();
				callback(err,posts);
			});
		});
	});
};

Post.getByContent = function(post_contnet,callback) {

};

