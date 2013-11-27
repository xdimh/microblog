(function($,window){

	//获取关标位置 和 设置光标位置（收藏）
	$.fn.extend({
	    getCurPos: function(){
	        var e=$(this).get(0);
	        e.focus();
	        if(e.selectionStart){    //FF
	            return e.selectionStart;
	        }
	        if(document.selection){    //IE
	            var r = document.selection.createRange();
	            if (r == null) {
	                return e.value.length;
	            }
	            var re = e.createTextRange();
	            var rc = re.duplicate();
	            re.moveToBookmark(r.getBookmark());
	            rc.setEndPoint('EndToStart', re);
	            return rc.text.length;
	        }
	        return e.value.length;
	    },
	    setCurPos: function(pos) {
	        var e=$(this).get(0);
	        e.focus();
	        if (e.setSelectionRange) {
	            e.setSelectionRange(pos, pos);
	        } else if (e.createTextRange) {
	            var range = e.createTextRange();
	            range.collapse(true);
	            range.moveEnd('character', pos);
	            range.moveStart('character', pos);
	            range.select();
	        }
	    }        
	});

	$(function(){


		$("#exp_pic,#post_pic").click(function(event) {
			/* Act on the event */
			var _this = $(this),
				clazzName = _this.attr('data-toggle');


			
			$(".tipbox").not("." + clazzName).hide();
			$("." + clazzName).toggle();

		});

		//post btn
		$("#post_weibo").click(function(event) {
			
			var _this = $(this);

			_this.button('loading');

		});

		$("#permission-menu li").unbind('click').on('click',function(event) {
			var _this = $(this),
				$a = _this.find('a'),
				text = $a.text(),
				textNode = $("#permission-display").contents().filter(function(){ return this.nodeType == 3; }),
				oldText = textNode.text();

			textNode.remove();
			
			$("#permission-display").prepend(text);
			$a.text(oldText);
		});

		function getBytes(str)
		{
			if(!str){return 0;}
		        var count = 0;
			for (var i = 0; i < str.length; i++)
			{
			  var c = str.charAt(i);
			  /^[\u0000-\u00ff]$/.test(c)?count++:count+=2;
		    }
		    return Math.round(count/2);
		}


		$("#post-area").bind('input',function(event){
			var _this = $(this),
				count = getBytes(_this.val()),
				tempNum = 160 - count;
				if(tempNum < 0) {
					tempNum = -tempNum;
					$("#tiptext").text("已经超出");
				}
				$("#rest_num").text(tempNum);
		});

		function insertText(obj,str) {
			var textRange,
				start = obj.selectionStart,
				end = obj.selectionEnd,
				value = $(obj).val(),
				re,rc;
			if(document.selection && document.selection.createRange) {
				textRange = document.selection.createRange();
				textRange.text = str;

				textRange.collapse();

				
				re = obj.createTextRange();
	            rc = re.duplicate();
	            re.moveToBookmark(textRange.getBookmark());
	            rc.setEndPoint('EndToStart', re);
	            return rc.text.length;
			} else if(typeof start === 'number' && typeof end === 'number') {
				value = value.substring(0,start) + str + value.substring(end);
				$(obj).val(value);
				return start+str.length;
			} else {
				$(obj).val(value+str);
				return $(obj).val().length;
			}
		}

		$(".emo li").click(function(event) {
			var _this = $(this),
				emoCode = _this.find('img').attr("title"),
				curPos;

			curPos = insertText($('#post-area').get(0),'[' + emoCode + ']');
			$('#post-area').trigger('input');
			_this.parents('div.tipbox').hide();
			$('#post-area').setCurPos(curPos);

		});


		$("#post_weibo").click(function(event) {
			var _this = $(this);
				content = $('#post-area').val();




			$.ajax({
				url: '/post',
				type: 'post',
				dataType: 'json',
				data: {
					content: content
				},
			})
			.done(function(data) {
				console.log(data);

				var $all = $("#all"),

					str = '<div class="weibo">' 
					+ '<div class="avatar">'
					+ '<a href="javascript:void(0)">'
					+ '<img src="/img/test.jpeg"/>'
					+ '</a></div>'
					+ '<div class="content">' 
					+ 
				$('<div>').addClass('weibo')

			})
			.fail(function(error) {
				console.log("error");
			});
		});


	});


})(jQuery,window);