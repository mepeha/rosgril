<?php
if (!isset($theme_uri)) {
    $theme_uri = esc_url(get_template_directory_uri());
}

$end_home_gallery_raw = [];
if (function_exists('get_field')) {
    $end_home_contexts = [
        'end-home-admin-page',
        'options_end-home-admin-page',
        'options_end_home_admin_page',
        'option',
        'options',
    ];

    foreach ($end_home_contexts as $end_home_context) {
        $end_home_value = get_field('end-home-gallery', $end_home_context);
        if (is_array($end_home_value) && !empty($end_home_value)) {
            $end_home_gallery_raw = $end_home_value;
            break;
        }
    }
}

$end_home_gallery_items = [];
if (!empty($end_home_gallery_raw)) {
    foreach ($end_home_gallery_raw as $end_home_item) {
        if (!is_array($end_home_item)) {
            continue;
        }

        $end_home_full_url = trim((string) ($end_home_item['url'] ?? ''));
        if ($end_home_full_url === '') {
            continue;
        }

        $end_home_sizes = is_array($end_home_item['sizes'] ?? null) ? $end_home_item['sizes'] : [];
        $end_home_thumb_url = trim((string) ($end_home_sizes['large'] ?? $end_home_sizes['medium_large'] ?? $end_home_full_url));
        $end_home_caption = trim((string) ($end_home_item['caption'] ?? ''));
        $end_home_title = trim((string) ($end_home_item['title'] ?? ''));
        $end_home_alt = trim((string) ($end_home_item['alt'] ?? ''));

        if ($end_home_alt === '') {
            $end_home_alt = $end_home_caption !== '' ? $end_home_caption : ($end_home_title !== '' ? $end_home_title : 'Построенный дом');
        }

        $end_home_gallery_items[] = [
            'full' => $end_home_full_url,
            'thumb' => $end_home_thumb_url,
            'caption' => $end_home_caption !== '' ? $end_home_caption : $end_home_title,
            'alt' => $end_home_alt,
        ];
    }
}

if (empty($end_home_gallery_items)) {
    $end_home_gallery_items = [
        ['full' => $theme_uri . '/dist/img/end-home-1.webp', 'thumb' => $theme_uri . '/dist/img/end-home-1.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-2.webp', 'thumb' => $theme_uri . '/dist/img/end-home-2.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-3.webp', 'thumb' => $theme_uri . '/dist/img/end-home-3.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-2.webp', 'thumb' => $theme_uri . '/dist/img/end-home-2.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-3.webp', 'thumb' => $theme_uri . '/dist/img/end-home-3.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-2.webp', 'thumb' => $theme_uri . '/dist/img/end-home-2.webp', 'caption' => '', 'alt' => 'Построенный дом'],
        ['full' => $theme_uri . '/dist/img/end-home-3.webp', 'thumb' => $theme_uri . '/dist/img/end-home-3.webp', 'caption' => '', 'alt' => 'Построенный дом'],
    ];
}
?>

<section class="end-home margin" id="end-home">
  <div class="container">
    <h2>построенные дома</h2>
    <div class="end-home__area">
      <?php foreach ($end_home_gallery_items as $end_home_gallery_item) : ?>
        <a
          href="<?php echo esc_url($end_home_gallery_item['full']); ?>"
          data-fancybox="end-home"
          <?php if ($end_home_gallery_item['caption'] !== '') : ?>
            data-caption="<?php echo esc_attr($end_home_gallery_item['caption']); ?>"
          <?php endif; ?>
        >
          <img src="<?php echo esc_url($end_home_gallery_item['thumb']); ?>" alt="<?php echo esc_attr($end_home_gallery_item['alt']); ?>">
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
