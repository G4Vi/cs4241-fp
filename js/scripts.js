var lastentry = "";
$('#searchbox').keyup(function(event) {
    if($('#searchbox').val() != lastentry) {
        var currententry = $('#searchbox').val();
        function mCallback (data, status){
            $('#movielist').html(data);
            window.history.pushState(null, null, "search?search=" + currententry);     
        }
        
        $.get("search?search=" + currententry + "&inline=true", mCallback)
      
    }
    lastentry = $('#searchbox').val()
}); 

$(document).ready(function($) {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function() {     
	  location.reload();
    });    
  }
});

$('#insertbox').on('click focusin', function() {
    if(this.value == 'Enter a movie to insert')
    {
        this.value = ''
        $(this).css('font-style', 'normal')
        $(this).css('color', '#000000');
    }
});

$('#searchbox').on('click focusin', function() {
    if(this.value == 'Enter a movie to search')
    {
        this.value = ''
        $(this).css('font-style', 'normal')
        $(this).css('color', '#000000');
    }
});

setTimeout(function(){
    console.log('loaded');
    document.getElementById("preview").style.height = document.getElementById("preview").contentWindow.document.body.scrollHeight + 'px';
}, 1000);

