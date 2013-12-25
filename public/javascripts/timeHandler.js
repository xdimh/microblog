(function($,window){	
	$.extend({
		getTimeStr : function (time) {
							var postDate = new Date(time),
								nowDate = new Date(),
								diff = nowDate.getTime() - time;

							if(diff > 86400000) {
								return getFormatDateStr(postDate);
							} else if(diff > 3600000){
								return Math.floor(diff/3600000) + '小时前';
							} else if(diff > 60000){
								return Math.floor(Math.floor(diff/1000)/60) + '分钟前';
							} else {
								return '刚刚';
							}
					},

		addZero: function(d) {
						return new String(d).length == 2 ? d : '0' + d;
				 },


		getFormatDateStr: function(date) {
							var y = date.getFullYear(),
								m = date.getMonth() + 1,
								d = date.getDay() + 1,
								h = date.getHours(),
								mi = date.getMinutes();
							return y + '-' + addZero(m) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(mi);
					}
	});
})(jQuery,window);