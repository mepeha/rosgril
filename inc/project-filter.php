<?php

if (!defined('ABSPATH')) {
    exit;
}

function tanyatheme_get_project_filter_items(): array
{
    $theme_uri = esc_url(get_template_directory_uri());

    return [
        'one' => [
            'label' => 'Одноэтажные',
            'image' => $theme_uri . '/dist/img/one-floor.webp',
        ],
        'two' => [
            'label' => 'Двухэтажные',
            'image' => $theme_uri . '/dist/img/two-floor.webp',
        ],
        'bany' => [
            'label' => 'Бани',
            'image' => $theme_uri . '/dist/img/three-floor.webp',
        ],
    ];
}

function tanyatheme_normalize_project_filter_type($raw_type = null): string
{
    if ($raw_type === null) {
        $raw_type = isset($_GET['type']) ? wp_unslash((string) $_GET['type']) : '';
    }

    $normalized_type = sanitize_key((string) $raw_type);
    $items = tanyatheme_get_project_filter_items();

    return array_key_exists($normalized_type, $items) ? $normalized_type : '';
}

function tanyatheme_get_project_archive_url(): string
{
    $archive_url = get_post_type_archive_link('project');

    if (!is_string($archive_url) || $archive_url === '') {
        return home_url('/project/');
    }

    return $archive_url;
}

function tanyatheme_build_project_query_args(string $project_type = '', int $page = 1, int $posts_per_page = 9): array
{
    $normalized_type = tanyatheme_normalize_project_filter_type($project_type);
    $safe_page = max(1, $page);
    $safe_posts_per_page = max(1, $posts_per_page);
    $query_args = [
        'post_type'           => 'project',
        'post_status'         => 'publish',
        'posts_per_page'      => $safe_posts_per_page,
        'paged'               => $safe_page,
        'orderby'             => 'date',
        'order'               => 'DESC',
        'ignore_sticky_posts' => true,
    ];

    if ($normalized_type !== '') {
        $query_args['tax_query'] = [
            [
                'taxonomy' => 'project_type',
                'field'    => 'slug',
                'terms'    => [$normalized_type],
            ],
        ];
    }

    return $query_args;
}

function tanyatheme_render_project_catalog_items_html(WP_Query $query): string
{
    $template_path = get_template_directory() . '/parts/catalog/item.php';
    ob_start();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $catalog_item_context = 'post';
            require $template_path;
        }
    } else {
        echo '<p class="text">Проекты пока не добавлены.</p>';
    }

    wp_reset_postdata();

    return (string) ob_get_clean();
}

function tanyatheme_apply_project_archive_filter(WP_Query $query): void
{
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive('project')) {
        return;
    }

    $current_type = tanyatheme_normalize_project_filter_type();

    $query->set('posts_per_page', 9);
    $query->set('orderby', 'date');
    $query->set('order', 'DESC');
    $query->set('ignore_sticky_posts', true);

    if ($current_type === '') {
        return;
    }

    $query->set('tax_query', [
        [
            'taxonomy' => 'project_type',
            'field'    => 'slug',
            'terms'    => [$current_type],
        ],
    ]);
}

add_action('pre_get_posts', 'tanyatheme_apply_project_archive_filter');

function tanyatheme_handle_project_filter_ajax(): void
{
    if (!check_ajax_referer('tanyatheme_filter_projects', 'nonce', false)) {
        wp_send_json_error([
            'message' => 'Неверный nonce фильтра.',
        ], 403);
    }

    $project_type = tanyatheme_normalize_project_filter_type(
        isset($_POST['type']) ? wp_unslash((string) $_POST['type']) : ''
    );
    $page = isset($_POST['page']) ? (int) absint($_POST['page']) : 1;
    $safe_page = max(1, $page);

    $query = new WP_Query(tanyatheme_build_project_query_args($project_type, $safe_page, 9));
    $max_pages = max(1, (int) $query->max_num_pages);
    $has_more = $safe_page < $max_pages;

    wp_send_json_success([
        'html'        => tanyatheme_render_project_catalog_items_html($query),
        'hasMore'     => $has_more,
        'nextPage'    => $has_more ? ($safe_page + 1) : $safe_page,
        'currentPage' => $safe_page,
        'maxPages'    => $max_pages,
        'totalFound'  => (int) $query->found_posts,
        'currentType' => $project_type,
    ]);
}

add_action('wp_ajax_tanyatheme_filter_projects', 'tanyatheme_handle_project_filter_ajax');
add_action('wp_ajax_nopriv_tanyatheme_filter_projects', 'tanyatheme_handle_project_filter_ajax');
