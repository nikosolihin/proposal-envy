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

    // var imgSource = $(".full-image").attr('src');
    // console.log(imgSource);
    // // var imgPosition = $(".full-image").attr('class').split(' ');
    // var imgHeight = $(".full-image").attr('title') ? $(".full-image").attr('title') : 450;
    // console.log(imgHeight);
    // var divClasses = $(".full-image").parent().parent().attr('class');
    // console.log(divClasses);
    // $(".full-image").parent().addClass('bookmark');
    // console.log('class added');
    // $(".full-image").parent().empty();
    // console.log('emptied');
    // var temp = $(".bookmark").parent().parent().html().split('<figure class="bookmark"></figure>');
    // var fresh = temp[0]+'</div><div class="full-image"></div><div class="'+divClasses+'">'+temp[1];
    // $(".entry-content").html(fresh);
    // $(".full-image").css('background-image', 'url(' + imgSource +')');
    // // $(".full-image-").css('background-position', 'center '+imgPosition);
    // $(".full-image").css('height', imgHeight);
    // $(".bookmark").remove();


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