<?php
if (!isset($theme_uri)) {
    $theme_uri = esc_url(get_template_directory_uri());
}

$project_archive_url = function_exists('tanyatheme_get_project_archive_url')
    ? tanyatheme_get_project_archive_url()
    : get_post_type_archive_link('project');

if (!is_string($project_archive_url) || $project_archive_url === '') {
    $project_archive_url = '/project/';
}

$project_filter_items = function_exists('tanyatheme_get_project_filter_items')
    ? tanyatheme_get_project_filter_items()
    : [
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

$current_project_type = function_exists('tanyatheme_normalize_project_filter_type')
    ? tanyatheme_normalize_project_filter_type()
    : '';

$project_list_query = new WP_Query([
    'post_type'      => 'project',
    'post_status'    => 'publish',
    'posts_per_page' => 6,
    'orderby'        => 'date',
    'order'          => 'DESC',
]);
?>
<section class="project-list mini-margin">
  <div class="container">
    <h2>ПРОЕКТЫ</h2>
    <div class="main-filter three-grid mini-margin">
      <?php foreach ($project_filter_items as $filter_slug => $filter_item) : ?>
        <?php
        $filter_label = trim((string) ($filter_item['label'] ?? ''));
        $filter_image = trim((string) ($filter_item['image'] ?? ''));
        $is_active = $current_project_type === $filter_slug;
        $filter_url = add_query_arg('type', $filter_slug, $project_archive_url);
        ?>
        <a
          href="<?php echo esc_url($filter_url); ?>"
          class="main-filter__item<?php echo $is_active ? ' is-active' : ''; ?>"
          data-project-filter
          data-project-type="<?php echo esc_attr($filter_slug); ?>"
        >
          <div class="name">
            <?php echo esc_html($filter_label); ?>
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo esc_url($filter_image); ?>" alt="<?php echo esc_attr($filter_label); ?>" class="image">
        </a>
      <?php endforeach; ?>
    </div>
    <div class="main-catalog three-grid">
      <?php if ($project_list_query->have_posts()) : ?>
        <?php while ($project_list_query->have_posts()) : $project_list_query->the_post(); ?>
          <?php
          $catalog_item_context = 'post';
          require get_template_directory() . '/parts/catalog/item.php';
          ?>
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
      <?php else : ?>
        <p class="text">Проекты пока не добавлены.</p>
      <?php endif; ?>
    </div>
    <a href="<?php echo esc_url($project_archive_url); ?>" class="main-catalog__button button button-stroke">
      смотреть все проекты
      <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
      </svg>
    </a>
  </div>
</section>
