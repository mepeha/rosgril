<?php

if (!defined('ABSPATH')) {
    exit;
}

function tanyatheme_setup(): void
{
    load_theme_textdomain('tanyatheme', get_template_directory() . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('customize-selective-refresh-widgets');

    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);

    add_theme_support('custom-logo', [
        'height'      => 120,
        'width'       => 320,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
}

add_action('after_setup_theme', 'tanyatheme_setup');
