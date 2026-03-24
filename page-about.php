
<?php
get_header();
$theme_uri = get_template_directory_uri();
?>
<main>



    <section class="create arch-buro">
        <div class="container">
            <div class="create__area">
                <img class="create__image" src="<?php echo $theme_uri; ?>/dist/img/tania-buro.webp" alt="">
                <div class="create__info info content">
                    <h2 class="info__title">
                        Дома, в которых хочется жить
                    </h2>
                    <div class="text">
                        Наша команда проектирует современные, продуманные до мелочей решения, где комфорт, функциональность и эстетика работают вместе.
                        <br>
                        Каждый проект ‒ не просто продукт. Мы разрабатываем его так, как делали бы для себя, ставя удобство и практичность на первое место.
                    </div>
                    <h3>
                        наши услуги
                    </h3>
                    <ul>
                        <li>реализуем и вносим изменения в готовые проекты домов;</li>
                        <li>разрабатываем индивидуальные проекты частных жилых домов;</li>
                        <li>разрабатываем концептуальные решения интерьеров;</li>
                        <li>производим полную комплектацию отделочных материалов, мебели и аксессуаров;</li>
                        <li>разрабатываем техническую документацию для реализации объекта;</li>
                        <li>ведем авторское сопровождение в реализации объекта</li>
                    </ul>
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
    <?php require get_template_directory() . '/parts/feedback/take.php'; ?>
</main>


<?php get_footer(); ?>