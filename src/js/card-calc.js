$(function () {
    const $cardCalcBlocks = $('.card-calc');

    if (!$cardCalcBlocks.length) {
        return;
    }

    const parseCurrency = function (value) {
        const digits = String(value || '').match(/\d+/g);

        if (!digits || !digits.length) {
            return NaN;
        }

        return Number(digits.join(''));
    };

    const parsePrice = function (value) {
        const parsedValue = Number(value);

        if (!isFinite(parsedValue)) {
            return 0;
        }

        return parsedValue;
    };

    const formatCurrency = function (value) {
        const safeValue = Math.max(0, Math.round(parsePrice(value)));
        return safeValue.toLocaleString('ru-RU') + ' ₽';
    };

    const normalizeText = function (value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    };

    const getLeadContext = function () {
        if (window.tanyathemeLeadContext && typeof window.tanyathemeLeadContext === 'object') {
            return window.tanyathemeLeadContext;
        }

        return null;
    };

    $cardCalcBlocks.each(function (blockIndex) {
        const $window = $(window);
        const $calc = $(this);
        const $box = $calc.find('.card-calc__box').first();
        const $summary = $calc.find('.card-calc__summary').first();
        const $inputs = $calc.find('[data-calc-group] input[data-price]');
        const $changesOutput = $calc.find('[data-calc-out="changes"]');
        const $baseOutput = $calc.find('[data-calc-out="base"]');
        const $totalOutput = $calc.find('[data-calc-out="total"]');
        const $summaryPlaceholder = $('<div class="card-calc__summary-placeholder" aria-hidden="true"></div>').insertAfter($summary).hide();
        const eventNamespace = '.cardCalc' + blockIndex;
        const stickyStartOffset = 280;
        let isFirstRender = true;
        let isCalculatorTouched = false;
        let stickyRafId = null;
        let forceFloatingUntil = 0;

        if (!$inputs.length || !$summary.length || !$box.length) {
            return;
        }

        const getViewportHeight = function () {
            if (window.visualViewport && window.visualViewport.height) {
                return window.visualViewport.height;
            }

            return $window.height();
        };

        const getBaseFloatingBottomOffset = function () {
            const viewportWidth = window.visualViewport && window.visualViewport.width
                ? window.visualViewport.width
                : window.innerWidth;

            if (viewportWidth <= 567) {
                return 8;
            }

            if (viewportWidth <= 768) {
                return 10;
            }

            if (viewportWidth <= 991) {
                return 14;
            }

            return 18;
        };

        const getVisualViewportInsetBottom = function () {
            if (!window.visualViewport) {
                return 0;
            }

            const insetBottom = window.innerHeight - (window.visualViewport.height + window.visualViewport.offsetTop);
            return Math.max(0, insetBottom);
        };

        const getFloatingBottomOffset = function () {
            return getBaseFloatingBottomOffset() + getVisualViewportInsetBottom();
        };

        const resolveBaseCost = function () {
            const $main = $calc.closest('main');
            const $scope = $main.length ? $main : $(document);
            const $priceNode = $scope.find('.price__cost').first();
            const priceFromCard = parseCurrency($priceNode.text());

            if (isFinite(priceFromCard)) {
                return priceFromCard;
            }

            const priceFromData = parseCurrency($calc.attr('data-base-cost'));

            if (isFinite(priceFromData)) {
                return priceFromData;
            }

            return 0;
        };

        const getChangesTotal = function () {
            let sum = 0;

            $inputs.filter(':checked').each(function () {
                sum += parsePrice($(this).attr('data-price'));
            });

            return sum;
        };

        const animateOutputValue = function ($node, nextValue, shouldAnimate) {
            const previousFrame = $node.data('cardCalcFrame');
            const previousTimeout = $node.data('cardCalcPulseTimeout');
            const currentValue = parsePrice($node.attr('data-calc-value'));

            if (previousFrame) {
                window.cancelAnimationFrame(previousFrame);
            }

            if (previousTimeout) {
                window.clearTimeout(previousTimeout);
            }

            if (!shouldAnimate || currentValue === nextValue) {
                $node.attr('data-calc-value', nextValue);
                $node.text(formatCurrency(nextValue));
                return;
            }

            const duration = 340;
            const startValue = isFinite(currentValue) ? currentValue : 0;
            const startTime = window.performance.now();

            $node.removeClass('is-updating');
            void $node[0].offsetWidth;
            $node.addClass('is-updating');

            const step = function (now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(startValue + (nextValue - startValue) * eased);

                $node.attr('data-calc-value', current);
                $node.text(formatCurrency(current));

                if (progress < 1) {
                    const nextFrame = window.requestAnimationFrame(step);
                    $node.data('cardCalcFrame', nextFrame);
                    return;
                }

                $node.attr('data-calc-value', nextValue);
                $node.text(formatCurrency(nextValue));
                $node.removeData('cardCalcFrame');

                const pulseTimeout = window.setTimeout(function () {
                    $node.removeClass('is-updating');
                    $node.removeData('cardCalcPulseTimeout');
                }, duration);

                $node.data('cardCalcPulseTimeout', pulseTimeout);
            };

            const initialFrame = window.requestAnimationFrame(step);
            $node.data('cardCalcFrame', initialFrame);
        };

        const updateFloatingGeometry = function () {
            const $anchor = $summaryPlaceholder.is(':visible') ? $summaryPlaceholder : $summary;
            const anchorOffset = $anchor.offset();

            if (!anchorOffset) {
                return;
            }

            const left = Math.max(0, anchorOffset.left - $window.scrollLeft());
            const width = Math.max(0, $anchor.outerWidth());
            const floatingBottomOffset = getFloatingBottomOffset();

            $summary.css('--calc-summary-left', left + 'px');
            $summary.css('--calc-summary-width', width + 'px');
            $summary.css('--calc-summary-bottom', floatingBottomOffset + 'px');
        };

        const enableFloatingSummary = function () {
            if ($summary.hasClass('is-floating')) {
                updateFloatingGeometry();
                return;
            }

            $summaryPlaceholder.height($summary.outerHeight(true)).show();
            $summary.addClass('is-floating');
            updateFloatingGeometry();
        };

        const disableFloatingSummary = function () {
            if (!$summary.hasClass('is-floating')) {
                return;
            }

            $summary.removeClass('is-floating');
            $summary.css('--calc-summary-left', '');
            $summary.css('--calc-summary-width', '');
            $summaryPlaceholder.hide().height(0);
        };

        const updateFloatingState = function () {
            const calcOffset = $calc.offset();

            if (!calcOffset) {
                disableFloatingSummary();
                return;
            }

            const $anchor = $summaryPlaceholder.is(':visible') ? $summaryPlaceholder : $summary;
            const anchorOffset = $anchor.offset();

            if (!anchorOffset) {
                disableFloatingSummary();
                return;
            }

            const scrollTop = $window.scrollTop();
            const viewportHeight = getViewportHeight();
            const viewportBottom = scrollTop + viewportHeight;
            const calcTop = calcOffset.top;
            const calcBottom = calcTop + $calc.outerHeight();
            const summaryHeight = $summary.outerHeight();
            const floatingBottomOffset = getFloatingBottomOffset();
            const fixedSummaryTop = viewportBottom - summaryHeight - floatingBottomOffset;
            const anchorTop = anchorOffset.top;
            const hasEnteredSection = viewportBottom > calcTop + stickyStartOffset;
            const beforeAnchorPosition = fixedSummaryTop + 2 < anchorTop;
            const enoughRoom = (calcBottom - scrollTop) > summaryHeight + floatingBottomOffset + 20;
            const normalFloating = hasEnteredSection && beforeAnchorPosition && enoughRoom;
            const forceFloating = Date.now() < forceFloatingUntil && beforeAnchorPosition && enoughRoom;
            const shouldFloat = normalFloating || forceFloating;

            if (shouldFloat) {
                enableFloatingSummary();
                return;
            }

            disableFloatingSummary();
        };

        const requestFloatingStateUpdate = function () {
            if (stickyRafId) {
                return;
            }

            stickyRafId = window.requestAnimationFrame(function () {
                stickyRafId = null;
                updateFloatingState();
            });
        };

        const revealFloatingSummaryOnChange = function () {
            if (window.innerWidth > 991) {
                return;
            }

            const targetNode = $summary[0];

            if (!targetNode) {
                return;
            }

            const viewportHeight = getViewportHeight();
            const rect = targetNode.getBoundingClientRect();
            const visibilityPadding = 12;
            const isVisible = rect.bottom > visibilityPadding && rect.top < (viewportHeight - visibilityPadding);

            if (isVisible) {
                return;
            }

            const calcOffset = $calc.offset();

            if (!calcOffset) {
                return;
            }

            const scrollTop = $window.scrollTop();
            const viewportBottom = scrollTop + viewportHeight;
            const calcTop = calcOffset.top;
            const calcBottom = calcTop + $calc.outerHeight();
            const summaryHeight = $summary.outerHeight();
            const floatingBottomOffset = getFloatingBottomOffset();
            const sectionVisible = viewportBottom > calcTop && scrollTop < calcBottom;
            const hasRoomForFloating = (calcBottom - scrollTop) > summaryHeight + floatingBottomOffset + 20;

            if (!sectionVisible || !hasRoomForFloating) {
                return;
            }

            forceFloatingUntil = Date.now() + 900;
            enableFloatingSummary();
            requestFloatingStateUpdate();
            window.setTimeout(requestFloatingStateUpdate, 920);
        };

        const renderTotals = function () {
            const base = resolveBaseCost();
            const changes = getChangesTotal();
            const total = base + changes;
            const shouldAnimate = !isFirstRender;

            animateOutputValue($changesOutput, changes, shouldAnimate);
            animateOutputValue($baseOutput, base, shouldAnimate);
            animateOutputValue($totalOutput, total, shouldAnimate);
            isFirstRender = false;
            requestFloatingStateUpdate();

            const leadContext = getLeadContext();

            if (isCalculatorTouched && leadContext && typeof leadContext.upsertCurrentProject === 'function') {
                const selections = {};
                const selectedOptions = [];

                $calc.find('[data-calc-group]').each(function (groupIndex) {
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
                        const optionPrice = parsePrice($(this).attr('data-price'));

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

                leadContext.upsertCurrentProject({
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
                    }
                });
            }
        };

        const restoreCalculatorState = function () {
            const leadContext = getLeadContext();

            if (!leadContext || typeof leadContext.getProject !== 'function' || typeof leadContext.getCurrentProjectKey !== 'function') {
                return false;
            }

            const currentProject = leadContext.getProject(leadContext.getCurrentProjectKey());
            const calculatorState = currentProject && currentProject.calculator && typeof currentProject.calculator === 'object'
                ? currentProject.calculator
                : null;

            if (!calculatorState || !calculatorState.selections || typeof calculatorState.selections !== 'object') {
                return false;
            }

            $calc.find('[data-calc-group]').each(function (groupIndex) {
                const $group = $(this);
                const groupKey = String($group.attr('data-calc-group') || (groupIndex + 1));
                const groupState = calculatorState.selections[groupKey];

                if (!groupState || !Array.isArray(groupState.selectedIndices)) {
                    return;
                }

                const $groupInputs = $group.find('input[data-price]');

                if (!$groupInputs.length) {
                    return;
                }

                $groupInputs.prop('checked', false);

                groupState.selectedIndices.forEach(function (selectedIndex) {
                    const safeIndex = Number(selectedIndex);

                    if (!isFinite(safeIndex)) {
                        return;
                    }

                    const $input = $groupInputs.eq(safeIndex);

                    if ($input.length) {
                        $input.prop('checked', true);
                    }
                });

                if ($group.find('input[type="radio"]').length && !$group.find('input[data-price]:checked').length) {
                    $group.find('input[data-price]').first().prop('checked', true);
                }
            });

            isCalculatorTouched = true;
            return true;
        };

        $inputs.on('change', function () {
            isCalculatorTouched = true;
            renderTotals();
            window.setTimeout(function () {
                requestFloatingStateUpdate();
                revealFloatingSummaryOnChange();
            }, 30);
        });

        $window.on('scroll' + eventNamespace + ' resize' + eventNamespace, requestFloatingStateUpdate);

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', requestFloatingStateUpdate);
            window.visualViewport.addEventListener('scroll', requestFloatingStateUpdate);
        }

        restoreCalculatorState();
        renderTotals();
    });
});
