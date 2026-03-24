<?php
$theme_uri = esc_url(get_template_directory_uri());
$recaptcha_settings = function_exists('tanyatheme_get_recaptcha_settings')
    ? tanyatheme_get_recaptcha_settings()
    : [
        'public_key' => '',
        'enabled' => false,
    ];
$recaptcha_site_key = isset($recaptcha_settings['public_key']) ? trim((string) $recaptcha_settings['public_key']) : '';
$recaptcha_enabled = !empty($recaptcha_settings['enabled']) && $recaptcha_site_key !== '';
$contact_data = function_exists('tanyatheme_get_contacts_data')
    ? tanyatheme_get_contacts_data()
    : [
        'phone' => '+7(982) 613-24-16',
        'phone_href' => 'tel:+79826132416',
        'email' => 'tsuv-1@mail.ru',
        'email_href' => 'mailto:tsuv-1@mail.ru',
        'social_items' => [],
    ];

$footer_phone = trim((string) ($contact_data['phone'] ?? ''));
$footer_phone_href = trim((string) ($contact_data['phone_href'] ?? ''));
$footer_email = trim((string) ($contact_data['email'] ?? ''));
$footer_email_href = trim((string) ($contact_data['email_href'] ?? ''));
$footer_social_items = isset($contact_data['social_items']) && is_array($contact_data['social_items'])
    ? $contact_data['social_items']
    : [];
?>
<footer class="footer">
  <div class="container">
    <div class="footer__area">
      <a href="/" class="footer__logo logo">
        <img src="<?php echo $theme_uri; ?>/dist/img/logo.svg" alt="Арх Бюро Суворова">
      </a>
      <div class="footer__menu">
        <?php
        $footer_menu_blocks = [
            [
                'title'    => 'КАТАЛОГ ПРОЕКТОВ',
                'location' => 'footer_catalog',
            ],
            [
                'title'    => 'ИНДИВИДУАЛЬНОЕ ПРОЕКТИРОВАНИЕ',
                'location' => 'footer_individual',
            ],
            [
                'title'    => 'О НАС',
                'location' => 'footer_about',
            ],
            [
                'title'    => 'ЧАСТЫЕ ВОПРОСЫ',
                'location' => 'footer_faq',
            ],
        ];
        ?>
        <?php foreach ($footer_menu_blocks as $footer_menu_block) : ?>
          <div class="footer__menu-block">
            <h3 class="footer-title">
              <?php echo esc_html($footer_menu_block['title']); ?>
            </h3>
            <?php
            if (has_nav_menu($footer_menu_block['location'])) {
                wp_nav_menu([
                    'theme_location'        => $footer_menu_block['location'],
                    'container'             => false,
                    'menu_class'            => 'footer__menu-list',
                    'depth'                 => 1,
                    'fallback_cb'           => false,
                    'tanyatheme_link_class' => 'footer__menu-item',
                ]);
            } else {
                echo '<ul class="footer__menu-list"></ul>';
            }
            ?>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="footer__contact">
        <h3 class="footer-title">
          свяжитесь с нами
        </h3>
        <?php if ($footer_phone !== '') : ?>
          <a href="<?php echo esc_url($footer_phone_href); ?>" class="footer-number name">
            <?php echo esc_html($footer_phone); ?>
          </a>
        <?php endif; ?>
        <?php if ($footer_email !== '') : ?>
          <a href="<?php echo esc_url($footer_email_href); ?>" class="footer-mail name">
            <?php echo esc_html($footer_email); ?>
          </a>
        <?php endif; ?>
        <?php if (!empty($footer_social_items)) : ?>
          <div class="social">
            <?php foreach ($footer_social_items as $footer_social_item) : ?>
              <?php
              $footer_social_url = trim((string) ($footer_social_item['url'] ?? ''));
              $footer_social_icon = trim((string) ($footer_social_item['icon_url'] ?? ''));
              $footer_social_alt = trim((string) ($footer_social_item['icon_alt'] ?? ''));
              if ($footer_social_url === '' || $footer_social_icon === '') {
                  continue;
              }
              ?>
              <a href="<?php echo esc_url($footer_social_url); ?>" class="social__item" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo esc_url($footer_social_icon); ?>" alt="<?php echo esc_attr($footer_social_alt !== '' ? $footer_social_alt : 'Социальная сеть'); ?>" loading="lazy">
              </a>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</footer>
<?php require get_template_directory() . '/parts/feedback/popup.php'; ?>
<?php require get_template_directory() . '/parts/feedback/captcha-popup.php'; ?>
<script>
  window.tanyathemeLead = <?php echo wp_json_encode([
      'ajaxUrl' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('tanyatheme_send_lead'),
      'recaptchaSiteKey' => $recaptcha_site_key,
      'recaptchaEnabled' => $recaptcha_enabled,
  ]); ?>;
  window.tanyathemeProjectFilter = <?php echo wp_json_encode([
      'ajaxUrl' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('tanyatheme_filter_projects'),
      'archiveUrl' => function_exists('tanyatheme_get_project_archive_url')
          ? tanyatheme_get_project_archive_url()
          : home_url('/project/'),
  ]); ?>;
</script>
<?php if ($recaptcha_enabled) : ?>
<script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer></script>
<?php endif; ?>
<script src="<?php echo $theme_uri; ?>/dist/js/vendor.js"></script>
<script src="<?php echo $theme_uri; ?>/dist/js/main.js"></script>
<?php wp_footer(); ?>
</body>
</html>
