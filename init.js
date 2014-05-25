var timer = setInterval(function() {
   if ($('.aw-widget-content').length == 1) {
       $('.aw-widget-content').attr('style','border: none !important');
       clearInterval(timer);
   }
}, 200);