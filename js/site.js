$(function() {
  $(window).scroll(function() {
    // .css( 'opacity', -( $(this).scrollTop()/1000));

    var offset = $(this).scrollTop()/$(this).height();
    var textSpeed = 265 * offset - 40;
    var textOpacity = 1 - ((.2 * offset) + offset);
    var scrollOpacity = offset + .05;

    $(".hero-action").css({
      transform: "translate3d(0,"+ textSpeed +"%,0)",
      opacity: textOpacity
    });
    // $("#hero-mask").css({opacity:scrollOpacity});
  });

  // Pause background video when hero-video is clicked
  $("#play-button").click(function(e){
    $("#hero-video").get(0).pause();
    $("#video-iframe")[0].src += "?autoplay=1";
    e.preventDefault();
  });
  $(".close-reveal-modal").click(function(){
    $("#hero-video").get(0).play();
  });


  var divClasses = $(".story-carousel").parent().attr('class');
  var carousel = '<div class="story-carousel">' + $(".story-carousel").html() + '</div>';
  $(".story-carousel").empty();
  var temp = $(".story-carousel").parent().parent().html().split('<div class="story-carousel"></div>');
  var fresh = temp[0]+'</div>'+carousel+'<div class="'+divClasses+'">'+temp[1];
  $(".entry-content").html(fresh);
  // Set top margin here because css won't work
  $('.story-carousel').prev().css('margin-bottom', 40);
  $('.story-carousel').css('margin-bottom', 80);

  $('.story-carousel').slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    swipe: true,
    touchMove: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear'
  });


  // $("blockquote").each(function(index) {
  //   var blockquote;
  //   blockquote = '<blockquote class="full-blockquote">';
  //   blockquote = blockquote + '<i class="icon-quote-left"></i>';
  //   blockquote = blockquote + '<p>' + $("blockquote").text() + '</p>';
  //   blockquote = blockquote + '</blockquote>';

  //   var divClasses = $("blockquote").parent().attr("class");
  //   $("blockquote").addClass("removed"+index);
  //   $("blockquote").empty();
  //   var temp = $(".removed"+index).parent().parent().html().split('<blockquote class="removed"></blockquote>');
  //   var fresh = temp[0]+'</div>'+blockquote+'<div class="'+divClasses+'">'+temp[1];
  //   $(".entry-content").html(fresh);
  // });

});