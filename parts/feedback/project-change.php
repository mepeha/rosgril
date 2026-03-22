<?php
if (!isset($theme_uri)) {
    $theme_uri = esc_url(get_template_directory_uri());
}
?>
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
