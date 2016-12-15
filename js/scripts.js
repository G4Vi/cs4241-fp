$(document).ready(function($) {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function() {
      location.reload();
    });
  }
});

setTimeout(function(){
    console.log('loaded');
    document.getElementById("preview").style.height = document.getElementById("preview").contentWindow.document.body.scrollHeight + 'px';
}, 1000);

