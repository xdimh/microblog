
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.reg = function(req,res) {
	res.render('reg',{title : 'Express'});
};