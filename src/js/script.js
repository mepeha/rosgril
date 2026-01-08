(function () {

    AOS.init({
        duration: 900,
        easing: "ease-out",
        once: true,
        offset: 120,
    });


    const $nav = $('.tarif__nav-item');
    const $body = $('.tarif__body');


    $nav.first().addClass('active');
    $body.first().addClass('active');

    $nav.on('click', function () {
        const tab = $(this).data('tab');

        $nav.removeClass('active');
        $(this).addClass('active');

        $body.removeClass('active');
        $body.filter(`[data-body="${tab}"]`).addClass('active');
    });

    $('.bitrix').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
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
                    slidesToShow: 1
                }
            }
        ]
    });




    $('.ask').on('click', function () {
        $(this).toggleClass('active');
        $(this).find('.ask__body').stop().slideToggle(200);
    });

    $('.popup-open, .popup__close, .popup').on('click', function () {
        $('body').toggleClass('popup--active');
    });
    $('.burger, .mob-menu').on('click', function () {
        $('body').toggleClass('menu--active');
    });
    $('.popup__area').on('click', function (e) {
        e.stopPropagation();
    });
    $('.mob-menu__area').on('click', function (e) {
        e.stopPropagation();
    });

    $('.cases__more').on('click', function () {
        const btn = $(this);
        let page = parseInt(btn.data('page'));
        const max = parseInt(btn.data('max'));

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'load_more_cases',
                page: page
            },
            beforeSend() {
                btn.addClass('loading');
            },
            success(html) {
                if (html.trim()) {
                    $('.cases__area').append(html);
                    page++;
                    btn.data('page', page);

                    if (page >= max) {
                        btn.fadeOut();
                    }
                } else {
                    btn.fadeOut();
                }
            },
            complete() {
                btn.removeClass('loading');
            }
        });
    });

    document.addEventListener('wpcf7mailsent', function (event) {
        const form = event.target;
        form.classList.add('sended');
    });
})();

$(function () {
    Fancybox.bind('[data-fancybox]', {
        dragToClose: false,
        placeFocusBack: false,
    });
});