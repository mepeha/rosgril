<div class="feedback-popup" data-feedback-popup aria-hidden="true">
  <button class="feedback-popup__overlay" type="button" data-feedback-popup-close aria-label="Закрыть попап"></button>
  <div class="feedback-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-popup-title">
    <button class="feedback-popup__close" type="button" data-feedback-popup-close aria-label="Закрыть">
      <span></span>
      <span></span>
    </button>
    <h2 class="feedback-popup__title" id="feedback-popup-title">
      ОСТАВЬТЕ ЗАЯВКУ
    </h2>
    <div class="text">
      И МЫ СВЯЖЕМСЯ С ВАМИ В БЛИЖАЙШЕЕ ВРЕМЯ
    </div>
    <form class="feedback__form feedback-popup__form">
      <input class="feedback__input" name="name" type="text" placeholder="Имя" autocomplete="name">
      <input class="feedback__input" name="phone" type="tel" placeholder="Номер" autocomplete="tel" inputmode="tel" data-phone-input required>
      <textarea class="feedback__input" name="message" cols="30" rows="5" placeholder="Сообщение"></textarea>
      <button class="feedback__button button button-stroke" type="submit">
        Оставить заявку
        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 12.4142L15.25 6.91422L9.75 1.41421M14 6.91422L1 6.91421" stroke="white" stroke-width="2" stroke-linecap="square"></path>
        </svg>
      </button>
    </form>
  </div>
</div>
