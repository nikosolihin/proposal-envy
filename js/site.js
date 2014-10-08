$(function() {

  var mq = "small";
  if ( !matchMedia(Foundation.media_queries['medium']).matches ) {
    // Small
    mq = "small";
  } else if ( !matchMedia(Foundation.media_queries['large']).matches ) {
    // Medium
    mq = "medium";
  } else if ( !matchMedia(Foundation.media_queries['xlarge']).matches ) {
    // Large
    mq = "large";
  } else {
    // XLarge
    mq = "xlarge";
  }

  // Menu waypoint on packages page on small devices
  if (mq == "small") {
    $(".packages-mobile-waypoint").addClass('menu-waypoint');
  } else {
    // Menu waypoint on packages page on tablet up
    $(".packages-table-menu").addClass('menu-waypoint');
  }

  var masonryColumns = function( fn ) {
    // Detemine how many masonry columns to have based on Foundation's MQ
    if ( !matchMedia(Foundation.media_queries['medium']).matches ) {
      // Small
      $(".journal-article").css("width", ($(".journal-wrapper").width()/1-15) );
    } else if ( !matchMedia(Foundation.media_queries['large']).matches ) {
      // Medium
      $(".journal-article").css("width", ($(".journal-wrapper").width()/2-15) );
    } else if ( !matchMedia(Foundation.media_queries['xlarge']).matches ) {
      // Large
      $(".journal-article").css("width", ($(".journal-wrapper").width()/3-15) );
    } else {
      // XLarge
      $(".journal-article").css("width", ($(".journal-wrapper").width()/3-15) );
    }
  };

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

  // .lets-talk buttons
  $(".lets-talk").click(function(e){
    e.preventDefault();
    olark('api.box.expand');
  });

  // for twitter share
  $(".twitter-share").click(function(e){
    e.preventDefault();
    window.open('https://twitter.com/share?text='+$(document).find("title").text()+'&url='+$(this).attr('href'), "popupWindow", "width=575,height=245,scrollbars=yes");
  });

  var notInHeader = false;
  var notOverlay = true;
  $(".menu-waypoint").waypoint( function(direction){
    if ( direction == "up" && notOverlay ) {
      // scrolling down out of header
      $('.menu-wrapper').removeClass('shaded');
      $('.menu-wrapper').removeClass('closed');
      notInHeader = false;
    } else if ( direction == "down" && notOverlay ) {
      // scrolling up into header and overlay is not open
      $('.menu-wrapper').addClass('closed');
      notInHeader = true;
    }
  }, { offset: 200 });

  // For anything that requires scrolltop value
  var lastST = 0;
  var lastDirection = "down";
  $(window).scroll(function() {
    var ST = $(this).scrollTop();
    var offset = ST/$(this).height();
    var textSpeed = 265 * offset - 50;
    var textOpacity = 1 - ((.2 * offset) + offset);
    var scrollOpacity = offset + .05;
    notOverlay = $(".overlay").hasClass('open') ? false : true;

    // for menu hiding based on scroll direction
    if ( ST > lastST ) {
      // up up..suddenly downscroll
      if ( ST > lastST && lastDirection == "up" && notInHeader && notOverlay ) {
        $(".menu-wrapper").addClass('closed');
      }
      lastDirection = "down";
    } else {
      // down down..suddenly upscroll
      if ( ST < lastST && lastDirection == "down" && notInHeader &&  notOverlay ) {
        $(".menu-wrapper").addClass('shaded');
        $(".menu-wrapper").removeClass('closed');
      }
      lastDirection = "up";
    }
    lastST = ST;

    // for homepage parallax on video thing (Only on S & M)
    if ( mq == "large" || mq == "xlarge" ) {
      $(".hero-action").css({
        transform: "translate3d(0,"+ textSpeed +"%,0)",
        opacity: textOpacity
      });
    }
  });


  // Mobile menu
  $(".nav-toggle-click-area").click(function(e){
    e.preventDefault();
    $(".nav-toggle").toggleClass('active');
    $(".overlay").toggleClass('open');
    $(".nav-text").toggleClass('off');
    $(".menu-wrapper").toggleClass('shaded');
    if (!notInHeader) {
      $(".menu-wrapper").removeClass('shaded');
    }
    if ($(".overlay").hasClass('open')) {
      olark('api.box.hide');
    } else {
      olark('api.box.show');
    }
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

  // If #slideshow exists then set it up
  if( $("#slideshow").length ) {
    $("#slideshow").slick({
      dots: true,
      arrows: false,
      fade: false,
      autoplay: true,
      autoplaySpeed: 10000,
      swipe: false,
      draggable: false,
      touchMove: true,
      infinite: true,
      speed: 350,
      cssEase: 'ease-in-out'
    });
    // Set up the prev and next arrows
    $(".slideshow-prev").click(function() {
      $("#slideshow").slickPrev();
    });
    $(".slideshow-next").click(function() {
      $("#slideshow").slickNext();
    });
  }

  if( $("#tiles").length ) {
    var $container = $("#tiles");
    // initialize Masonry after all images have loaded
    $container.imagesLoaded( function() {
      $container.masonry({
        gutter: 12,
        itemSelector: '.item'
      });
      $container.lightGallery({
        loop : true
      });
      // remove WP Gallery from the DOM
      $("[id^=gallery-]").remove();
    });
  }

  $( window ).resize(function() {
    masonryColumns();
  });

  if( $(".journal-content").length ) {
    var $journalContainer = $(".journal-content");
    $journalContainer.imagesLoaded( function() {
      masonryColumns();
      $journalContainer.masonry({
        itemSelector: '.journal-article',
        gutter: 20,
        isFitWidth: true
      });
    });
  }

  $("[class^=package-]").click(function(e){
    e.preventDefault();
    $(".packages-expand td").children().hide();
    var package = $(this).attr('class').match("package-(.*) button")[1];
    $(".packages-expand, .package-"+package+"-details").fadeIn(300);
    $("html,body").animate({
      scrollTop: $("#packages-detail-jump").offset().top
    }, 400);
    return false;
  });

  // Make the first package the active tab
  $(".packages-tab").first().children('a').addClass('packages-select-active');

  // Show Inception tab by default
  $(".packages-inception").show();
  $(".packages-select-link").click(function(e){
    e.preventDefault();
    $(".packages-select-active").removeClass("packages-select-active");
    $(this).parent().addClass("packages-select-active");
    $(".packages-tab, .packages-frame").hide();
    $(".packages-" + $(this).text().toLowerCase().split(' proposals')[0]).fadeIn(300);
  });

  // Each tab has expand button
  $(".packages-open").click(function(e){
    e.preventDefault();
    $(".packages-" + $(".packages-select-active a").text().toLowerCase().split(' proposals')[0] + " .packages-frame").fadeIn(300);
  });
  // Each tab has book now button
  $(".packages-book").click(function(e){
    e.preventDefault();
    olark('api.box.show');
    olark('api.box.expand');
    $("#habla_wcsend_input, #habla_offline_body_input").val("I want to book the " +
      $(".packages-select-active a").text() + " package. Please get back to me as soon as you can");
  });

  // Book Now button
  $(".book").click(function(e){
    e.preventDefault();
    olark('api.box.show');
    olark('api.box.expand');
    $("#habla_wcsend_input, #habla_offline_body_input").val("I want to book the " +
      $(this).siblings(".title-bold").text() + " package. Please get back to me as soon as you can");
  });

  // Packages FAQs
  $(".question").click(function(){
    $(this).next('.answer').fadeToggle(100);
  });

  // Mailchimp submission via AJAX
  $('#subscribe').ajaxChimp({
    url: '//proposalenvy.us9.list-manage.com/subscribe/post?u=ca8ce0af86bcc57be42d033e5&amp;id=569d343fb2',
    callback: subCallbackFunction
  });
  function subCallbackFunction (resp) {
    $('#subscribe button').addClass('disabled');
    if (resp.result === 'success') {
      $('#subscribe-email').css('color', '#aaaaaa');
      $('#subscribe-email').val('Check your email for verification.');
    } else {
      $('#subscribe-email').css('color', '#fc4640');
      $('#subscribe-email').val('Enter a valid email address.');
      $('#subscribe button').removeClass('disabled');
    }
  }
});