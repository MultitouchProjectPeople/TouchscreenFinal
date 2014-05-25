function animate(obj, speed,amount)
{
	$(obj).animate({
		"margin-left": "+="+amount
	},speed, function() {
	
		animate(obj, speed, amount);
	
	});
}

$('document').ready(function() {

	var posterWidths = 0;

	$('#poster_carousel').append('<div id="images"><div id="image_container"></div></div>');

	$('#poster_carousel').children('img').each(function (index, obj) {
		$(obj).attr('id','poster'+(index+1));
		
		posterWidths += $(obj).outerWidth();
		
		$(obj).appendTo('#image_container');
		
		var imageContainerWidth = $('#images').outerWidth();
		
		var marginAmount = (imageContainerWidth - $(obj).outerWidth()) / 2;
		
		console.log(marginAmount);
		
		$(obj).css({
		"margin-left": marginAmount + "px",
		"margin-right": marginAmount + "px"
		});
		
		var backAmount = index * imageContainerWidth * -1;
		
		$('#image_container').css("margin-left",backAmount+"px");
		
		
		
		animate($('#image_container'),5000, imageContainerWidth);
			
	});
	
	$('#image_container').css('width',posterWidths);

});