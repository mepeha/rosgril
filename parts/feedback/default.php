<?php
if (!isset($theme_uri)) {
    $theme_uri = esc_url(get_template_directory_uri());
}
?>
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
