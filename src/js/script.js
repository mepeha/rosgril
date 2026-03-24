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
    const $feedbackForms = $('.feedback__form');
    const $captchaPopup = $('[data-captcha-popup]');
    const $captchaPopupText = $captchaPopup.find('[data-captcha-popup-text]');
    const $captchaPopupWidget = $captchaPopup.find('[data-captcha-popup-widget]');
    const $captchaPopupError = $captchaPopup.find('[data-captcha-popup-error]');
    const $captchaPopupClosers = $captchaPopup.find('[data-captcha-popup-close]');
    const getLeadContext = function () {
        if (window.tanyathemeLeadContext && typeof window.tanyathemeLeadContext === 'object') {
            return window.tanyathemeLeadContext;
        }

        return null;
    };
    const leadConfig = window.tanyathemeLead && typeof window.tanyathemeLead === 'object'
        ? window.tanyathemeLead
        : {};
    const captchaState = {
        widgetId: null,
        pendingResolve: null,
        pendingReject: null,
        cancelled: false
    };
    let feedbackPopupSource = 'cta';
    let isLeadSubmitLocked = false;

    const initFastZoomReveal = function () {
        const $revealItems = $('.js-fast-zoom-reveal');
        const revealStepDelay = 320;

        if (!$revealItems.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            $revealItems.each(function () {
                const orderValue = Number($(this).attr('data-reveal-order'));
                const order = isFinite(orderValue) ? Math.max(0, orderValue) : 0;

                window.setTimeout(function () {
                    $(this).addClass('is-visible');
                }.bind(this), order * revealStepDelay);
            });
            return;
        }

        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const orderValue = Number($(entry.target).attr('data-reveal-order'));
                const order = isFinite(orderValue) ? Math.max(0, orderValue) : 0;

                window.setTimeout(function () {
                    entry.target.classList.add('is-visible');
                }, order * revealStepDelay);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -8% 0px'
        });

        $revealItems.each(function () {
            revealObserver.observe(this);
        });
    };

    initFastZoomReveal();

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
                        dots: true
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

    const normalizeText = function (value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    };

    const normalizePhone = function (value) {
        let digits = String(value || '').replace(/\D+/g, '');

        if (digits.length === 11 && digits.charAt(0) === '8') {
            digits = '7' + digits.slice(1);
        }

        return digits;
    };

    const isValidPhone = function (value) {
        const normalized = normalizePhone(value);
        return normalized.length === 11 && normalized.charAt(0) === '7';
    };

    const formatCurrency = function (value) {
        const numeric = Number(value);
        const safe = isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
        return safe.toLocaleString('ru-RU') + ' ₽';
    };

    const sanitizeFileToken = function (value, fallback) {
        const token = normalizeText(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!token) {
            return fallback;
        }

        return token.slice(0, 64);
    };

    const PLAN_ATTACHMENT_MAX_LONG_SIDE = 1600;
    const PLAN_ATTACHMENT_TARGET_BYTES = 280 * 1024;
    const PLAN_ATTACHMENT_MAX_BYTES = 300 * 1024;
    const PLAN_ATTACHMENT_MIN_QUALITY = 0.42;
    const PLAN_ATTACHMENT_MAX_QUALITY = 0.9;
    const PLAN_ATTACHMENT_QUALITY_STEP = 0.08;

    const initPhoneMasks = function () {
        const hasInputMask = typeof window.Inputmask === 'function';

        if (!hasInputMask) {
            return;
        }

        $('[data-phone-input]').each(function () {
            const input = this;

            if ($(input).data('phoneMaskReady')) {
                return;
            }

            if (hasInputMask) {
                window.Inputmask({
                    mask: '+7 (999) 999 99 99',
                    showMaskOnHover: false,
                    clearIncomplete: true,
                    jitMasking: true
                }).mask(input);

                $(input).data('phoneMaskReady', 'inputmask');
            }
        });
    };

    const buildFormMeta = function ($form) {
        const sourceFromForm = normalizeText($form.attr('data-form-source'));

        if (sourceFromForm) {
            return {
                source: sourceFromForm,
                page: String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(window.location && window.location.href ? window.location.href : '')
            };
        }

        if ($form.closest('.feedback-popup').length) {
            return {
                source: feedbackPopupSource || 'popup',
                page: String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(window.location && window.location.href ? window.location.href : '')
            };
        }

        if ($form.closest('.feedback.dark').length) {
            return {
                source: 'feedback-dark',
                page: String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(window.location && window.location.href ? window.location.href : '')
            };
        }

        return {
            source: 'feedback',
            page: String(window.location && window.location.pathname ? window.location.pathname : '/'),
            url: String(window.location && window.location.href ? window.location.href : '')
        };
    };

    const setFormStatus = function ($form, message, type) {
        let $status = $form.find('.feedback__status');

        if (!$status.length) {
            $status = $('<div class="feedback__status" role="status" aria-live="polite"></div>');
            $form.append($status);
        }

        $status
            .text(message)
            .removeClass('is-error is-success')
            .addClass(type === 'error' ? 'is-error' : 'is-success');
    };

    const clearFormStatus = function ($form) {
        $form.find('.feedback__status').remove();
    };

    const ensureFormProgress = function ($form) {
        let $progress = $form.find('.feedback__progress');

        if ($progress.length) {
            return $progress;
        }

        $progress = $(
            '<div class="feedback__progress" aria-hidden="true">' +
                '<div class="feedback__progress-track"><span class="feedback__progress-bar"></span></div>' +
                '<div class="feedback__progress-text"></div>' +
            '</div>'
        );

        $form.append($progress);
        return $progress;
    };

    const setFormProgressPreparing = function ($form, message, percent) {
        const $progress = ensureFormProgress($form);
        const $text = $progress.find('.feedback__progress-text');
        const $bar = $progress.find('.feedback__progress-bar');
        const progressMessage = normalizeText(message) || 'Подготовка файлов...';
        const hasPercent = isFinite(Number(percent));
        const safePercent = hasPercent ? Math.min(99, Math.max(0, Math.round(Number(percent)))) : 35;

        $progress.addClass('is-visible').attr('aria-hidden', 'false');

        if (hasPercent) {
            $progress.removeClass('is-indeterminate');
        } else {
            $progress.addClass('is-indeterminate');
        }

        $bar.css('width', String(safePercent) + '%');
        $text.text(progressMessage);
    };

    const setFormProgressUpload = function ($form, percent) {
        const $progress = ensureFormProgress($form);
        const $text = $progress.find('.feedback__progress-text');
        const $bar = $progress.find('.feedback__progress-bar');
        const safePercent = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)));

        $progress
            .addClass('is-visible')
            .removeClass('is-indeterminate')
            .attr('aria-hidden', 'false');
        $bar.css('width', String(safePercent) + '%');
        $text.text('Загрузка ' + safePercent + '%');
    };

    const resetFormProgress = function ($form) {
        const $progress = $form.find('.feedback__progress');

        if (!$progress.length) {
            return;
        }

        $progress
            .removeClass('is-visible is-indeterminate')
            .attr('aria-hidden', 'true');
        $progress.find('.feedback__progress-bar').css('width', '0%');
        $progress.find('.feedback__progress-text').text('');
    };

    const isCaptchaConfigured = function () {
        const siteKey = normalizeText(leadConfig.recaptchaSiteKey);
        return !!leadConfig.recaptchaEnabled && siteKey !== '';
    };

    const clearCaptchaError = function () {
        if (!$captchaPopupError.length) {
            return;
        }

        $captchaPopupError.text('').removeClass('is-visible');
    };

    const setCaptchaError = function (message) {
        if (!$captchaPopupError.length) {
            return;
        }

        const text = normalizeText(message);
        if (text === '') {
            $captchaPopupError.text('').removeClass('is-visible');
            return;
        }

        $captchaPopupError.text(text).addClass('is-visible');
    };

    const setCaptchaPopupText = function (message) {
        if (!$captchaPopupText.length) {
            return;
        }

        const text = normalizeText(message);
        if (text !== '') {
            $captchaPopupText.text(text);
        }
    };

    const openCaptchaPopup = function (message) {
        if (!$captchaPopup.length) {
            return;
        }

        captchaState.cancelled = false;
        clearCaptchaError();
        setCaptchaPopupText(message || 'Ожидание проверки captcha...');
        $captchaPopup.addClass('is-open').attr('aria-hidden', 'false');
        $body.addClass('captcha-popup-open');
    };

    const closeCaptchaPopup = function () {
        if (!$captchaPopup.length) {
            return;
        }

        $captchaPopup.removeClass('is-open').attr('aria-hidden', 'true');
        $body.removeClass('captcha-popup-open');
    };

    const clearPendingCaptchaPromise = function () {
        captchaState.pendingResolve = null;
        captchaState.pendingReject = null;
    };

    const rejectPendingCaptcha = function (message) {
        if (typeof captchaState.pendingReject !== 'function') {
            clearPendingCaptchaPromise();
            return;
        }

        const reject = captchaState.pendingReject;
        clearPendingCaptchaPromise();
        reject(new Error(normalizeText(message) || 'Проверка captcha не завершена.'));
    };

    const resolvePendingCaptcha = function (token) {
        if (typeof captchaState.pendingResolve !== 'function') {
            clearPendingCaptchaPromise();
            return;
        }

        const resolve = captchaState.pendingResolve;
        clearPendingCaptchaPromise();
        resolve(String(token || ''));
    };

    const resetCaptchaWidget = function () {
        if (!window.grecaptcha || typeof window.grecaptcha.reset !== 'function') {
            return;
        }

        if (captchaState.widgetId === null) {
            return;
        }

        try {
            window.grecaptcha.reset(captchaState.widgetId);
        } catch (error) {
            console.warn('[LeadForm] Failed to reset reCAPTCHA widget', error);
        }
    };

    const waitForRecaptchaApi = function (timeoutMs) {
        return new Promise(function (resolve, reject) {
            const maxWait = Math.max(1000, Number(timeoutMs) || 14000);
            const startedAt = Date.now();
            const hasApi = function () {
                return !!(window.grecaptcha && typeof window.grecaptcha.render === 'function');
            };

            if (hasApi()) {
                resolve(window.grecaptcha);
                return;
            }

            const timer = window.setInterval(function () {
                if (hasApi()) {
                    window.clearInterval(timer);
                    resolve(window.grecaptcha);
                    return;
                }

                if (Date.now() - startedAt >= maxWait) {
                    window.clearInterval(timer);
                    reject(new Error('Не удалось загрузить Google reCAPTCHA. Попробуйте еще раз.'));
                }
            }, 120);
        });
    };

    const ensureCaptchaWidget = async function () {
        if (!$captchaPopup.length || !$captchaPopupWidget.length) {
            throw new Error('Не найден pop-up для проверки captcha.');
        }

        if (!isCaptchaConfigured()) {
            throw new Error('Капча не настроена. Проверьте ключи в админке.');
        }

        const siteKey = normalizeText(leadConfig.recaptchaSiteKey);
        const grecaptcha = await waitForRecaptchaApi(15000);

        if (captchaState.widgetId !== null) {
            resetCaptchaWidget();
            return;
        }

        captchaState.widgetId = grecaptcha.render($captchaPopupWidget.get(0), {
            sitekey: siteKey,
            callback: function (token) {
                closeCaptchaPopup();
                setCaptchaPopupText('Ожидание проверки captcha...');
                resolvePendingCaptcha(token);
            },
            'expired-callback': function () {
                setCaptchaError('Срок действия капчи истек. Повторите проверку.');
                closeCaptchaPopup();
                rejectPendingCaptcha('Срок действия капчи истек. Повторите проверку.');
                resetCaptchaWidget();
            },
            'error-callback': function () {
                setCaptchaError('Ошибка проверки captcha. Повторите попытку.');
                closeCaptchaPopup();
                rejectPendingCaptcha('Ошибка проверки captcha. Повторите попытку.');
                resetCaptchaWidget();
            }
        });
    };

    const requestCaptchaToken = async function () {
        if (!isCaptchaConfigured()) {
            throw new Error('Капча не настроена. Проверьте ключи в админке.');
        }

        openCaptchaPopup('Ожидание проверки captcha...');
        await ensureCaptchaWidget();

        if (captchaState.cancelled || !$captchaPopup.hasClass('is-open')) {
            throw new Error('Проверка captcha отменена.');
        }

        setCaptchaPopupText('Подтвердите, что вы не робот.');

        return new Promise(function (resolve, reject) {
            captchaState.pendingResolve = resolve;
            captchaState.pendingReject = reject;
        });
    };

    const cancelCaptchaRequest = function (reason) {
        const message = normalizeText(reason) || 'Проверка captcha отменена.';
        captchaState.cancelled = true;
        closeCaptchaPopup();
        setCaptchaError(message);
        rejectPendingCaptcha(message);
        setCaptchaPopupText('Ожидание проверки captcha...');
        resetCaptchaWidget();
    };

    const getLeadQueueProjects = function () {
        const leadContext = getLeadContext();

        if (!leadContext || typeof leadContext.getUnsentProjects !== 'function') {
            return [];
        }

        const projects = leadContext.getUnsentProjects();
        return Array.isArray(projects) ? projects : [];
    };

    const parseCurrencyText = function (value) {
        const digits = String(value || '').match(/\d+/g);

        if (!digits || !digits.length) {
            return NaN;
        }

        return Number(digits.join(''));
    };

    const parsePriceNumber = function (value) {
        const parsed = Number(value);

        if (!isFinite(parsed)) {
            return 0;
        }

        return parsed;
    };

    const getRuntimeProjectMeta = function () {
        const leadContext = getLeadContext();

        if (leadContext && typeof leadContext.getCurrentProjectMeta === 'function') {
            const meta = leadContext.getCurrentProjectMeta();

            return {
                key: normalizeText(meta && meta.key) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
                path: normalizeText(meta && meta.path) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(meta && meta.url ? meta.url : (window.location && window.location.href ? window.location.href : '')),
                title: normalizeText(meta && meta.title),
                id: normalizeText(meta && meta.id)
            };
        }

        return {
            key: String(window.location && window.location.pathname ? window.location.pathname : '/'),
            path: String(window.location && window.location.pathname ? window.location.pathname : '/'),
            url: String(window.location && window.location.href ? window.location.href : ''),
            title: normalizeText($('.page-head__title').first().text()) || normalizeText(document.title),
            id: normalizeText($('.card-info__subtitle').first().text())
        };
    };

    const mergeRuntimeProjectPayload = function (projects, runtimeProject) {
        const list = Array.isArray(projects) ? projects.slice() : [];

        if (!runtimeProject || typeof runtimeProject !== 'object') {
            return list;
        }

        const runtimeKey = normalizeText(runtimeProject.projectKey);

        if (!runtimeKey) {
            return list;
        }

        const existingIndex = list.findIndex(function (project) {
            return normalizeText(project && project.projectKey) === runtimeKey;
        });
        const existing = existingIndex >= 0 && list[existingIndex] && typeof list[existingIndex] === 'object'
            ? list[existingIndex]
            : {};
        const merged = Object.assign({}, existing, runtimeProject, {
            projectKey: runtimeKey,
            updatedAt: Date.now()
        });
        const existingMeta = existing.projectMeta && typeof existing.projectMeta === 'object'
            ? existing.projectMeta
            : {};
        const runtimeMeta = runtimeProject.projectMeta && typeof runtimeProject.projectMeta === 'object'
            ? runtimeProject.projectMeta
            : {};

        merged.projectMeta = Object.assign({}, existingMeta, runtimeMeta);

        if (existingIndex >= 0) {
            list[existingIndex] = merged;
        } else {
            list.push(merged);
        }

        return list;
    };

    const buildRuntimeProjectFallback = function () {
        if (!window.planEditorApi || typeof window.planEditorApi.getAllPlansPayload !== 'function') {
            return null;
        }

        let plansPayload = null;

        try {
            plansPayload = window.planEditorApi.getAllPlansPayload();
        } catch (error) {
            console.warn('[LeadForm] Failed to collect runtime plan payload', error);
            return null;
        }

        if (!plansPayload || !Array.isArray(plansPayload.plans)) {
            return null;
        }

        const hasChanges = plansPayload.plans.some(function (plan) {
            if (!plan || typeof plan !== 'object') {
                return false;
            }

            const hasObjects = Array.isArray(plan.fabricObjectsJson) && plan.fabricObjectsJson.length > 0;
            const hasComment = normalizeText(plan.comment) !== '';
            return hasObjects || !!plan.hasEdits || hasComment;
        });

        if (!hasChanges) {
            return null;
        }

        const meta = getRuntimeProjectMeta();

        return {
            projectKey: normalizeText(meta && meta.key) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
            projectMeta: {
                path: normalizeText(meta && meta.path) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(meta && meta.url ? meta.url : (window.location && window.location.href ? window.location.href : '')),
                title: normalizeText(meta && meta.title),
                id: normalizeText(meta && meta.id)
            },
            planEditor: Object.assign({}, plansPayload, {
                updatedAt: Date.now()
            }),
            updatedAt: Date.now()
        };
    };

    const buildRuntimeCalculatorProjectFallback = function () {
        const $calc = $('.card-calc').first();

        if (!$calc.length) {
            return null;
        }

        const $groups = $calc.find('[data-calc-group]');

        if (!$groups.length) {
            return null;
        }

        const selections = {};
        const selectedOptions = [];

        $groups.each(function (groupIndex) {
            const $group = $(this);
            const groupKey = String($group.attr('data-calc-group') || (groupIndex + 1));
            const $groupTitle = $group.find('.card-calc__group-title').first().clone();

            $groupTitle.find('.card-calc__group-number').remove();

            const groupTitle = normalizeText($groupTitle.text());
            const selectedIndices = [];
            const selectedTitles = [];

            $group.find('input[data-price]').each(function (optionIndex) {
                if (!$(this).is(':checked')) {
                    return;
                }

                const $option = $(this).closest('.card-calc__option');
                const optionTitle = normalizeText($option.find('.card-calc__option-text').text());
                const optionPrice = parsePriceNumber($(this).attr('data-price'));

                selectedIndices.push(optionIndex);
                selectedTitles.push(optionTitle);
                selectedOptions.push({
                    groupKey: groupKey,
                    groupTitle: groupTitle,
                    optionIndex: optionIndex,
                    optionTitle: optionTitle,
                    price: optionPrice,
                    priceFormatted: formatCurrency(optionPrice)
                });
            });

            selections[groupKey] = {
                groupKey: groupKey,
                groupTitle: groupTitle,
                selectedIndices: selectedIndices,
                selectedTitles: selectedTitles
            };
        });

        const changesFromOutput = parseCurrencyText($calc.find('[data-calc-out="changes"]').first().text());
        const baseFromOutput = parseCurrencyText($calc.find('[data-calc-out="base"]').first().text());
        const totalFromOutput = parseCurrencyText($calc.find('[data-calc-out="total"]').first().text());
        const baseFromData = parseCurrencyText($calc.attr('data-base-cost'));
        const changesFallback = selectedOptions.reduce(function (sum, option) {
            return sum + parsePriceNumber(option && option.price);
        }, 0);
        const base = isFinite(baseFromOutput) ? baseFromOutput : (isFinite(baseFromData) ? baseFromData : 0);
        const changes = isFinite(changesFromOutput) ? changesFromOutput : changesFallback;
        const total = isFinite(totalFromOutput) ? totalFromOutput : (base + changes);
        const meta = getRuntimeProjectMeta();

        return {
            projectKey: normalizeText(meta && meta.key) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
            projectMeta: {
                path: normalizeText(meta && meta.path) || String(window.location && window.location.pathname ? window.location.pathname : '/'),
                url: String(meta && meta.url ? meta.url : (window.location && window.location.href ? window.location.href : '')),
                title: normalizeText(meta && meta.title),
                id: normalizeText(meta && meta.id)
            },
            calculator: {
                selections: selections,
                selectedOptions: selectedOptions,
                totals: {
                    base: base,
                    changes: changes,
                    total: total,
                    baseFormatted: formatCurrency(base),
                    changesFormatted: formatCurrency(changes),
                    totalFormatted: formatCurrency(total)
                },
                updatedAt: Date.now()
            },
            updatedAt: Date.now()
        };
    };

    const loadImage = function (src) {
        return new Promise(function (resolve, reject) {
            const image = new Image();
            let safeUrl = src;

            try {
                safeUrl = String(new URL(src, window.location && window.location.href ? window.location.href : '').href);
                const imageOrigin = new URL(safeUrl).origin;
                const pageOrigin = window.location && window.location.origin ? window.location.origin : '';

                if (imageOrigin && pageOrigin && imageOrigin !== pageOrigin) {
                    image.crossOrigin = 'anonymous';
                }
            } catch (error) {
                safeUrl = src;
            }

            image.onload = function () {
                resolve(image);
            };

            image.onerror = function () {
                reject(new Error('Failed to load image: ' + src));
            };

            image.src = safeUrl;
        });
    };

    const loadFabricObjects = function (staticCanvas, payload) {
        try {
            const result = staticCanvas.loadFromJSON(payload);

            if (result && typeof result.then === 'function') {
                return result;
            }

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const canvasToJpegBlob = function (canvas, quality) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
                if (!blob) {
                    reject(new Error('Failed to build JPEG blob'));
                    return;
                }

                resolve(blob);
            }, 'image/jpeg', quality);
        });
    };

    const compressCanvasToTargetJpeg = async function (canvas) {
        let quality = PLAN_ATTACHMENT_MAX_QUALITY;
        let bestBlob = null;
        let bestQuality = quality;
        let selectedBlob = null;
        let selectedQuality = quality;

        while (quality >= PLAN_ATTACHMENT_MIN_QUALITY - 0.001) {
            const currentQuality = Number(quality.toFixed(2));
            const currentBlob = await canvasToJpegBlob(canvas, currentQuality);

            if (!bestBlob || currentBlob.size < bestBlob.size) {
                bestBlob = currentBlob;
                bestQuality = currentQuality;
            }

            if (currentBlob.size <= PLAN_ATTACHMENT_TARGET_BYTES) {
                selectedBlob = currentBlob;
                selectedQuality = currentQuality;
                break;
            }

            if (!selectedBlob && currentBlob.size <= PLAN_ATTACHMENT_MAX_BYTES) {
                selectedBlob = currentBlob;
                selectedQuality = currentQuality;
            }

            quality -= PLAN_ATTACHMENT_QUALITY_STEP;
        }

        if (!selectedBlob && bestBlob) {
            selectedBlob = bestBlob;
            selectedQuality = bestQuality;
        }

        if (!selectedBlob) {
            throw new Error('Failed to compress JPEG attachment');
        }

        return {
            blob: selectedBlob,
            quality: selectedQuality,
            isOversized: selectedBlob.size > PLAN_ATTACHMENT_MAX_BYTES
        };
    };

    const formatKilobytes = function (bytes) {
        const safeBytes = Math.max(0, Math.round(Number(bytes) || 0));
        return String(Math.round(safeBytes / 1024)) + ' KB';
    };

    const renderPlanAttachment = async function (project, plan) {
        if (!window.fabric || typeof window.fabric.StaticCanvas !== 'function') {
            throw new Error('Fabric.js is not available');
        }

        const sourceImage = normalizeText(plan && plan.sourceImage);

        if (!sourceImage) {
            throw new Error('Plan source image is missing');
        }

        const image = await loadImage(sourceImage);
        const width = Math.max(1, image.naturalWidth || image.width || 1);
        const height = Math.max(1, image.naturalHeight || image.height || 1);
        const sourceCanvasWidth = Math.max(1, Math.round(Number(plan && plan.canvasWidth) || width));
        const sourceCanvasHeight = Math.max(1, Math.round(Number(plan && plan.canvasHeight) || height));
        const maxSide = Math.max(width, height);
        const outputScale = maxSide > PLAN_ATTACHMENT_MAX_LONG_SIDE
            ? PLAN_ATTACHMENT_MAX_LONG_SIDE / maxSide
            : 1;
        const outputWidth = Math.max(1, Math.round(width * outputScale));
        const outputHeight = Math.max(1, Math.round(height * outputScale));
        const overlayCanvas = document.createElement('canvas');
        const outputCanvas = document.createElement('canvas');
        const outputContext = outputCanvas.getContext('2d');
        const staticCanvas = new window.fabric.StaticCanvas(overlayCanvas, {
            width: sourceCanvasWidth,
            height: sourceCanvasHeight,
            selection: false,
            enableRetinaScaling: false
        });
        const payload = {
            objects: Array.isArray(plan.fabricObjectsJson) ? plan.fabricObjectsJson : []
        };

        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        try {
            await loadFabricObjects(staticCanvas, payload);
            staticCanvas.renderAll();

            if (!outputContext) {
                throw new Error('Canvas context is not available');
            }

            outputContext.fillStyle = '#ffffff';
            outputContext.fillRect(0, 0, outputWidth, outputHeight);
            outputContext.drawImage(image, 0, 0, outputWidth, outputHeight);
            outputContext.drawImage(
                overlayCanvas,
                0,
                0,
                overlayCanvas.width,
                overlayCanvas.height,
                0,
                0,
                outputWidth,
                outputHeight
            );

            const compressed = await compressCanvasToTargetJpeg(outputCanvas);

            const projectToken = sanitizeFileToken(project && project.projectMeta && project.projectMeta.id ? project.projectMeta.id : project && project.projectKey, 'project');
            const planToken = sanitizeFileToken(plan && plan.planTitle ? plan.planTitle : '', 'plan');
            const fileName = projectToken + '-' + planToken + '.jpg';

            return {
                blob: compressed.blob,
                fileName: fileName,
                fileSize: compressed.blob.size,
                isOversized: compressed.isOversized
            };
        } finally {
            staticCanvas.dispose();
        }
    };

    const buildAttachmentsForProjects = async function (projects, onPreparingProgress) {
        const files = [];
        const warnings = [];
        let totalEditedPlans = 0;
        let processedPlans = 0;

        projects.forEach(function (project) {
            const planEditor = project && project.planEditor && typeof project.planEditor === 'object'
                ? project.planEditor
                : null;
            const plans = planEditor && Array.isArray(planEditor.plans)
                ? planEditor.plans
                : [];

            plans.forEach(function (plan) {
                const hasObjects = plan && Array.isArray(plan.fabricObjectsJson) && plan.fabricObjectsJson.length > 0;
                const hasEdits = !!(plan && plan.hasEdits);

                if (plan && (hasEdits || hasObjects)) {
                    totalEditedPlans += 1;
                }
            });
        });

        for (let projectIndex = 0; projectIndex < projects.length; projectIndex += 1) {
            const project = projects[projectIndex];
            const planEditor = project && project.planEditor && typeof project.planEditor === 'object'
                ? project.planEditor
                : null;
            const plans = planEditor && Array.isArray(planEditor.plans)
                ? planEditor.plans
                : [];

            for (let planIndex = 0; planIndex < plans.length; planIndex += 1) {
                const plan = plans[planIndex];
                const hasObjects = plan && Array.isArray(plan.fabricObjectsJson) && plan.fabricObjectsJson.length > 0;
                const hasEdits = !!(plan && plan.hasEdits);

                if (!plan || (!hasEdits && !hasObjects)) {
                    continue;
                }

                processedPlans += 1;
                if (typeof onPreparingProgress === 'function') {
                    onPreparingProgress(processedPlans, totalEditedPlans);
                }

                try {
                    const rendered = await renderPlanAttachment(project, plan);
                    files.push(rendered);

                    if (rendered.isOversized) {
                        const projectTitle = normalizeText(project && project.projectMeta && project.projectMeta.title);
                        const planTitle = normalizeText(plan && plan.planTitle);

                        warnings.push(
                            'Attachment exceeds 300KB for "' +
                            (projectTitle || project && project.projectKey || 'project') +
                            '" / "' +
                            (planTitle || ('plan ' + (planIndex + 1))) +
                            '" (' +
                            formatKilobytes(rendered.fileSize) +
                            ')'
                        );
                    }
                } catch (error) {
                    const projectTitle = normalizeText(project && project.projectMeta && project.projectMeta.title);
                    const planTitle = normalizeText(plan && plan.planTitle);
                    warnings.push('Attachment skipped for "' + (projectTitle || project && project.projectKey || 'project') + '" / "' + (planTitle || ('plan ' + (planIndex + 1))) + '"');
                    console.warn('[LeadForm] Failed to build plan attachment', error);
                }
            }
        }

        return {
            files: files,
            warnings: warnings
        };
    };

    const sendLeadRequest = function (formData, onUploadProgress) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', String(leadConfig.ajaxUrl), true);
            xhr.withCredentials = true;

            xhr.upload.addEventListener('progress', function (event) {
                if (!event.lengthComputable || typeof onUploadProgress !== 'function') {
                    return;
                }

                const percent = Math.round((event.loaded / event.total) * 100);
                onUploadProgress(percent);
            });

            xhr.addEventListener('error', function () {
                reject(new Error('Ошибка сети при отправке формы.'));
            });

            xhr.addEventListener('abort', function () {
                reject(new Error('Отправка формы была отменена.'));
            });

            xhr.addEventListener('load', function () {
                let responseJson = null;

                try {
                    responseJson = JSON.parse(String(xhr.responseText || ''));
                } catch (error) {
                    responseJson = null;
                }

                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    data: responseJson
                });
            });

            xhr.send(formData);
        });
    };

    const submitLeadForm = async function ($form) {
        if (!leadConfig.ajaxUrl || !leadConfig.nonce) {
            setFormStatus($form, 'Не настроен endpoint отправки.', 'error');
            return;
        }

        if (!isCaptchaConfigured()) {
            setFormStatus($form, 'Капча не настроена. Проверьте ключи в админке.', 'error');
            return;
        }

        if (isLeadSubmitLocked || $form.data('isSending') === '1') {
            return;
        }

        const $nameField = $form.find('[name="name"]').first();
        const $phoneField = $form.find('[name="phone"]').first();
        const $messageField = $form.find('[name="message"]').first();
        const $submitButton = $form.find('[type="submit"]').first();

        clearFormStatus($form);
        $form.data('isSending', '1');
        isLeadSubmitLocked = true;
        $submitButton.prop('disabled', true);
        setFormProgressPreparing($form, 'Ожидание проверки captcha...');

        try {
            const captchaToken = await requestCaptchaToken();
            const name = normalizeText($nameField.val());
            const rawPhone = normalizeText($phoneField.val());
            const message = normalizeText($messageField.val());
            const normalizedPhone = normalizePhone(rawPhone);

            if (!isValidPhone(normalizedPhone)) {
                setFormStatus($form, 'Укажите корректный номер телефона.', 'error');
                $phoneField.trigger('focus');
                throw new Error('__phone_validation__');
            }

            setFormProgressPreparing($form, 'Подготовка файлов...');

            let projects = getLeadQueueProjects();
            const runtimePlanProject = buildRuntimeProjectFallback();
            const runtimeCalculatorProject = buildRuntimeCalculatorProjectFallback();

            if (runtimePlanProject) {
                projects = mergeRuntimeProjectPayload(projects, runtimePlanProject);
            }

            if (runtimeCalculatorProject) {
                projects = mergeRuntimeProjectPayload(projects, runtimeCalculatorProject);
            }

            if (runtimePlanProject || runtimeCalculatorProject) {
                const leadContext = getLeadContext();
                const patch = {};

                if (runtimePlanProject && runtimePlanProject.planEditor) {
                    patch.planEditor = runtimePlanProject.planEditor;
                }

                if (runtimeCalculatorProject && runtimeCalculatorProject.calculator) {
                    patch.calculator = runtimeCalculatorProject.calculator;
                }

                if (leadContext && typeof leadContext.upsertCurrentProject === 'function' && Object.keys(patch).length) {
                    leadContext.upsertCurrentProject(patch);
                }
            }

            const projectKeys = projects
                .map(function (project) {
                    return normalizeText(project && project.projectKey);
                })
                .filter(function (key) {
                    return key !== '';
                });
            const attachmentsResult = await buildAttachmentsForProjects(projects, function (processedPlans, totalPlans) {
                if (!totalPlans) {
                    setFormProgressPreparing($form, 'Подготовка файлов...');
                    return;
                }

                const preparePercent = Math.round((processedPlans / totalPlans) * 35);
                const safePercent = Math.min(35, Math.max(5, preparePercent));
                setFormProgressPreparing($form, 'Подготовка файлов... ' + safePercent + '%', safePercent);
            });
            const formData = new FormData();

            formData.append('action', 'tanyatheme_send_lead');
            formData.append('nonce', String(leadConfig.nonce));
            formData.append('name', name);
            formData.append('phone', normalizedPhone);
            formData.append('message', message);
            formData.append('captchaToken', captchaToken);
            formData.append('formMeta', JSON.stringify(buildFormMeta($form)));
            formData.append('projectsContext', JSON.stringify({
                projectKeys: projectKeys,
                projects: projects
            }));
            formData.append('contextWarnings', JSON.stringify(attachmentsResult.warnings));

            attachmentsResult.files.forEach(function (file) {
                formData.append('attachments[]', file.blob, file.fileName);
            });

            setFormProgressUpload($form, 0);

            const response = await sendLeadRequest(formData, function (percent) {
                setFormProgressUpload($form, percent);
            });
            const responseJson = response && response.data ? response.data : null;

            const hasSuccess = !!(responseJson && responseJson.success);

            if (!response.ok || !hasSuccess) {
                throw new Error(responseJson && responseJson.data && responseJson.data.message
                    ? String(responseJson.data.message)
                    : 'Не удалось отправить форму.');
            }

            setFormProgressUpload($form, 100);

            const sentProjectKeys = Array.isArray(responseJson && responseJson.data && responseJson.data.sentProjectKeys)
                ? responseJson.data.sentProjectKeys
                : projectKeys;

            const leadContext = getLeadContext();
            if (leadContext && typeof leadContext.markSent === 'function' && sentProjectKeys.length) {
                leadContext.markSent(sentProjectKeys);
            }

            setFormStatus($form, 'Спасибо, заявка отправлена.', 'success');
            $form.trigger('reset');
            initPhoneMasks();

            if ($form.closest('.feedback-popup').length && window.tanyathemeFeedbackPopup) {
                window.setTimeout(function () {
                    window.tanyathemeFeedbackPopup.close();
                    clearFormStatus($form);
                }, 900);
            }

            window.setTimeout(function () {
                resetFormProgress($form);
            }, 700);
        } catch (error) {
            if (!error || error.message !== '__phone_validation__') {
                console.warn('[LeadForm] Submit failed', error);
                setFormStatus($form, error && error.message ? error.message : 'Ошибка отправки. Попробуйте еще раз.', 'error');
            }
            resetFormProgress($form);
        } finally {
            clearPendingCaptchaPromise();
            captchaState.cancelled = false;
            closeCaptchaPopup();
            clearCaptchaError();
            setCaptchaPopupText('Ожидание проверки captcha...');
            resetCaptchaWidget();
            $form.data('isSending', '0');
            isLeadSubmitLocked = false;
            $submitButton.prop('disabled', false);
        }
    };

    initPhoneMasks();

    if ($captchaPopup.length) {
        const closeCaptchaPopupByUser = function (event) {
            if (event) {
                event.preventDefault();
            }

            cancelCaptchaRequest('Проверка captcha отменена.');
        };

        if ($captchaPopupClosers.length) {
            $captchaPopupClosers.on('click', closeCaptchaPopupByUser);
        }

        $(document).on('keydown', function (event) {
            if (event.key !== 'Escape' || !$captchaPopup.hasClass('is-open')) {
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            closeCaptchaPopupByUser();
        });
    }

    if ($feedbackPopup.length) {
        const $popup = $feedbackPopup.first();
        const $popupClosers = $popup.find('[data-feedback-popup-close]');

        const openFeedbackPopup = function (options) {
            const settings = options && typeof options === 'object' ? options : {};

            feedbackPopupSource = normalizeText(settings.source || feedbackPopupSource || 'popup') || 'popup';
            $popup.addClass('is-open').attr('aria-hidden', 'false');
            $body.addClass('feedback-popup-open');
            initPhoneMasks();
        };

        const closeFeedbackPopup = function () {
            $popup.removeClass('is-open').attr('aria-hidden', 'true');
            $body.removeClass('feedback-popup-open');
        };

        window.tanyathemeFeedbackPopup = {
            open: openFeedbackPopup,
            close: closeFeedbackPopup,
            isOpen: function () {
                return $popup.hasClass('is-open');
            }
        };

        if ($feedbackPopupOpeners.length) {
            $feedbackPopupOpeners.on('click', function (e) {
                e.preventDefault();
                openFeedbackPopup({
                    source: normalizeText($(this).attr('data-feedback-source')) || 'cta'
                });
            });
        }

        $popupClosers.on('click', function (e) {
            e.preventDefault();
            closeFeedbackPopup();
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $popup.hasClass('is-open') && !$captchaPopup.hasClass('is-open')) {
                closeFeedbackPopup();
            }
        });
    }

    if ($feedbackForms.length) {
        $feedbackForms.on('submit', function (event) {
            event.preventDefault();
            submitLeadForm($(this));
        });
    }

    if (window.Fancybox && typeof Fancybox.bind === 'function') {
        Fancybox.bind('[data-fancybox]', {
            dragToClose: false,
            placeFocusBack: false
        });
    }
});
