<?php get_header(); ?>

<?php $theme_uri = esc_url(get_template_directory_uri()); ?>

<main>
  <?php require get_template_directory() . '/parts/banner.php'; ?>
  <?php require get_template_directory() . '/parts/create.php'; ?>
  <?php require get_template_directory() . '/parts/page-menu.php'; ?>
  <?php require get_template_directory() . '/parts/home-ready.php'; ?>
  <?php require get_template_directory() . '/parts/project-list.php'; ?>
  <?php require get_template_directory() . '/parts/end-home.php'; ?>
  <?php require get_template_directory() . '/parts/feedback/default.php'; ?>
</main>

<?php get_footer(); ?>
