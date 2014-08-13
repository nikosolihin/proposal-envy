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

  var imgSource = $('.huge-image').attr('src');
  var imgHeight = $('.huge-image').height();
  var imgWidth = $('.huge-image').width();
  var divClasses = $('.huge-image').parent().parent().attr('class');
  $('.huge-image').parent().addClass('removed');
  $('.huge-image').parent().empty();
  var temp = $('.removed').parent().parent().html().split('<figure class="removed"></figure>');
  var fresh = temp[0]+'</div><div class="full-image columns"></div><div class="'+divClasses+'">'+temp[1];
  $('.entry-content').html(fresh);
  $('.full-image').css('background-image', 'url(' + imgSource +')');
  $('.full-image').css('height', imgHeight);
});