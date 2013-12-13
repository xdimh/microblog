(function($, exports) {

	$.fn.comments = function(options) {
		var opts = $.fn.extend($.fn.comments.defaults, options || {});
		return this.each(function(index) {
			var _thisCommentsArea = $(this),
				$itemsDiv = $('<div>').addClass('m-cmts m-cmts-content');
			// _thisCommentsArea.hide();


			function insertText(obj, str) {
				var textRange,
					start = obj.selectionStart,
					end = obj.selectionEnd,
					value = $(obj).val(),
					re, rc;
				if (document.selection && document.selection.createRange) {
					textRange = document.selection.createRange();
					textRange.text = str;

					textRange.collapse();


					re = obj.createTextRange();
					rc = re.duplicate();
					re.moveToBookmark(textRange.getBookmark());
					rc.setEndPoint('EndToStart', re);
					return rc.text.length;
				} else if (typeof start === 'number' && typeof end === 'number') {
					value = value.substring(0, start) + str + value.substring(end);
					$(obj).val(value);
					return start + str.length;
				} else {
					$(obj).val(value + str);
					return $(obj).val().length;
				}
			}

			function _createTextarea() {
				var $textareaWraper = $('<div>').addClass('m-cmts m-cmts-textarea'),
					$textarea = $('<textarea>').addClass('form-control').attr({
						rows: 1,
					}).css({
						'overflow-y': 'hidden',
						height: 34
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
				$button.bind('')
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
				$('<div>').addClass('comments').comments({
					button_text: '回复',
					isHasComments: false
				}).appendTo($replayBoxDiv);

				return $replayBoxDiv;

			}

			function _getTextAreaVal() {
				return $('textarea', _thisCommentsArea).val();
			}

			function _bindEventOnTextArea() {
				var $thisTextArea = $('textarea', _thisCommentsArea),
					$tempDiv = $('<div>').addClass('form-control').css({
						'white-space': 'pre-wrap',
						'word-wrap': 'break-word',
						height: 'auto',
						'letter-spacing': 'normal'
					});

				/*originalHeihgt = $thisTextArea.get(0).clientHeight;
					console.log($thisTextArea.get(0).clientHeight);
					console.log(exports.getComputedStyle($thisTextArea.get(0)).height);
					console.log($thisTextArea.outerHeight());*/

				$thisTextArea.bind('input.autohight', function(event) {
					var _this = $(this),
						text = $(this).val().replace(/\n/g, '<br> ');

					$tempDiv.html(text).hide().insertAfter(_this);

					newHeight = $tempDiv.outerHeight();
					/*		rows = _getTextAreaRows( _this.get(0));
					 _this.animate({height:_this.get(0).scrollHeight+2},100);
					_this.css({height:_this.get(0).scrollHeight+2});

					if(_this.attr('rows') != rows) {
						_this.attr({rows:rows});
					}*/
					if (newHeight < 34) {
						newHeight = 34;
					}
					_this.css({
						height: newHeight
					});

				});

			}

			function _getTextAreaRows(textArea) {
				var agt = navigator.userAgent.toLowerCase(),
					is_op = (agt.indexOf("opera") != -1),
					is_ie = (agt.indexOf("msie") != -1) && document.all && !is_op;
				str = textArea.value.split("\n"),
				cols = textArea.cols,
				str_height = is_ie ? 1 : 0;

				str_height += str.length;


				for (var i = 0; i < str.length; i++) {
					if (str[i].length >= cols) {
						str_height += Math.ceil(str[i].length / cols)
					}
				}
				str_height = Math.max(str_height, 1);
				return str_height;
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

					$('.j-reply', $replyWraper).unbind('click.comments').bind('click.comments', function(event) {
						$(this).trigger('reply.comments', $replyWraper);
						event.stopPropagation();
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


				$(document).unbind('reply.comments').on('reply.comments', '.j-reply', function(event, replyWraper) {
					var $replyBox;
					if (!($(replyWraper).next('.replay-box').size() > 0)) {
						$replyBox = _createReplyBox().hide().insertAfter(replyWraper);
					} else {
						$replyBox = $(replyWraper).next('.replay-box');
					}
					$replyBox.slideToggle('fast');
				});
			};

			console.log($('textarea', _thisCommentsArea).height());

			_bindEventOnTextArea();

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