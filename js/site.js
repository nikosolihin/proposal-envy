$(function() {
  $(window).scroll(function() {
    // .css( 'opacity', -( $(this).scrollTop()/1000));

    var offset = $(this).scrollTop()/$(this).height();
    var textSpeed = 265 * offset - 40;
    var textOpacity = 1 - ((.2 * offset) + offset);
    var scrollOpacity = offset + .05;

    $('.hero-action').css({
      transform: "translate3d(0,"+ textSpeed +"%,0)",
      opacity: textOpacity
    });
    // $("#hero-mask").css({opacity:scrollOpacity});
  });

  // Pause background video when hero-video is clicked
  $('#play-button').click(function(e){
    $('#hero-video').get(0).pause();
    $("#video-iframe")[0].src += "?autoplay=1";
    e.preventDefault();
  });
  $('.close-reveal-modal').click(function(){
    $('#hero-video').get(0).play();
  });
  $('#play-video').on('click', function(ev) {

  });
});