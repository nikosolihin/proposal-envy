<?php

$slideshow_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'story-collection'
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
$context['testimonials'] = Timber::get_post($slideshow_args);
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