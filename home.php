<?php
/*
Template Name: Home
*/
?>

<!DOCTYPE html>
<!--[if IE 9]><html class="lt-ie10" lang="en" > <![endif]-->
<html class="no-js" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Proposal Envy | Indonesia's Marriage Proposal Planners</title>
    <link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon.ico" />
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri() ; ?>/css/app.css" />
    <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/modernizr/modernizr.min.js"></script>
    <style type="text/css">
      /*.hero { background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/img/hero-bg.jpg'); }*/
      .packages { background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/img/bali.jpg'); }
      .success-story { background-image: linear-gradient(rgba(134, 206, 211, 0.85),rgba(134, 206, 211, 0.85)),url('<?php echo get_stylesheet_directory_uri(); ?>/assets/img/success-story.jpg'); }
      .proposal-story { background-image: linear-gradient(rgba(226, 195, 90, 0.85), rgba(226, 195, 90, 0.85)),url('<?php echo get_stylesheet_directory_uri(); ?>/assets/img/proposal-story.jpg'); }
      .hint { background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/assets/img/hint-bg.jpg'); }
    </style>
  </head>
  <body data-grid-framework="f4" data-grid-color="pink" data-grid-opacity="0.3" data-grid-zindex="10" data-grid-gutterwidth="30px" data-grid-nbcols="16">
    <?php include_once(get_stylesheet_directory() . "/assets/svg/sprite.svg"); ?>
    <main>
      <header class="hero">
        <div class="hero-bg hide-for-large-up"></div>
        <!-- <span id="hero-mask"></span> -->
        <video autoplay loop class="show-for-large-up" poster="http://artbees.net/themes/jupiter-demo/wp-content/uploads/2013/10/home-vid-img.jpg" id="hero-video">
          <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/video/header.webm" type="video/webm">
          <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/video/header.mp4" type="video/mp4">
          <source src="<?php echo get_stylesheet_directory_uri(); ?>/assets/video/header.ogv" type="video/ogg">
        </video>

       <div class="contain-to-grid menu-wrap">
          <nav class="top-bar" data-topbar>
            <ul class="title-area">
              <li class="logo">
                <h1>
                  <a href="proposalenvy.dev">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/svg/svgs/menu.svg" alt="Proposal Envy">
                  </a>
                </h1>
              </li>
            </ul>
            <section class="top-bar-section">
              <ul class="right">
                <li><a href="#">Our Works</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Packages</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </section>
          </nav>
        </div>

        <div class="row hero-action">
          <div class="small-12 columns">
            <h3 class="hero-subtitle">Beautifully Crafted</h3>
            <h1 class="hero-title">Proposals</h1>
            <h5 class="hero-tagline">Leave the planning to us and worry about the big question</h5>
            <a href="#" class="button coral">Portfolio</a>
            <a href="#" class="button wire">Play Video</a>
          </div>
        </div>
      </header>

      <section class="about text-center">
        <div class="row">
          <div class="large-12 medium-12 columns">
            <h5>Indonesia's First Proposal Planner</h5>
            <h2>Turning Dreams Into Reality</h2>
            <hr>
          </div>
        </div>
        <div class="row">
          <div class="large-2 large-offset-3 columns divider">
            <a href="#" class="link">Who are we?</a>
          </div>
          <div class="large-2 columns divider">
            <a href="#" class="link active">Why hire us?</a>
          </div>
          <div class="large-2 end columns">
            <a href="#" class="link">Testimonials</a>
          </div>
        </div>
        <div class="row about-blurb hide">
          <div class="large-8 large-offset-2 columns">
            <p class="gradient-text">We are a group of <strong>passionate young talents</strong> (photographers, videographers, designers, editors, and stylists), working together to create beautiful masterpieces.</p>
          </div>
        </div>
        <div class="row reasons">
          <div class="large-4 columns">
            <svg>
              <use xlink:href="#shape-save-time"></use>
            </svg>
            <h4>Save time &amp; money</h4>
            <p>We plan everything for you, hire trusted vendors, scout the perfect location, and negotiate on/under budget rates on your behalf. All you have to do is bring the ring!</p>
          </div>
          <div class="large-4 columns">
            <svg>
              <use xlink:href="#shape-planner"></use>
            </svg>
            <h4>We were born to plan</h4>
            <p>We have a passion for the big picture and devotion to little details. Your proposal will run seamlessly and on schedule. All according to a predefined timeline we provide in the beginning.</p>
          </div>
          <div class="large-4 columns">
            <svg>
              <use xlink:href="#shape-creative"></use>
            </svg>
            <h4>Brilliant Creatives</h4>
            <p>Our creativity helps you brainstorm a more personalized proposal catered to your relationship. No romantic concepts are re-used. They are freshly baked just for you.</p>
          </div>
        </div>
        <div class="row">
          <a href="#" class="button coral">Get to know us</a>
        </div>
      </section>


      <section class="packages text-center">
       <div class="row">
        <div class="xlarge-6 xlarge-offset-3 large-8 large-offset-2 medium-10 medium-offset-1 panel columns">
          <h5>Destination Proposal</h5>
          <h2>Bali</h2>
          <hr>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel id quas quasi repellat itaque eos, officiis culpa? Eligendi iusto, odit repellat sint nulla ipsam eveniet praesentium, dolor sapiente facere molestias.</p>
          <a href="#" class="button coral">See Other Packages</a>
        </div> <!-- columns -->
       </div> <!-- row -->
      </section>

      <section class="stories text-center">
        <div class="row max-width">
          <div class="success-story large-6 columns">
            <h5>Featured Success Story</h5>
            <h2>Handy & Arista</h2>
            <h6>Bali 2013</h6>
            <hr>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, autem, corporis? Non, maxime dolorum neque vel! Quibusdam, nesciunt corporis, voluptatum id suscipit tempora pariatur est, saepe ducimus enim totam voluptatibus.</p>
            <a href="#" class="button wire">Watch Video</a>
            <a href="#" class="button coral">Read Story</a>
          </div>
          <div class="proposal-story large-6 columns">
            <div class="tint">
              <h5>Featured Proposal Story</h5>
              <h2>Guy &amp; Girl</h2>
              <h6>Jakarta 2013</h6>
              <hr>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, autem, corporis? Non, maxime dolorum neque vel! Quibusdam, nesciunt corporis, voluptatum id suscipit tempora pariatur est, saepe ducimus enim totam voluptatibus.</p>
              <a href="#" class="button wire">Watch Video</a>
              <a href="#" class="button white">Read Story</a>
            </div>
          </div>
        </div> <!-- row -->
      </section>

      <section class="instagram text-center hide">
        <div class="row">
          <div class="large-12 columns">
            <h2>What we're up to</h2>
            <!-- insert divider -->
          </div>
        </div>
      </section>

      <section class="hint">
        <div class="row">
          <div class="large-5 columns">
            <h5>Drop Him A Hint</h5>
            <p>Ladies here’s your chance to “drop a hint” to your boyfriend that you want to get married! Some gentlemen just need a little guidance, whether or not they realize it. Proposal Envy’s here to help!</p>
          </div>
          <div class="large-2 text-center columns">
            <p>bird image</p>
          </div>
          <div class="large-5 columns">
            <h5>Lorem Ipsum Dolor</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <a href="#" class="button coral">Help Me</a>
          </div>
        </div>
      </section>

      <footer>
        <div class="row">
          <div class="medium-3 columns navigation">
            <h5>Quick Links</h5>
            <div class="row">
              <div class="medium-4 columns">
                <ul>
                  <li><a href="">Home</a></li>
                  <li><a href="">About Us</a></li>
                  <li><a href="">Packages</a></li>
                  <li><a href="">FAQ</a></li>
                </ul>
              </div>
              <div class="medium-8 columns">
                <ul>
                  <li><a href="">Stories</a></li>
                  <li><a href="">Blog</a></li>
                  <li><a href="">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="medium-4 columns contact">
            <h5>Let's Work Together</h5>
            <div class="row">
              <div class="medium-1 columns">
                <ul>
                  <li>icon</li>
                  <li>icon</li>
                  <li>icon</li>
                  <li>icon</li>
                </ul>
              </div>
              <div class="medium-9 end columns">
                <ul>
                  <li>info@proposalenvy.com</li>
                  <li>+62-0818-858-805 <br> +61-0817-757-337</li>
                  <li>(Meetings by appointment only)</li>
                  <li>2B1F188E</li>
                  <li>308 Negra Arroyo Lane, Albuquerque, NM 87104</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="medium-5 columns newsletter">
            <div class="row">
              <div class="medium-12 columns">
                <h5>Don't Be A Stranger</h5>
                <p>Sign up for updates &amp; exciting offers from us.</p>
              </div>
            </div>
            <div class="row collapse">
              <div class="small-6 columns">
                <input type="text" placeholder="Your Email Address" class="radius">
              </div>
              <div class="small-3 end columns">
                <button type="submit" class="button postfix radius">Subscribe</button>
              </div>
            </div>
            <div class="row">
              <div class="medium-12 columns">
                <ul class="inline-list social text-center">
                  <li>
                    <a href="" target="_blank">
                      <i class="icon-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="" target="_blank">
                      <i class="icon-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="" target="_blank">
                      <i class="icon-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="" target="_blank">
                      <i class="icon-pinterest"></i>
                    </a>
                  </li>
                  <li>
                    <a href="" target="_blank">
                      <i class="icon-youtube-play"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row footer-info">
          <div class="large-2 columns text-left">
            <img src="<?php echo get_stylesheet_directory_uri() ; ?>/assets/img/icons/logo-light.svg" alt="Copyright - Proposal Envy">
          </div>
          <div class="large-10 columns text-right">
            <p> &copy; Proposal Envy. All rights reserved</p>
          </div>
        </div>
      </footer>

    </main>

    <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/foundation/js/vendor/jquery.js"></script>
    <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/foundation/js/vendor/fastclick.js"></script>
    <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/foundation/js/foundation/foundation.js"></script>
    <script src="http://localhost:35729/livereload.js"></script>
    <script>
      $(document).foundation();
      $( document ).ready(function() {
        $(window).scroll(function() {
          // .css( 'opacity', -( $(this).scrollTop()/1000));

          var offset = $(this).scrollTop()/$(this).height();
          var textSpeed = 265 * offset - 40;
          var textOpacity = 1.1 - ((.2 * offset) + offset);
          var scrollOpacity = offset + textOpacity;

          $('.hero-action').css({
            transform: "translate3d(0,"+ textSpeed +"%,0)",
            opacity: textOpacity
          });
          // $("#hero-mask").css({opacity:scrollOpacity})
        });
      });
    </script>
  </body>
</html>
