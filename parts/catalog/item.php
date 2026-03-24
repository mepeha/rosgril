<?php

if (!defined('ABSPATH')) {
    exit;
}

$theme_uri = esc_url(get_template_directory_uri());

$catalog_item_context = isset($catalog_item_context) ? (string) $catalog_item_context : 'post';

$catalog_item_link = isset($catalog_item_link) ? (string) $catalog_item_link : '';
$catalog_item_image = isset($catalog_item_image) ? (string) $catalog_item_image : '';
$catalog_item_title = isset($catalog_item_title) ? (string) $catalog_item_title : '';
$catalog_item_param_1 = isset($catalog_item_param_1) ? (string) $catalog_item_param_1 : '';
$catalog_item_param_2 = isset($catalog_item_param_2) ? (string) $catalog_item_param_2 : '';
$catalog_item_price = isset($catalog_item_price) ? (string) $catalog_item_price : '';

if ($catalog_item_context === 'static') {
    if ($catalog_item_link === '') {
        $catalog_item_link = '/card.html';
    }

    if ($catalog_item_image === '') {
        $catalog_item_image = $theme_uri . '/dist/img/catalog-image-1.webp';
    }
} else {
    $catalog_item_link = (string) get_permalink();
    $catalog_item_title = (string) get_the_title();

    $project_image = get_field('image');

    if (is_array($project_image) && !empty($project_image['url'])) {
        $catalog_item_image = (string) $project_image['url'];
    } elseif (has_post_thumbnail()) {
        $catalog_item_image = (string) get_the_post_thumbnail_url(get_the_ID(), 'large');
    }

    if ($catalog_item_image === '') {
        $catalog_item_image = $theme_uri . '/dist/img/catalog-image-1.webp';
    }

    $main_params = get_field('main-param');
    $param_values = [];

    if (is_array($main_params)) {
        foreach ($main_params as $main_param) {
            if (!is_array($main_param)) {
                continue;
            }

            $param_body = trim((string) ($main_param['main-param-body'] ?? ''));

            if ($param_body === '') {
                continue;
            }

            $param_values[] = $param_body;

            if (count($param_values) >= 2) {
                break;
            }
        }
    }

    $catalog_item_param_1 = $param_values[0] ?? '—';
    $catalog_item_param_2 = $param_values[1] ?? '—';

    $price_group = get_field('price');
    if (!is_array($price_group)) {
        $price_group = get_field('material_копировать');
    }
    if (!is_array($price_group)) {
        $price_group = get_field('field_69bfa7a7239d8');
    }

    if (is_array($price_group)) {
        $catalog_price_raw = $price_group['price-body'] ?? '';

        if (is_numeric($catalog_price_raw)) {
            $catalog_item_price = number_format((int) round((float) $catalog_price_raw), 0, '', ' ') . ' ₽';
        } else {
            $catalog_item_price = trim((string) $catalog_price_raw);
        }
    }

    if ($catalog_item_price === '') {
        $catalog_item_price = 'по запросу';
    }
}

$catalog_item_title = trim($catalog_item_title);
$catalog_item_param_1 = trim($catalog_item_param_1);
$catalog_item_param_2 = trim($catalog_item_param_2);
$catalog_item_price = trim($catalog_item_price);
?>

<a href="<?php echo esc_url($catalog_item_link); ?>" class="item">
  <img src="<?php echo esc_url($catalog_item_image); ?>" alt="<?php echo esc_attr($catalog_item_title); ?>" class="item__image">
  <div class="item__info">
    <div class="item__name name">
      <?php echo esc_html($catalog_item_title); ?>
    </div>
    <div class="item__param">
      <div class="item__param-item">
        <?php echo esc_html($catalog_item_param_1); ?>
      </div>
      <div class="item__param-item">
        <?php echo esc_html($catalog_item_param_2); ?>
      </div>
    </div>
    <div class="item__price">
      <span class="text no-margin">
        <?php echo esc_html($catalog_item_price); ?>
      </span>
      <svg class="item__arrow" width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.6498 22.4725L27.606 12.5163L17.6498 2.56006M25.3432 12.5163L1.81034 12.5163" stroke="#B2B2B2" stroke-width="3.62044" stroke-linecap="square"/>
      </svg>
    </div>
  </div>
</a>
