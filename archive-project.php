<?php
get_header();

$project_archive_url = function_exists('tanyatheme_get_project_archive_url')
    ? tanyatheme_get_project_archive_url()
    : get_post_type_archive_link('project');

if (!is_string($project_archive_url) || $project_archive_url === '') {
    $project_archive_url = '/project/';
}

$project_filter_items = function_exists('tanyatheme_get_project_filter_items')
    ? tanyatheme_get_project_filter_items()
    : [];
$current_project_type = function_exists('tanyatheme_normalize_project_filter_type')
    ? tanyatheme_normalize_project_filter_type()
    : '';
$current_page = max(1, (int) get_query_var('paged'));
$max_pages = max(1, (int) $wp_query->max_num_pages);
?>

<main>
  <section class="project-list mini-margin">
    <div class="container">
      <h1>ПРОЕКТЫ</h1>
      <div class="main-filter three-grid mini-margin">
        <?php foreach ($project_filter_items as $filter_slug => $filter_item) : ?>
          <?php
          $filter_label = trim((string) ($filter_item['label'] ?? ''));
          $filter_image = trim((string) ($filter_item['image'] ?? ''));
          $is_active = $current_project_type === $filter_slug;
          $filter_url = $is_active
              ? $project_archive_url
              : add_query_arg('type', $filter_slug, $project_archive_url);
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

      <div
        class="project-archive"
        data-project-archive
        data-archive-url="<?php echo esc_url($project_archive_url); ?>"
        data-current-type="<?php echo esc_attr($current_project_type); ?>"
        data-current-page="<?php echo esc_attr($current_page); ?>"
        data-max-pages="<?php echo esc_attr($max_pages); ?>"
      >
        <div class="main-catalog three-grid" data-project-grid>
          <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
              <?php
              $catalog_item_context = 'post';
              require get_template_directory() . '/parts/catalog/item.php';
              ?>
            <?php endwhile; ?>
          <?php else : ?>
            <p class="text">Проекты пока не добавлены.</p>
          <?php endif; ?>
        </div>

        <button
          class="project-list__more button button-stroke"
          type="button"
          data-project-load-more
          <?php echo $current_page >= $max_pages ? 'hidden' : ''; ?>
        >
          Показать еще
        </button>
      </div>
    </div>
  </section>

  <?php require get_template_directory() . '/parts/feedback/default.php'; ?>
</main>

<?php get_footer(); ?>
