<?php
// Disable unused headings and pre formatting
function wpa_45815($arr){
    $arr['block_formats'] = 'Huge=h2;Normal=h3;Smaller=h4;Paragraph=p';
    return $arr;
  }
add_filter('tiny_mce_before_init', 'wpa_45815');

// Add new styles to the TinyMCE "formats" menu dropdown
if ( ! function_exists( 'wpex_styles_dropdown' ) ) {
  function wpex_styles_dropdown( $settings ) {

    // Create array of new styles
    $new_styles = array(
      array(
        'title' => 'Make Button',
        'selector' => 'a',
        'classes' => 'button post-set'
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