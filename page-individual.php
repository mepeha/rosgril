<?php
get_header();
$theme_uri = get_template_directory_uri();
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
                        Стоимость проектирования от 550 ₽/ м2
                    </h3>
                    <a href="" class="banner__button button button-main">
                        смотреть все проекты
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 12.4141L15.25 6.91406L9.75 1.41406M14 6.91406L1 6.91406" stroke="black" stroke-width="2" stroke-linecap="square"/>
                        </svg>
                    </a>
                </div>
                <img class="individual-banner__image" src="<?php echo esc_url($theme_uri . "/dist/img/individual-banner-img.webp"); ?>" alt="">
            </div>
        </div>
    </section>
    <section class="create">
        <div class="container">
            <div class="create__area">
                <img class="create__image" src="<?php echo esc_url($theme_uri . "/dist/img/individual-2.webp"); ?>" alt="">
                <div class="create__info info">
                    <div class="text">
                        Мы разрабатываем проекты частных жилых домов, которые отвечают всем потребностям заказчика и отражают его индивидуальность. Разработанная нами документация, позволяет построить надежный дом, в котором будет приятно жить Вам и Вашим близким!
                    </div>
                    <a href="/project" class="info__button button button-stroke">
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

    <section class="project-list margin">

        <div class="container">
            <h2>выполненные проекты</h2>
            <div class="main-catalog three-grid">
                <div class="item">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" alt="" class="item__image">
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
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" alt="" class="item__image">
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
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" alt="" class="item__image">
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
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/card-head-1.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 1">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/card-head-1.webp"); ?>" alt="Пример проекта 1">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 2">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" alt="Пример проекта 2">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/individual-2.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 3">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/individual-2.webp"); ?>" alt="Пример проекта 3">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/plan-1.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 4">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/plan-1.webp"); ?>" alt="Пример проекта 4">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/plan-2.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 5">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/plan-2.webp"); ?>" alt="Пример проекта 5">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/end-home-1.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 6">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-1.webp"); ?>" alt="Пример проекта 6">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/end-home-2.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 7">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-2.webp"); ?>" alt="Пример проекта 7">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/end-home-3.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 8">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-3.webp"); ?>" alt="Пример проекта 8">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/two-floor.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 9">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/two-floor.webp"); ?>" alt="Пример проекта 9">
                        </a>
                    </div>
                    <div class="project-example__slide">
                        <a class="project-example__slide-link" href="<?php echo esc_url($theme_uri . "/dist/img/three-floor.webp"); ?>" data-fancybox="project-example-gallery" data-caption="Пример проекта 10">
                            <img src="<?php echo esc_url($theme_uri . "/dist/img/three-floor.webp"); ?>" alt="Пример проекта 10">
                        </a>
                    </div>
                </div>
            </div>

            <div class="project-example__thumbs" aria-label="Навигация по слайдам проекта">
                <button class="project-example__thumb is-active" type="button" data-example-slide="0" aria-label="Открыть слайд 1">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/card-head-1.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="1" aria-label="Открыть слайд 2">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/catalog-image-1.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="2" aria-label="Открыть слайд 3">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/individual-2.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="3" aria-label="Открыть слайд 4">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/plan-1.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="4" aria-label="Открыть слайд 5">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/plan-2.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="5" aria-label="Открыть слайд 6">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-1.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="6" aria-label="Открыть слайд 7">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-2.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="7" aria-label="Открыть слайд 8">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/end-home-3.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="8" aria-label="Открыть слайд 9">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/two-floor.webp"); ?>" alt="">
                </button>
                <button class="project-example__thumb" type="button" data-example-slide="9" aria-label="Открыть слайд 10">
                    <img src="<?php echo esc_url($theme_uri . "/dist/img/three-floor.webp"); ?>" alt="">
                </button>
            </div>
        </div>
    </section>

    <?php require get_template_directory() . '/parts/feedback/default.php'; ?>
</main>
<?php get_footer(); ?>
