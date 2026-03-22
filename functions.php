<?php

if (!defined('ABSPATH')) {
    exit;
}

$theme_parts = [
    'theme-setup',
    'menu',
];

foreach ($theme_parts as $theme_part) {
    $theme_part_path = get_template_directory() . '/inc/' . $theme_part . '.php';

    if (file_exists($theme_part_path)) {
        require_once $theme_part_path;
    }
}
