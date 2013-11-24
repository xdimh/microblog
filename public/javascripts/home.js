$(function(){
	var scrollTimer;
	$(window).scroll(function(event){
		if(scrollTimer) {
			clearTimeout(scrollTimer);
			scrollTimer=undefined;
		}
		scrollTimer=setTimeout(function(){
			console.log("I'm invoked");
			$("#j_login_dialog").animate({'top':$(document).scrollTop()},500);
		}, 200);
		// console.log("I'm invoked");
		// $("#j_login_dialog").animate({'top':$(document).scrollTop()},{duration:600,queue:false});
	});


	$("#reg").click(function(event){
		window.location.href="/reg";
	});
});
	