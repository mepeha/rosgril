$(function () {
    const $body = $('body');
    const $burger = $('.header__burger');
    const $mobileMenu = $('.mobile-menu');
    const $mobileOverlay = $('.mobile-menu__overlay');
    const $cardMainSlider = $('.card-slider__main');
    const $cardMiniSlider = $('.card-slider__mini');
    const $endHomeSlider = $('.end-home__area');
    const $stagesSlider = $('.stages-slider');
    const $projectExample = $('.project-example');
    const $cardTabs = $('.card-tabs');
    const $feedbackPopup = $('[data-feedback-popup]');
    const $feedbackPopupOpeners = $('[data-feedback-popup-open]');
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

    if ($cardMainSlider.length && $cardMiniSlider.length) {
        if (!$cardMainSlider.hasClass('slick-initialized')) {
            $cardMainSlider.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                asNavFor: '.card-slider__mini',
                infinite: false,
                arrows: false,
                dots: false,
                adaptiveHeight: true
            });
        }

        if (!$cardMiniSlider.hasClass('slick-initialized')) {
            $cardMiniSlider.slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: '.card-slider__main',
                focusOnSelect: true,
                centerMode: true,
                centerPadding: '0px',
                infinite: false,
                arrows: false,
                dots: false,
                swipeToSlide: true,
                draggable: true
            });
        }
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

    if ($stagesSlider.length && !$stagesSlider.hasClass('slick-initialized')) {
        $stagesSlider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
            dots: true,
            adaptiveHeight: false,
            swipeToSlide: true,
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3
                    }
                }
            ]
        });
    }

    if ($projectExample.length) {
        $projectExample.each(function () {
            const $block = $(this);
            const $slider = $block.find('.project-example__slider');
            const $thumbs = $block.find('.project-example__thumb[data-example-slide]');

            if (!$slider.length) {
                return;
            }

            const setActiveThumb = function (index) {
                $thumbs.removeClass('is-active');
                $thumbs.filter('[data-example-slide="' + index + '"]').addClass('is-active');
            };

            $slider.on('init reInit afterChange', function (event, slick, currentSlide) {
                const slideIndex = typeof currentSlide === 'number' ? currentSlide : 0;
                setActiveThumb(slideIndex);
            });

            if (!$slider.hasClass('slick-initialized')) {
                $slider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                    arrows: true,
                    dots: false,
                    adaptiveHeight: false,
                    swipe: true,
                    touchMove: true
                });
            }

            $thumbs.on('click', function () {
                const targetIndex = Number($(this).attr('data-example-slide'));

                if (!isFinite(targetIndex)) {
                    return;
                }

                $slider.slick('slickGoTo', targetIndex);
            });
        });
    }

    if ($cardTabs.length) {
        $cardTabs.each(function () {
            const $tabs = $(this);
            const $heads = $tabs.find('.card-tabs__head-item');
            const $bodies = $tabs.find('.card-tabs__body-item');

            if (!$heads.length || !$bodies.length) {
                return;
            }

            const activateTab = function (key, fallbackIndex) {
                let targetIndex = typeof fallbackIndex === 'number' ? fallbackIndex : 0;

                if (key) {
                    const keyIndex = $heads.filter('[data-tab-key="' + key + '"]').first().index();
                    if (keyIndex >= 0) {
                        targetIndex = keyIndex;
                    }
                }

                const $targetHead = $heads.eq(targetIndex);
                const targetKey = String($targetHead.data('tab-key') || '');
                let $targetBody;

                if (targetKey) {
                    $targetBody = $bodies.filter('[data-tab-key="' + targetKey + '"]').first();
                } else {
                    $targetBody = $bodies.eq(targetIndex);
                }

                $heads.removeClass('active');
                $bodies.removeClass('active');
                $targetHead.addClass('active');

                if ($targetBody.length) {
                    $targetBody.addClass('active');
                } else {
                    $bodies.eq(targetIndex).addClass('active');
                }
            };

            let initialIndex = $heads.filter('.active').first().index();
            if (initialIndex < 0) {
                initialIndex = 0;
            }

            const initialKey = String($heads.eq(initialIndex).data('tab-key') || '');
            activateTab(initialKey, initialIndex);

            $heads.on('click', function () {
                const $head = $(this);
                const key = String($head.data('tab-key') || '');
                const index = $head.index();
                activateTab(key, index);
            });
        });
    }

    if ($feedbackPopup.length && $feedbackPopupOpeners.length) {
        const $popup = $feedbackPopup.first();
        const $popupClosers = $popup.find('[data-feedback-popup-close]');
        const $popupForm = $popup.find('.feedback-popup__form');

        const openFeedbackPopup = function () {
            $popup.addClass('is-open').attr('aria-hidden', 'false');
            $body.addClass('feedback-popup-open');
        };

        const closeFeedbackPopup = function () {
            $popup.removeClass('is-open').attr('aria-hidden', 'true');
            $body.removeClass('feedback-popup-open');
        };

        $feedbackPopupOpeners.on('click', function (e) {
            e.preventDefault();
            openFeedbackPopup();
        });

        $popupClosers.on('click', function (e) {
            e.preventDefault();
            closeFeedbackPopup();
        });

        if ($popupForm.length) {
            $popupForm.on('submit', function (e) {
                e.preventDefault();
            });
        }

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $popup.hasClass('is-open')) {
                closeFeedbackPopup();
            }
        });
    }

    if (window.Fancybox && typeof Fancybox.bind === 'function') {
        Fancybox.bind('[data-fancybox]', {
            dragToClose: false,
            placeFocusBack: false
        });
    }
});
