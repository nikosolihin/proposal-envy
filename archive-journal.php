<?php

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'journal-settings'
);

$journal_args = array(
  'post_type' => 'journal',
  'orderby' => 'most_recent'
);

$context = Timber::get_context();
$context['options'] = get_fields('options');
$context['settings'] = Timber::get_post($settings_args);
$context['journal'] = Timber::get_posts($journal_args);
// get all non-empty categories except uncategorized
$context['categories'] = get_categories('orderby=name&exclude=1');

Timber::render(array('page-journal.twig'), $context);