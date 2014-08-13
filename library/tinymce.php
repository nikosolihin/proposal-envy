<?php

/**
 * Register Global Option Submenus & Rename Options Page Menu Title
 */

// Add Formats Dropdown Menu To MCE
if ( ! function_exists( 'wpex_style_select' ) ) {
    function wpex_style_select( $buttons ) {
        array_push( $buttons, 'styleselect' );
        return $buttons;
    }
}
add_filter( 'mce_buttons', 'wpex_style_select' );

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
                        'inline'    => 'span',
                        'classes'   => 'text-highlight',
                    ),
                ),
            ),
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