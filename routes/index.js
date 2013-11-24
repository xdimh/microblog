
/*
 * GET home page.
 */

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