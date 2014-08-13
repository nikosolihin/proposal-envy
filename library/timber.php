<?php

  if (!class_exists('Timber')){
    add_action( 'admin_notices', function(){
      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a></p></div>';
    });
    return;
  }

  class StarterSite extends TimberSite {

    function __construct(){
      add_theme_support('post-formats');
      add_theme_support('post-thumbnails');
      add_theme_support('menus');
      add_filter('timber_context', array($this, 'add_to_context'));
      add_filter('get_twig', array($this, 'add_to_twig'));
      add_action('init', array($this, 'register_post_types'));
      add_action('init', array($this, 'register_taxonomies'));
      parent::__construct();
    }

    function register_post_types(){
      //this is where you can register custom post types
    }

    function register_taxonomies(){
      //this is where you can register custom taxonomies
    }

    function add_to_context($context){
      $context['menu'] = new TimberMenu();
      $context['site'] = $this;
      return $context;
    }

    function add_to_twig($twig){
      /* this is where you can add your own fuctions to twig */
      $twig->addExtension(new Twig_Extension_StringLoader());
      $twig->addFilter('myfoo', new Twig_Filter_Function('myfoo'));
      $twig->addFilter('toRGB', new Twig_Filter_Function('toRGB'));
      return $twig;
    }

  }

  new StarterSite();

  function toRGB($hex){
    $hex = str_replace("#", "", $hex);

    if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
    } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
    }
    $rgb = array($r, $g, $b);
    return implode(",", $rgb);
  }