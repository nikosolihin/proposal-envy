<?php

/**
 * Register Global Option Submenus & Rename Options Page Menu Title
 */
if( function_exists('acf_add_options_sub_page') )
{
    acf_add_options_sub_page(array(
        'title' => 'Menu',
        'menu' => 'Menu Options'
    ));
    acf_add_options_sub_page(array(
        'title' => 'Footer',
        'menu' => 'Footer Options'
    ));
    acf_add_options_sub_page(array(
        'title' => 'Hint',
        'menu' => 'Hint Options'
    ));
    acf_add_options_sub_page(array(
        'title' => 'Misc',
        'menu' => 'Misc Options'
    ));
}
function my_acf_options_page_settings( $settings )
{
    $settings['title'] = 'Global Stuff';
    return $settings;
}
add_filter('acf/options_page/settings', 'my_acf_options_page_settings');


/**
 * Remove Confusing Wordpress Default Menus for client
 */
function remove_menus(){
  remove_menu_page( 'index.php' );                   //Dashboard
  remove_menu_page( 'edit.php' );                    //Posts
  // remove_menu_page( 'upload.php' );                  //Media
  // remove_menu_page( 'edit.php?post_type=page' );     //Pages
  // remove_menu_page( 'edit.php?post_type=vecb_editor_buttons' ); // Visual editor custom buttons
  remove_menu_page( 'edit-comments.php' );           //Comments
  // remove_menu_page( 'themes.php' );                  //Appearance
  // remove_menu_page( 'plugins.php' );                 //Plugins
  remove_menu_page( 'users.php' );                   //Users
  remove_menu_page( 'tools.php' );                      //Tools
  // remove_menu_page( 'options-general.php' );         //Settings
  remove_submenu_page( 'themes.php', 'widgets.php' );
  remove_submenu_page( 'themes.php', 'customize.php' );
  // remove_submenu_page( 'themes.php', 'themes.php' );
  remove_submenu_page( 'edit.php', 'edit-tags.php?taxonomy=post_tag' );
}
add_action( 'admin_menu', 'remove_menus' );


/**
 * Change Some Generic Dashicons & Hide Confusing Plugin Menus for client
 */
function replace_admin_menu_icons_css() {
    ?>
    <style>
        #adminmenu #toplevel_page_acf-options-header div.wp-menu-image:before {
            content: "\f319";
        }
/*        #adminmenu #toplevel_page_cpt_main_menu,
        #adminmenu #toplevel_page_edit-post_type-acf {
            display: none;
        }*/
    </style>
    <?php
}
add_action( 'admin_head', 'replace_admin_menu_icons_css' );


/**
 * Register Menus
 * http://codex.wordpress.org/Function_Reference/register_nav_menus#Examples
 */
register_nav_menus(array(
    'top-bar-l' => 'Left Top Bar', // registers the menu in the WordPress admin menu editor
    'top-bar-r' => 'Right Top Bar',
    'mobile-off-canvas' => 'Mobile'
));


/**
 * Left top bar
 * http://codex.wordpress.org/Function_Reference/wp_nav_menu
 */
function foundationPress_top_bar_l() {
    wp_nav_menu(array(
        'container' => false,                           // remove nav container
        'container_class' => '',                        // class of container
        'menu' => '',                                   // menu name
        'menu_class' => 'top-bar-menu left',            // adding custom nav class
        'theme_location' => 'top-bar-l',                // where it's located in the theme
        'before' => '',                                 // before each link <a>
        'after' => '',                                  // after each link </a>
        'link_before' => '',                            // before each link text
        'link_after' => '',                             // after each link text
        'depth' => 5,                                   // limit the depth of the nav
        'fallback_cb' => false,                         // fallback function (see below)
        'walker' => new top_bar_walker()
    ));
}

/**
 * Right top bar
 */
function foundationPress_top_bar_r() {
    wp_nav_menu(array(
        'container' => false,                           // remove nav container
        'container_class' => '',                        // class of container
        'menu' => '',                                   // menu name
        'menu_class' => 'top-bar-menu right',           // adding custom nav class
        'theme_location' => 'top-bar-r',                // where it's located in the theme
        'before' => '',                                 // before each link <a>
        'after' => '',                                  // after each link </a>
        'link_before' => '',                            // before each link text
        'link_after' => '',                             // after each link text
        'depth' => 5,                                   // limit the depth of the nav
        'fallback_cb' => false,                         // fallback function (see below)
        'walker' => new top_bar_walker()
    ));
}

/**
 * Mobile off-canvas
 */
function foundationPress_mobile_off_canvas() {
    wp_nav_menu(array(
        'container' => false,                           // remove nav container
        'container_class' => '',                        // class of container
        'menu' => '',                                   // menu name
        'menu_class' => 'off-canvas-list',              // adding custom nav class
        'theme_location' => 'mobile-off-canvas',        // where it's located in the theme
        'before' => '',                                 // before each link <a>
        'after' => '',                                  // after each link </a>
        'link_before' => '',                            // before each link text
        'link_after' => '',                             // after each link text
        'depth' => 5,                                   // limit the depth of the nav
        'fallback_cb' => false,                         // fallback function (see below)
        'walker' => new top_bar_walker()
    ));
}

?>