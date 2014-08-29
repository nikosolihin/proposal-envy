<?php

// get category from url
$chosen_cat = end(explode('/', $_SERVER['REQUEST_URI']));

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'journal-settings'
);

$terms_args = array(
  'orderby' => 'name'
);

$category_args = array(
  'post_type' => 'journal',
  'orderby' => 'most_recent',
  'category_name' => $chosen_cat
);

$context = Timber::get_context();
$context['settings'] = Timber::get_post($settings_args);
$context['chosen_slug'] = $chosen_cat;
// $context['chosen_name'] = ucwords(str_replace("-", " ", $chosen_cat));
// for dropdown
$context['categories'] = Timber::get_terms('category', $terms_args);
$context['posts'] = Timber::get_posts($category_args);
Timber::render('category.twig', $context);