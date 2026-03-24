<?php

if (!defined('ABSPATH')) {
    exit;
}

$projects_section_title = isset($projects_section_title) ? trim((string) $projects_section_title) : 'Проекты';
$projects_section_class = isset($projects_section_class) ? trim((string) $projects_section_class) : 'mini-margin';
$projects_section_count = isset($projects_section_count) ? (int) $projects_section_count : 3;
$projects_section_exclude_id = isset($projects_section_exclude_id) ? (int) $projects_section_exclude_id : 0;

if ($projects_section_count < 1) {
    $projects_section_count = 3;
}

$projects_section_archive_url = function_exists('tanyatheme_get_project_archive_url')
    ? tanyatheme_get_project_archive_url()
    : get_post_type_archive_link('project');

if (!is_string($projects_section_archive_url) || $projects_section_archive_url === '') {
    $projects_section_archive_url = home_url('/project/');
}

$projects_section_query_args = [
    'post_type'      => 'project',
    'post_status'    => 'publish',
    'posts_per_page' => $projects_section_count,
    'orderby'        => 'date',
    'order'          => 'DESC',
];

if ($projects_section_exclude_id > 0) {
    $projects_section_query_args['post__not_in'] = [$projects_section_exclude_id];
}

$projects_section_query = new WP_Query($projects_section_query_args);
?>

<section class="project-list <?php echo esc_attr($projects_section_class); ?>">
  <div class="container">
    <h2><?php echo esc_html($projects_section_title); ?></h2>
    <div class="main-catalog three-grid">
      <?php if ($projects_section_query->have_posts()) : ?>
        <?php while ($projects_section_query->have_posts()) : $projects_section_query->the_post(); ?>
          <?php
          $catalog_item_context = 'post';
          require get_template_directory() . '/parts/catalog/item.php';
          ?>
        <?php endwhile; ?>
      <?php else : ?>
        <p class="text">Проекты пока не добавлены.</p>
      <?php endif; ?>
    </div>
    <a href="<?php echo esc_url($projects_section_archive_url); ?>" class="main-catalog__button button button-stroke">
      смотреть все проекты
      <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
      </svg>
    </a>
  </div>
</section>

<?php wp_reset_postdata(); ?>
