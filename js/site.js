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

  // for FB Share
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

  // for twitter share
  $(".twitter-share").click(function(e){
    e.preventDefault();
    window.open('https://twitter.com/share?text=Proposal+Story%3A+'+$(document).find("title").text()+'&url='+$(this).attr('href'), "popupWindow", "width=575,height=245,scrollbars=yes");
  });



  // for homepage parallax on video thing
  $(window).scroll(function() {
    var ST = $(this).scrollTop();
    var offset = ST/$(this).height();
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

  // Pause hero video
  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $("#hero-video").get(0).pause();
  });
  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $("#hero-video").get(0).play();
  });

  // Mobile menu
  $("#nav-toggle").click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    $(".overlay").toggleClass('open');
    $("#nav-text").toggleClass('off');
  });

  // sets up image to use fluidbox
  $("figure a").fluidbox();

  // Get outta the way menu!
  $('#nav-bar').scrollUpMenu();








  // sets up default wordpress gallery to use slick carousel
  // var divClasses = $(".story-carousel").parent().attr('class');
  // var carousel = '<div class="story-carousel hide-for-small-only">' + $(".story-carousel").html() + '</div>';
  // $(".story-carousel").empty();
  // var temp = $(".story-carousel").parent().parent().html().split('<div class="story-carousel"></div>');
  // var fresh = temp[0]+'</div>'+carousel+'<div class="'+divClasses+'">'+temp[1];
  // $(".entry-content").html(fresh);
  // // Set top margin here because css won't work
  // $('.story-carousel').prev().css('margin-bottom', 20);
  // $('.story-carousel').css('margin-bottom', 60);

  // $(".story-carousel").slick({
  //   dots: true,
  //   arrows: false,
  //   fade: true,
  //   autoplay: true,
  //   autoplaySpeed: 5000,
  //   swipe: true,
  //   touchMove: true,
  //   infinite: true,
  //   speed: 350,
  //   cssEase: 'linear'
  // });


  // Mailchimp submission via AJAX
  // $('#subscribe').ajaxChimp({
  //   url: '//proposalenvy.us9.list-manage.com/subscribe/post?u=ca8ce0af86bcc57be42d033e5&amp;id=569d343fb2',
  //   callback: subCallbackFunction
  // });

  // function subCallbackFunction (resp) {
  //   console.log(resp);
  //   $('#subscribe button').addClass('disabled');
  //   if (resp.result === 'success') {
  //     $('#subscribe-email').val('Check email for verification...');
  //   } else {
  //     // $('#subscribe-email').parent('div').addClass('has-error');
  //     // $('#subscribe-email').parent('div').append("<p class='val-msg'>" + resp.msg.substring(4) + "</p>");
  //     $('#subscribe button').removeClass('disabled');
  //   }
  // }

});