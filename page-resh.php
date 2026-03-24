<?php
get_header();
$theme_uri = get_template_directory_uri();
?>

<main>

    <section class="create arch-buro">
        <div class="container">
            <div class="create__area">
                <img class="create__image" src="<?php echo $theme_uri; ?>/dist/img/interdesign.webp" alt="">
                <div class="create__info info content">
                    <h2 class="info__title">
                        дизайн интерьеров
                    </h2>
                    <h3>
                        Наша команда объединила в себе
                        сразу две специальности — архитектура и дизайн
                    </h3>
                    <p>
                        Для нас это не разные направления, а единая творческая миссия — создавать продуманные, гармоничные и вдохновляющие пространства, в которых приятно жить, отдыхать и творить с удовольствием.
                        Приоритетными задачами при проектировании современного пространства считаем — комфорт, функциональность и эстетика.

                    </p>
                    <a href="/project" class="info__button button button-stroke" data-feedback-popup-open>
                        получить бесплатную консультацию
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"/>
                        </svg>

                    </a>
                </div>
            </div>
        </div>
    </section>
    <section class="our-services margin">
        <div class="container">
            <div class="our-services__area">
                <div class="our-services__info">
                    <h2>
                        Наши услуги
                    </h2>
                    <ul>
                        <li>
                            <span class="orange">разрабатываем концептуальные решения интерьеров:</span> от планировочных решений, 3D-визуализации, до подробной и исчерпывающей рабочей документации, учитывая индивидуальные пожелания заказчика
                        </li>
                        <li>
                            <span class="orange">комплектация интерьера:</span> подбор и закупка материалов, мебели, оборудования и декора для полного соответствия дизайн-проекту
                        </li>
                        <li>
                            <span class="orange">авторский надзор:</span> контроль за выполнением строительных и отделочных работ в соответствии с проектной документацией
                        </li>
                    </ul>
                    <a href="/project" class="info__button button button-stroke">
                        подробнее
                        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"/>
                        </svg>

                    </a>
                </div>
                <img class="our-services__img" src="<?php echo $theme_uri; ?>/dist/img/our-services.webp" alt="">
            </div>
        </div>
    </section>
    <div class="preim margin">
        <div class="container">
            <div class="preim__area">
                <div class="preim__item mini-content">
                    <h3>
                        Планировочные решения
                    </h3>
                    <p>
                        Планировка – это основа дизайн-проекта. Вы увидите расположение мебели, оборудования, возводимых перегородок со всеми необходимыми размерами.
                        <br>Так же экспликацию помещений с точными площадями и сносками габаритами используемой мебели
                    </p>
                    <p class="orange">от 350 ₽/ м2</p>
                </div>
                <div class="preim__item mini-content">
                    <h3>
                        Эскизный проект
                    </h3>
                    <p>
                        На этом этапе Вы сможете рассмотреть планировочную концепцию своего будущего интерьера на выбор:
                    </p>
                    <ul class="no-margin">
                        <li>
                            <strong>формат визуализации</strong>, где будет представлено фотореалистичное объемное изображение каждого помещения в нескольких ракурсах, что позволит погрузиться в интерьер с головой
                        </li>
                        <li>
                            <strong>формат коллажа</strong>  – который представляет собой композицию из нескольких предметов и изображений, с привязкой к планировке. В коллаже Вы увидите как будут сочетаться между собой предметы мебели и декора и почувствуйте настроение будущего пространства
                        </li>
                    </ul>
                    <p class="orange">от 1500 ₽/ м2</p>
                </div>
                <div class="preim__item mini-content">
                    <h3>
                        Полный проект интерьера
                    </h3>
                    <p>
                        Это целый ряд грамотно оформленных чертежей с необходимой для строителей и подрядчиков технической информацией, которые помогут приступить к реализации и избежать ошибок во время ремонта.
                        А так же подробная спецификация по всем позициям проекта с учетом Вашего бюджета, запаса материалов и технических нюансов
                    </p>

                    <p class="orange">от 3 000 ₽/ м2</p>
                </div>
            </div>
        </div>
    </div>

</main>
<?php get_footer(); ?>
