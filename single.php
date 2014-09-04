<?php

// get post type from url
$post_type = explode('/', $_SERVER['REQUEST_URI'])[1];

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['options'] = get_fields('options');
$context['wp_title'] = 'Proposal Envy - ' . $post->title();
$context['post_type'] = ucwords($post_type);
$context['gallery_img_ids'] = grab_ids_from_gallery();

$context['gallery_imgs'] = array();
foreach ($context['gallery_img_ids'] as &$image) {
    $img = wp_get_attachment_image_src( $image, 'full');
    $thumb = wp_get_attachment_image_src( $image, 'thumbnail');
    array_push($context['gallery_imgs'], array($thumb[0],$img[0]));
}

$context['layouts'] = get_field('layouts');

Timber::render(array('single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig'), $context);