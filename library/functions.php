<?php

/**
 * Bypass stupid gallery
 * http://wordpress.stackexchange.com/questions/76360/how-to-get-gallery-images
 * ----------------------------------------------------------------------------
 */

function grab_ids_from_gallery() {
    global $post;
    $attachment_ids = array();
    $pattern = get_shortcode_regex();
    $ids = array();

    if (preg_match_all( '/'. $pattern .'/s', $post->post_content, $matches ) ) {   //finds the     "gallery" shortcode and puts the image ids in an associative array at $matches[3]
    $count=count($matches[3]);      //in case there is more than one gallery in the post.
    for ($i = 0; $i < $count; $i++){
        $atts = shortcode_parse_atts( $matches[3][$i] );
        if ( isset( $atts['ids'] ) ){
        $attachment_ids = explode( ',', $atts['ids'] );
        $ids = array_merge($ids, $attachment_ids);
        }
        }
    }
      return $ids;

 }
add_action( 'wp', 'grab_ids_from_gallery' );


// Add Slideshow Shortcode
function slideshow_shortcode() {
    return '<div class="slideshow"></div>';
}
add_shortcode( 'slideshow', 'slideshow_shortcode' );

?>