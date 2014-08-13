<?php



$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;


$args = array(
    'post_type'      => 'attachment',
    'post_parent'    => $post->ID,
    'post_status'    => 'inherit',
    'numberposts'    => -1
);
$context['images'] = Timber::get_posts($args);

$context['options'] = get_fields('options');

$context['wp_title'] .= ' - ' . $post->title();

Timber::render(array('single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'), $context);


