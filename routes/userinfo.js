/*
	display user info 
*/


exports.display = function(req,res) {
	res.send(req.body.username);
};