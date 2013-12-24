(function($,window,undefined){
	$.fn.popAvatarModifyDialog = function(option) {
		var opts = $.extend($.fn.popAvatarModifyDialog.defaults,option || {});

		if(!opts.dialogId || !opts.xiuxiuDivId){
			alert("指定相应的ID");
			return this;
		}

		xiuxiu.setLaunchVars("uploadBtnLabel", "保存头像","avatar");
		xiuxiu.setLaunchVars("closeByHTML", 0,"avatar");
		xiuxiu.setLaunchVars("maxFinalWidth",200,"avatar");
        xiuxiu.setLaunchVars("maxFinalHeight", 200,"avatar");
		xiuxiu.embedSWF(opts.xiuxiuDivId, 5, 600, 470,"avatar");
		xiuxiu.setUploadArgs ({"isAvatarImg":1},"avatar");
	   
		xiuxiu.onUploadResponse = function (data)
		{
		    alert(data);
		};


		return this.each(function(){
			var _modifyAvatarBtn = $(this);

			_modifyAvatarBtn.bind('click.modifyAvatar',function(){
				$('#' + opts.dialogId).modal('show');
			});

			$('#' + opts.dialogId).bind('shown.bs.modal',function(event){
				var _this = $(this),
					top = ($(window).height()-_this.find('.modal-dialog').height())/2;
				//有卡顿现象 需要修改
				_this.find('.modal-dialog').animate({"padding-top":top}, 300);
			});

		});
	};

	$.fn.popAvatarModifyDialog.defaults = {
		dialogId : '',
		xiuxiuDivId : ''
	};

	$('#j_mdfyavatar').popAvatarModifyDialog({dialogId:'avatar_editor_dialog',xiuxiuDivId:'avatar_editor'});
})(jQuery,window,undefined);