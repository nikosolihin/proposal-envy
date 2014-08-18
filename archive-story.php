<?php

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

// Exclude the 3 most recent success stories using their IDs
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