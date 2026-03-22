<?php
get_header();
$theme_uri = esc_url(get_template_directory_uri());

$project_title = get_the_title();
$project_id = trim((string) get_field('id'));

$project_slider = get_field('slider');
$project_main_image = get_field('image');
$slider_images = [];

$collect_project_image = static function ($image_item, $fallback_alt = '') {
    $image_url = '';
    $image_alt = '';

    if (is_array($image_item)) {
        $image_url = isset($image_item['url']) ? (string) $image_item['url'] : '';
        $image_alt = isset($image_item['alt']) ? (string) $image_item['alt'] : '';
    } elseif (is_numeric($image_item)) {
        $image_id = (int) $image_item;
        $image_url = (string) wp_get_attachment_image_url($image_id, 'full');
        $image_alt = (string) get_post_meta($image_id, '_wp_attachment_image_alt', true);
    } elseif (is_string($image_item)) {
        $image_url = $image_item;
    }

    $image_url = trim($image_url);
    $image_alt = trim($image_alt);
    $fallback_alt = trim((string) $fallback_alt);

    if ($image_url === '') {
        return null;
    }

    return [
        'url' => $image_url,
        'alt' => $image_alt !== '' ? $image_alt : $fallback_alt,
    ];
};

if (is_array($project_slider)) {
    foreach ($project_slider as $slider_image_item) {
        $slider_image = $collect_project_image($slider_image_item, $project_title);

        if (is_array($slider_image)) {
            $slider_images[] = $slider_image;
        }
    }
}

if (empty($slider_images)) {
    $main_image = $collect_project_image($project_main_image, $project_title);

    if (is_array($main_image)) {
        $slider_images[] = $main_image;
    }
}

if (empty($slider_images)) {
    $slider_images[] = [
        'url' => $theme_uri . '/dist/img/card-head-1.webp',
        'alt' => $project_title,
    ];
}

$main_params = get_field('main-param');
if (!is_array($main_params)) {
    $main_params = [];
}

$material_group = get_field('material');
if (!is_array($material_group)) {
    $material_group = [];
}
$material_title = trim((string) ($material_group['material-head'] ?? 'Применяемые отделочные материалы'));
$material_body = trim((string) ($material_group['material-body'] ?? ''));

$dop_params = get_field('dop-param');
if (!is_array($dop_params)) {
    $dop_params = [];
}

$price_group = get_field('price');
if (!is_array($price_group)) {
    $price_group = get_field('material_копировать');
}
if (!is_array($price_group)) {
    $price_group = get_field('field_69bfa7a7239d8');
}
if (!is_array($price_group)) {
    $price_group = [];
}

$price_head = trim((string) ($price_group['price-head'] ?? 'Стоимость проекта'));
$price_subhead = trim((string) ($price_group['price-subhead'] ?? '(архитектурный раздел)'));
$price_body_raw = $price_group['price-body'] ?? '22000';
$card_calc_base_cost = 22000;

if (is_numeric($price_body_raw)) {
    $price_value = (int) round((float) $price_body_raw);
    $price_body = number_format($price_value, 0, '', ' ') . ' ₽';
    $card_calc_base_cost = $price_value;
} else {
    $price_body = trim((string) $price_body_raw);
    $price_digits = preg_replace('/[^\d]/u', '', $price_body);
    $card_calc_base_cost = $price_digits !== '' ? (int) $price_digits : 22000;
}

$plan_editor_rows = get_field('plan-editor');
if (!is_array($plan_editor_rows)) {
    $plan_editor_rows = [];
}

$plan_editor_items = [];

foreach ($plan_editor_rows as $plan_editor_index => $plan_editor_row) {
    if (!is_array($plan_editor_row)) {
        continue;
    }

    $plan_title = trim((string) ($plan_editor_row['plan-editor-body'] ?? ''));
    $plan_image = $collect_project_image($plan_editor_row['plan-editor-head'] ?? null, $plan_title !== '' ? $plan_title : $project_title);

    if (!is_array($plan_image)) {
        continue;
    }

    if ($plan_title === '') {
        $plan_title = 'План ' . ($plan_editor_index + 1);
    }

    $plan_editor_items[] = [
        'title' => $plan_title,
        'url'   => $plan_image['url'],
        'alt'   => $plan_image['alt'],
    ];
}

$services_tab_title = trim((string) get_field('services-name'));
if ($services_tab_title === '') {
    $services_tab_title = 'Стоимость услуг';
}

$services_params = get_field('services-param');
if (!is_array($services_params)) {
    $services_params = [];
}

$services_gray_text = trim((string) get_field('services-gray-text'));

$extra_tab_title = trim((string) get_field('dop-servies'));
if ($extra_tab_title === '') {
    $extra_tab_title = 'дополнительные услуги';
}

$extra_params = get_field('dop-servies-param');
if (!is_array($extra_params)) {
    $extra_params = [];
}

$engineering_tab_title = trim((string) get_field('seti'));
if ($engineering_tab_title === '') {
    $engineering_tab_title = 'ИНЖЕНЕРНЫЕ СЕТИ ТИПОВЫЕ';
}

$engineering_text = trim((string) get_field('seti-text'));

$engineering_params = get_field('seti-param');
if (!is_array($engineering_params)) {
    $engineering_params = [];
}

$calc_params = get_field('calc-param', 'option');
if (!is_array($calc_params)) {
    $calc_params = get_field('calc-param', 'options');
}
if (!is_array($calc_params)) {
    $calc_params = get_field('calc-param', 'calc');
}
if (!is_array($calc_params)) {
    $calc_params = [];
}

$parse_calc_price = static function ($value) {
    if (is_numeric($value)) {
        return (float) $value;
    }

    $value_string = trim((string) $value);
    if ($value_string === '') {
        return 0.0;
    }

    $normalized_value = preg_replace('/[^\d,.\-]/u', '', $value_string);
    if (!is_string($normalized_value) || $normalized_value === '') {
        return 0.0;
    }

    $normalized_value = str_replace(',', '.', $normalized_value);

    return is_numeric($normalized_value) ? (float) $normalized_value : 0.0;
};

$card_calc_groups = [];

foreach ($calc_params as $calc_group_index => $calc_group_row) {
    if (!is_array($calc_group_row)) {
        continue;
    }

    $calc_group_title = trim((string) ($calc_group_row['calc-param-name'] ?? ''));
    $calc_group_items_rows = $calc_group_row['calc-param-item'] ?? [];
    $calc_group_is_multi = !empty($calc_group_row['calc-multy']);

    if (!is_array($calc_group_items_rows)) {
        $calc_group_items_rows = [];
    }

    $calc_group_items = [];

    foreach ($calc_group_items_rows as $calc_item_row) {
        if (!is_array($calc_item_row)) {
            continue;
        }

        $calc_item_name = trim((string) ($calc_item_row['calc-param-item-name'] ?? ''));
        if ($calc_item_name === '') {
            continue;
        }

        $calc_item_price = $parse_calc_price($calc_item_row['calc-param-item-cost'] ?? 0);

        $calc_group_items[] = [
            'name'  => $calc_item_name,
            'price' => $calc_item_price,
        ];
    }

    if ($calc_group_title === '') {
        $calc_group_title = 'Параметр ' . ($calc_group_index + 1);
    }

    if (empty($calc_group_items)) {
        continue;
    }

    $card_calc_groups[] = [
        'number'   => count($card_calc_groups) + 1,
        'title'    => $calc_group_title,
        'is_multi' => $calc_group_is_multi,
        'items'    => $calc_group_items,
    ];
}

$card_calc_columns = [[], [], []];
$card_calc_group_count = count($card_calc_groups);

if ($card_calc_group_count > 0) {
    $card_calc_column_count = count($card_calc_columns);
    $base_groups_per_column = intdiv($card_calc_group_count, $card_calc_column_count);
    $groups_remainder = $card_calc_group_count % $card_calc_column_count;
    $group_offset = 0;

    for ($column_index = 0; $column_index < $card_calc_column_count; $column_index++) {
        $groups_in_column = $base_groups_per_column + ($column_index < $groups_remainder ? 1 : 0);
        if ($groups_in_column <= 0) {
            continue;
        }

        $card_calc_columns[$column_index] = array_slice($card_calc_groups, $group_offset, $groups_in_column);
        $group_offset += $groups_in_column;
    }
}

$breadcrumbs_project = $project_id !== '' ? 'проект ' . $project_id : $project_title;
?>

<main>

  <div class="page-head">
    <div class="container">
      <div class="page-head__area">
        <div class="breadcrumbs">
          главная - каталог проектов - <?php echo esc_html($breadcrumbs_project); ?>
        </div>
        <h1 class="page-head__title ">
          <?php echo esc_html($project_title); ?>
        </h1>
      </div>
    </div>
  </div>

  <div class="card-head margin">
    <div class="container">
      <div class="card-head__area">
        <div class="card-slider">
          <div class="card-slider__main">
            <?php foreach ($slider_images as $slider_image) : ?>
              <a href="<?php echo esc_url($slider_image['url']); ?>" data-fancybox="slider" class="card-slider__main-item">
                <img src="<?php echo esc_url($slider_image['url']); ?>" alt="<?php echo esc_attr($slider_image['alt']); ?>">
              </a>
            <?php endforeach; ?>
          </div>
          <div class="card-slider__mini">
            <?php foreach ($slider_images as $slider_image) : ?>
              <div class="card-slider__mini-item">
                <img src="<?php echo esc_url($slider_image['url']); ?>" alt="<?php echo esc_attr($slider_image['alt']); ?>">
              </div>
            <?php endforeach; ?>
          </div>
        </div>
        <div class="card-info">
          <?php if ($project_id !== '') : ?>
            <h2 class="card-info__subtitle gray">
              <?php echo esc_html($project_id); ?>
            </h2>
          <?php endif; ?>
          <div class="card-info__title name">
            <?php echo esc_html($project_title); ?>
          </div>
          <?php foreach ($main_params as $main_param) : ?>
            <?php
            if (!is_array($main_param)) {
                continue;
            }

            $main_param_head = trim((string) ($main_param['main-param-head'] ?? ''));
            $main_param_body = trim((string) ($main_param['main-param-body'] ?? ''));

            if ($main_param_head === '' && $main_param_body === '') {
                continue;
            }
            ?>
            <div class="param">
              <div class="param__head gray">
                <?php echo esc_html($main_param_head); ?>
              </div>
              <div class="param__body">
                <?php echo esc_html($main_param_body); ?>
              </div>
            </div>
          <?php endforeach; ?>
          <div class="material">
            <div class="material__title gray">
              <?php echo esc_html($material_title); ?>
            </div>
            <div class="material__body">
              <?php echo esc_html($material_body); ?>
            </div>
          </div>
          <div class="general">
            <div class="price">
              <div class="price__area">
                <div class="price__title">
                  <?php echo esc_html($price_head); ?>
                </div>
                <div class="price__subtitle mini gray">
                  <?php echo esc_html($price_subhead); ?>
                </div>
                <div class="price__cost orange">
                  <?php echo esc_html($price_body); ?>
                </div>
              </div>
              <div class="price__more gray mini">
                Что еще входит в стоимость?
              </div>
            </div>
            <div class="dop">
              <div class="dop__title">
                Приобретается дополнительно
              </div>
              <?php foreach ($dop_params as $dop_param) : ?>
                <?php
                if (!is_array($dop_param)) {
                    continue;
                }

                $dop_param_name = trim((string) ($dop_param['dop-param-name'] ?? ''));
                $dop_param_body = trim((string) ($dop_param['dop-param-body'] ?? ''));

                if ($dop_param_name === '' && $dop_param_body === '') {
                    continue;
                }
                ?>
                <div class="param">
                  <div class="param__head gray">
                    <?php echo esc_html($dop_param_name); ?>
                  </div>
                  <div class="param__body">
                    <?php echo esc_html($dop_param_body); ?>
                  </div>
                </div>
              <?php endforeach; ?>

            </div>
          </div>
          <div class="buttons">
            <div class="buttons__head">
              <a href="" class="button button-main">
                заказать проект
              </a>
            </div>
            <div class="buttons__change">
              <a href="/project" class=" button button-stroke">
                внести изменения <br> в проект
              </a>
              <a href="/project" class=" button button-stroke">
                изменить планировку
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">
    <h2 class="block-title">ПОЭТАЖНЫЕ ПЛАНЫ</h2>
  </div>
  <div class="plans">
    <div class="container">
      <div class="plans__area">
        <?php if (!empty($plan_editor_items)) : ?>
          <?php foreach ($plan_editor_items as $plan_editor_item) : ?>
            <div class="plans__part">
              <h3 class="plans__title">
                <?php echo esc_html($plan_editor_item['title']); ?>
              </h3>
              <div class="plans__image">
                <img src="<?php echo esc_url($plan_editor_item['url']); ?>" alt="<?php echo esc_attr($plan_editor_item['alt']); ?>">
              </div>
              <button class="button button-stroke plans__edit-button" type="button">
                редактировать планировку
              </button>
            </div>
          <?php endforeach; ?>
        <?php else : ?>
          <div class="plans__part">
            <h3 class="plans__title">
              1 ЭТАЖ
            </h3>
            <div class="plans__image">
              <img src="<?php echo $theme_uri; ?>/dist/img/plan-1.webp" alt="">
            </div>
            <button class="button button-stroke plans__edit-button" type="button">
              редактировать планировку
            </button>
          </div>
          <div class="plans__part">
            <h3 class="plans__title">
              2 ЭТАЖ
            </h3>
            <div class="plans__image">
              <img src="<?php echo $theme_uri; ?>/dist/img/plan-2.webp" alt="">
            </div>
            <button class="button button-stroke plans__edit-button" type="button">
              редактировать планировку
            </button>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <div class="plan-editor-modal" aria-hidden="true">
    <button class="plan-editor-modal__overlay" type="button" aria-label="Закрыть редактор"></button>
    <div class="plan-editor-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="plan-editor-title">
      <div class="plan-editor-modal__head">
        <h2 class="plan-editor-modal__title" id="plan-editor-title">
          ИЗМЕНЕНИЕ ПЛАНИРОВКИ
        </h2>
        <button class="plan-editor-modal__close" type="button" aria-label="Закрыть редактор">
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="plan-editor-modal__plan-row">
        <span class="plan-editor-modal__plan-label">План</span>
        <select class="plan-editor-modal__plan-select" aria-label="Выбор плана"></select>
      </div>

      <div class="plan-editor-modal__toolbar">
        <button class="plan-editor-modal__tool is-active" type="button" data-plan-tool="brush">Кисть</button>
        <button class="plan-editor-modal__tool" type="button" data-plan-tool="eraser">Ластик</button>
        <button class="plan-editor-modal__tool" type="button" data-plan-tool="line">Линия</button>
        <button class="plan-editor-modal__tool" type="button" data-plan-tool="text">Текст</button>
        <button class="plan-editor-modal__tool" type="button" data-plan-tool="hand">Перемещение</button>
        <button class="plan-editor-modal__tool" type="button" data-plan-action="clear">Очистить всё</button>
        <div class="plan-editor-modal__zoom">
          <button class="plan-editor-modal__zoom-btn" type="button" data-plan-zoom="out" aria-label="Уменьшить масштаб">-</button>
          <button class="plan-editor-modal__zoom-value" type="button" data-plan-zoom="reset" aria-label="Сбросить масштаб">100%</button>
          <button class="plan-editor-modal__zoom-btn" type="button" data-plan-zoom="in" aria-label="Увеличить масштаб">+</button>
        </div>
      </div>

      <div class="plan-editor-modal__canvas-wrap">
        <div class="plan-editor-modal__stage">
          <img class="plan-editor-modal__base-image" src="" alt="Планировка">
          <canvas class="plan-editor-modal__canvas"></canvas>
        </div>
      </div>

      <form class="plan-editor-modal__form">
        <label class="plan-editor-modal__comment-title" for="plan-editor-comment">Комментарий к планировке</label>
        <input class="plan-editor-modal__comment-input" id="plan-editor-comment" type="text">
        <button class="plan-editor-modal__submit button button-main" type="submit">
          ОТПРАВИТЬ ИЗМЕНЕНИЯ
        </button>
      </form>
    </div>
  </div>




  <section class="card-tabs">
    <div class="container">
      <div class="card-tabs__head">
        <div class="card-tabs__head-item" data-tab-key="services">
          <?php echo esc_html($services_tab_title); ?>
        </div>
        <div class="card-tabs__head-item" data-tab-key="extra">
          <?php echo esc_html($extra_tab_title); ?>
        </div>
        <div class="card-tabs__head-item" data-tab-key="engineering">
          <?php echo esc_html($engineering_tab_title); ?>
        </div>
      </div>
      <div class="card-tabs__body">
        <div class="card-tabs__body-item text" data-tab-key="services">
          <div class="width-eight">
            <?php foreach ($services_params as $services_param) : ?>
              <?php
              if (!is_array($services_param)) {
                  continue;
              }

              $services_param_name = trim((string) ($services_param['services-param-name'] ?? ''));
              $services_param_body = trim((string) ($services_param['services-param-body'] ?? ''));

              if ($services_param_name === '' && $services_param_body === '') {
                  continue;
              }
              ?>
              <div class="param">
                <div class="param__head orange">
                  <?php echo esc_html($services_param_name); ?>
                </div>
                <div class="param__body">
                  <?php echo esc_html($services_param_body); ?>
                </div>
              </div>
            <?php endforeach; ?>
            <?php if ($services_gray_text !== '') : ?>
              <div class="subtext mini gray">
                <?php echo esc_html($services_gray_text); ?>
              </div>
            <?php endif; ?>
          </div>
        </div>
        <div class="card-tabs__body-item" data-tab-key="extra">
          <div class="dop">
            <?php foreach ($extra_params as $extra_param) : ?>
              <?php
              if (!is_array($extra_param)) {
                  continue;
              }

              $extra_title = trim((string) ($extra_param['dop-servies-param-head'] ?? ''));
              $extra_body = trim((string) ($extra_param['dop-servies-param-body'] ?? ''));

              if ($extra_title === '' && $extra_body === '') {
                  continue;
              }

              $extra_body_is_html = $extra_body !== '' && preg_match('/<[^>]+>/', $extra_body) === 1;
              ?>
              <div class="dop__item">
                <?php if ($extra_title !== '') : ?>
                  <h3 class="dop__title">
                    <?php echo esc_html($extra_title); ?>
                  </h3>
                <?php endif; ?>
                <?php if ($extra_body !== '') : ?>
                  <?php if ($extra_body_is_html) : ?>
                    <?php echo wp_kses_post($extra_body); ?>
                  <?php else : ?>
                    <p><?php echo esc_html($extra_body); ?></p>
                  <?php endif; ?>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
        <div class="card-tabs__body-item" data-tab-key="engineering">
          <?php if ($engineering_text !== '') : ?>
            <p>
              <?php echo esc_html($engineering_text); ?>
            </p>
          <?php endif; ?>
          <div class="width-eight">
            <div class="seti">
              <?php foreach ($engineering_params as $engineering_param) : ?>
                <?php
                if (!is_array($engineering_param)) {
                    continue;
                }

                $engineering_param_text = trim((string) ($engineering_param['seti-param-text'] ?? ''));
                $engineering_param_cost = trim((string) ($engineering_param['seti-param-cost'] ?? ''));

                if ($engineering_param_text === '' && $engineering_param_cost === '') {
                    continue;
                }

                $engineering_text_is_html = $engineering_param_text !== '' && preg_match('/<[^>]+>/', $engineering_param_text) === 1;
                ?>
                <div class="seti__item">
                  <?php if ($engineering_param_text !== '') : ?>
                    <?php if ($engineering_text_is_html) : ?>
                      <?php echo wp_kses_post($engineering_param_text); ?>
                    <?php else : ?>
                      <p><?php echo esc_html($engineering_param_text); ?></p>
                    <?php endif; ?>
                  <?php endif; ?>
                  <?php if ($engineering_param_cost !== '') : ?>
                    <p class="seti__price orange">
                      <?php echo esc_html($engineering_param_cost); ?>
                    </p>
                  <?php endif; ?>
                </div>
              <?php endforeach; ?>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <section class="card-calc" data-base-cost="<?php echo esc_attr((string) $card_calc_base_cost); ?>">
    <div class="container">
      <h2 class="block-title card-calc__title">
        Расчет стоимости при выборе характеристик проекта
      </h2>
      <p class="card-calc__note mini gray">
        *Стоимость изменения характеристик проекта оплачивается единоразово и относится ко всем выбранным разделам.
      </p>

      <div class="card-calc__box">
        <div class="card-calc__grid">
          <?php foreach ($card_calc_columns as $card_calc_column_groups) : ?>
            <div class="card-calc__column">
              <?php foreach ($card_calc_column_groups as $card_calc_group) : ?>
                <fieldset class="card-calc__group" data-calc-group="<?php echo esc_attr((string) $card_calc_group['number']); ?>">
                  <legend class="card-calc__group-title orange uppercase">
                    <span class="card-calc__group-number"><?php echo esc_html((string) $card_calc_group['number']); ?></span>
                    <?php echo esc_html($card_calc_group['title']); ?>
                  </legend>

                  <?php foreach ($card_calc_group['items'] as $card_calc_item_index => $card_calc_item) : ?>
                    <?php $is_checked_by_default = !$card_calc_group['is_multi'] && $card_calc_item_index === 0; ?>
                    <label class="card-calc__option">
                      <input
                        type="<?php echo esc_attr($card_calc_group['is_multi'] ? 'checkbox' : 'radio'); ?>"
                        <?php if (!$card_calc_group['is_multi']) : ?>
                          name="<?php echo esc_attr('calc-group-' . $card_calc_group['number']); ?>"
                        <?php endif; ?>
                        data-price="<?php echo esc_attr((string) $card_calc_item['price']); ?>"
                        <?php checked($is_checked_by_default); ?>
                      >
                      <span class="card-calc__control"></span>
                      <span class="card-calc__option-text"><?php echo esc_html($card_calc_item['name']); ?></span>
                    </label>
                  <?php endforeach; ?>
                </fieldset>
              <?php endforeach; ?>
            </div>
          <?php endforeach; ?>
        </div>

        <div class="card-calc__summary">
          <div class="card-calc__summary-totals">
            <div class="card-calc__summary-item">
              <div class="card-calc__summary-label">Приблизительная стоимость изменений</div>
              <div class="card-calc__summary-value orange" data-calc-out="changes">0 ₽</div>
            </div>
            <div class="card-calc__summary-item">
              <div class="card-calc__summary-label">Стоимость проекта</div>
              <div class="card-calc__summary-value orange" data-calc-out="base">0 ₽</div>
            </div>
            <div class="card-calc__summary-item">
              <div class="card-calc__summary-label">Приблизительная стоимость измененного проекта</div>
              <div class="card-calc__summary-value orange" data-calc-out="total">0 ₽</div>
            </div>
          </div>
          <button class="card-calc__summary-action button button-main" type="button">Оставить заявку</button>
        </div>
      </div>
    </div>
  </section>

  <?php require get_template_directory() . '/parts/feedback/project-change.php'; ?>


  <section class="project-list mini-margin">

    <div class="container">
      <h2>ПРОСМОТРЕННЫЕ ПРОЕКТЫ</h2>
      <div class="main-catalog three-grid">
        <div class="item">
          <img src="<?php echo $theme_uri; ?>/dist/img/catalog-image-1.webp" alt="" class="item__image">
          <div class="item__info">
            <div class="item__name">
              Проект одноэтажного жилого дома
              со встроенным гаражом
              на две машины
            </div>
            <div class="item__param">
              <div class="item__param-item">
                116 м2
              </div>
              <div class="item__param-item">
                12х14
              </div>
            </div>
            <div class="item__price">
            <span>
              от 50 000 ₽
            </span>
              <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6498 22.4725L27.606 12.5163L17.6498 2.56006M25.3432 12.5163L1.81034 12.5163" stroke="#B2B2B2" stroke-width="3.62044" stroke-linecap="square"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="item">
          <img src="<?php echo $theme_uri; ?>/dist/img/catalog-image-1.webp" alt="" class="item__image">
          <div class="item__info">
            <div class="item__name">
              Проект одноэтажного жилого дома
              со встроенным гаражом
              на две машины
            </div>
            <div class="item__param">
              <div class="item__param-item">
                116 м2
              </div>
              <div class="item__param-item">
                12х14
              </div>
            </div>
            <div class="item__price">
            <span>
              от 50 000 ₽
            </span>
              <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6498 22.4725L27.606 12.5163L17.6498 2.56006M25.3432 12.5163L1.81034 12.5163" stroke="#B2B2B2" stroke-width="3.62044" stroke-linecap="square"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="item">
          <img src="<?php echo $theme_uri; ?>/dist/img/catalog-image-1.webp" alt="" class="item__image">
          <div class="item__info">
            <div class="item__name">
              Проект одноэтажного жилого дома
              со встроенным гаражом
              на две машины
            </div>
            <div class="item__param">
              <div class="item__param-item">
                116 м2
              </div>
              <div class="item__param-item">
                12х14
              </div>
            </div>
            <div class="item__price">
            <span>
              от 50 000 ₽
            </span>
              <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6498 22.4725L27.606 12.5163L17.6498 2.56006M25.3432 12.5163L1.81034 12.5163" stroke="#B2B2B2" stroke-width="3.62044" stroke-linecap="square"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <a href="/project" class="main-catalog__button button button-stroke">
        смотреть все проекты
        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
        </svg>

      </a>
    </div>


  </section>
  <?php require get_template_directory() . '/parts/feedback/single-bottom.php'; ?>




</main>

<?php get_footer(); ?>
