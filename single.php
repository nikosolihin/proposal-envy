<?php

// get post type from url
$post_type = explode('/', $_SERVER['REQUEST_URI'])[1];

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['options'] = get_fields('options');
$context['wp_title'] = 'Proposal Envy - ' . $post->title();
$context['post_type'] = ucwords($post_type);

Timber::render(array('single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'), $context);