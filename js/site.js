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

  $(".full-image").each(function() {
    var imgSource = $(this).attr('src');
    var imgPosition = $(this).attr('class').split(' align').pop();
    var imgHeight = $(this).attr('title') ? $(this).attr('title') : 450;
    var divClasses = $(this).parent().parent().attr('class');
    $(this).parent().addClass('removed');
    $(this).parent().empty();
    var temp = $(".removed").parent().parent().html().split('<figure class="removed"></figure>');
    var fresh = temp[0]+'</div><div class="full-image"></div><div class="'+divClasses+'">'+temp[1];
    $(".entry-content").html(fresh);
    $("div.full-image").css('background-image', 'url(' + imgSource +')');
    $("div.full-image").css('background-position', 'center '+imgPosition);
    $("div.full-image").css('height', imgHeight);
  });


  // var blockquote;
  // blockquote = '<blockquote class="full-blockquote">';
  // blockquote = blockquote + '<i class="icon-quote-left"></i>';
  // blockquote = blockquote + '<p>' + $("blockquote").text() + '</p>';
  // blockquote = blockquote + '</blockquote>';

  // var divClasses = $("blockquote").parent().attr("class");
  // $("blockquote").addClass("removed");
  // $("blockquote").empty();
  // var temp = $(".removed").parent().parent().html().split("<blockquote class="removed"></blockquote>");
  // var fresh = temp[0]+'</div>'+blockquote+'<div class="'+divClasses+'">'+temp[1];
  // $(".entry-content").html(fresh);



});