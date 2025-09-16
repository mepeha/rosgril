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




