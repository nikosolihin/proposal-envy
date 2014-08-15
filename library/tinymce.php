<?php
// Disable unused headings and pre formatting
function wpa_45815($arr){
    $arr['block_formats'] = 'Huge=h2;Heading=h3;Paragraph=p';
    return $arr;
  }
add_filter('tiny_mce_before_init', 'wpa_45815');

// Add new styles to the TinyMCE "formats" menu dropdown
if ( ! function_exists( 'wpex_styles_dropdown' ) ) {
  function wpex_styles_dropdown( $settings ) {

    // Create array of new styles
    $new_styles = array(
      array(
        'title' => __( 'Styling', 'wpex' ),
        'items' => array(
          array(
            'title'     => __('Video','wpex'),
            'wrapper'  => true,
            'block'    => 'div',
            'classes'   => 'flex-video widescreen'
          ),
          array(
            'title'     => __('Full Width Image','wpex'),
            'selector'  => 'img',
            'classes'   => 'full-image'
          )
        )
      )
    );
    // Merge old & new styles
    $settings['style_formats_merge'] = false;
    // Add new styles
    $settings['style_formats'] = json_encode( $new_styles );
    // Return New Settings
    return $settings;
  }
}
add_filter( 'tiny_mce_before_init', 'wpex_styles_dropdown' );
?>