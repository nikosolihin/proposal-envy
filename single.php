<?php

// get post type from url
$post_type = explode('/', $_SERVER['REQUEST_URI'])[1];

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$context['options'] = get_fields('options');
$context['wp_title'] = 'Proposal Envy - ' . $post->title();
$context['post_type'] = ucwords($post_type);

if (get_field('has_spotlight', $post->ID) == 'yes' ) {
  $args = "post_type=people-n-things&p=".array_shift(get_field('people-n-things', $post->ID));
  $context['spotlight'] = Timber::get_post($args);
}

$context['layouts'] = get_field('layouts');

Timber::render(array('single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'), $context);