<?php

$context = Timber::get_context();
$context['post'] = Timber::get_posts();

print_r($content);

// Timber::render('page-home.twig', $context);