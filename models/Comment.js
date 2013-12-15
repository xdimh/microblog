var mongodb = require('./db');
 
function Comment(comment) {
	this.reviewer = comment.reviewer;
	this.whobereplied = comment.whobereplied;
	this.content = comment.content;
	this.favor = comment.favor;
	this.smavatar = comment.smavatar;
	this.postid = comment.postid;
	this.posttime = comment.posttime;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
	var comment = {
		reviewer : this.reviewer,
		whobereplied : this.whobereplied,
		content : this.content,
		favor : this.favor,
		smavatar : this.smavatar,
		postid : this.postid
	};

	mongodb.open(function(err,db){
		if(err) {
			return callback(err);
		}

		db.collection('comment',function(err,collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(comment,{safe:true},function(err,comment){
				mongodb.close();
				callback(err,comment);
			});
		});
	});
}


Comment.getAllCommentsByPostId = function(postId,callback) {
	mongodb.open(function(err,db){
		if(err) {
			callback(err);
		}

		db.collection('comment',function(err,collection){
				if(err) {
					mongodb.close();
					callback(err);
				}
				collection.find({postid:postId},{sort : [['posttime','desc']]}).toArray(function(err,comments){
						mongodb.close();
						callback(err,comments);
				});
		});
	});
};
