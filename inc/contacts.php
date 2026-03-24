<?php

if (!defined('ABSPATH')) {
    exit;
}

function tanyatheme_get_userfield_option_value(string $field_name)
{
    if (!function_exists('get_field')) {
        return null;
    }

    $contexts = [
        'options_userfield',
        'userfield',
        'options',
        'option',
    ];

    $field_names = array_values(array_unique(array_filter([
        $field_name,
        str_replace('-', '_', $field_name),
    ])));

    foreach ($contexts as $context) {
        foreach ($field_names as $name_candidate) {
            $raw_value = get_field($name_candidate, $context);

            if (is_array($raw_value) && !empty($raw_value)) {
                return $raw_value;
            }

            if (is_scalar($raw_value)) {
                $value = trim((string) $raw_value);
                if ($value !== '') {
                    return $value;
                }
            }
        }
    }

    $option_keys = array_values(array_unique(array_filter([
        'options_' . $field_name,
        'options_' . str_replace('-', '_', $field_name),
    ])));

    foreach ($option_keys as $option_key) {
        $raw_option = get_option($option_key);

        if (is_array($raw_option) && !empty($raw_option)) {
            return $raw_option;
        }

        if (is_scalar($raw_option)) {
            $value = trim((string) $raw_option);
            if ($value !== '') {
                return $value;
            }
        }
    }

    return null;
}

function tanyatheme_build_phone_href(string $raw_phone): string
{
    $digits = preg_replace('/\D+/', '', $raw_phone);
    $digits = is_string($digits) ? $digits : '';

    if ($digits !== '' && strlen($digits) === 11 && $digits[0] === '8') {
        $digits = '7' . substr($digits, 1);
    }

    if ($digits === '') {
        return '';
    }

    return 'tel:+' . $digits;
}

function tanyatheme_get_contacts_data(): array
{
    static $cache = null;

    if (is_array($cache)) {
        return $cache;
    }

    $default_phone = '+7(982) 613-24-16';
    $default_email = 'tsuv-1@mail.ru';

    $phone_raw = tanyatheme_get_userfield_option_value('phone');
    $email_raw = tanyatheme_get_userfield_option_value('email');
    $social_raw = tanyatheme_get_userfield_option_value('social');

    $phone = is_scalar($phone_raw) ? trim((string) $phone_raw) : '';
    $email = is_scalar($email_raw) ? trim((string) $email_raw) : '';

    if ($phone === '') {
        $phone = $default_phone;
    }

    if ($email === '') {
        $email = $default_email;
    }

    $email_sanitized = sanitize_email($email);
    $email_href = $email_sanitized !== '' ? 'mailto:' . $email_sanitized : '';
    $phone_href = tanyatheme_build_phone_href($phone);

    $social_items = [];

    if (is_array($social_raw)) {
        foreach ($social_raw as $social_row) {
            if (!is_array($social_row)) {
                continue;
            }

            $social_link = trim((string) ($social_row['social-link'] ?? $social_row['social_link'] ?? ''));
            $icon_raw = $social_row['icon-social'] ?? $social_row['icon_social'] ?? null;
            $icon_url = '';
            $icon_alt = '';

            if (is_array($icon_raw)) {
                $icon_url = trim((string) ($icon_raw['sizes']['thumbnail'] ?? $icon_raw['sizes']['medium'] ?? $icon_raw['url'] ?? ''));
                $icon_alt = trim((string) ($icon_raw['alt'] ?? $icon_raw['title'] ?? ''));
            } elseif (is_numeric($icon_raw)) {
                $attachment_id = (int) $icon_raw;
                if ($attachment_id > 0) {
                    $icon_url = (string) wp_get_attachment_image_url($attachment_id, 'thumbnail');
                    $icon_alt = trim((string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true));
                }
            } elseif (is_string($icon_raw)) {
                $icon_url = trim($icon_raw);
            }

            if ($social_link === '' || $icon_url === '') {
                continue;
            }

            $social_items[] = [
                'url' => $social_link,
                'icon_url' => $icon_url,
                'icon_alt' => $icon_alt !== '' ? $icon_alt : 'Социальная сеть',
            ];
        }
    }

    $cache = [
        'phone' => $phone,
        'phone_href' => $phone_href !== '' ? $phone_href : tanyatheme_build_phone_href($default_phone),
        'email' => $email,
        'email_href' => $email_href !== '' ? $email_href : 'mailto:' . $default_email,
        'social_items' => $social_items,
    ];

    return $cache;
}
