$(function () {
    const $endHomeSlider = $('.end-home__area');

    if ($endHomeSlider.length && !$endHomeSlider.hasClass('slick-initialized')) {
        $endHomeSlider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true,
            infinite: false,
            autoplay: false,
            arrows: true,
            dots: false,
            swipe: true,
            touchMove: true,
            draggable: true,
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
                        slidesToShow: 1,
                        arrows: false,
                    }
                }
            ]
        });
    }
});
