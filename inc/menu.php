<?php

if (!defined('ABSPATH')) {
    exit;
}

function tanyatheme_register_menus(): void
{
    register_nav_menus([
        'primary'           => __('Primary Menu', 'tanyatheme'),
        'mobile'            => __('Mobile Menu', 'tanyatheme'),
        'footer_catalog'    => __('Footer Catalog', 'tanyatheme'),
        'footer_individual' => __('Footer Individual', 'tanyatheme'),
        'footer_about'      => __('Footer About', 'tanyatheme'),
        'footer_faq'        => __('Footer FAQ', 'tanyatheme'),
    ]);
}

add_action('after_setup_theme', 'tanyatheme_register_menus');

function tanyatheme_nav_menu_link_attributes(array $atts, $item, $args, int $depth): array
{
    $class = '';

    if (!empty($args->tanyatheme_link_class) && is_string($args->tanyatheme_link_class)) {
        $class = trim($args->tanyatheme_link_class);
    } elseif (!empty($args->theme_location) && $args->theme_location === 'primary') {
        $class = 'menu__item';
    } elseif (!empty($args->theme_location) && $args->theme_location === 'mobile') {
        $class = 'mobile-menu__item';
    }

    if ($class !== '') {
        $existing = isset($atts['class']) && is_string($atts['class']) ? trim($atts['class']) : '';
        $atts['class'] = trim($existing . ' ' . $class);
    }

    return $atts;
}

add_filter('nav_menu_link_attributes', 'tanyatheme_nav_menu_link_attributes', 10, 4);
