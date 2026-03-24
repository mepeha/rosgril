<?php
get_header();
$theme_uri = get_template_directory_uri();

$project_example_gallery_raw = [];
if (function_exists('get_field')) {
    $project_example_contexts = [
        'end-home-admin-page',
        'options_end-home-admin-page',
        'options_end_home_admin_page',
        'option',
        'options',
    ];

    foreach ($project_example_contexts as $project_example_context) {
        $project_example_value = get_field('end-home-example', $project_example_context);
        if (is_array($project_example_value) && !empty($project_example_value)) {
            $project_example_gallery_raw = $project_example_value;
            break;
        }
    }
}

$project_example_items = [];
if (!empty($project_example_gallery_raw)) {
    foreach ($project_example_gallery_raw as $project_example_item) {
        if (!is_array($project_example_item)) {
            continue;
        }

        $project_example_full = trim((string) ($project_example_item['url'] ?? ''));
        if ($project_example_full === '') {
            continue;
        }

        $project_example_sizes = is_array($project_example_item['sizes'] ?? null) ? $project_example_item['sizes'] : [];
        $project_example_thumb = trim((string) ($project_example_sizes['medium_large'] ?? $project_example_sizes['large'] ?? $project_example_sizes['medium'] ?? $project_example_full));
        $project_example_caption = trim((string) ($project_example_item['caption'] ?? ''));
        $project_example_title = trim((string) ($project_example_item['title'] ?? ''));
        $project_example_alt = trim((string) ($project_example_item['alt'] ?? ''));

        if ($project_example_caption === '') {
            $project_example_caption = $project_example_title;
        }

        if ($project_example_alt === '') {
            $project_example_alt = $project_example_caption !== '' ? $project_example_caption : ($project_example_title !== '' ? $project_example_title : 'Пример выполненного проекта');
        }

        $project_example_items[] = [
            'full' => $project_example_full,
            'thumb' => $project_example_thumb,
            'caption' => $project_example_caption,
            'alt' => $project_example_alt,
        ];
    }
}

if (empty($project_example_items)) {
    $project_example_items = [
        ['full' => $theme_uri . '/dist/img/card-head-1.webp', 'thumb' => $theme_uri . '/dist/img/card-head-1.webp', 'caption' => 'Пример проекта 1', 'alt' => 'Пример проекта 1'],
        ['full' => $theme_uri . '/dist/img/catalog-image-1.webp', 'thumb' => $theme_uri . '/dist/img/catalog-image-1.webp', 'caption' => 'Пример проекта 2', 'alt' => 'Пример проекта 2'],
        ['full' => $theme_uri . '/dist/img/individual-2.webp', 'thumb' => $theme_uri . '/dist/img/individual-2.webp', 'caption' => 'Пример проекта 3', 'alt' => 'Пример проекта 3'],
        ['full' => $theme_uri . '/dist/img/plan-1.webp', 'thumb' => $theme_uri . '/dist/img/plan-1.webp', 'caption' => 'Пример проекта 4', 'alt' => 'Пример проекта 4'],
        ['full' => $theme_uri . '/dist/img/plan-2.webp', 'thumb' => $theme_uri . '/dist/img/plan-2.webp', 'caption' => 'Пример проекта 5', 'alt' => 'Пример проекта 5'],
    ];
}
?>

<main>

    <section class="individual-banner">
        <div class="container">
            <div class="individual-banner__area">
                <div class="individual-banner__info">
                    <h1>
                        индивидуальное проектирование
                        загородных жилых домов
                    </h1>
                    <h3>
                        Стоимость проектирования <span class="nowrap">от 550 ₽/ м2</span>
                    </h3>
                    <a href="/project/" class="banner__button button button-main">
                        смотреть все проекты
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 12.4141L15.25 6.91406L9.75 1.41406M14 6.91406L1 6.91406" stroke="black" stroke-width="2" stroke-linecap="square"/>
                        </svg>
                    </a>
                </div>
                <img class="individual-banner__image js-fast-zoom-reveal" src="<?php echo esc_url($theme_uri . "/dist/img/individual-banner-img.webp"); ?>" alt="">
            </div>
        </div>
    </section>
    <section class="create">
        <div class="container">
            <div class="create__area">
                <img class="create__image js-fast-zoom-reveal" src="<?php echo esc_url($theme_uri . "/dist/img/individual-2.webp"); ?>" alt="">
                <div class="create__info info">
                    <div class="text">
                        Мы разрабатываем проекты частных жилых домов, которые отвечают всем потребностям заказчика и отражают его индивидуальность. Разработанная нами документация, позволяет построить надежный дом, в котором будет приятно жить Вам и Вашим близким!
                    </div>
                    <a href="/project" class="info__button button button-stroke" data-feedback-popup-open>
                        воплотить ваш проект
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"/>
                        </svg>

                    </a>
                </div>
            </div>
        </div>
    </section>

    <div class="preim margin">
        <div class="container">
            <h2>
                наши преимущества
            </h2>
            <div class="preim__area">
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim1.webp"); ?>" alt="">
                    </div>
                    <h3>
                        Уникальность
                    </h3>
                    <div >
                        Создаём уникальные и эксклюзивные пространства
                        в каждом проекте
                    </div>
                </div>
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim2.webp"); ?>" alt="">
                    </div>
                    <h3>
                        Профессиональность
                    </h3>
                    <div >
                        Профессиональные консультации
                        на всех этапах строительства
                    </div>
                </div>
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim3.webp"); ?>" alt="">
                    </div>
                    <h3>
                        Опытность
                    </h3>
                    <div >
                        Над каждым проектом работают высококвалифицированные специалисты
                    </div>
                </div>
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim4.webp"); ?>" alt="">
                    </div>
                    <h3>
                        Региональные
                        особенности
                    </h3>
                    <div >
                        Учёт региональных особенностей
                        при разработке проекта
                    </div>
                </div>
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim5.webp"); ?>" alt="">
                    </div>
                    <h3 >
                        Сотрудничество
                    </h3>
                    <div>
                        Мы сотрудничаем с подрядными организациями и поставщиками строительных материалов дают гарантии качественного и грамотного строительного процесса, а так же рациональной сметной стоимости проекта (по Свердловской области)
                    </div>
                </div>
                <div class="preim__item">
                    <div class="icon">
                        <img src="<?php echo esc_url($theme_uri . "/dist/img/preim6.webp"); ?>" alt="">
                    </div>
                    <h3>
                        Функциональность
                    </h3>
                    <div >
                        Приоритетные задачи
                        для создания проектов
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
    $projects_section_title = 'Выполненные проекты';
    $projects_section_class = 'margin';
    $projects_section_count = 3;
    $projects_section_exclude_id = 0;
    require get_template_directory() . '/parts/catalog/projects-section.php';
    ?>


    <section class="stages-project mini-margin">

        <div class="container">
            <h2>
                этапы проектирования
            </h2>

            <h3>1 - Эскизное проектирование</h3>
            <p>
                На этапе эскиза мы разрабатываем концепцию будущего дома. Ведем поиск удачного планировочного решения, учитывая объемно-пространственные характеристики и пропорции будущего проекта.
            </p>



            <div class="stages-slider mini-margin">
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        1
                    </div>
                    <div class="stages-slider__info">
                        <strong class="uppercase">
                            знакомство
                        </strong>
                        <p>Созвон или встреча (по предварительной договорённости)
                            с командой для обсуждения технического задания и пожеланий заказчика</p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        2
                    </div>
                    <div class="stages-slider__info ">
                        <strong class="uppercase">
                            ТЕХНИЧЕСКОЕ ЗАДАНИЕ
                        </strong>
                        <p>
                            Составление технического задания, заключение договора
                            на проектирование
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        3
                    </div>
                    <div class="stages-slider__info">
                        <strong class="uppercase">
                            ПЛАНИРОВКА
                        </strong>
                        <p>
                            Разработка предварительных планировочных решений (два-три варианта) на основании технического задания с учетом расположения дома на участке
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        4
                    </div>
                    <div class="stages-slider__info">
                        <strong class="uppercase">
                            КОРРЕКТИРОВКИ
                        </strong>
                        <p>
                            Внесение корректировок в планировку и посадку при необходимости, а также согласование финального решения
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        5
                    </div>
                    <div class="stages-slider__info">
                        <strong class="uppercase">
                            ФАСАДЫ
                        </strong>
                        <p>
                            Проработка фасадных решений в выбранном стиле. Дополняются общие данные и схематичный разрез для понимания внутренней высоты помещений
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        6
                    </div>
                    <div class="stages-slider__info">
                        <strong class="uppercase">
                            изменение фасадов
                        </strong>
                        <p>
                            Внесение корректировок в фасадные решения при необходимости
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        7
                    </div>
                    <div class="stages-slider__info ">
                        <strong class="uppercase">
                            визуализация
                        </strong>
                        <p>
                            3D-моделирование и визуализация проекта (на данном этапе правки в проект не вносятся)
                        </p>
                    </div>
                </div>
                <div class="stages-slider__item">
                    <div class="stages-slider__nubmer">
                        8
                    </div>
                    <div class="stages-slider__info ">
                        <strong class="uppercase">
                            согласование
                        </strong>
                        <p>
                            Согласование эскизного проекта и передача его в дальнейшую разработку
                        </p>
                    </div>
                </div>
            </div>
            <br><br>
            <div class="content">
                <h3>2 - рабочее</h3>
                <p>
                    Детальная проработка ранее разработанной концепции. Уточнение используемых материалов и конструктивных решений. Параллельная разработка
                </p>
                <p class="name">
                    АРХИТЕКТУРНОЕ РЕШЕНИЕ (AP)
                </p>


                <p>
                    Комплект чертежей с ведомостями основных объемов материалов, разработка узлов, привязка строения к участку, и другая проработка ранее разработанных чертежей
                </p>
                <p class="name">
                    КОНСТРУКТИВНОЕ РЕШЕНИЕ (KP) - при необходимости
                </p>

                <p>
                    Чертежи по строительным конструкциям здания, включающие все этапы строительных работ от нулевого цикла до покрытия кровли
                </p>

                <p class="name">
                    ИНЖЕНЕРНОЕ ПРОЕКТИРОВАНИЕ - при необходимости
                </p>
                <p>
                    (при необходимости) Проект отопления, вентиляции, водоснабжения, канализации и электрики
                </p>
            </div>
        </div>
    </section>

    <section class="project-example mini-margin">
        <div class="container">
            <h2 class="project-example__title">ПРИМЕР ВЫПОЛНЕННОГО ПРОЕКТА</h2>

            <div class="project-example__slider-wrap">
                <div class="project-example__slider">
                    <?php foreach ($project_example_items as $project_example_item) : ?>
                        <div class="project-example__slide">
                            <a
                                class="project-example__slide-link"
                                href="<?php echo esc_url($project_example_item['full']); ?>"
                                data-fancybox="project-example-gallery"
                                <?php if ($project_example_item['caption'] !== '') : ?>
                                    data-caption="<?php echo esc_attr($project_example_item['caption']); ?>"
                                <?php endif; ?>
                            >
                                <img src="<?php echo esc_url($project_example_item['full']); ?>" alt="<?php echo esc_attr($project_example_item['alt']); ?>">
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="project-example__thumbs" aria-label="Навигация по слайдам проекта">
                <?php foreach ($project_example_items as $project_example_index => $project_example_item) : ?>
                    <button
                        class="project-example__thumb<?php echo $project_example_index === 0 ? ' is-active' : ''; ?>"
                        type="button"
                        data-example-slide="<?php echo esc_attr((string) $project_example_index); ?>"
                        aria-label="<?php echo esc_attr('Открыть слайд ' . ($project_example_index + 1)); ?>"
                    >
                        <img src="<?php echo esc_url($project_example_item['thumb']); ?>" alt="<?php echo esc_attr($project_example_item['alt']); ?>">
                    </button>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <?php require get_template_directory() . '/parts/feedback/default.php'; ?>
</main>
<?php get_footer(); ?>
