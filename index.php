<?php get_header(); ?>

<?php $theme_uri = esc_url(get_template_directory_uri()); ?>

<main>
  <section class="banner">
    <div class="container">
      <div class="banner__area">
        <h1 class="banner__title">
          готовые Проекты <br>
          домов и коттеджей
        </h1>
        <a href="" class="banner__button button button-main" data-feedback-popup-open>
          смотреть все проекты
          <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.75 12.4141L15.25 6.91406L9.75 1.41406M14 6.91406L1 6.91406" stroke="black" stroke-width="2" stroke-linecap="square"/>
          </svg>
        </a>
        <img class="banner__image" src="<?php echo $theme_uri; ?>/dist/img/banner-bg.webp" alt="Коттедж">
      </div>
    </div>
  </section>
  <section class="create">
    <div class="container">
      <div class="create__area">
        <img class="create__image" src="<?php echo $theme_uri; ?>/dist/img/tania.webp" alt="">
        <div class="create__info info">
          <h2 class="info__title">
            создаем дома
            и пространства,
            в которых приятно жить
          </h2>
          <div class="text">
            Наша команда проектирует современные
            дома, где комфорт, функциональность
            и эстетика объединяются в каждом решении
          </div>
          <a href="/project" class="info__button button button-stroke" data-feedback-popup-open>
            построенные дома по проектам
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"/>
            </svg>

          </a>
        </div>
      </div>
    </div>
  </section>


  <section class="page-menu margin">
    <div class="container">
      <div class="page-menu__area">

        <div class="page-menu__item project" style="background-image: url(<?php echo $theme_uri; ?>/dist/img/page-menu-item-bg.webp)">
          <div class="name">
            Индивидуальное
            проектирование
          </div>
          <div class="price text no-margin">
            от 700 ₽/м2
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"/>
              <path d="M45.0186 43.4248L47.4636 29.5585L33.5973 27.1135M45.61 30.8564L26.333 44.3542" stroke="black" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
        </div>
        <div class="page-menu__item">
          <div class="name">
            Как заказать проект дома
          </div>

          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"/>
              <path d="M45.0186 43.4248L47.4636 29.5585L33.5973 27.1135M45.61 30.8564L26.333 44.3542" stroke="black" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
        </div>
        <div class="page-menu__item">
          <div class="name">
            Состав проектной документации
          </div>

          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"/>
              <path d="M45.0186 43.4248L47.4636 29.5585L33.5973 27.1135M45.61 30.8564L26.333 44.3542" stroke="black" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
        </div>
        <div class="page-menu__item">
          <div class="name">
            Внесение изменений в проект
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"/>
              <path d="M45.0186 43.4248L47.4636 29.5585L33.5973 27.1135M45.61 30.8564L26.333 44.3542" stroke="black" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
        </div>
        <img src="<?php echo $theme_uri; ?>/dist/img/page-menu-bg.webp" alt="" class="page-menu__bg">
      </div>
    </div>
  </section>
  <section class="home-ready margin">
    <div class="container">
      <div class="home-ready__area">
        <img src="<?php echo $theme_uri; ?>/dist/img/home-ready.webp" alt="" class="home-ready__image">
        <div class="create__info info">
          <h2>
            Дом готов?
            Дело за интерьером
          </h2>
          <div class="text">
            Наша команда создаёт современные интерьеры, где эстетика встречается с комфортом.
            Мы превращаем пустые стены
            в атмосферные пространства с душой
          </div>
          <a href="/project" class="info__button button button-stroke" data-feedback-popup-open>
            узнать подробнее
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
            </svg>

          </a>
        </div>
      </div>
    </div>
  </section>
  <section class="project-list mini-margin">

    <div class="container">
      <h2>ПРОЕКТЫ</h2>
      <div class="main-filter three-grid mini-margin">
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/one-floor.webp" alt="" class="image">
        </a>
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/two-floor.webp" alt="" class="image">
        </a>
        <a href="" class="main-filter__item">
          <div class="name">
            Одноэтажные
          </div>
          <div class="arrow">
            <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"/>
              <path d="M45.0176 43.4243L47.4626 29.558L33.5963 27.113M45.609 30.8559L26.3321 44.3537" stroke="white" stroke-width="3.62044" stroke-linecap="square"/>
            </svg>
          </div>
          <img src="<?php echo $theme_uri; ?>/dist/img/three-floor.webp" alt="" class="image">
        </a>
      </div>
      <div class="main-catalog three-grid">
        <div class="item">
          <img src="<?php echo $theme_uri; ?>/dist/img/catalog-image-1.webp" alt="" class="item__image">
          <div class="item__info">
            <div class="item__name name">
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
            <span class="text no-margin">
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
            <div class="item__name name">
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
            <span class="text no-margin">
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
            <div class="item__name name">
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
            <span class="text no-margin">
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
            <div class="item__name name">
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
            <span class="text no-margin">
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
            <div class="item__name name">
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
            <span class="text no-margin">
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
            <div class="item__name name">
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
            <span class="text no-margin">
              от 50 000 ₽
            </span>
              <svg width="31" height="26" viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6498 22.4725L27.606 12.5163L17.6498 2.56006M25.3432 12.5163L1.81034 12.5163" stroke="#B2B2B2" stroke-width="3.62044" stroke-linecap="square"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <a href="/project" class="main-catalog__button button button-stroke" data-feedback-popup-open>
        смотреть все проекты
        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
        </svg>

      </a>
    </div>


  </section>


  <section class="end-home margin">
    <div class="container">
      <h2>построенные дома</h2>
      <div class="end-home__area">
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-1.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-1.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-2.webp" alt="">
        </a>
        <a href="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" data-fancybox="end-home">
          <img src="<?php echo $theme_uri; ?>/dist/img/end-home-3.webp" alt="">
        </a>
      </div>


    </div>
  </section>


  <section class="feedback">
    <div class="container">
      <div class="feedback__area">
        <div class="feedback__info">
          <div class="text">
            Не нашли подходящий проект?
          </div>
          <h2>
            создадим <i>идеальный дом</i> для вас
          </h2>
        </div>
        <form class="feedback__form">
          <input class="feedback__input" type="text" placeholder="Имя">
          <input class="feedback__input" type="text" placeholder="Номер">
          <a href="#" class="feedback__button button button-stroke" data-feedback-popup-open>
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
