<?php

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'journal-settings'
);

// get all
$journal_args = array(
  'post_type' => 'journal',
  'orderby' => 'most_recent'
);

$context = Timber::get_context();
$context['settings'] = Timber::get_post($settings_args);
$context['journal'] = Timber::get_posts($journal_args);
// for dropdown
$context['categories'] = Timber::get_terms('category', 'orderby=name');

Timber::render(array('page-journal.twig'), $context);