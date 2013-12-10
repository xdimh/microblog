(function($,exports){

	$.fn.comments = function(options) {
		var opts = $.fn.extend($.fn.comments.defaults, options || {});
		return this.each(function(index){
			var _thisCommentsArea = $(this),
				$itemsDiv = $('<div>').addClass('m-cmts m-cmts-content');
				// _thisCommentsArea.hide();

			function _createTextarea() {
				var $textareaWraper = $('<div>').addClass('m-cmts m-cmts-textarea'),
					$textarea = $('<textarea>').addClass('form-control').attr({
						rows : 1
					});
				return $textareaWraper.append($textarea);
			}

			function _createFuncArea() {
				var $areaWraper = $('<div>').addClass('m-cmts m-cmts-func'),
					$emoSpan = $('<span class="label label-primary">表情</span>'),
					$button = $('<button type="button" class="btn btn-success btn-xs"></button>')
								.text(opts.button_text).attr({
									'data-loading-text':'正在' + opts.button_text + '...'
								});
				return $areaWraper.append($emoSpan).append($button);
			}

			/*
				data = {
					_id : jdsfkdsfksdjj,
					content : ksdkfkdsf,
					reviewer : dds,
					whobereplied : ddd,
					favor : 23,
					avatar: 'ddsfsd'
				}
			*/

			function _createCommentsPanel(data) {
				var cmts = [];
				$.each(data,function(index,value){
					
						var $cItem = $('<div>').addClass('m-cmts-content-item'),
							$a = $('<a href="javascript:void(0)" class="sm-avatar"></a>'),
							$avatar = $('<img>').attr({
								src : value.avatar
							}),
							$iWraper = $('<div>').addClass('i-wraper'),
							$uname = $('<a href="javascript:void(0)" class="u-name"></a>').text(value.reviewer),
							$textWraper = $('<div>').addClass('c-text'),
							$p_text = $('<p>').html(value.content),
							$replyWraper = $('<div class="m-cmts-reply" ><ul><li><a href="javascript:void(0)">喜欢(0)</a></li><li><a href="javascript:void(0)">回复</a></li></ul></div>');

						$a.append($avatar).appendTo($cItem);
						$uname.appendTo($iWraper);
						$textWraper.append($p_text).appendTo($iWraper);
						$replyWraper.appendTo($iWraper);
						$iWraper.appendTo($cItem);
						cmts.push($cItem);
				
				});

				return cmts;
			}

			_thisCommentsArea.append(_createTextarea()).append(_createFuncArea());
			
			$.each(_createCommentsPanel([{avatar:'/img/test.jpeg',content:'test,test,test',reviewer:'zzy7186'},{avatar:'/img/test.jpeg',content:'test,test,test',reviewer:'zzy7186'}]),function(index,value){
				$itemsDiv.append(value);
			});

			_thisCommentsArea.append($itemsDiv);
		});

	};

	$.fn.comments.defaults = {
		isHasComments : true,
		button_text : '评论'
	};

	// $(function(){
	// 	$('.comments').comments();
	// });


})(jQuery,window); 


