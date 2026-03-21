<?php
get_header();
$theme_uri = esc_url(get_template_directory_uri());
?>

<main>

  <div class="page-head">
    <div class="container">
      <div class="page-head__area">
        <div class="breadcrumbs">
          главная - каталог проектов - проект D-1
        </div>
        <h1 class="page-head__title ">
          Проект одноэтажного жилого дома
          со встроенным гаражом на две машины
        </h1>
      </div>
    </div>
  </div>

  <div class="card-head margin">
    <div class="container">
      <div class="card-head__area">
        <div class="card-slider">
          <div class="card-slider__main">
            <a href="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" data-fancybox="slider" class="card-slider__main-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </a>
            <a href="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" data-fancybox="slider" class="card-slider__main-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </a>
            <a href="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" data-fancybox="slider" class="card-slider__main-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </a>
            <a href="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" data-fancybox="slider" class="card-slider__main-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </a>
          </div>
          <div class="card-slider__mini">
            <div class="card-slider__mini-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </div>
            <div class="card-slider__mini-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </div>
            <div class="card-slider__mini-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </div>
            <div class="card-slider__mini-item">
              <img src="<?php echo $theme_uri; ?>/dist/img/card-head-1.webp" alt="">
            </div>
          </div>
        </div>
        <div class="card-info">
          <h2 class="card-info__subtitle gray">
            D-1
          </h2>
          <div class="card-info__title name">
            Проект одноэтажного жилого дома
            со встроенным гаражом на две машины
          </div>
          <div class="param">
            <div class="param__head gray">
              Общая площадь
            </div>
            <div class="param__body">
              270 м2
            </div>
          </div>
          <div class="param">
            <div class="param__head gray">
              Террасы, балконы
            </div>
            <div class="param__body">
              36 м2
            </div>
          </div>
          <div class="param">
            <div class="param__head gray">
              Крыша
            </div>
            <div class="param__body">
              чердачная
            </div>
          </div>
          <div class="material">
            <div class="material__title gray">
              Применяемые отделочные материалы
            </div>
            <div class="material__body">
              минеральная фасадная штукатурка, планкен, керамогранит, мягкая черепица
            </div>
          </div>
          <div class="general">
            <div class="price">
              <div class="price__area">
                <div class="price__title">
                  Стоимость проекта
                </div>
                <div class="price__subtitle mini gray">
                  (архитектурный раздел)
                </div>
                <div class="price__cost orange">
                  22 000 ₽
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
              <div class="param">
                <div class="param__head gray">
                  Общая площадь
                </div>
                <div class="param__body">
                  270 м2
                </div>
              </div>
              <div class="param">
                <div class="param__head gray">
                  Террасы, балконы
                </div>
                <div class="param__body">
                  36 м2
                </div>
              </div>
              <div class="param">
                <div class="param__head gray">
                  Крыша
                </div>
                <div class="param__body">
                  чердачная
                </div>
              </div>
              <div class="param">
                <div class="param__head gray">
                  Общая площадь
                </div>
                <div class="param__body">
                  270 м2
                </div>
              </div>
              <div class="param">
                <div class="param__head gray">
                  Террасы, балконы
                </div>
                <div class="param__body">
                  36 м2
                </div>
              </div>

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
            1 ЭТАЖ
          </h3>
          <div class="plans__image">
            <img src="<?php echo $theme_uri; ?>/dist/img/plan-2.webp" alt="">
          </div>
          <button class="button button-stroke plans__edit-button" type="button">
            редактировать планировку
          </button>
        </div>
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
          Стоимость услуг
        </div>
        <div class="card-tabs__head-item" data-tab-key="extra">
          дополнительные услуги
        </div>
        <div class="card-tabs__head-item" data-tab-key="engineering">
          ИНЖЕНЕРНЫЕ СЕТИ ТИПОВЫЕ
        </div>
      </div>
      <div class="card-tabs__body">
        <div class="card-tabs__body-item text" data-tab-key="services">
          <div class="width-eight">
            <div class="param">
              <div class="param__head orange">
                Конструктивный раздел
              </div>
              <div class="param__body">
                27 000 ₽
              </div>
            </div>
            <div class="param">
              <div class="param__head orange">
                Конструктивный раздел
              </div>
              <div class="param__body">
                27 000 ₽
              </div>
            </div>
            <div class="param">
              <div class="param__head orange">
                Конструктивный раздел
              </div>
              <div class="param__body">
                27 000 ₽
              </div>
            </div>
            <div class="param">
              <div class="param__head orange">
                Конструктивный раздел
              </div>
              <div class="param__body">
                27 000 ₽
              </div>
            </div>
            <div class="subtext mini gray">
              *Планировка участка (подробная схема генерального плана) ‒ это распределение территории участка с указанием мест для мощения, расположения септика, скважины, бассейна и различных построек, с учетом установленных норм (без учета озеленения).
            </div>
          </div>


        </div>
        <div class="card-tabs__body-item" data-tab-key="extra">
          <div class="dop">
            <div class="dop__item">
              <h3 class="dop__title">
                Что входит
                в проект
              </h3>
              <p>
                Проект предоставляется на бумажном носителе формата A3 в единственном экземпляре
              </p>
              <p>
                Состав архитектурного проекта ‒ раздел Ахитектурные решения (АР). <a href="#">Читать подробнее про состав проекта</a>
              </p>
            </div>
            <div class="dop__item">
              <h3 class="dop__title">
                бесплатная доставка
              </h3>
              <p>
                Доставка проекта осуществляется бесплатно, курьерской службой CDEK
              </p>
            </div>
            <div class="dop__item">
              <h3 class="dop__title">
                внесение изменений
              </h3>
              <p>
                К типовым проектам возможно внесение изменений, ориентировочную стоимость изменений можно посчитать в
                <a href="#">списке характеристик проекта</a>
              </p>
              <p>
                Финальную стоимость изменений Вам сможет озвучить менеджер после получения Технического задания на внесение изменений, бланк Технического задания можно скачать здесь
              </p>
            </div>
          </div>
        </div>
        <div class="card-tabs__body-item" data-tab-key="engineering">
          <p>
            ИНЖЕНЕРНЫЕ СЕТИ ТИПОВЫЕ
            В состав ИС входит два раздела (СО и ВК) — отопление, водоснабжение, канализация.
            В случае внесений изменений в архитектурный проект стоимость разработки типовых инженерных сетей увеличивается.
          </p>
          <div class="width-eight">
            <div class="seti">
              <div class="seti__item">
                <p > Вариант с радиаторным отоплением и электрическим теплым полом в мокрых помещениях</p>
                <p class="seti__price orange">
                  27 000 ₽
                </p>

              </div>
              <div class="seti__item">
                <p> Вариант с отоплением водяным теплым полом
                  и дополнительными радиаторами в местах больших теплопотерь</p>
                <p class="seti__price orange">
                  +5 000 ₽ к стоимости
                </p>

              </div>
              <div class="seti__item">
                <p> Индивидуальные инженерные сети выполняются по техническому заданию Заказчика</p>
                <p class="seti__price orange">
                  300 ₽ за 1 м2
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <section class="card-calc" data-base-cost="22000">
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
