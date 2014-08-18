$(function() {
  // scroll to div ID
  $("a[href*=#]:not([href=#])").click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $("html,body").animate({
          scrollTop: target.offset().top
        }, 400);
        return false;
      }
    }
  });

  $(".fb-share").click(function(e){
    e.preventDefault();
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
        object: $(location).attr('href')
      })
    }, function(response){});
  });

  $(".twitter-share").click(function(e){
    e.preventDefault();
    window.open('https://twitter.com/share?text=Proposal+Story%3A+'+$(document).find("title").text()+'&url='+$(this).attr('href'), "popupWindow", "width=575,height=245,scrollbars=yes");
  });

  $(window).scroll(function() {
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

  // Redirect to different category pages
  $(".category-select").change(function(){
    window.location.href = $(this).val();
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
  var carousel = '<div class="story-carousel hide-for-small-only">' + $(".story-carousel").html() + '</div>';
  $(".story-carousel").empty();
  var temp = $(".story-carousel").parent().parent().html().split('<div class="story-carousel"></div>');
  var fresh = temp[0]+'</div>'+carousel+'<div class="'+divClasses+'">'+temp[1];
  $(".entry-content").html(fresh);
  // Set top margin here because css won't work
  $('.story-carousel').prev().css('margin-bottom', 20);
  $('.story-carousel').css('margin-bottom', 60);

  $('.story-carousel').slick({
    dots: true,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    swipe: true,
    touchMove: true,
    infinite: true,
    speed: 350,
    cssEase: 'linear'
  });
});