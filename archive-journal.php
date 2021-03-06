<?php

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'journal-collection'
);

// get all
$journal_args = array(
  'post_type' => 'journal',
  'orderby' => 'most_recent'
);

$context = Timber::get_context();
$context['options'] = get_fields('options');
$context['slideshow'] = Timber::get_posts(Timber::get_post($settings_args)->slideshow_posts);
$context['journal'] = Timber::get_posts($journal_args);
// for dropdown
$context['categories'] = Timber::get_terms('category', 'orderby=name');

Timber::render(array('page-journal.twig'), $context);