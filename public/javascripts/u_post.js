(function($,window){
	
	$(function(){
 
		var uploaded = {},isPost = 0;

		$('.m-avatar .slice').css({
	    			'background-image': 'url('+$.getCookie('big')+')'
	    });
		//loading all related post 
		

		Dropzone.options.simpleUploadDropzone = {
			maxFilesize: 2,
			autoProcessQueue : false,
			parallelUploads: 5,
			addRemoveLinks : true,
			maxFiles : 5,
      		acceptedFiles: 'image/*',
			init: function() {

			    this.on("maxfilesexceeded", function(file){
			        alert("No more files please!");
			    });

			    this.on("removedfile",function(file){
			    		// console.log("a file " + file.name + "is removed");
			    		if(uploaded[file.name]&&uploaded[file.name].length !=0&&isPost==0) {
			    			var fname = uploaded[file.name].shift();
	    					$.ajax({
									url: '/deleteImg',
									type: 'post',
									dataType: 'json',
									data: {
										filename: fname
									}
							}).done(function(data){

							}).fail(function(err){

							});
			    		}
			    });

			    this.on("success",function(file,data){
			    	isPost = 0;
			    	var filename = file.name;
			    	// console.log("file:" + file.name);
			    	// console.log('已上传:' + this.getAcceptedFiles().length);
			    	// console.log("总共可以上传几个文件:" + Dropzone.options.simpleUploadDropzone['maxFiles']);
			    	if(!uploaded[filename]) {
			    		uploaded[filename] = [];
			    	} 
			    	uploaded[filename].push(data);
			    });
		  	}
		};

		$("#exp_pic,#post_pic").click(function(event) {
			/* Act on the event */
			var _this = $(this),
				$previous ,
				$textarea = _this.parents('.func_area').prev(),
				clazzName = _this.attr('data-toggle');
			
			$(".tipbox").not("." + clazzName).hide();
			if(clazzName == "expression") {
				$previous = $("." + clazzName).data('previous');

				if($previous && _this.data('mark') != $previous.data('mark')) {
					$("." + clazzName).hide();
				}

				_this.data('mark',new Date().getTime());
				$("." + clazzName).css({
					left : _this.offset().left,
					top : _this.offset().top + _this.outerHeight() + 11
				}).data({'textarea' : $textarea,'previous' :  _this});
			}
			$("." + clazzName).toggle();
			event.stopPropagation();
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
				$textarea = _this.parents('.tipbox').data('textarea'),
				curPos;

			curPos = insertText($textarea.get(0),'[' + emoCode + ']');
			$textarea.trigger('input');
			$textarea.trigger('keyup');
			_this.parents('div.tipbox').hide();
			$textarea.setCurPos(curPos);
			event.stopPropagation();
		});


		$("#post_weibo").click(function(event) {
			var _this = $(this),
				content = $('#post-area').val(),
				imgs = [];
			
				content = parsePostContent(content);
			
				$('#post-area').val("").trigger('input');
				$("#template1").find('.wb_content a').each(function(index){
					imgs.push($(this).attr('href'));
				});


			$.ajax({
				url: '/post',
				type: 'post',
				dataType: 'json',
				data: {
					content: content,
					imgs:imgs.join('*')
				}
			})
			.done(function(data) {
			
				$("#post_weibo").button('reset');
				if(data.error) {
					alert(data.error);
				} else {
					var $all = $("#all"),
						d = new Date();
					$newWb = $('#template1').clone(true).attr({
						id : data[0]._id
					});

					$('#template1').find('.wb_content a').remove();
					$newWb.find('.wb_time a').text('刚刚').attr({
						title:$.getFormatDateStr(d),
						'data-time' : d.getTime()
					});
					$('<p>').html(content).appendTo($newWb.find(".wb_text"));
					$newWb.prependTo($all).find('.wb_content a').css('display','inline');
					$newWb.slideDown();
				}
			})
			.fail(function(error) {
				
			});
		});

		$('a[rel^="group"]').click(function(event) {
			/* Act on the event */
		
		});

		$('.fancybox').fancybox({
			helpers	: {
				title	: {
					type: 'inside'
				},
				thumbs	: {
					width	: 80,
					height	: 80
				}
			}
	    });

		$(document).click(function(event) {
			/* Act on the event */
			var target = event.target,
				tagName = target.nodeName;
			if($(target).parents("div.tipbox").size() == 0) {
				$(".tipbox").hide();
			}
		});

		//js related file upload
		// Dropzone.autoDiscover = false;

		$('#simple_upload').click(function(event) {
			var _this = $(this);
			/*myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
			myDropzone.removeAllFiles();
			*/
			$("#simple_upload_dialog").modal('show').stop(true,true);
			_this.parents('div.tipbox').hide();
			event.stopPropagation();
		});


		$('#pt_upload').click(function(event) {
			/* Act on the event */
			var _this = $(this);
			$('#pt_upload_dialog').modal('show');
			_this.parents('div.tipbox').hide();
			xiuxiu.setLaunchVars("uploadBtnLabel", "发送到微博","lite");
			xiuxiu.embedSWF("pt_editor", 2, 530, 470,"lite");
		});

		$("#simple_upload_dialog,#pt_upload_dialog").on('shown.bs.modal',function(event){
			var _this = $(this),
				top = ($(window).height()-_this.find('.modal-dialog').height())/2;
			//有卡顿现象 需要修改
			_this.find('.modal-dialog').animate({"padding-top":top}, 300);
		});

		xiuxiu.onClose = function(id) {
			if(id == "lite") {
				$('#pt_upload_dialog').modal('hide');
			}
			if(id =="avatar") {
				$('#avatar_editor_dialog').modal('hide');
			}
		};

		xiuxiu.onInit = function(id) {
				xiuxiu.setUploadURL('http://localhost:3000/picupload',id);
				xiuxiu.setUploadType(2,id);
				xiuxiu.setUploadDataFieldName("file",id);
		};

		xiuxiu.onUploadResponse = function (data,id)
		{
	    	if(id == "lite") {
	    		afterConfirm(data);
		    	$("#post-area").val($("#post-area").val() + '#随手拍#').trigger('input');
		    	$('#pt_upload_dialog').modal('hide');
	    	}
	    	if(id == "avatar") {
	    		console.log(data);
	    		$('#avatar_editor_dialog').modal('hide');
	    		$('.m-avatar .slice').css({
	    			'background-image': 'url('+$.getCookie('big')+')'
	    		});
	    		window.location.href="/user/" + $.getCookie('username'); 
	    	}
		};

		xiuxiu.onBeforeUpload = function (data, id)
		{
		  var size = data.size;
		  if(size > 2 * 1024 * 1024)
		  { 
		    alert("图片不能超过2M"); 
		    return false; 
		  }
		  return true; 
		};



		$('#beginUpload').click(function(event) {
			var myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
			myDropzone.processQueue();
		});


		function afterConfirm(data) {
				var $weibo = $('#template1'),
					$imga = $("#template2"),
					time = new Date().getTime();
				   
			
			myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
		
			if(myDropzone.getAcceptedFiles().length > 0) {
				$("#post-area").val($("#post-area").val() + '#随手拍#').trigger('input');

			}
			if(data) {
				var newImga = $imga.clone();
				newImga.attr({
					href : data,
					rel : time,
					id : time
				}).find('img').attr({
					src : data
				}).show();
				$weibo.find('.wb_content').append(newImga);
			} else {
					$.each(uploaded,function(key,value){
						if(value.length > 0) {
							for(var i = 0; i < value.length; i++) {
								var newImga = $imga.clone();
								newImga.attr({
									href : value[i],
									rel : time,
									id : time
								}).find('img').attr({
									src : value[i]
								}).show();
								$weibo.find('.wb_content').append(newImga);
							}
						}
					});
			}
		
		}

		$('#confirmUpload').click(function(event){
			isPost = 1;
			afterConfirm();	
			var myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
			myDropzone.removeAllFiles();
			uploaded = {};
		});


		//wb display part
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	

		    var _this = $(e.target);
		    if(_this.attr('href') == "#myweibo") {
		    	$.ajax({
		    		url: '/displayMyPost',
		    		type: 'post',
		    		dataType: 'json'
		    	})
		    	.done(function(data) {
		    		console.log(data);
		    		displayWB(data,$('#myweibo'));
		    	})
		    	.fail(function(err) {
		    	});
		    } else if (_this.attr('href') == "#all") {
		    	$.ajax({
		    		url: '/displayAllPost',
		    		type: 'post',
		    		dataType: 'json'
		    	})
		    	.done(function(data) {
		    	
		    		displayWB(data,$('#all'));
		    	})
		    	.fail(function(err) {
		    	
		    	});
		    }

		});

		$('a[href="#all"]').trigger('shown.bs.tab');

		function displayWB(data,where) {
			var $weibo = $('#template1'),
				$imga = $("#template2");
			$weibo.find('.wb_content a').remove();
			where.empty();
			$.each(data,function(index,value){
				var imgs = value.imgs,
					time = value.post_time,
					author = value.autor,
					commentsNum = value.commentsNum,
					content = value.post_content,
					$newWB = $weibo.clone(true);
				$newWB.attr({id:value._id});
				$.each(imgs, function(index,value){
					var newImga = $imga.clone();
					newImga.attr({
						href : value,
						rel : time,
						id : time
					}).find('img').attr({
						src : value
					}).show();
					$newWB.find('.wb_content').append(newImga);
				});
				$newWB.find(".uname").text(author);
				$('<p>').html(content).appendTo($newWB.find('.wb_text'));
				$newWB.find('.wb_time a').text($.getTimeStr(time));
				$newWB.find('.j-comments span').text(commentsNum);
				$newWB.appendTo(where).show().find('.wb_content a').css('display','inline');
			});
		}

		
		//emotions parser part

		function parsePostContent(content) {
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

		//comments

		function getComments(postId){

			return function(callback) {
					$.ajax({
			    		url: '/dsc',
			    		type: 'post',
			    		dataType: 'json',
			    		data : {
			    			postid : postId
			    		}
			    	})
			    	.done(function(data) {
			    		console.log(data);
			    		callback(data);
			    	})
			    	.fail(function(err) {
			    	
			    	});
			};
			
		}


		$('.j-comments').bind('click',function(event){
			var _this = $(this),
				$content = _this.parents('.content'),
				postId = _this.parents('.weibo').attr('id'),
				$commentTipBox;
			getComments(postId);
			if(!($(".comments-tipbox",$content).size() > 0)){
				$commentTipBox = $('<div>').addClass('comments-tipbox');
				$('<div>').addClass('arrow').appendTo($commentTipBox);
				$('<div>').addClass('comments').comments({button_text:'评论',isHasComments:true,getComments:getComments(postId)}).appendTo($commentTipBox);
				$commentTipBox.hide().appendTo($content);
			}		
			$(".comments-tipbox",$content).slideToggle();
		});

}); //jQuery
	
	

})(jQuery,window);
