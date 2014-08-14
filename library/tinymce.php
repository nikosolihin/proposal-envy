<?php

// Disable unused headings and pre formatting
function wpa_45815($arr){
    $arr['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3';
    return $arr;
  }
add_filter('tiny_mce_before_init', 'wpa_45815');

// Add new styles to the TinyMCE "formats" menu dropdown
if ( ! function_exists( 'wpex_styles_dropdown' ) ) {
  function wpex_styles_dropdown( $settings ) {

    // Create array of new styles
    $new_styles = array(
      array(
        'title' => __( 'Custom Styles', 'wpex' ),
        'items' => array(
          array(
            'title'     => __('Theme Button','wpex'),
            'selector'  => 'a',
            'classes'   => 'theme-button'
          ),
          array(
            'title'     => __('Highlight','wpex'),
            'inline'    => 'div',
            'classes'   => 'max-width'
          )
        ),
    ),
    array(
        'title' => __( 'Image Styles', 'wpex' ),
        'items' => array(
          array(
            'title'     => __('Full Width','wpex'),
            'selector'  => 'img',
            'classes'   => 'full-image'
          )
        )
      )
    );
    // Merge old & new styles
    $settings['style_formats_merge'] = true;
    // Add new styles
    $settings['style_formats'] = json_encode( $new_styles );
    // Return New Settings
    return $settings;
  }
}
add_filter( 'tiny_mce_before_init', 'wpex_styles_dropdown' );
?>