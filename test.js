$(document).ready(function () {
    $(".front-banner").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        autoplay: false,
        // autoplaySpeed: 2000,
        dots: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });








});




$(".search__icon").on("click", function(event) {
    let header = $(".header-main");

    if (!header.hasClass("search--active")) {
        event.preventDefault(); // Блокируем переход
        header.addClass("search--active"); // Активируем поиск
        $(".search__input").focus(); // Фокус в поле ввода
    }
});

$('.input-file input[type=file]').on('change', function(){
    let file = this.files[0];
    $(this).next().html(file.name);
});
$(".search").on("submit", function(event) {
    if (!$(".header-main").hasClass("search--active")) {
        event.preventDefault();
    }
});
$(".search__input").on("click", function(event) {
    event.stopPropagation();
});
$(".header-main__nav").on("click", function(event) {
    $("body").toggleClass("menu--active");
});
$(document).on("click", function(event) {
    if (!$(event.target).closest(".header-main").length) {
        $(".header-main").removeClass("search--active"); // Закрываем поиск
    }
});
$(".mobil-menu__close").on("click", function(event) {
    $("body").toggleClass("menu--active");
});
$(".img-down").click(function (e) {
    e.preventDefault();
    let $submenu = $(this).closest("li").find("> .submenu"); // Ищем ближайшее подменю

    if ($submenu.length) {
        $submenu.slideToggle(300); // Плавно показываем/скрываем
        $(this).toggleClass("rotated"); // Переворачиваем стрелку
    }
});

$('.main-slider').on('afterChange', function(event, slick, currentSlide){
    $('.main-slider__dark').css('z-index', '-1'); // Фон всегда ниже
});
$(".form-open").on("click", function(event) {
    event.preventDefault();
    $("body").toggleClass("form--active");
});
$(".form").on("click", function() {
    $("body").removeClass("form--active");
});
$(".form__area").on("click", function(event) {
    event.stopPropagation();
});
$(".form__close").on("click", function(event) {
    event.stopPropagation();
    $("body").removeClass("form--active");
});
$(document).ready(function(){
    var $slider = $('.ready-product');
    var $current = $('.ready-product__current'); // Текущий слайд
    var $total = $('.ready-product__all'); // Общее количество слайдов

    $slider.on('init reInit afterChange', function(event, slick, currentSlide){
        var i = (currentSlide ? currentSlide : 0) + 1; // Текущий слайд (начинается с 0)
        $current.text(i); // Обновляем счетчик
        $total.text(slick.slideCount); // Обновляем общее число слайдов
    });

    $slider.slick({
        slidesToShow: 3, // Показываем 3 слайда
        slidesToScroll: 1, // Прокручиваем по 1
        centerMode: true, // Центрируем слайд
        centerPadding: '0', // Без отступов
        arrows: false, // Отключаем стандартные стрелки
        dots: false, // Отключаем точки
        infinite: true, // Бесконечная прокрутка
        focusOnSelect: true, // Позволяет кликать по соседним слайдам
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Кастомные кнопки "вперед" и "назад"
    $('.ready-product__next').click(function(){
        $slider.slick('slickNext');
    });

    $('.ready-product__prev').click(function(){
        $slider.slick('slickPrev');
    });
});
$('.other-product__list').slick({
    slidesToShow: 4, // Показывать 4 слайда
    slidesToScroll: 2,
    arrows: false, // Кнопки "вперёд" и "назад"
    dots: false, // Точки навигации
    infinite: false, // Бесконечная прокрутка
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
});
$('.detail-header__big').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: '.detail-header__mini',
    responsive: [
        {
            breakpoint: 600,
            settings: {
                dots: true,
                arrows: false,
            }
        },

    ]
});
$('.detail-header__mini').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.detail-header__big',
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    vertical: true,
    verticalSwiping: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 3
            }
        },

    ]
});
let $slider = $(".video-review__slider a");
let $current = $(".video-review__current");
let totalSlides = $slider.length;
let currentIndex = 0;
$(".video-review__all").text(totalSlides);
function showSlide(index) {
    $slider.hide().eq(index).fadeIn();
    $current.text(index + 1);
}

// Кнопка "Вперёд"
$(".video-review__next").click(function() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
});

// Кнопка "Назад"
$(".video-review__prev").click(function() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentIndex);
});