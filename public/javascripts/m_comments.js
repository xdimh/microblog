(function($, exports) {

	$.fn.comments = function(options) {
		var opts = $.fn.extend($.fn.comments.defaults, options || {});
		return this.each(function(index) {
			var _thisCommentsArea = $(this),
				$itemsDiv = $('<div>').addClass('m-cmts m-cmts-content');
			// _thisCommentsArea.hide();

			function _createTextarea() {
				var $textareaWraper = $('<div>').addClass('m-cmts m-cmts-textarea'),
					$textarea = $('<textarea>').addClass('form-control').attr({
						rows: 1
					});
				return $textareaWraper.append($textarea);
			}

			function _createFuncArea() {
				var $areaWraper = $('<div>').addClass('m-cmts m-cmts-func'),
					$emoSpan = $('<span class="label label-primary">表情</span>'),
					$button = $('<button type="button" class="btn btn-success btn-xs"></button>')
						.text(opts.button_text).attr({
							'data-loading-text': '正在' + opts.button_text + '...'
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

			function _createReplyBox() {
				var $replayBoxDiv = $('<div>').addClass('replay-box');
				$('<div>').addClass('arrow').appendTo($replayBoxDiv);
				$('<div>').addClass('comments').append(_createTextarea()).append(_createFuncArea())
					.appendTo($replayBoxDiv);

				return $replayBoxDiv;

			}

			function _createCommentsPanel(data) {
				var cmts = [];
				$.each(data, function(index, value) {

					var $cItem = $('<div>').addClass('m-cmts-content-item'),
						$a = $('<a href="javascript:void(0)" class="sm-avatar"></a>'),
						$avatar = $('<img>').attr({
							src: value.avatar
						}),
						$iWraper = $('<div>').addClass('i-wraper'),
						$uname = $('<a href="javascript:void(0)" class="u-name"></a>').text(value.reviewer),
						$textWraper = $('<div>').addClass('c-text'),
						$p_text = $('<p>').html(value.content),
						$replyWraper = $('<div class="m-cmts-reply" ><ul><li><a href="/favor">喜欢(0)</a></li><li><a class="j-reply" href="javascript:void(0)">回复</a></li></ul></div>');

					$('.j-reply',$replyWraper).bind('click.comments',function(event){
						$(this).trigger('reply.comments',$replyWraper);
					});

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

			$(document).on('reply.comments','.j-reply',function(event,replyWraper){
				var $replyBox;
				if(!($(replyWraper).next('.replay-box').size() > 0)) {
					$replyBox = _createReplyBox().hide().insertAfter(replyWraper);
				} else {
					$replyBox = $(replyWraper).next('.replay-box');
				}
				$replyBox.slideToggle('fast');
			});



			if (opts.isHasComments) {

				$.each(_createCommentsPanel([{
					avatar: '/img/test.jpeg',
					content: 'test,test,test',
					reviewer: 'zzy7186'
				}, {
					avatar: '/img/test.jpeg',
					content: 'test,test,test',
					reviewer: 'zzy7186'
				}]), function(index, value) {
					$itemsDiv.append(value);
				});
				_thisCommentsArea.append($itemsDiv);

			};


		});

	};

	$.fn.comments.defaults = {
		isHasComments: true,
		button_text: '评论',
		getComments: function() {},
		postComment: function() {},
		getCommentsUrl: '',
		postCommentUrl: ''
	};

	// $(function(){
	// 	$('.comments').comments();
	// });


})(jQuery, window);