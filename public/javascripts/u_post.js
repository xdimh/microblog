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
 
		var uploaded = {};
		Dropzone.options.simpleUploadDropzone = {
			maxFilesize: 2,
			autoProcessQueue : true,
			parallelUploads: 5,
			maxFiles : 5,
      		addRemoveLinks: true,
      		acceptedFiles: 'image/*',
			init: function() {

			    this.on("maxfilesexceeded", function(file){
			        alert("No more files please!");
			    });
			    this.on("removedfile",function(file){
			    		console.log("a file " + file.name + "is removed");

			    		$.each(uploaded,function(value,num){
			    			if(value.indexOf(file.name) > 0) {
			    				uploaded[value]--;
			    				if(uploaded[value] == 0) {
			    					delete uploaded[value];
			    					$.ajax({
										url: '/deleteImg',
										type: 'post',
										dataType: 'json',
										data: {
											filename: file.name
										}
									}).done(function(data){

									}).fail(function(err){

									});
			    				}
			    				return false;
			    			}
			    		});

			    	
			    });
			    this.on("success",function(file,data){
			    	console.log("file:" + file);
			    	console.log('已上传:' + this.getAcceptedFiles().length);
			    	console.log("总共可以上传几个文件:" + Dropzone.options.simpleUploadDropzone['maxFiles']);

			    	if(!uploaded[data]) {
			    		uploaded[data] = 1;
			    	} else {
			    		uploaded[data] = parseInt(uploaded[data],10) + 1;
			    	}
			    });
		  	}
		};

		$("#exp_pic,#post_pic").click(function(event) {
			/* Act on the event */
			var _this = $(this),
				clazzName = _this.attr('data-toggle');


			
			$(".tipbox").not("." + clazzName).hide();
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
				curPos;

			curPos = insertText($('#post-area').get(0),'[' + emoCode + ']');
			$('#post-area').trigger('input');
			_this.parents('div.tipbox').hide();
			$('#post-area').setCurPos(curPos);
			event.stopPropagation();
		});


		$("#post_weibo").click(function(event) {
			var _this = $(this);
				content = $('#post-area').val(),
				imgs = [];
				$('#post-area').val("");
				$("#template1").find('.wb_content a').each(function(index){
					imgs.push($(this).attr('href'));
				});


			$.ajax({
				url: '/post',
				type: 'post',
				dataType: 'json',
				data: {
					content: content,
					imgs:imgs.join('-')
				}
			})
			.done(function(data) {
				console.log(data);
				$("#post_weibo").button('reset');
				var $all = $("#all"),
				$newWb = $('#template1').clone().attr({
					id : new Date().getTime()
				});

				$('#template1').find('.wb_content a').remove();
			
				$('<p>').text(content).appendTo($newWb.find(".wb_text"));
				$newWb.prependTo($all).find('.wb_content a').css('display','inline');
				$newWb.slideDown();
			})
			.fail(function(error) {
				console.log("error");
			});
		});

		$('a[rel^="group"]').click(function(event) {
			/* Act on the event */
			console.log("I'm clicked");
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
			// $('#simpleUploadDropzone').dropzone({
			// 	maxFilesize: 2,
			// 	thumbnailWidth: '20',
			// 	thumbnailHeight : '20',
			// 	autoProcessQueue : false
			// });
			uploaded = {};
			var myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
			myDropzone.removeAllFiles();
			
			$("#simple_upload_dialog").modal('show');
			_this.parents('div.tipbox').hide();
			event.stopPropagation();
		});


		$('#pt_upload').click(function(event) {
			/* Act on the event */
			var _this = $(this);
			$('#pt_upload_dialog').modal('show');
			_this.parents('div.tipbox').hide();

			xiuxiu.embedSWF("pt_editor", 2, 530, 470,"lite");
		});

		$("#simple_upload_dialog,#pt_upload_dialog").on('show.bs.modal',function(event){
			$(".modal-dialog",this).css("padding-top",195);
		});

		xiuxiu.onClose = function(id) {
			$('#pt_upload_dialog').modal('hide');
		};

		$('#beginUpload').click(function(event) {
			var myDropzone = Dropzone.forElement("form#simpleUploadDropzone");
			myDropzone.processQueue();
		});

		$('#confirmUpload').click(function(event){
			var _this = $(this),
				$weibo = $('#template1'),
				$imga = $("#template2"),
				time = new Date().getTime();
			$weibo.find('.wb_content a').remove();
			$("#post-area").val($("#post-area").val() + '#随手拍#');
			$.each(uploaded, function(key,value){
				var newImga = $imga.clone();
				newImga.attr({
					href : key,
					rel : time,
					id : time
				}).find('img').attr({
					src : key
				}).show();
				$weibo.find('.wb_content').append(newImga);
			});
		});


}); //jQuery
	
	

})(jQuery,window);