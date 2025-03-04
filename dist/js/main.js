$(document).ready(function () {








    $(".main-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
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


    $('.detail-header__big').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.detail-header__mini'
    });
    $('.detail-header__mini').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.detail-header__big',
        dots: false,
        centerMode: false,
        focusOnSelect: true,
        vertical: true,
        verticalSwiping: true
    });







});