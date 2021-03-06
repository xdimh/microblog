(function($, exports) {

	var old = $.fn.comments;

	$.fn.comments = MAIN_FN;
	MAIN_FN.noConflict = function() {return old;};

	function MAIN_FN(options) {
		var opts = $.fn.extend($.fn.comments.defaults, options || {});
		return this.each(function(index) {
			var _thisCommentsArea = $(this),
				$itemsDiv = $('<div>').addClass('m-cmts m-cmts-content');
			// _thisCommentsArea.hide();

			function _parsePostContent(content) {
				var result,
					emojiRegExp = new RegExp(/\[([^\]\[]*)\]/g),
					$imgs = $('ul.emo li img');		
					while(result = emojiRegExp.exec(content)) {
					
						var $newImg = $imgs.filter('[title^='+result[1]+']').eq(0).clone(),
							index = result.index,
							length = result[0].length;

						content = content.substring(0,index) + $newImg.get(0).outerHTML + content.substring(length+index);
					}
				
					return content;

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
					$emoSpan = $('<span class="label label-primary j-emoij">表 情</span>'),
					$button = $('<button type="button" class="btn btn-success btn-xs"></button>')
						.text(opts.button_text).attr({
							'data-loading-text': '正在' + opts.button_text + '...'
						});
				$button.unbind('click.post').bind('click.post',function(event){
					replyBtnHandler($(this),event);
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
				var $replayBoxDiv = $('<div>').addClass('reply-box');
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

			function _getCommentId($btn) {
				if($btn.parents('.m-cmts-content-item').size() == 0) {
					return null;
				} else {
					return $btn.parents('.m-cmts-content-item').attr('id');
				}
			}

			function _getPostId() {
				return _thisCommentsArea.parents('.weibo').attr('id');
			}

			function replyBtnHandler(_this,event) {
				var commentId = _getCommentId(_this),
					postId = _getPostId(),
					replyContent = _getTextAreaVal(),
					$itemsDiv,
					$replyBox,
					isreply = true;
				if(_this.parents('.m-cmts-content').size()>0) {
					$itemsDiv = _this.parents('.m-cmts-content');
					isreply = true;
				} else {
					$itemsDiv = _this.parents('.m-cmts-func').next('.m-cmts-content');
					isreply = false;
				}
				_this.button('loading');
				$.ajax({
			    		url: '/svc',
			    		type: 'post',
			    		dataType: 'json',
			    		data : {
			    			postId : postId,
			    			commentId : commentId,
			    			replyContent : replyContent
			    		}
			    	})
			    	.done(function(data) {
			    		_this.button('reset');
			    		console.log(data);
			    		var $cItem = _createCommmentItem(data);
			    		$itemsDiv.prepend($cItem);
			    		$('.j-comments span',_this.parents('.weibo')).text(function(index,text){
			    			return text-0 + 1 + "";
			    		});
			    		if(isreply) {
			    			$replyBox = _this.parents('.reply-box');
			    			$('textarea',$replyBox).val("").trigger('input.autohight');
			    			$replyBox.hide();
			    		} else {
			    			_this.parents('.m-cmts-func').prev('.m-cmts-textarea').find('textarea').val("").trigger('input.autohight');;
			    		}
			    	
			    	})
			    	.fail(function(err) {
			    	
			    	});
			}

			function _bindEventOnTextArea() {
				var $thisTextArea = $('textarea', _thisCommentsArea),
					$tempDiv = $('<div>').addClass('form-control').css({
						'white-space': 'pre-wrap',
						'word-wrap': 'break-word',
						height: 'auto',
						'letter-spacing': 'normal'
					});

				

				$thisTextArea.bind('input.autohight', function(event) {
					var _this = $(this),
						text = $(this).val().replace(/\n/g, '<br> ');

					$tempDiv.html(text).hide().insertAfter(_this);

					newHeight = $tempDiv.outerHeight();
				
					if (newHeight < 34) {
						newHeight = 34;
					}
					_this.css({
						height: newHeight
					});

				});

			}

			function _bindEventOnReplyButton() {
				var $replyBtn = $('.j-emoij',_thisCommentsArea),
					$thisTextArea = $('textarea',_thisCommentsArea);
				$replyBtn.unbind('click.onEmoij').bind('click.onEmoij',function(event){
					var _this = $(this),
						$emoij = $('div.tipbox.expression'),
						$previous = $emoij.data('previous');
					
					if($previous && _this.data('mark') != $previous.data('mark'))  {
						$emoij.hide();
					}
					_this.data('mark',new Date().getTime());
					$emoij.css({
						left : _this.offset().left,
						top : _this.offset().top + _this.outerHeight() + 11
					}).data({'textarea':$thisTextArea,'previous': _this}).toggle();
					event.stopPropagation();
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

			function _deleteCommentEventHandler(_this,commentId,postid) {
						$.ajax({
							url: '/delc',
							type: 'post',
							dataType: 'json',
							data: {
								commentId: commentId,
								postId : postid
							},
						})
						.done(function(data) {
							console.log(data);
							if(data.status == 'succ') {
								var $plSpan = _this.parents('div.weibo').find('.j-comments span');
								console.log(_this.parents('div.mm-cmts-content-item'));
								_this.parents('div.m-cmts-content-item').remove();
								$plSpan.text($plSpan.text()-1);
							}
						})
						.fail(function() {
							console.log("error");
						})
			}

			function _createCommmentItem(value) {
				var $cItem = $('<div>').addClass('m-cmts-content-item').attr({id:value._id})
								.data({'itemsDiv':$itemsDiv}),
					$a = $('<a href="javascript:void(0)" class="sm-avatar"></a>'),
					$avatar = $('<img>').attr({
						src: $.getCookie('small')
					}),
					$iWraper = $('<div>').addClass('i-wrap'),
					$uname = $('<a href="javascript:void(0)" class="u-name"></a>').text(value.reviewer + ": "),
					$textWraper = $('<div>').addClass('c-text'),
					$p_text = $('<p>').html(_parsePostContent(value.content) + ' ('+$.getTimeStr(value.posttime)+')'),
					$replyWraper = $('<div class="m-cmts-reply" ><ul><li><a href="/favor">喜欢('+ value.favor +')</a></li><li><a class="j-reply" href="javascript:void(0)">回复</a></li></ul></div>');

				if($.getCookie('username') == value.reviewer) {
					var $delLi = $('<li><a href="javascript:void(0)">删除</a></li>');
					$delLi.bind('click.delete',function(event){_deleteCommentEventHandler($(this),value._id,value.postid)});
					$replyWraper.find('ul').prepend($delLi);
				}
					
				if(value.whobereplied) {
					$uname.text($uname.text() + "回复@" + value.whobereplied + ":");
				} 

				$('.j-reply', $replyWraper).unbind('click.comments').bind('click.comments', function(event) {
						$(this).trigger('reply.comments', $replyWraper);
						event.stopPropagation();
				});

				$a.append($avatar).appendTo($cItem);
				$uname.appendTo($iWraper);
				$textWraper.append($p_text).appendTo($iWraper);
				$replyWraper.appendTo($iWraper);
				$iWraper.appendTo($cItem);

				return $cItem;
			}

			function _createCommentsPanel(data) {
				var cmts = [];
				$.each(data, function(index, value) {

					var $cItem = _createCommmentItem(value);
					cmts.push($cItem);

				});
	
				$.each(cmts, function(index, value) {
					$itemsDiv.append(value);
				});
				_thisCommentsArea.append($itemsDiv);
			}

			_thisCommentsArea.append(_createTextarea()).append(_createFuncArea());



			if (opts.isHasComments) {

				
				opts.getComments(_createCommentsPanel);

				$(document).unbind('reply.comments').on('reply.comments', '.j-reply', function(event, replyWraper) {
					var $replyBox;
					if (!($(replyWraper).next('.reply-box').size() > 0)) {
						$replyBox = _createReplyBox().hide().insertAfter(replyWraper);
					} else {
						$replyBox = $(replyWraper).next('.reply-box');
					}
					$replyBox.slideToggle('fast');
				});
			};

			console.log($('textarea', _thisCommentsArea).height());

			_bindEventOnTextArea();
			_bindEventOnReplyButton();

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
	/*
		判断评论内容为空时 验证
	*/

})(jQuery, window);