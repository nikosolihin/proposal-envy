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

$success_args = array(
  'post_type' => 'story',
  'orderby' => 'most_recent',
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key' => 'feature_on_homepage',
      'value' => 'yes'
    ),
    array(
      'key' => 'story_type',
      'value' => 'success'
    )
  )
);

$proposal_args = array(
  'post_type' => 'story',
  'orderby' => 'most_recent',
  'meta_query' => array(
    'relation' => 'AND',
    array(
      'key' => 'feature_on_homepage',
      'value' => 'yes'
    ),
    array(
      'key' => 'story_type',
      'value' => 'proposal'
    )
  )
);

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['options'] = get_fields('options');
$context['success'] = Timber::get_post($success_args);
$context['proposal'] = Timber::get_post($proposal_args);
Timber::render(array('page-home.twig'), $context);