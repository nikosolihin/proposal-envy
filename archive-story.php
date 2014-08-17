<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/views/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'stories-settings'
);

$success_args = array(
  'post_type' => 'story',
  'orderby' => 'most_recent',
  'posts_per_page' => 3,
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key' => 'story_type',
      'value' => 'success'
    )
  )
);

$context = Timber::get_context();
$context['options'] = get_fields('options');
$context['settings'] = Timber::get_post($settings_args);
$context['success'] = Timber::get_posts($success_args);

// Dont get the 3 most recent success stories using their IDs
$ids = array();
foreach ($context['success'] as $value) {
  array_unshift($ids, $value->ID);
}

$recent_args = array(
  'post_type' => 'story',
  'orderby' => 'most_recent',
  'post__not_in' => $ids
);
$context['recent'] = Timber::get_posts($recent_args);

Timber::render(array('page-stories.twig'), $context);