<?php

/**
 * Start cleanup functions
 * ----------------------------------------------------------------------------
 */

add_action('after_setup_theme','start_cleanup');

function start_cleanup() {

    // launching operation cleanup
    add_action('init', 'cleanup_head');

    // remove WP version from RSS
    add_filter('the_generator', 'remove_rss_version');

    // remove pesky injected css for recent comments widget
    add_filter( 'wp_head', 'remove_wp_widget_recent_comments_style', 1 );

    // clean up comment styles in the head
    add_action('wp_head', 'remove_recent_comments_style', 1);

    // clean up gallery output in wp
    add_filter('gallery_style', 'gallery_style');

    // additional post related cleaning
    add_filter('get_image_tag_class', 'image_tag_class', 0, 4);
    add_filter('get_image_tag', 'image_editor', 0, 4);
    add_filter( 'the_content', 'img_unautop', 30 );

}

/**
 * Clean up head
 * ----------------------------------------------------------------------------
 */

function cleanup_head() {

    // EditURI link
    remove_action( 'wp_head', 'rsd_link' );

    // Category feed links
    remove_action( 'wp_head', 'feed_links_extra', 3 );

    // Post and comment feed links
    remove_action( 'wp_head', 'feed_links', 2 );

    // Windows Live Writer
    remove_action( 'wp_head', 'wlwmanifest_link' );

    // Index link
    remove_action( 'wp_head', 'index_rel_link' );

    // Previous link
    remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 );

    // Start link
    remove_action( 'wp_head', 'start_post_rel_link', 10, 0 );

    // Canonical
    remove_action('wp_head', 'rel_canonical', 10, 0 );

    // Shortlink
    remove_action( 'wp_head', 'wp_shortlink_wp_head', 10, 0 );

    // Links for adjacent posts
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );

    // WP version
    remove_action( 'wp_head', 'wp_generator' );

    // Remove WP version from css
    add_filter( 'style_loader_src', 'remove_wp_ver_css_js', 9999 );

    // Remove WP version from scripts
    add_filter( 'script_loader_src', 'remove_wp_ver_css_js', 9999 );

    // Prevent unneccecary info from being displayed
    add_filter('login_errors',create_function('$a', "return null;"));

}


// remove WP version from RSS
function remove_rss_version() { return ''; }

// remove WP version from scripts
function remove_wp_ver_css_js( $src ) {
    if ( strpos( $src, 'ver=' ) )
        $src = remove_query_arg( 'ver', $src );
    return $src;
}

// remove injected CSS for recent comments widget
function remove_wp_widget_recent_comments_style() {
   if ( has_filter('wp_head', 'wp_widget_recent_comments_style') ) {
      remove_filter('wp_head', 'wp_widget_recent_comments_style' );
   }
}

// remove injected CSS from recent comments widget
function remove_recent_comments_style() {
  global $wp_widget_factory;
  if (isset($wp_widget_factory->widgets['WP_Widget_Recent_Comments'])) {
    remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
  }
}

// remove injected CSS from gallery
function gallery_style($css) {
  return preg_replace("!<style type='text/css'>(.*?)</style>!s", '', $css);
}

/**
 * Clean up image tags
 * ----------------------------------------------------------------------------
 */

// http://css-tricks.com/snippets/wordpress/remove-width-and-height-attributes-from-inserted-images/
add_filter( 'post_thumbnail_html', 'remove_width_attribute', 10 );
add_filter( 'image_send_to_editor', 'remove_width_attribute', 10 );

function remove_width_attribute( $html ) {
   $html = preg_replace( '/(width|height)="\d*"\s/', "", $html );
   return $html;
}

// Remove default inline style of wp-caption
add_shortcode('wp_caption', 'fixed_img_caption_shortcode');
add_shortcode('caption', 'fixed_img_caption_shortcode');
function fixed_img_caption_shortcode($attr, $content = null) {
    if ( ! isset( $attr['caption'] ) ) {
        if ( preg_match( '#((?:<a [^>]+>\s*)?<img [^>]+>(?:\s*</a>)?)(.*)#is', $content, $matches ) ) {
            $content = $matches[1];
            $attr['caption'] = trim( $matches[2] );
        }
    }
    $output = apply_filters('img_caption_shortcode', '', $attr, $content);
    if ( $output != '' )
        return $output;
    extract(shortcode_atts(array(
        'id'    => '',
        'align' => 'alignnone',
        'width' => '',
        'caption' => ''
    ), $attr));
    if ( 1 > (int) $width || empty($caption) )
        return $content;
    if ( $id ) $id = 'id="' . esc_attr($id) . '" ';
    return '<figure><a href="#" data-fluidbox>'
    . do_shortcode( $content ) . '</a><figcaption>' . $caption . '</figcaption></figure>';
}


// Clean the output of attributes of images in editor
function image_tag_class($class, $id, $align, $size) {
    $align = esc_attr($align);
    return $align;
}

// Remove width and height in editor, for a better responsive world.
function image_editor($html, $id, $alt, $title) {
    return preg_replace(array(
            '/\s+width="\d+"/i',
            '/\s+height="\d+"/i',
            '/alt=""/i'
        ),
        array(
            '',
            '',
            '',
            'alt="' . $title . '"'
        ),
        $html);
}

// Wrap images with figure tag
function img_unautop($pee) {
    $pee = preg_replace('/<p>\\s*?(<a .*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s', '<figure><a href="">$1</a></figure>', $pee);
    return $pee;
}


/**
 * Clean up gallery output
 * http://stackoverflow.com/questions/19802157/change-wordpress-default-gallery-output
 * ----------------------------------------------------------------------------
 */

// function my_post_gallery($output, $attr) {
//     global $post;

//     if (isset($attr['orderby'])) {
//         $attr['orderby'] = sanitize_sql_orderby($attr['orderby']);
//         if (!$attr['orderby'])
//             unset($attr['orderby']);
//     }
//     extract(shortcode_atts(array(
//         'order' => 'ASC',
//         'orderby' => 'menu_order ID',
//         'id' => $post->ID,
//         'itemtag' => 'dl',
//         'icontag' => 'dt',
//         'captiontag' => 'dd',
//         'columns' => 3,
//         'size' => 'thumbnail',
//         'include' => '',
//         'exclude' => ''
//     ), $attr));
//     $id = intval($id);
//     if ('RAND' == $order) $orderby = 'none';

//     if (!empty($include)) {
//         $include = preg_replace('/[^0-9,]+/', '', $include);
//         $_attachments = get_posts(array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby));

//         $attachments = array();
//         foreach ($_attachments as $key => $val) {
//             $attachments[$val->ID] = $_attachments[$key];
//         }
//     }
//     if (empty($attachments)) return '';
//     $output = "<div class=\"story-carousel\">\n";
//     foreach ($attachments as $id => $attachment) {
//         $img = wp_get_attachment_image_src($id, 'full');
//         $output .= "<div class=\"story-carousel-content\" style=\"background-image: url('{$img[0]}');\">\n";
//         $output .= "</div>\n";
//     }
//     $output .= "</div>\n";
//     return $output;
// }
// clean up default gallery output
    // add_filter('post_gallery', 'my_post_gallery', 10, 2);

/**
 * Allow SVG upload
 * ----------------------------------------------------------------------------
 */

// http://css-tricks.com/snippets/wordpress/allow-svg-through-wordpress-media-uploader/
function cc_mime_types( $mimes ){
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

/**
 * Disable update notifications for client. Uncomment at launch.
 * ----------------------------------------------------------------------------
 */
function remove_core_updates(){
    global $wp_version;return(object) array('last_checked'=> time(),'version_checked'=> $wp_version,);
}
// add_filter('pre_site_transient_update_core','remove_core_updates');
// add_filter('pre_site_transient_update_plugins','remove_core_updates');
// add_filter('pre_site_transient_update_themes','remove_core_updates');

?>