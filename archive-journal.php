<!-- Carousel the journal. Category filter below it. Category filter sticks to top.

Design journal page like JSM page and the harvard page. Layout each article in a masonry grid
and do one or two random one with backgorund tinted pic with white text. -->

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
$context['settings'] = Timber::get_post($settings_args);
$context['journal'] = Timber::get_posts($journal_args);
// for dropdown
$context['categories'] = Timber::get_terms('category', 'orderby=name');

?>
    <pre>
    <?php
    print_r($context['settings']);
    ?>
    </pre>
   <?php



Timber::render(array('page-journal.twig'), $context);