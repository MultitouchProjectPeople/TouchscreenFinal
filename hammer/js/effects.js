$(document).ready(function () {
	
	itemID = 1;
	
	$('.canvas').hammer().on("drag", function(event) {
		
		var itemWidth = 20;
		var itemHeight = 20;
		
		$('body').append('<div id="item_'+itemID+'" class="bubble"></div>');
		
		$('#item_'+itemID).css({
		'left' 		: (event.gesture.center.pageX - (itemWidth/2))+'px',
		'top' 		: (event.gesture.center.pageY - (itemHeight/2))+'px',
		'width'		: '20px',
		'height'	: '20px'
		});
		
		itemID++;
	});
	
});