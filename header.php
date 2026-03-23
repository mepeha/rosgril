<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <?php $theme_uri = esc_url(get_template_directory_uri()); ?>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Onest:wght@100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $theme_uri; ?>/dist/css/vendor.css">
    <link rel="stylesheet" href="<?php echo $theme_uri; ?>/dist/css/style.css">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="header">
  <div class="container">
      <?php
      $mobile_menu_location = has_nav_menu('mobile') ? 'mobile' : 'primary';
      ?>
      <div class="header__area">
        <a href="/" class="logo">
          <img src="<?php echo $theme_uri; ?>/dist/img/logo.svg" alt="Арх Бюро Суворова">
        </a>
        <nav class="menu" aria-label="Основное меню">
          <?php
          if (has_nav_menu('primary')) {
              wp_nav_menu([
                  'theme_location'        => 'primary',
                  'container'             => false,
                  'menu_class'            => 'menu__list',
                  'depth'                 => 2,
                  'fallback_cb'           => false,
                  'tanyatheme_link_class' => 'menu__item',
              ]);
          }
          ?>
        </nav>
        <a href="tel:+7(982) 613-24-16" class="number">
          <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.9263 20.2917C13.4629 20.2378 9.31561 19.6647 4.9722 15.3223C0.629807 10.9789 0.0576635 6.83263 0.00278653 5.36823C-0.0785127 3.13657 1.6308 0.968928 3.60536 0.1224C3.84313 0.0197262 4.10352 -0.0193648 4.36096 0.00896282C4.61841 0.0372905 4.86406 0.132064 5.07382 0.283982C6.69981 1.46892 7.82174 3.26156 8.78513 4.67109C8.9971 4.98077 9.08773 5.35761 9.03976 5.7298C8.99178 6.102 8.80855 6.44354 8.52497 6.68934L6.54229 8.16187C6.4465 8.23104 6.37907 8.33263 6.35253 8.44776C6.32599 8.5629 6.34214 8.68375 6.39798 8.78787C6.84716 9.60391 7.64593 10.8193 8.56054 11.734C9.47516 12.6486 10.7485 13.5002 11.6215 14.0002C11.7309 14.0616 11.8597 14.0788 11.9815 14.0482C12.1032 14.0175 12.2086 13.9415 12.2759 13.8355L13.5665 11.8711C13.8038 11.556 14.1539 11.3448 14.5433 11.2819C14.9328 11.219 15.3315 11.3093 15.6559 11.5338C17.0858 12.5236 18.7544 13.6262 19.976 15.1902C20.1402 15.4015 20.2447 15.653 20.2785 15.9185C20.3123 16.1839 20.2741 16.4536 20.168 16.6993C19.3174 18.684 17.165 20.374 14.9263 20.2917Z" fill="#F4B166"/>
          </svg>
          +7(982) 613-24-16
        </a>
        <button class="header__burger" type="button" aria-label="Открыть меню" aria-controls="mobile-menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        <?php
        if (has_nav_menu($mobile_menu_location)) {
            wp_nav_menu([
                'theme_location'        => $mobile_menu_location,
                'container'             => false,
                'menu_class'            => 'mobile-menu__list',
                'depth'                 => 2,
                'fallback_cb'           => false,
                'tanyatheme_link_class' => 'mobile-menu__item',
            ]);
        }
        ?>
        <a href="tel:+79826132416" class="mobile-menu__phone">
          +7 (982) 613-24-16
        </a>
      </div>
      <button class="mobile-menu__overlay" type="button" aria-label="Закрыть меню"></button>
    </div>
</header>

<?php
$page_head_data = null;

if (is_singular(['project', 'page'])) {
    $page_head_post_id = (int) get_queried_object_id();

    if ($page_head_post_id > 0) {
        $page_head_title = trim((string) get_the_title($page_head_post_id));
        $page_head_subtitle = '';
        $page_head_hide_breadcrumbs = false;
        $page_head_hide_title = false;
        $page_head_hide_subtitle = false;

        if (function_exists('get_field')) {
            $page_head_hide_breadcrumbs = (bool) get_field('breadcrumbs', $page_head_post_id);
            $page_head_hide_title = (bool) get_field('head-title', $page_head_post_id);
            $page_head_hide_subtitle = (bool) get_field('head-subtitle', $page_head_post_id);
            $page_head_subtitle = trim((string) get_field('subtitle', $page_head_post_id));
        }

        $page_head_breadcrumbs_text = '';
        if (!$page_head_hide_breadcrumbs && $page_head_title !== '') {
            if (get_post_type($page_head_post_id) === 'project') {
                $page_head_project_label = $page_head_title;

                if (function_exists('get_field')) {
                    $page_head_project_id = trim((string) get_field('id', $page_head_post_id));
                    if ($page_head_project_id !== '') {
                        $page_head_project_label = 'проект ' . $page_head_project_id;
                    }
                }

                $page_head_breadcrumbs_text = 'главная - каталог проектов - ' . $page_head_project_label;
            } else {
                $page_head_breadcrumbs_text = 'главная - ' . $page_head_title;
            }
        }

        $page_head_title_to_render = (!$page_head_hide_title && $page_head_title !== '') ? $page_head_title : '';
        $page_head_subtitle_to_render = (!$page_head_hide_subtitle && $page_head_subtitle !== '') ? $page_head_subtitle : '';

        if ($page_head_breadcrumbs_text !== '' || $page_head_title_to_render !== '' || $page_head_subtitle_to_render !== '') {
            $page_head_data = [
                'breadcrumbs' => $page_head_breadcrumbs_text,
                'title' => $page_head_title_to_render,
                'subtitle' => $page_head_subtitle_to_render,
            ];
        }
    }
}
?>

<?php if (is_array($page_head_data)) : ?>
  <div class="page-head">
    <div class="container">
      <div class="page-head__area">
        <?php if ($page_head_data['breadcrumbs'] !== '') : ?>
          <div class="breadcrumbs">
            <?php echo esc_html($page_head_data['breadcrumbs']); ?>
          </div>
        <?php endif; ?>

        <?php if ($page_head_data['title'] !== '') : ?>
          <h1 class="page-head__title">
            <?php echo esc_html($page_head_data['title']); ?>
          </h1>
        <?php endif; ?>

        <?php if ($page_head_data['subtitle'] !== '') : ?>
          <h3 class="page-head__subtitle">
            <?php echo esc_html($page_head_data['subtitle']); ?>
          </h3>
        <?php endif; ?>
      </div>
    </div>
  </div>
<?php endif; ?>
