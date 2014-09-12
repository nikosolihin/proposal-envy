<?php

// get category from url
$chosen_cat = end(explode('/', $_SERVER['REQUEST_URI']));

$settings_args = array(
  'post_type' => 'page',
  'number' => 1,
  'name' => 'journal-collection'
);

$category_args = array(
  'post_type' => 'journal',
  'orderby' => 'most_recent',
  'category_name' => $chosen_cat
);

$context = Timber::get_context();
$context['options'] = get_fields('options');
$context['slideshow'] = Timber::get_posts(Timber::get_post($settings_args)->slideshow_posts);
$context['chosen_slug'] = $chosen_cat;
// $context['chosen_name'] = ucwords(str_replace("-", " ", $chosen_cat));
// for dropdown
$context['categories'] = Timber::get_terms('category', 'orderby=name');
$context['posts'] = Timber::get_posts($category_args);

Timber::render('category.twig', $context);