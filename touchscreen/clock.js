/* CSS driven clock */

var secondHand = true;

var date = new Date();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();

var screenMinute = (minute < 10) ? '0'+minute : minute;
var screenSecond = (second < 10) ? '0'+second : second;
var screenHour = (hour < 10) ? '0'+hour : hour;

var hourDegrees = 360/12;
var degrees = 360/60;

var secondRotation = second*degrees;
var minuteRotation = minute*degrees;
var hourRotation = hour*hourDegrees;

$('document').ready(function() {
	buildClock();
	runClock();
	
	$( window ).resize(function() {
		$('#face').css('height',parseInt($('#face').css('width')));
		
		var origin = (parseInt($('#face').css('height'))/2) - (parseInt($('#face').css('height'))*0.03);
	
		$('.secondIndicator').css('-webkit-transform-origin','0.5% '+origin+'px');
		$('.hourIndicator').css('-webkit-transform-origin','0.5% '+origin+'px');
		
		var digitalHeight = parseInt($('#face').css('width'))/8;
		$('#digital')
		.css('height',digitalHeight)
		.css('font-size',digitalHeight*.8);
	});
});

function buildClock()
{
	
	$('#clock').append('<div id="face"></div>');
	$('#clock').append('<div id="digital"></div>');
	
	$('#face').css('height',parseInt($('#face').css('width')));
	
	$('#digital').append('<span id="hour" class="time">'+screenHour+'</span><span class="colon">:</span><span id="minute" class="time">'+screenMinute+'</span><span class="colon">:</span><span id="second" class="time">'+screenSecond+'</span>');
	
	var digitalHeight = parseInt($('#face').css('width'))/8;
	$('#digital')
		.css('height',digitalHeight)
		.css('font-size',digitalHeight*.8);
		
	
	for(var i = 0;i <= 60;i++)
	{
		var handPosition = degrees*i;
		if(i % 5)
			$('#face').prepend('<div id="hand'+i+'" class="secondIndicator"></div>');
		else
			$('#face').prepend('<div id="hand'+i+'" class="hourIndicator"></div>');
			
		$('#hand'+i).css('-webkit-transform', 'rotate('+handPosition+'deg)');
		
	}
	
	var origin = (parseInt($('#face').css('height'))/2) - (parseInt($('#face').css('height'))*0.03);
	
	$('.secondIndicator').css('-webkit-transform-origin','0.5% '+origin+'px');
	$('.hourIndicator').css('-webkit-transform-origin','0.5% '+origin+'px');
	
	if(secondHand)
	{
		$('#face').prepend('<div class="second"></div>');
		$('.second').css('-webkit-transform', 'rotate('+secondRotation+'deg)');
	}
	
	$('#face').prepend('<div class="minute"></div>');
	$('.minute').css('-webkit-transform', 'rotate('+minuteRotation+'deg)');
	
	$('#face').prepend('<div class="hour"></div>');
	$('.hour').css('-webkit-transform', 'rotate('+hourRotation+'deg)');
	
	$('#face').append('<div class="center"></div>');
}



function runClock()
{
	doTimer(1000, 1, function(steps)
	{
		second++;
		if(second == 60)
		{
			second = 0;
			minute++;
			if(minute == 60)
			{
				minute = 0;
				hour++;
			}
		}
		
		screenMinute = (minute < 10) ? '0'+minute : minute;
		screenSecond = (second < 10) ? '0'+second : second;
		screenHour = (hour < 10) ? '0'+hour : hour;
		
		$('#second').html(screenSecond);
		$('#minute').html(screenMinute);
		$('#hour').html(screenHour);
		
		secondRotation = second*degrees;
		minuteRotation = minute*degrees;
		hourRotation = hour*hourDegrees;
		if(secondHand)
		$('.second').css('-webkit-transform', 'rotate('+secondRotation+'deg)');
		$('.minute').css('-webkit-transform', 'rotate('+minuteRotation+'deg)');
		$('.hour').css('-webkit-transform', 'rotate('+hourRotation+'deg)');
		runClock();
	},
	function(){
		
	});
	
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


/* Helper function for accurate timing */
/* http://www.sitepoint.com/creating-accurate-timers-in-javascript/ */

function doTimer(length, resolution, oninstance, oncomplete)
{
    var steps = (length / 100) * (resolution / 10),
        speed = length / steps,
        count = 0,
        start = new Date().getTime();

    function instance()
    {
        if(count++ == steps)
        {
            oncomplete(steps, count);
        }
        else
        {
            oninstance(steps, count);

            var diff = (new Date().getTime() - start) - (count * speed);
            window.setTimeout(instance, (speed - diff));
        }
    }

    window.setTimeout(instance, speed);
}