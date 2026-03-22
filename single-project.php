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
          <div class="card-calc__column">
            <fieldset class="card-calc__group" data-calc-group="1">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">1</span>
                Добавление и изменение помещений
              </legend>

              <label class="card-calc__option">
                <input type="checkbox" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Изменение планировочных решений путем перемещения перегородок, не затрагивая несущие стены</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Изменение расположения окон, дверей и проемов</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Изменение уклона кровли и навесов</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="7000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Изменение высоты потолков</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Веранда</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Крыльцо</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Балкон</span>
              </label>
              <label class="card-calc__option">
                <input type="checkbox" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Терраса</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="2">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">2</span>
                Тип фундамента
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-2" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По умолчанию</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-2" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Заменить на желаемый (монолитный ленточный ж/б, свайно-ростверковый ж/б, сборные блоки ФБС, мелкозаглубленная ж/б лента, забивные ж/б сваи, винтовые сваи)</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="3">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">3</span>
                Материал наружных и несущих стен
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-3" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Газобетонные блоки 300</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-3" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Газобетонные блоки 400</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-3" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Поризованный керамический блок 380/250</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-3" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Каркас 150/200</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="4">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">4</span>
                Утеплитель
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-4" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Минеральная вата (100)</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-4" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Экструдированный пенополистирол (100)</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-4" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Экструдированный пенополистирол ПЕНОПЛЕКС 120</span>
              </label>
            </fieldset>
          </div>

          <div class="card-calc__column">
            <fieldset class="card-calc__group" data-calc-group="5">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">5</span>
                Материал внутренних перегородок
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-5" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По проекту</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-5" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Кирпич (120)</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-5" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Деревянные каркасы с различными заполнителями (150)</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-5" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Газобетонные блоки 150</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-5" data-price="10000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Плита гипсовая пазогребневая (100)</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="6">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">6</span>
                Тип перекрытия
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По проекту</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="5000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Монолитные ж/б</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="5000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Сборные ж/б плиты</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="5000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Монолитные ж/б и по деревянным балкам</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="5000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По деревянным балкам</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-6" data-price="5000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Сборные ж/б плиты и по деревянным балкам</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="7">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">7</span>
                Цокольный или подвальный этаж
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-7" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Без изменений</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-7" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Цоколь/Подвал</span>
              </label>
            </fieldset>
          </div>

          <div class="card-calc__column">
            <fieldset class="card-calc__group" data-calc-group="8">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">8</span>
                Отделка фасада
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-8" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По проекту</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-8" data-price="7000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Декоративная штукатурка</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-8" data-price="7000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Лицевой кирпич</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-8" data-price="7000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Клинкерная плитка</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-8" data-price="7000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Фиброцементный сайдинг</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="9">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">9</span>
                Гараж
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-9" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">По проекту</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-9" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Убрать гараж</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-9" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">1 автомобиль</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-9" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">2 автомобиля</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-9" data-price="15000">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">3 автомобиля</span>
              </label>
            </fieldset>

            <fieldset class="card-calc__group" data-calc-group="10">
              <legend class="card-calc__group-title orange uppercase">
                <span class="card-calc__group-number">10</span>
                Покрытие кровли
              </legend>

              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0" checked>
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Металлочерепица</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Мягкая черепица</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Керамическая черепица</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Композитная черепица</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Фальцевая кровля</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Наплавляемая</span>
              </label>
              <label class="card-calc__option">
                <input type="radio" name="calc-group-10" data-price="0">
                <span class="card-calc__control"></span>
                <span class="card-calc__option-text">Цементно-песчаная черепица</span>
              </label>
            </fieldset>
          </div>
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

  <section class="feedback dark margin">
    <div class="container">
      <div class="feedback__area">
        <div class="feedback__info">

          <h2>
            нужно Внести изменения в проект?
          </h2>
          <div class="text">
            Оставьте заявку, и менеджер свяжется
            с Вами в ближайшее время
          </div>
        </div>
        <form class="feedback__form">
          <input class="feedback__input" type="text" placeholder="Имя">
          <input class="feedback__input" type="text" placeholder="Номер">
          <a href="#" class="feedback__button button button-main">
            Оставить заявку
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 12.4141L15.25 6.91406L9.75 1.41406M14 6.91406L1 6.91406" stroke="black" stroke-width="2" stroke-linecap="square"/>
            </svg>
          </a>
        </form>
      </div>
    </div>
    <img src="<?php echo $theme_uri; ?>/dist/img/feedback-bg.webp" alt="" class="feedback__bg">
  </section>


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
  <section class="feedback">
    <div class="container">
      <div class="feedback__area">
        <div class="feedback__info">
          <div class="text">
            Не нашли подходящий проект?
          </div>
          <h2 class="info__title">
            создадим <i>идеальный дом</i> для вас
          </h2>
        </div>
        <form class="feedback__form">
          <input class="feedback__input" type="text" placeholder="Имя">
          <input class="feedback__input" type="text" placeholder="Номер">
          <a href="#" class="feedback__button button button-stroke">
            Оставить заявку
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
            </svg>

          </a>
        </form>
      </div>
    </div>
    <img src="<?php echo $theme_uri; ?>/dist/img/feedback-bg.webp" alt="" class="feedback__bg">
  </section>




</main>

<?php get_footer(); ?>
