$('document').ready(function() {

/* Overlay */

var overlay = false;

function addOverlay(url) {

	overlay = true;
	$('body').append('<div id="overlay"><div class="wrap"><div class="left"><div class="wrap"></div></div><div class="mid"><div class="wrap"></div></div><div class="right"><div class="wrap"></div></div></div>');

	$('#overlay > .wrap > .mid > .wrap').append('<iframe src="'+url+'"></iframe>');
	
}

function homeButton()
{
location.reload(forceGet = true);

}

function lunchButton()
{
window.location.assign("lunch/");
}
/*
function configToolButton()
{
window.location.assign("hammer/notes.html");
} 
*/

function configToolButton()
{
addOverlay("hammer/notes.html");
} 

function clickGameButton()
{
window.location.assign("clickgame/");
}

});