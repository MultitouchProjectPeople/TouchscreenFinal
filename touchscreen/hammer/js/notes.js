/* 		NOTE CANVAS Version 0.1 			*/
/* 		By Ville Hurme 						*/
/* 		Student at Metropolia University 	*/
/* 		Class TJ11S1 Media Engineering 		*/
/*		INFO:								*/
/* 		This application is a part of 		*/
/* 		Media product project course 		*/


/*					NOTES					*/
/*	1. Arrays are not cleaned when notes	*/
/*	are deleted. Is it even necessary since	*/
/*	old IDs are not used ever again?		*/

$('document').ready(function() {
	
	/* Declaring necessary variables */
	var currentID = 1;
	var zIndex = 1;
	var itemWidthArray = [],
		itemPositionArrayX = [],
		itemPositionArrayY = [],
		itemRotationArray = [],
		itemMaxWidth = $('.wrap').height(),
		itemMinWidth = 200;
		
	var currentMenu,
		menuOpen = false;
	
	/* Canvas functionality */
	$('.wrap').hammer().on("tap", function(event) {
		if(menuOpen)
			closeMenu();
	});
	
	$('.wrap').hammer().on("doubletap", function(event) {
		
		/* Store the currentID */
		var itemID = currentID;
		
		/* Declare position variables needed for dragging and scaling */
		var posChangeX = 0,
			posChangeY = 0,
			origHeight = 0,
			origWidth = 0;
		
		/* Add a note */
		$('.wrap').append('<div id="item_' + itemID +'" class="item" data-id="'+itemID+'"></div>');
		
		/* Declare note default CSS by ID so that each note is unique */
		$('#item_' + itemID)
			.css('width','200px')
			.css('height','200px')
			.css('z-index',zIndex)
			.css('-webkit-transform', 'rotate(0deg)');
		
		/* Push width to an array for storing */
		itemWidthArray.push(parseInt($('#item_' + itemID).css('width')));
		
		/* Set note position by determining the point of doubleclick */
		$('#item_' + itemID).css('left',(event.gesture.center.pageX - (parseInt($('#item_' + itemID).css('width'))/2))).css('top',(event.gesture.center.pageY - (parseInt($('#item_' + itemID).css('height'))/2)));
		
		/* Push positions to an array for storing */
		itemPositionArrayX.push(parseInt($('#item_' + itemID).css('left')));
		itemPositionArrayY.push(parseInt($('#item_' + itemID).css('top')));
		
		/* Push rotation to an array for storing */
		itemRotationArray.push(getRotationDegrees($('#item_' + itemID)));
		
		/* Double tap function on a note */
		$('#item_' + itemID).hammer().on("doubletap", function(event) {
			event.stopPropagation();
		});
		
		/* An event that is fired when dragging starts */
		$('#item_' + itemID).hammer().on("dragstart", function(event) {
			event.stopPropagation();
			
			/* Get the drag point in the note */
			var itemPosX = parseInt($(event.target).css('left'));
			var itemPosY = parseInt($(event.target).css('top'));
			
			posChangeX =  event.gesture.center.pageX - itemPosX;
			posChangeY =  event.gesture.center.pageY - itemPosY;
			
			/* Set z-index to be the highest available so that the note pops up on front when dragged */
			if($(event.target).css('z-index') != zIndex-1)
			{
				$(event.target).css('z-index',zIndex);
				zIndex++;
			}
		});
		
		/* Drag event */
		$('#item_' + itemID).hammer().on("drag", function(event) {
			event.stopPropagation();
			
			/* Store positions */
			var itemPosX = parseInt($(event.target).css('left'));
			var itemPosY = parseInt($(event.target).css('top'));
			
			/* Set the new position */
			$(event.target).css('left', (event.gesture.center.pageX - posChangeX) + 'px');
			$(event.target).css('top', (event.gesture.center.pageY - posChangeY) + 'px');
			
		});
		
		/* Drag end event */
		$('#item_' + itemID).hammer().on("dragend", function(event) {
			event.stopPropagation();
			
			/* When drag ends store the new positions to corresponding places in position arrays */
			itemPositionArrayX[($(event.target).attr('data-id') - 1)] = parseInt($(event.target).css('left'));
			itemPositionArrayY[($(event.target).attr('data-id') - 1)] = parseInt($(event.target).css('top'));
		});
		
		/* Pinch / rotation event */
		$('#item_' + itemID).hammer().on("pinch", function(event) {
			event.stopPropagation();
			
			/* Set variables */
			var scale = event.gesture.scale;
			var newPosX,
				newPosY;
			
			/* Adjust scale amount when pinching */
			if(scale > 1)
			var tempScale = ((scale - 1)/2)+1;
			if(scale < 1)
			var tempScale = 1-((1 - scale)/2);
			
			/* Set amount of rotation */
			var tempRotation = itemRotationArray[($(event.target).attr('data-id') - 1)] + event.gesture.rotation;

			/* Store scaling width */
			var tempWidth = itemWidthArray[($(event.target).attr('data-id') - 1)] * tempScale;
			
			/* get the amount of pixels compared to the original size */
			var scaleAmount = (itemWidthArray[($(event.target).attr('data-id') - 1)] - tempWidth)/2;
			
			
			/* Check maximum and minimum sizes and restrict scaling accordingly or let it scale */
			if(tempWidth > itemMaxWidth)
			{
				tempWidth = itemMaxWidth;
				newPosX = parseInt($(event.target).css('left'));
				newPosY = parseInt($(event.target).css('top'));
			}
			else if(tempWidth < itemMinWidth)
			{
				tempWidth = itemMinWidth;
				newPosY = parseInt($(event.target).css('top'));
				newPosX = parseInt($(event.target).css('left'));
			}
			else
			{
				newPosY = itemPositionArrayY[($(event.target).attr('data-id') - 1)] + scaleAmount;
				newPosX = itemPositionArrayX[($(event.target).attr('data-id') - 1)] + scaleAmount;
			}
			
			/* Set new css for the note */
			$(event.target).css({
				width  : tempWidth + 'px',
				height : tempWidth + 'px',
				left   : newPosX + 'px',
				top    : newPosY + 'px',
				transform: 'rotate(' + tempRotation + 'deg)'
			});
			
			
		});
		
		/* Event that fires when pinch / rotation event ends */
		$('#item_' + itemID).hammer().on("transformend", function(event) {
			event.stopPropagation();
			
			/* Store new values to corresponding arrays */
			itemWidthArray[($(event.target).attr('data-id') - 1)] = parseInt($(event.target).css('width'));
			itemPositionArrayX[($(event.target).attr('data-id') - 1)] = parseInt($(event.target).css('left'));
			itemPositionArrayY[($(event.target).attr('data-id') - 1)] = parseInt($(event.target).css('top'));
			itemRotationArray[($(event.target).attr('data-id') - 1)] = getRotationDegrees($(event.target));
		});
		
		$('#item_' + itemID).hammer().on("tap", function(event) {
			event.stopPropagation();
			
			if(menuOpen)
				closeMenu();
			
			/* Set z-index to be the highest available so that the note pops up on front when tapped */
			if($(event.target).css('z-index') != zIndex-1)
			{
				$(event.target).css('z-index',zIndex);
				zIndex++;
			}
		});
		
		/* Event to open note menu */
		$('#item_' + itemID).hammer().on("hold", function(event) {
			event.stopPropagation();
			
			if(!menuOpen)
			{
				menuOpen = true;
				
				/* Append menu to body (Needs optimizing html part)*/ 
				$('body').append('<div id="item_'+ $(event.target).attr('data-id') + '_menu" class="menu" data-id="'+ $(event.target).attr('data-id') +'"><ul><li id="edit">EDIT</li><li id="reset">RESET</li><li id="delete">DELETE</li></ul></div>');
				
				/* Store the opened menu to a variable for later use */
				currentMenu = $('#item_'+ $(event.target).attr('data-id') + '_menu');
				
				/* Add menu button functions on tap */
				$('#item_'+ $(event.target).attr('data-id') + '_menu').find('#delete').hammer().on("tap", function(event) {
					event.stopPropagation();
					
					/* Removing all event listeners related to the note */
					Hammer($('#item_'+ $(event.target).parent().parent().attr('data-id'))).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
					
					/* Removing all event listeners related to the menu */
					
					/* Activate below when events are done (Create a loop to close events of children) */
					/*
					Hammer($(event.target).parent().children('#reset')).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
					
					Hammer($(event.target).parent().children('#edit')).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
					*/
					
					Hammer($(event.target)).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
					
					/* Removing the note from canvas */
					$('#item_'+ $(event.target).parent().parent().attr('data-id')).remove();
					
					/* Closing menu */
					$(event.target).parent().parent().remove();
					menuOpen = false;
				});
				
				$('#item_'+ $(event.target).attr('data-id') + '_menu').css('left',event.gesture.center.pageX).css('top',event.gesture.center.pageY);
			}
		});
		
		/* When a new note is added add one to ID and z-index values in order to keep them unique */
		currentID++;
		zIndex++;
				
    });
	
	
	/* Function for closing the menu so it can be easily called without copying all the functionality in multiple places */
	function closeMenu()
	{
		/*
		Hammer(currentMenu.parent().children('#reset')).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
		
		Hammer(currentMenu.parent().children('#edit')).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
		*/
	
		Hammer(currentMenu.parent().children('#delete')).off('hold tap doubletap drag dragstart dragend dragup dragdown dragleft dragright swipe swipeup swipedown swipeleft swiperight transform transformstart transformend rotate pinch pinchin pinchout touch release');
		
		currentMenu.remove();
		
		menuOpen = false;
		
		/* NOT COMPLETE ! */
	}
	
	/* Helper function got from Stackoverflow for rotation */
	/* http://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate */
	
	function getRotationDegrees(obj) {
		var matrix = obj.css("-webkit-transform") ||
		obj.css("-moz-transform")    ||
		obj.css("-ms-transform")     ||
		obj.css("-o-transform")      ||
		obj.css("transform");
		if(matrix !== 'none') {
			var values = matrix.split('(')[1].split(')')[0].split(',');
			var a = values[0];
			var b = values[1];
			var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
		} else { var angle = 0; }
		return (angle < 0) ? angle +=360 : angle;
	}

});
