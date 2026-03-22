<?php
get_header();
$theme_uri = esc_url(get_template_directory_uri());
?>

<main>
  <section class="project-list mini-margin">
    <div class="container">
      <h1>ПРОЕКТЫ</h1>
      <div class="main-filter three-grid mini-margin">
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/one-floor.webp" alt="" class="image">
        </a>
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/two-floor.webp" alt="" class="image">
        </a>
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/three-floor.webp" alt="" class="image">
        </a>
      </div>

      <div class="main-catalog three-grid">
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
    </div>
  </section>

  <?php require get_template_directory() . '/parts/feedback/default.php'; ?>
</main>

<?php get_footer(); ?>
