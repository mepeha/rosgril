$(function () {
    const $body = $('body');
    const $burger = $('.header__burger');
    const $mobileMenu = $('.mobile-menu');
    const $mobileOverlay = $('.mobile-menu__overlay');
    const $endHomeSlider = $('.end-home__area');

    if ($burger.length && $mobileMenu.length) {
        const openMenu = function () {
            $body.addClass('menu-open');
            $burger.attr('aria-expanded', 'true');
            $mobileMenu.attr('aria-hidden', 'false');
        };

        const closeMenu = function () {
            $body.removeClass('menu-open');
            $burger.attr('aria-expanded', 'false');
            $mobileMenu.attr('aria-hidden', 'true');
        };

        $burger.on('click', function () {
            if ($body.hasClass('menu-open')) {
                closeMenu();
                return;
            }
            openMenu();
        });

        $mobileOverlay.on('click', closeMenu);
        $mobileMenu.find('a').on('click', closeMenu);

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        $(window).on('resize', function () {
            if (window.innerWidth > 1400) {
                closeMenu();
            }
        });
    }

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
                        arrows: false
                    }
                }
            ]
        });
    }
});
