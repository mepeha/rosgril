$(function () {
    const STORAGE_KEY = 'tanyatheme:lead-queue:v1';
    const STORAGE_VERSION = 1;
    const MAX_PROJECTS = 2;

    const normalizeText = function (value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    };

    const deepClone = function (value) {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (error) {
            return null;
        }
    };

    const createEmptyState = function () {
        return {
            version: STORAGE_VERSION,
            order: [],
            projects: {}
        };
    };

    const normalizeProjectKey = function (value) {
        const fallback = String(window.location && window.location.pathname ? window.location.pathname : '/');
        const raw = normalizeText(value);
        return raw !== '' ? raw : fallback;
    };

    const normalizeProjectToken = function (value) {
        const raw = normalizeText(value)
            .toLowerCase()
            .replace(/[^a-z0-9а-яё_-]+/gi, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-');

        return raw.slice(0, 96);
    };

    const normalizeRecord = function (record, key) {
        const baseMeta = record && typeof record.projectMeta === 'object' ? record.projectMeta : {};
        const normalized = {
            projectKey: key,
            projectMeta: {
                path: normalizeText(baseMeta.path || key) || key,
                url: normalizeText(baseMeta.url || ''),
                title: normalizeText(baseMeta.title || ''),
                id: normalizeText(baseMeta.id || '')
            },
            updatedAt: Number(record && record.updatedAt) || Date.now()
        };

        if (record && typeof record.planEditor === 'object' && record.planEditor) {
            normalized.planEditor = record.planEditor;
        }

        if (record && typeof record.calculator === 'object' && record.calculator) {
            normalized.calculator = record.calculator;
        }

        return normalized;
    };

    const loadState = function () {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return createEmptyState();
            }

            const parsed = JSON.parse(raw);
            const order = Array.isArray(parsed && parsed.order) ? parsed.order.map(normalizeProjectKey) : [];
            const projectsRaw = parsed && typeof parsed.projects === 'object' && parsed.projects ? parsed.projects : {};
            const projects = {};

            order.forEach(function (key) {
                if (projectsRaw[key] && typeof projectsRaw[key] === 'object') {
                    projects[key] = normalizeRecord(projectsRaw[key], key);
                }
            });

            return {
                version: STORAGE_VERSION,
                order: Object.keys(projects),
                projects: projects
            };
        } catch (error) {
            console.warn('[LeadContext] Failed to load queue state', error);
            return createEmptyState();
        }
    };

    let state = loadState();

    const saveState = function () {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.warn('[LeadContext] Failed to save queue state', error);
        }
    };

    const removeProject = function (projectKey) {
        const key = normalizeProjectKey(projectKey);
        const nextOrder = state.order.filter(function (item) {
            return item !== key;
        });

        delete state.projects[key];
        state.order = nextOrder;
    };

    const touchProject = function (projectKey) {
        const key = normalizeProjectKey(projectKey);
        removeProject(key);
        state.order.push(key);
    };

    const pruneQueue = function () {
        while (state.order.length > MAX_PROJECTS) {
            const oldestKey = state.order.shift();

            if (oldestKey) {
                delete state.projects[oldestKey];
            }
        }
    };

    const isRecordEmpty = function (record) {
        if (!record || typeof record !== 'object') {
            return true;
        }

        const hasPlanEditor = !!(record.planEditor && typeof record.planEditor === 'object');
        const hasCalculator = !!(record.calculator && typeof record.calculator === 'object');

        return !hasPlanEditor && !hasCalculator;
    };

    const getCurrentProjectMeta = function () {
        const path = normalizeProjectKey(window.location && window.location.pathname ? window.location.pathname : '/');
        const $main = $('main.single-project-main').first();
        const titleFromMain = normalizeText($main.attr('data-project-title'));
        const idFromMain = normalizeText($main.attr('data-project-id'));
        const titleFromHead = normalizeText($('.page-head__title').first().text());
        const idFromCard = normalizeText($('.card-info__subtitle').first().text());
        const title = titleFromMain || titleFromHead || normalizeText(document.title);
        const projectId = idFromMain || idFromCard;
        const projectToken = normalizeProjectToken(projectId || title);
        const key = projectToken ? (path + '::' + projectToken) : path;

        return {
            key: key,
            path: path,
            url: String(window.location && window.location.href ? window.location.href : ''),
            title: title,
            id: projectId
        };
    };

    const ensureProjectRecord = function (projectKey) {
        const key = normalizeProjectKey(projectKey);

        if (!state.projects[key]) {
            state.projects[key] = normalizeRecord({
                projectMeta: getCurrentProjectMeta()
            }, key);
        }

        return state.projects[key];
    };

    const upsertProject = function (projectKey, partialState) {
        const key = normalizeProjectKey(projectKey);
        const patch = partialState && typeof partialState === 'object' ? partialState : {};
        const record = ensureProjectRecord(key);

        if (patch.projectMeta && typeof patch.projectMeta === 'object') {
            const patchMeta = patch.projectMeta;
            record.projectMeta = {
                path: normalizeText(patchMeta.path || record.projectMeta.path || key) || key,
                url: normalizeText(patchMeta.url || record.projectMeta.url || ''),
                title: normalizeText(patchMeta.title || record.projectMeta.title || ''),
                id: normalizeText(patchMeta.id || record.projectMeta.id || '')
            };
        }

        if (Object.prototype.hasOwnProperty.call(patch, 'planEditor')) {
            if (patch.planEditor && typeof patch.planEditor === 'object') {
                record.planEditor = patch.planEditor;
            } else {
                delete record.planEditor;
            }
        }

        if (Object.prototype.hasOwnProperty.call(patch, 'calculator')) {
            if (patch.calculator && typeof patch.calculator === 'object') {
                record.calculator = patch.calculator;
            } else {
                delete record.calculator;
            }
        }

        record.updatedAt = Date.now();

        if (isRecordEmpty(record)) {
            removeProject(key);
            saveState();
            return null;
        }

        state.projects[key] = normalizeRecord(record, key);
        touchProject(key);
        pruneQueue();
        saveState();

        return deepClone(state.projects[key]);
    };

    const upsertCurrentProject = function (partialState) {
        const meta = getCurrentProjectMeta();
        const patch = partialState && typeof partialState === 'object' ? partialState : {};
        const mergedMeta = Object.assign({}, meta, patch.projectMeta || {});
        const payload = Object.assign({}, patch, {
            projectMeta: mergedMeta
        });

        return upsertProject(meta.key, payload);
    };

    const getProject = function (projectKey) {
        const key = normalizeProjectKey(projectKey);
        const project = state.projects[key];
        return project ? deepClone(project) : null;
    };

    const getUnsentProjects = function () {
        return state.order
            .map(function (key) {
                return state.projects[key] ? deepClone(state.projects[key]) : null;
            })
            .filter(function (item) {
                return !!item;
            });
    };

    const markSent = function (projectKeys) {
        const keys = Array.isArray(projectKeys) ? projectKeys : [];

        if (!keys.length) {
            return;
        }

        keys.forEach(function (projectKey) {
            removeProject(projectKey);
        });

        saveState();
    };

    const clear = function () {
        state = createEmptyState();
        saveState();
    };

    window.tanyathemeLeadContext = {
        STORAGE_KEY: STORAGE_KEY,
        MAX_PROJECTS: MAX_PROJECTS,
        getCurrentProjectKey: function () {
            return getCurrentProjectMeta().key;
        },
        getCurrentProjectMeta: getCurrentProjectMeta,
        upsertProject: upsertProject,
        upsertCurrentProject: upsertCurrentProject,
        getProject: getProject,
        getUnsentProjects: getUnsentProjects,
        markSent: markSent,
        clear: clear
    };
});

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

$(function () {
    const STORAGE_KEY = 'planEditor:v2:' + String(window.location && window.location.pathname ? window.location.pathname : '/');
    const STORAGE_SAVE_DELAY = 250;
    const getLeadContext = function () {
        if (window.tanyathemeLeadContext && typeof window.tanyathemeLeadContext === 'object') {
            return window.tanyathemeLeadContext;
        }

        return null;
    };

    const $body = $('body');
    const $planEditorModal = $('.plan-editor-modal');
    const $planEditorOverlay = $('.plan-editor-modal__overlay');
    const $planEditorClose = $('.plan-editor-modal__close');
    const $planEditorSelect = $('.plan-editor-modal__plan-select');
    const $planEditorToolButtons = $('.plan-editor-modal__tool[data-plan-tool]');
    const $planEditorClearButton = $('.plan-editor-modal__tool[data-plan-action="clear"]');
    const $planEditorCanvasWrap = $('.plan-editor-modal__canvas-wrap');
    const $planEditorStage = $('.plan-editor-modal__stage');
    const $planEditorBaseImage = $('.plan-editor-modal__base-image');
    const $planEditorCanvas = $('.plan-editor-modal__canvas');
    const $planEditorForm = $('.plan-editor-modal__form');
    const $planEditorComment = $('.plan-editor-modal__comment-input');
    const $planEditorZoomControls = $('.plan-editor-modal [data-plan-zoom]');
    const $planEditorZoomValue = $('.plan-editor-modal__zoom-value');
    const $planParts = $('.plans__part');

    const planEditorState = {
        plans: [],
        activeIndex: 0,
        activeTool: 'brush',
        fabricCanvas: null,
        lineDraft: null,
        lineStart: null,
        eraserHoverObject: null,
        imageNaturalWidth: 0,
        imageNaturalHeight: 0,
        baseImageElement: null,
        drawWidth: 0,
        drawHeight: 0,
        zoom: 1,
        minZoom: 1,
        maxZoom: 3,
        zoomStep: 0.2,
        panX: 0,
        panY: 0,
        isPanning: false,
        isErasing: false,
        eraserHasChanges: false,
        panStartX: 0,
        panStartY: 0,
        panOriginX: 0,
        panOriginY: 0,
        imageLoadRequestId: 0,
        switchAnimationTimer: null,
        storageWriteTimer: null,
        persistedState: {
            activePlanIndex: 0,
            plansState: {}
        }
    };

    const normalizeText = function (value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    };

    const parseNumberOr = function (value, fallback) {
        const parsed = Number(value);

        if (!isFinite(parsed)) {
            return fallback;
        }

        return parsed;
    };

    const normalizeSnapshotZoom = function (value) {
        const parsed = Number(value);

        if (!isFinite(parsed) || parsed <= 0) {
            return 1;
        }

        return parsed;
    };

    const createEmptyPersistedState = function () {
        return {
            activePlanIndex: 0,
            plansState: {}
        };
    };

    const loadPersistedStateFromSession = function () {
        const emptyState = createEmptyPersistedState();

        try {
            const rawValue = window.sessionStorage.getItem(STORAGE_KEY);

            if (!rawValue) {
                planEditorState.persistedState = emptyState;
                return;
            }

            const parsedValue = JSON.parse(rawValue);
            const parsedPlansState = parsedValue && typeof parsedValue === 'object' ? parsedValue.plansState : null;
            const normalizedPlansState = {};

            if (parsedPlansState && typeof parsedPlansState === 'object') {
                Object.keys(parsedPlansState).forEach(function (planKey) {
                    const snapshot = parsedPlansState[planKey];

                    if (!snapshot || typeof snapshot !== 'object') {
                        return;
                    }

                    normalizedPlansState[planKey] = {
                        fabricObjectsJson: Array.isArray(snapshot.fabricObjectsJson) ? snapshot.fabricObjectsJson : [],
                        comment: typeof snapshot.comment === 'string' ? snapshot.comment : '',
                        zoom: clampPlanEditorZoom(Math.max(1, normalizeSnapshotZoom(snapshot.zoom))),
                        panX: parseNumberOr(snapshot.panX, 0),
                        panY: parseNumberOr(snapshot.panY, 0),
                        canvasWidth: Math.max(0, Math.round(parseNumberOr(snapshot.canvasWidth, 0))),
                        canvasHeight: Math.max(0, Math.round(parseNumberOr(snapshot.canvasHeight, 0))),
                        updatedAt: parseNumberOr(snapshot.updatedAt, 0)
                    };
                });
            }

            planEditorState.persistedState = {
                activePlanIndex: parseNumberOr(parsedValue && parsedValue.activePlanIndex, 0),
                plansState: normalizedPlansState
            };
        } catch (error) {
            console.warn('[PlanEditor] Failed to load session state', error);
            planEditorState.persistedState = emptyState;
        }
    };

    const persistStateToSession = function () {
        try {
            const payload = JSON.stringify(planEditorState.persistedState);
            window.sessionStorage.setItem(STORAGE_KEY, payload);
        } catch (error) {
            console.warn('[PlanEditor] Failed to save session state', error);
        }
    };

    const schedulePersistState = function () {
        if (planEditorState.storageWriteTimer) {
            clearTimeout(planEditorState.storageWriteTimer);
        }

        planEditorState.storageWriteTimer = setTimeout(function () {
            planEditorState.storageWriteTimer = null;
            persistStateToSession();
        }, STORAGE_SAVE_DELAY);
    };

    const flushPersistState = function () {
        if (planEditorState.storageWriteTimer) {
            clearTimeout(planEditorState.storageWriteTimer);
            planEditorState.storageWriteTimer = null;
        }

        persistStateToSession();
    };

    const triggerPlanSwitchAnimation = function (direction) {
        if (!$planEditorCanvasWrap.length) {
            return;
        }

        const classBase = 'is-plan-switching';
        const classDirection = direction === 'prev' ? 'is-plan-switching-prev' : 'is-plan-switching-next';

        if (planEditorState.switchAnimationTimer) {
            clearTimeout(planEditorState.switchAnimationTimer);
            planEditorState.switchAnimationTimer = null;
        }

        $planEditorCanvasWrap.removeClass('is-plan-switching-next is-plan-switching-prev');
        void $planEditorCanvasWrap.get(0).offsetWidth;
        $planEditorCanvasWrap.addClass(classBase + ' ' + classDirection);

        planEditorState.switchAnimationTimer = setTimeout(function () {
            $planEditorCanvasWrap.removeClass(classBase + ' is-plan-switching-next is-plan-switching-prev');
            planEditorState.switchAnimationTimer = null;
        }, 300);
    };

    const collectPlanParts = function () {
        planEditorState.plans = [];

        $planParts.each(function (index) {
            const $part = $(this);
            const title = normalizeText($part.find('.plans__title').text());
            const imageSrc = $part.find('.plans__image img').attr('src') || '';
            const $trigger = $part.find('.plans__edit-button');

            if (!imageSrc || !$trigger.length) {
                return;
            }

            planEditorState.plans.push({
                index: index,
                planKey: String(index) + '::' + imageSrc,
                title: title || 'План ' + (index + 1),
                displayTitle: '',
                imageSrc: imageSrc,
                $trigger: $trigger
            });
        });
    };

    const prunePersistedPlansState = function () {
        const allowedKeys = {};
        const nextPlansState = {};

        planEditorState.plans.forEach(function (plan) {
            allowedKeys[plan.planKey] = true;
        });

        Object.keys(planEditorState.persistedState.plansState || {}).forEach(function (planKey) {
            if (allowedKeys[planKey]) {
                nextPlansState[planKey] = planEditorState.persistedState.plansState[planKey];
            }
        });

        planEditorState.persistedState.plansState = nextPlansState;
    };

    const buildPlanSelect = function () {
        const titleCounts = {};

        planEditorState.plans.forEach(function (plan) {
            titleCounts[plan.title] = (titleCounts[plan.title] || 0) + 1;
        });

        $planEditorSelect.empty();

        planEditorState.plans.forEach(function (plan, index) {
            const isDuplicateTitle = titleCounts[plan.title] > 1;
            const title = isDuplicateTitle ? 'План ' + (index + 1) : (plan.title || 'План ' + (index + 1));
            plan.displayTitle = title;
            const option = $('<option></option>')
                .val(index)
                .text(title);

            $planEditorSelect.append(option);
        });
    };

    const getPlanByIndex = function (planIndex) {
        if (!planEditorState.plans.length) {
            return null;
        }

        const safeIndex = Math.max(0, Math.min(planIndex, planEditorState.plans.length - 1));
        return planEditorState.plans[safeIndex] || null;
    };

    const getPlanSnapshot = function (planIndex) {
        const plan = getPlanByIndex(planIndex);

        if (!plan) {
            return null;
        }

        return planEditorState.persistedState.plansState[plan.planKey] || null;
    };

    const ensurePlanSnapshot = function (planIndex) {
        const plan = getPlanByIndex(planIndex);

        if (!plan) {
            return null;
        }

        if (!planEditorState.persistedState.plansState[plan.planKey]) {
            planEditorState.persistedState.plansState[plan.planKey] = {
                fabricObjectsJson: [],
                comment: '',
                zoom: 1,
                panX: 0,
                panY: 0,
                canvasWidth: 0,
                canvasHeight: 0,
                updatedAt: Date.now()
            };
        }

        return planEditorState.persistedState.plansState[plan.planKey];
    };

    const getCanvasObjectsJson = function () {
        if (!planEditorState.fabricCanvas) {
            return [];
        }

        const canvasJson = planEditorState.fabricCanvas.toJSON(['globalCompositeOperation']);

        if (!canvasJson || !Array.isArray(canvasJson.objects)) {
            return [];
        }

        return canvasJson.objects;
    };

    const saveCurrentPlanState = function (withObjects) {
        clearEraserHoverState();

        const snapshot = ensurePlanSnapshot(planEditorState.activeIndex);

        if (!snapshot) {
            return;
        }

        if (withObjects !== false) {
            snapshot.fabricObjectsJson = getCanvasObjectsJson();
        }

        snapshot.comment = String($planEditorComment.val() || '');
        snapshot.zoom = clampPlanEditorZoom(Math.max(1, normalizeSnapshotZoom(planEditorState.zoom)));
        snapshot.panX = parseNumberOr(planEditorState.panX, 0);
        snapshot.panY = parseNumberOr(planEditorState.panY, 0);
        snapshot.canvasWidth = planEditorState.fabricCanvas ? Math.max(0, Math.round(planEditorState.fabricCanvas.getWidth())) : 0;
        snapshot.canvasHeight = planEditorState.fabricCanvas ? Math.max(0, Math.round(planEditorState.fabricCanvas.getHeight())) : 0;
        snapshot.updatedAt = Date.now();

        planEditorState.persistedState.activePlanIndex = planEditorState.activeIndex;
    };

    const queueCurrentPlanSave = function (withObjects) {
        saveCurrentPlanState(withObjects);
        schedulePersistState();
        syncPlanEditorToLeadContext();
    };

    const buildAllPlansPayload = function () {
        const plans = planEditorState.plans.map(function (plan, index) {
            const snapshot = planEditorState.persistedState.plansState[plan.planKey] || {};
            const hasObjects = Array.isArray(snapshot.fabricObjectsJson) && snapshot.fabricObjectsJson.length > 0;

            return {
                planIndex: index,
                planKey: plan.planKey,
                planTitle: plan.displayTitle || plan.title || 'План ' + (index + 1),
                sourceImage: plan.imageSrc || '',
                comment: typeof snapshot.comment === 'string' ? snapshot.comment : '',
                zoom: clampPlanEditorZoom(Math.max(1, normalizeSnapshotZoom(snapshot.zoom))),
                panX: parseNumberOr(snapshot.panX, 0),
                panY: parseNumberOr(snapshot.panY, 0),
                canvasWidth: Math.max(0, Math.round(parseNumberOr(snapshot.canvasWidth, 0))),
                canvasHeight: Math.max(0, Math.round(parseNumberOr(snapshot.canvasHeight, 0))),
                fabricObjectsJson: Array.isArray(snapshot.fabricObjectsJson) ? snapshot.fabricObjectsJson : [],
                updatedAt: parseNumberOr(snapshot.updatedAt, 0),
                hasEdits: hasObjects
            };
        });

        return {
            pageKey: String(window.location && window.location.pathname ? window.location.pathname : '/'),
            activePlanIndex: planEditorState.activeIndex,
            plans: plans
        };
    };

    const syncPlanEditorToLeadContext = function () {
        const leadContext = getLeadContext();

        if (!leadContext || typeof leadContext.upsertCurrentProject !== 'function') {
            return;
        }

        const payload = buildAllPlansPayload();
        const hasPayloadChanges = payload.plans.some(function (plan) {
            return !!plan.hasEdits || normalizeText(plan.comment) !== '';
        });

        leadContext.upsertCurrentProject({
            planEditor: hasPayloadChanges
                ? Object.assign({}, payload, { updatedAt: Date.now() })
                : null
        });
    };

    const clearPlanAnnotations = function (shouldPersist) {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        const objects = planEditorState.fabricCanvas.getObjects();
        objects.forEach(function (object) {
            planEditorState.fabricCanvas.remove(object);
        });

        planEditorState.fabricCanvas.discardActiveObject();
        planEditorState.fabricCanvas.requestRenderAll();

        if (shouldPersist !== false) {
            queueCurrentPlanSave(true);
        }
    };

    const clampPlanEditorZoom = function (value) {
        return Math.min(planEditorState.maxZoom, Math.max(planEditorState.minZoom, value));
    };

    const clampPlanEditorPan = function (value, axis) {
        const stageSize = axis === 'x' ? $planEditorStage.innerWidth() : $planEditorStage.innerHeight();
        const drawSize = axis === 'x' ? planEditorState.drawWidth : planEditorState.drawHeight;
        const overflow = Math.max(0, drawSize * planEditorState.zoom - stageSize);
        const limit = overflow / 2;

        if (!isFinite(limit) || limit <= 0) {
            return 0;
        }

        return Math.min(limit, Math.max(-limit, value));
    };

    const stopPlanEditorPanning = function () {
        if (!planEditorState.isPanning) {
            return;
        }

        planEditorState.isPanning = false;

        if (planEditorState.fabricCanvas && planEditorState.activeTool === 'hand') {
            planEditorState.fabricCanvas.defaultCursor = 'grab';
            planEditorState.fabricCanvas.hoverCursor = 'grab';
            planEditorState.fabricCanvas.moveCursor = 'grab';
        }

        if ($planEditorModal.hasClass('is-open')) {
            queueCurrentPlanSave(false);
        }
    };

    const clearEraserHoverState = function () {
        const hoveredObject = planEditorState.eraserHoverObject;

        if (!hoveredObject) {
            return;
        }

        if (Object.prototype.hasOwnProperty.call(hoveredObject, '__planEditorEraserOpacity')) {
            hoveredObject.set('opacity', hoveredObject.__planEditorEraserOpacity);
            delete hoveredObject.__planEditorEraserOpacity;
        }

        if (Object.prototype.hasOwnProperty.call(hoveredObject, '__planEditorEraserStroke')) {
            hoveredObject.set('stroke', hoveredObject.__planEditorEraserStroke);
            delete hoveredObject.__planEditorEraserStroke;
        }

        if (Object.prototype.hasOwnProperty.call(hoveredObject, '__planEditorEraserStrokeWidth')) {
            hoveredObject.set('strokeWidth', hoveredObject.__planEditorEraserStrokeWidth);
            delete hoveredObject.__planEditorEraserStrokeWidth;
        }

        if (Object.prototype.hasOwnProperty.call(hoveredObject, '__planEditorEraserStrokeDashArray')) {
            hoveredObject.set('strokeDashArray', hoveredObject.__planEditorEraserStrokeDashArray);
            delete hoveredObject.__planEditorEraserStrokeDashArray;
        }

        planEditorState.eraserHoverObject = null;

        if (planEditorState.fabricCanvas) {
            planEditorState.fabricCanvas.requestRenderAll();
        }
    };

    const setEraserHoverObject = function (object) {
        if (planEditorState.eraserHoverObject === object) {
            return;
        }

        clearEraserHoverState();

        if (!object) {
            return;
        }

        const currentOpacity = typeof object.opacity === 'number' ? object.opacity : 1;
        object.__planEditorEraserOpacity = currentOpacity;
        object.set('opacity', Math.max(0.2, currentOpacity * 0.45));

        object.__planEditorEraserStroke = object.stroke;
        object.__planEditorEraserStrokeWidth = object.strokeWidth;
        object.__planEditorEraserStrokeDashArray = Array.isArray(object.strokeDashArray)
            ? object.strokeDashArray.slice()
            : object.strokeDashArray;
        object.set({
            stroke: 'rgba(239, 170, 89, 1)',
            strokeWidth: Math.max(2, Number(object.strokeWidth) || 0),
            strokeDashArray: [8, 6]
        });

        planEditorState.eraserHoverObject = object;

        if (planEditorState.fabricCanvas) {
            planEditorState.fabricCanvas.requestRenderAll();
        }
    };

    const stopPlanEditorErasing = function () {
        clearEraserHoverState();

        if (!planEditorState.isErasing) {
            return;
        }

        planEditorState.isErasing = false;

        if (planEditorState.eraserHasChanges) {
            planEditorState.eraserHasChanges = false;

            if ($planEditorModal.hasClass('is-open')) {
                queueCurrentPlanSave(true);
            }
        }
    };

    const applyPlanEditorZoom = function () {
        if (!planEditorState.fabricCanvas || !planEditorState.fabricCanvas.wrapperEl) {
            return;
        }

        planEditorState.panX = clampPlanEditorPan(planEditorState.panX, 'x');
        planEditorState.panY = clampPlanEditorPan(planEditorState.panY, 'y');

        const viewportTranslateX = (planEditorState.drawWidth * (1 - planEditorState.zoom) / 2) + planEditorState.panX;
        const viewportTranslateY = (planEditorState.drawHeight * (1 - planEditorState.zoom) / 2) + planEditorState.panY;
        const zoomLabel = String(Math.round(planEditorState.zoom * 100)) + '%';

        $(planEditorState.fabricCanvas.wrapperEl).css({
            transform: 'translate(-50%, -50%)'
        });

        planEditorState.fabricCanvas.setViewportTransform([
            planEditorState.zoom,
            0,
            0,
            planEditorState.zoom,
            viewportTranslateX,
            viewportTranslateY
        ]);
        planEditorState.fabricCanvas.requestRenderAll();

        $planEditorZoomValue.text(zoomLabel);
        planEditorState.fabricCanvas.calcOffset();
    };

    const refreshPlanEditorBackgroundImage = function () {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        const sourceImage = planEditorState.baseImageElement;

        if (!sourceImage) {
            planEditorState.fabricCanvas.backgroundImage = null;
            planEditorState.fabricCanvas.requestRenderAll();
            return;
        }

        const naturalWidth = Math.max(1, sourceImage.naturalWidth || sourceImage.width || 1);
        const naturalHeight = Math.max(1, sourceImage.naturalHeight || sourceImage.height || 1);
        const drawWidth = Math.max(1, planEditorState.drawWidth || planEditorState.fabricCanvas.getWidth() || 1);
        const drawHeight = Math.max(1, planEditorState.drawHeight || planEditorState.fabricCanvas.getHeight() || 1);
        const backgroundImage = new fabric.Image(sourceImage, {
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
            selectable: false,
            evented: false
        });

        backgroundImage.scaleX = drawWidth / naturalWidth;
        backgroundImage.scaleY = drawHeight / naturalHeight;

        planEditorState.fabricCanvas.backgroundImage = backgroundImage;
        planEditorState.fabricCanvas.requestRenderAll();
    };

    const setPlanEditorZoom = function (value, anchorPoint, shouldPersist) {
        const currentZoom = planEditorState.zoom;
        const safeZoom = clampPlanEditorZoom(Math.round(value * 100) / 100);

        if (safeZoom === currentZoom) {
            return;
        }

        if (anchorPoint && typeof anchorPoint.x === 'number' && typeof anchorPoint.y === 'number' && currentZoom > 0) {
            const stageWidth = $planEditorStage.innerWidth();
            const stageHeight = $planEditorStage.innerHeight();
            const relativeX = anchorPoint.x - (stageWidth / 2);
            const relativeY = anchorPoint.y - (stageHeight / 2);
            const sceneX = (relativeX - planEditorState.panX) / currentZoom;
            const sceneY = (relativeY - planEditorState.panY) / currentZoom;

            planEditorState.panX = relativeX - (sceneX * safeZoom);
            planEditorState.panY = relativeY - (sceneY * safeZoom);
        }

        planEditorState.zoom = safeZoom;
        applyPlanEditorZoom();

        if (shouldPersist !== false && $planEditorModal.hasClass('is-open')) {
            queueCurrentPlanSave(false);
        }
    };

    const resetPlanEditorZoom = function (shouldPersist) {
        planEditorState.zoom = 1;
        planEditorState.panX = 0;
        planEditorState.panY = 0;
        applyPlanEditorZoom();

        if (shouldPersist !== false && $planEditorModal.hasClass('is-open')) {
            queueCurrentPlanSave(false);
        }
    };

    const fitPlanEditorStage = function () {
        if (!planEditorState.fabricCanvas || !planEditorState.imageNaturalWidth || !planEditorState.imageNaturalHeight) {
            return;
        }

        const stageWidth = $planEditorStage.innerWidth();
        const stageHeight = $planEditorStage.innerHeight();
        const scale = Math.min(stageWidth / planEditorState.imageNaturalWidth, stageHeight / planEditorState.imageNaturalHeight);
        const drawWidth = Math.max(1, Math.round(planEditorState.imageNaturalWidth * scale));
        const drawHeight = Math.max(1, Math.round(planEditorState.imageNaturalHeight * scale));
        planEditorState.drawWidth = drawWidth;
        planEditorState.drawHeight = drawHeight;

        planEditorState.fabricCanvas.setDimensions({
            width: drawWidth,
            height: drawHeight
        });
        $(planEditorState.fabricCanvas.wrapperEl).css({
            width: drawWidth + 'px',
            height: drawHeight + 'px'
        });
        refreshPlanEditorBackgroundImage();
        planEditorState.fabricCanvas.calcOffset();
        planEditorState.fabricCanvas.requestRenderAll();
        applyPlanEditorZoom();
    };

    const toPlainPoint = function (pointLike) {
        if (!pointLike || typeof pointLike.x !== 'number' || typeof pointLike.y !== 'number') {
            return null;
        }

        return {
            x: pointLike.x,
            y: pointLike.y
        };
    };

    const getPlanCanvasPointer = function (event) {
        if (!planEditorState.fabricCanvas || !event) {
            return null;
        }

        const eventPoint = toPlainPoint(event.scenePoint || event.pointer || event.absolutePointer);
        if (eventPoint) {
            return eventPoint;
        }

        const nativeEvent = event.e || event;
        if (!nativeEvent) {
            return null;
        }

        if (typeof planEditorState.fabricCanvas.getScenePoint === 'function') {
            const scenePoint = toPlainPoint(planEditorState.fabricCanvas.getScenePoint(nativeEvent));
            if (scenePoint) {
                return scenePoint;
            }
        }

        if (typeof planEditorState.fabricCanvas.getPointer === 'function') {
            return toPlainPoint(planEditorState.fabricCanvas.getPointer(nativeEvent));
        }

        return null;
    };

    const rectsIntersect = function (a, b) {
        if (!a || !b) {
            return false;
        }

        return a.left <= (b.left + b.width) &&
            (a.left + a.width) >= b.left &&
            a.top <= (b.top + b.height) &&
            (a.top + a.height) >= b.top;
    };

    const getObjectBounds = function (object) {
        if (!object) {
            return null;
        }

        if (typeof object.setCoords === 'function') {
            object.setCoords();
        }

        const coords = object.aCoords;

        if (!coords || !coords.tl || !coords.tr || !coords.br || !coords.bl) {
            return null;
        }

        const xs = [coords.tl.x, coords.tr.x, coords.br.x, coords.bl.x];
        const ys = [coords.tl.y, coords.tr.y, coords.br.y, coords.bl.y];
        const left = Math.min.apply(null, xs);
        const right = Math.max.apply(null, xs);
        const top = Math.min.apply(null, ys);
        const bottom = Math.max.apply(null, ys);

        return {
            left: left,
            top: top,
            width: Math.max(0, right - left),
            height: Math.max(0, bottom - top)
        };
    };

    const findPlanObjectAtPointer = function (pointer, radius) {
        if (!planEditorState.fabricCanvas || !pointer) {
            return null;
        }

        const safeRadius = Math.max(6, Number(radius) || 14);
        const probeRect = {
            left: pointer.x - safeRadius,
            top: pointer.y - safeRadius,
            width: safeRadius * 2,
            height: safeRadius * 2
        };
        const objects = planEditorState.fabricCanvas.getObjects();

        for (let index = objects.length - 1; index >= 0; index -= 1) {
            const object = objects[index];
            const bounds = getObjectBounds(object);

            if (!rectsIntersect(bounds, probeRect)) {
                continue;
            }

            return object;
        }

        return null;
    };

    const erasePlanObjectsAtPointer = function (pointer, radius) {
        if (!planEditorState.fabricCanvas || !pointer) {
            return false;
        }

        const targetObject = findPlanObjectAtPointer(pointer, radius);

        if (!targetObject) {
            return false;
        }

        if (planEditorState.eraserHoverObject === targetObject) {
            clearEraserHoverState();
        }

        planEditorState.fabricCanvas.remove(targetObject);
        planEditorState.fabricCanvas.discardActiveObject();
        planEditorState.fabricCanvas.requestRenderAll();

        return true;
    };

    const isPlanTextObject = function (object) {
        if (!object) {
            return false;
        }

        const type = String(object.type || '').toLowerCase();
        return type === 'i-text' || type === 'textbox';
    };

    const setPlanObjectsInteractivity = function (mode) {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        const normalizedMode = mode === 'all'
            ? 'all'
            : (mode === 'text' || mode === true ? 'text' : 'none');

        planEditorState.fabricCanvas.getObjects().forEach(function (object) {
            const interactive = normalizedMode === 'all' || (normalizedMode === 'text' && isPlanTextObject(object));
            object.selectable = interactive;
            object.evented = interactive;
            object.hasControls = interactive;
            object.hasBorders = interactive;
        });
    };

    const setPlanEditorTool = function (tool) {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        planEditorState.activeTool = tool;
        planEditorState.lineDraft = null;
        planEditorState.lineStart = null;
        stopPlanEditorPanning();
        stopPlanEditorErasing();
        clearEraserHoverState();
        planEditorState.fabricCanvas.skipTargetFind = false;

        $planEditorToolButtons.removeClass('is-active');
        $planEditorToolButtons.filter('[data-plan-tool="' + tool + '"]').addClass('is-active');

        if (tool === 'brush') {
            const brush = new fabric.PencilBrush(planEditorState.fabricCanvas);
            brush.width = 3;
            brush.color = 'rgba(30,30,30,1)';

            planEditorState.fabricCanvas.freeDrawingBrush = brush;
            planEditorState.fabricCanvas.isDrawingMode = true;
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'crosshair';
            planEditorState.fabricCanvas.hoverCursor = 'crosshair';
            planEditorState.fabricCanvas.moveCursor = 'crosshair';
            setPlanObjectsInteractivity('none');
            return;
        }

        if (tool === 'eraser') {
            planEditorState.fabricCanvas.isDrawingMode = false;
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'cell';
            planEditorState.fabricCanvas.hoverCursor = 'cell';
            planEditorState.fabricCanvas.moveCursor = 'cell';
            setPlanObjectsInteractivity('none');
            planEditorState.fabricCanvas.skipTargetFind = true;
            planEditorState.fabricCanvas.discardActiveObject();
            planEditorState.fabricCanvas.requestRenderAll();
            return;
        }

        if (tool === 'hand') {
            planEditorState.fabricCanvas.isDrawingMode = false;
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'grab';
            planEditorState.fabricCanvas.hoverCursor = 'grab';
            planEditorState.fabricCanvas.moveCursor = 'grab';
            setPlanObjectsInteractivity('none');
            planEditorState.fabricCanvas.skipTargetFind = true;
            planEditorState.fabricCanvas.discardActiveObject();
            planEditorState.fabricCanvas.requestRenderAll();
            return;
        }

        if (tool === 'select') {
            planEditorState.fabricCanvas.isDrawingMode = false;
            planEditorState.fabricCanvas.selection = true;
            planEditorState.fabricCanvas.defaultCursor = 'default';
            planEditorState.fabricCanvas.hoverCursor = 'move';
            planEditorState.fabricCanvas.moveCursor = 'move';
            setPlanObjectsInteractivity('all');
            planEditorState.fabricCanvas.skipTargetFind = false;
            return;
        }

        if (tool === 'text') {
            planEditorState.fabricCanvas.selection = true;
            planEditorState.fabricCanvas.defaultCursor = 'text';
            planEditorState.fabricCanvas.hoverCursor = 'text';
            planEditorState.fabricCanvas.moveCursor = 'text';
            setPlanObjectsInteractivity('text');
        } else {
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'crosshair';
            planEditorState.fabricCanvas.hoverCursor = 'crosshair';
            planEditorState.fabricCanvas.moveCursor = 'crosshair';
            setPlanObjectsInteractivity('none');
            planEditorState.fabricCanvas.skipTargetFind = true;
        }

        planEditorState.fabricCanvas.isDrawingMode = false;
    };

    const restorePlanSnapshot = function (planIndex) {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        const snapshot = getPlanSnapshot(planIndex);
        const objectsJson = snapshot && Array.isArray(snapshot.fabricObjectsJson) ? snapshot.fabricObjectsJson : [];

        $planEditorComment.val(snapshot && typeof snapshot.comment === 'string' ? snapshot.comment : '');

        planEditorState.zoom = clampPlanEditorZoom(Math.max(1, normalizeSnapshotZoom(snapshot && snapshot.zoom)));
        planEditorState.panX = parseNumberOr(snapshot && snapshot.panX, 0);
        planEditorState.panY = parseNumberOr(snapshot && snapshot.panY, 0);
        applyPlanEditorZoom();

        const restorePayload = {
            objects: objectsJson
        };
        const finalizeRestore = function () {
            refreshPlanEditorBackgroundImage();
            applyPlanEditorZoom();
            planEditorState.fabricCanvas.discardActiveObject();
            planEditorState.fabricCanvas.requestRenderAll();
        };

        try {
            const loadResult = planEditorState.fabricCanvas.loadFromJSON(restorePayload);

            if (loadResult && typeof loadResult.then === 'function') {
                loadResult
                    .then(function () {
                        finalizeRestore();
                    })
                    .catch(function (error) {
                        console.warn('[PlanEditor] Failed to restore plan snapshot', error);
                        clearPlanAnnotations(false);
                        refreshPlanEditorBackgroundImage();
                    });
                return;
            }

            finalizeRestore();
        } catch (error) {
            console.warn('[PlanEditor] Failed to restore plan snapshot', error);
            clearPlanAnnotations(false);
            refreshPlanEditorBackgroundImage();
        }
    };

    const ensurePlanEditorCanvas = function () {
        if (planEditorState.fabricCanvas) {
            return true;
        }

        if (!window.fabric || typeof fabric.Canvas !== 'function') {
            return false;
        }

        planEditorState.fabricCanvas = new fabric.Canvas($planEditorCanvas.get(0), {
            selection: false,
            preserveObjectStacking: true,
            enableRetinaScaling: false,
            backgroundVpt: true
        });

        $planEditorBaseImage.css({
            display: 'none'
        });

        planEditorState.fabricCanvas.on('path:created', function (event) {
            const path = event.path;
            path.globalCompositeOperation = 'source-over';

            path.selectable = false;
            path.evented = false;
            planEditorState.fabricCanvas.requestRenderAll();
            queueCurrentPlanSave(true);
        });

        planEditorState.fabricCanvas.on('mouse:down', function (event) {
            if (planEditorState.activeTool === 'hand') {
                if (!event || !event.e) {
                    return;
                }

                planEditorState.isPanning = true;
                planEditorState.panStartX = event.e.clientX;
                planEditorState.panStartY = event.e.clientY;
                planEditorState.panOriginX = planEditorState.panX;
                planEditorState.panOriginY = planEditorState.panY;
                planEditorState.fabricCanvas.defaultCursor = 'grabbing';
                planEditorState.fabricCanvas.hoverCursor = 'grabbing';
                planEditorState.fabricCanvas.moveCursor = 'grabbing';
                return;
            }

            if (planEditorState.activeTool === 'line') {
                const pointer = getPlanCanvasPointer(event);
                if (!pointer) {
                    return;
                }
                planEditorState.lineStart = pointer;
                planEditorState.lineDraft = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
                    stroke: 'rgba(30,30,30,1)',
                    strokeWidth: 2,
                    selectable: false,
                    evented: false
                });
                planEditorState.fabricCanvas.add(planEditorState.lineDraft);
                return;
            }

            if (planEditorState.activeTool === 'eraser') {
                const pointer = getPlanCanvasPointer(event);

                if (!pointer) {
                    return;
                }

                setEraserHoverObject(findPlanObjectAtPointer(pointer, 14));
                planEditorState.isErasing = true;
                if (erasePlanObjectsAtPointer(pointer, 14)) {
                    planEditorState.eraserHasChanges = true;
                }
                setEraserHoverObject(findPlanObjectAtPointer(pointer, 14));
                return;
            }

            if (planEditorState.activeTool === 'text' && !event.target) {
                const pointer = getPlanCanvasPointer(event);
                if (!pointer) {
                    return;
                }
                const textObject = new fabric.IText('Текст', {
                    left: pointer.x,
                    top: pointer.y,
                    fill: 'rgba(30,30,30,1)',
                    fontSize: 24,
                    selectable: true,
                    evented: true,
                    editable: true
                });
                planEditorState.fabricCanvas.add(textObject);
                planEditorState.fabricCanvas.setActiveObject(textObject);
                textObject.enterEditing();
                textObject.selectAll();
                planEditorState.fabricCanvas.requestRenderAll();
                queueCurrentPlanSave(true);
            }
        });

        planEditorState.fabricCanvas.on('mouse:move', function (event) {
            if (planEditorState.activeTool === 'hand' && planEditorState.isPanning) {
                if (!event || !event.e) {
                    return;
                }

                const deltaX = event.e.clientX - planEditorState.panStartX;
                const deltaY = event.e.clientY - planEditorState.panStartY;

                planEditorState.panX = planEditorState.panOriginX + deltaX;
                planEditorState.panY = planEditorState.panOriginY + deltaY;
                applyPlanEditorZoom();
                return;
            }

            if (planEditorState.activeTool !== 'line' || !planEditorState.lineDraft) {
                if (planEditorState.activeTool === 'eraser') {
                    const pointer = getPlanCanvasPointer(event);

                    if (!pointer) {
                        clearEraserHoverState();
                        return;
                    }

                    setEraserHoverObject(findPlanObjectAtPointer(pointer, 14));

                    if (planEditorState.isErasing) {
                        if (erasePlanObjectsAtPointer(pointer, 14)) {
                            planEditorState.eraserHasChanges = true;
                        }

                        setEraserHoverObject(findPlanObjectAtPointer(pointer, 14));
                    }
                }
                return;
            }

            const pointer = getPlanCanvasPointer(event);
            if (!pointer) {
                return;
            }
            planEditorState.lineDraft.set({
                x2: pointer.x,
                y2: pointer.y
            });
            planEditorState.fabricCanvas.requestRenderAll();
        });

        planEditorState.fabricCanvas.on('mouse:up', function () {
            if (planEditorState.activeTool === 'hand') {
                stopPlanEditorPanning();
                return;
            }

            if (planEditorState.activeTool === 'eraser') {
                stopPlanEditorErasing();
                return;
            }

            if (planEditorState.activeTool !== 'line' || !planEditorState.lineDraft) {
                return;
            }

            planEditorState.lineDraft = null;
            planEditorState.lineStart = null;
            queueCurrentPlanSave(true);
        });

        return true;
    };

    const loadPlanImage = function (planIndex, options) {
        if (!planEditorState.plans.length) {
            return;
        }

        const settings = options && typeof options === 'object' ? options : {};
        const safeIndex = Math.max(0, Math.min(planIndex, planEditorState.plans.length - 1));
        const plan = planEditorState.plans[safeIndex];
        const image = new Image();
        const requestId = planEditorState.imageLoadRequestId + 1;

        planEditorState.imageLoadRequestId = requestId;
        planEditorState.activeIndex = safeIndex;
        planEditorState.persistedState.activePlanIndex = safeIndex;
        $planEditorSelect.val(String(safeIndex));

        image.onload = function () {
            if (requestId !== planEditorState.imageLoadRequestId) {
                return;
            }

            planEditorState.imageNaturalWidth = image.naturalWidth || 1;
            planEditorState.imageNaturalHeight = image.naturalHeight || 1;
            planEditorState.baseImageElement = image;
            $planEditorBaseImage.attr('src', plan.imageSrc);
            fitPlanEditorStage();
            restorePlanSnapshot(safeIndex);

            if (settings.animate) {
                triggerPlanSwitchAnimation(settings.direction === 'prev' ? 'prev' : 'next');
            }
        };

        image.src = plan.imageSrc;
    };

    const closePlanEditor = function () {
        if (!$planEditorModal.hasClass('is-open')) {
            return;
        }

        queueCurrentPlanSave(true);

        $planEditorModal.removeClass('is-open').attr('aria-hidden', 'true');
        $body.removeClass('plan-editor-open');
        stopPlanEditorPanning();
        stopPlanEditorErasing();

        if (planEditorState.fabricCanvas) {
            planEditorState.fabricCanvas.isDrawingMode = false;
            planEditorState.fabricCanvas.discardActiveObject();
            planEditorState.fabricCanvas.requestRenderAll();
        }

        flushPersistState();
    };

    const openPlanEditor = function (partIndex) {
        collectPlanParts();
        prunePersistedPlansState();

        if (!planEditorState.plans.length) {
            return;
        }

        buildPlanSelect();

        if (!ensurePlanEditorCanvas()) {
            return;
        }

        const hasExplicitIndex = typeof partIndex === 'number' && isFinite(partIndex);
        const selectedPlanIndex = hasExplicitIndex
            ? planEditorState.plans.findIndex(function (plan) {
                return plan.index === partIndex;
            })
            : -1;
        const fallbackIndex = Math.max(0, Math.min(parseNumberOr(planEditorState.persistedState.activePlanIndex, 0), planEditorState.plans.length - 1));
        const targetIndex = selectedPlanIndex === -1 ? fallbackIndex : selectedPlanIndex;

        $planEditorModal.addClass('is-open').attr('aria-hidden', 'false');
        $body.addClass('plan-editor-open');
        setPlanEditorTool('brush');
        loadPlanImage(targetIndex, {
            animate: false
        });
    };

    const getCurrentEditedImageDataUrl = function () {
        if (!planEditorState.fabricCanvas) {
            return '';
        }

        const output = document.createElement('canvas');
        const outputWidth = planEditorState.fabricCanvas.getWidth();
        const outputHeight = planEditorState.fabricCanvas.getHeight();
        const outputContext = output.getContext('2d');

        if (!outputWidth || !outputHeight || !outputContext) {
            return '';
        }

        output.width = outputWidth;
        output.height = outputHeight;

        const baseImageElement = planEditorState.baseImageElement || $planEditorBaseImage.get(0);
        const hasFabricBackground = !!(planEditorState.fabricCanvas && planEditorState.fabricCanvas.backgroundImage);

        if (!hasFabricBackground && baseImageElement && baseImageElement.complete) {
            outputContext.drawImage(baseImageElement, 0, 0, outputWidth, outputHeight);
        }

        const currentViewport = Array.isArray(planEditorState.fabricCanvas.viewportTransform)
            ? planEditorState.fabricCanvas.viewportTransform.slice()
            : [1, 0, 0, 1, 0, 0];

        planEditorState.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        planEditorState.fabricCanvas.renderAll();
        outputContext.drawImage(planEditorState.fabricCanvas.lowerCanvasEl, 0, 0, outputWidth, outputHeight);
        planEditorState.fabricCanvas.setViewportTransform(currentViewport);
        planEditorState.fabricCanvas.renderAll();

        return output.toDataURL('image/png');
    };

    const getPlanEditorPayload = function () {
        const plan = planEditorState.plans[planEditorState.activeIndex] || {};

        queueCurrentPlanSave(true);

        return {
            planIndex: planEditorState.activeIndex,
            planTitle: plan.displayTitle || plan.title || 'План ' + (planEditorState.activeIndex + 1),
            sourceImage: plan.imageSrc || '',
            editedImageDataUrl: getCurrentEditedImageDataUrl(),
            comment: normalizeText($planEditorComment.val())
        };
    };

    const getAllPlansPayload = function () {
        queueCurrentPlanSave(true);
        return buildAllPlansPayload();
    };

    if ($planEditorModal.length && $planParts.length) {
        collectPlanParts();
        loadPersistedStateFromSession();
        prunePersistedPlansState();
        buildPlanSelect();

        $planParts.each(function (index) {
            const $part = $(this);

            $part.find('.plans__edit-button').on('click', function (event) {
                event.preventDefault();
                openPlanEditor(index);
            });
        });

        $planEditorOverlay.on('click', closePlanEditor);
        $planEditorClose.on('click', closePlanEditor);

        $planEditorSelect.on('change', function () {
            const selectedIndex = Number($(this).val());

            if (selectedIndex === planEditorState.activeIndex) {
                return;
            }

            const direction = selectedIndex > planEditorState.activeIndex ? 'next' : 'prev';
            queueCurrentPlanSave(true);
            loadPlanImage(selectedIndex, {
                animate: true,
                direction: direction
            });
        });

        $planEditorToolButtons.on('click', function () {
            const tool = $(this).data('plan-tool');
            setPlanEditorTool(tool);
        });

        $planEditorZoomControls.on('click', function () {
            const zoomAction = String($(this).data('plan-zoom') || '');

            if (zoomAction === 'in') {
                setPlanEditorZoom(planEditorState.zoom + planEditorState.zoomStep);
                return;
            }

            if (zoomAction === 'out') {
                setPlanEditorZoom(planEditorState.zoom - planEditorState.zoomStep);
                return;
            }

            if (zoomAction === 'reset') {
                resetPlanEditorZoom();
            }
        });

        $planEditorStage.on('wheel', function (event) {
            if (!$planEditorModal.hasClass('is-open')) {
                return;
            }

            const nativeEvent = event.originalEvent;
            if (!nativeEvent || typeof nativeEvent.deltaY !== 'number') {
                return;
            }

            event.preventDefault();
            const stageRect = $planEditorStage.get(0).getBoundingClientRect();
            const anchorPoint = {
                x: nativeEvent.clientX - stageRect.left,
                y: nativeEvent.clientY - stageRect.top
            };

            if (nativeEvent.deltaY < 0) {
                setPlanEditorZoom(planEditorState.zoom + planEditorState.zoomStep, anchorPoint);
                return;
            }

            setPlanEditorZoom(planEditorState.zoom - planEditorState.zoomStep, anchorPoint);
        });

        $planEditorClearButton.on('click', function () {
            clearPlanAnnotations(true);
        });

        $planEditorComment.on('input', function () {
            queueCurrentPlanSave(false);
        });

        $planEditorForm.on('submit', function (event) {
            event.preventDefault();
            queueCurrentPlanSave(true);

            if (window.tanyathemeFeedbackPopup && typeof window.tanyathemeFeedbackPopup.open === 'function') {
                closePlanEditor();
                window.tanyathemeFeedbackPopup.open({
                    source: 'plan-editor'
                });
            }
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape') {
                closePlanEditor();
            }
        });

        $(document).on('mouseup', function () {
            stopPlanEditorPanning();
            stopPlanEditorErasing();
        });

        $(window).on('resize', function () {
            if ($planEditorModal.hasClass('is-open')) {
                fitPlanEditorStage();
            }
        });

        $(window).on('beforeunload', function () {
            saveCurrentPlanState(true);
            flushPersistState();
            syncPlanEditorToLeadContext();
        });

        window.planEditorApi = {
            open: openPlanEditor,
            close: closePlanEditor,
            getPayload: getPlanEditorPayload,
            getAllPlansPayload: getAllPlansPayload
        };
    }
});

$(function () {
    const $archives = $('[data-project-archive]');

    if (!$archives.length) {
        return;
    }

    const globalConfig = window.tanyathemeProjectFilter && typeof window.tanyathemeProjectFilter === 'object'
        ? window.tanyathemeProjectFilter
        : {};
    const fallbackLeadConfig = window.tanyathemeLead && typeof window.tanyathemeLead === 'object'
        ? window.tanyathemeLead
        : {};
    const ajaxUrl = String(globalConfig.ajaxUrl || fallbackLeadConfig.ajaxUrl || '');
    const nonce = String(globalConfig.nonce || '');
    const allowedTypes = ['one', 'two', 'bany'];
    const ajaxReady = ajaxUrl !== '' && nonce !== '';

    const normalizeType = function (value) {
        const normalized = String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '');

        return allowedTypes.indexOf(normalized) >= 0 ? normalized : '';
    };

    const toRelativeUrl = function (url) {
        const parsedUrl = new URL(String(url || '/project/'), window.location.origin);

        if (parsedUrl.origin !== window.location.origin) {
            return parsedUrl.toString();
        }

        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    };

    const buildTypeUrl = function (baseUrl, typeSlug) {
        const parsedUrl = new URL(String(baseUrl || '/project/'), window.location.origin);

        parsedUrl.searchParams.delete('type');

        if (typeSlug) {
            parsedUrl.searchParams.set('type', typeSlug);
        }

        return toRelativeUrl(parsedUrl.toString());
    };

    const parseTypeFromCurrentUrl = function () {
        const parsedUrl = new URL(window.location.href);
        return normalizeType(parsedUrl.searchParams.get('type'));
    };

    $archives.each(function () {
        const $archive = $(this);
        const $grid = $archive.find('[data-project-grid]').first();
        const $filters = $archive.closest('.container').find('[data-project-filter]');
        const $loadMore = $archive.find('[data-project-load-more]').first();
        const archiveUrl = String($archive.attr('data-archive-url') || globalConfig.archiveUrl || '/project/');
        const initialTypeFromData = normalizeType($archive.attr('data-current-type'));
        const initialTypeFromUrl = parseTypeFromCurrentUrl();
        const state = {
            type: initialTypeFromUrl || initialTypeFromData,
            page: Math.max(1, parseInt(String($archive.attr('data-current-page') || '1'), 10) || 1),
            maxPages: Math.max(1, parseInt(String($archive.attr('data-max-pages') || '1'), 10) || 1),
            hasMore: false,
            loading: false
        };

        state.hasMore = state.page < state.maxPages;

        const updateFilterState = function () {
            $filters.each(function () {
                const $filter = $(this);
                const filterType = normalizeType($filter.attr('data-project-type'));
                const isActive = filterType !== '' && filterType === state.type;
                const href = isActive
                    ? buildTypeUrl(archiveUrl, '')
                    : buildTypeUrl(archiveUrl, filterType);

                $filter.toggleClass('is-active', isActive);
                $filter.attr('href', href);
            });
        };

        const updateLoadMoreState = function () {
            if (!$loadMore.length) {
                return;
            }

            const hasMore = !!state.hasMore;

            $loadMore.toggleClass('is-loading', state.loading);
            $loadMore.toggleClass('is-hidden', !hasMore);
            $loadMore.prop('disabled', state.loading || !hasMore);

            if (hasMore) {
                $loadMore.removeAttr('hidden');
            } else {
                $loadMore.attr('hidden', 'hidden');
            }
        };

        const updateHistory = function () {
            window.history.pushState(
                {
                    projectType: state.type
                },
                '',
                buildTypeUrl(archiveUrl, state.type)
            );
        };

        const loadProjects = function (nextType, nextPage, replaceMode, pushHistory) {
            if (!ajaxReady || state.loading || !$grid.length) {
                return;
            }

            state.loading = true;
            updateLoadMoreState();

            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: {
                    action: 'tanyatheme_filter_projects',
                    nonce: nonce,
                    type: nextType,
                    page: nextPage
                }
            }).done(function (response) {
                if (!response || !response.success || !response.data) {
                    return;
                }

                const payload = response.data;
                const html = typeof payload.html === 'string' ? payload.html : '';

                if (replaceMode) {
                    $grid.html(html);
                } else {
                    $grid.append(html);
                }

                state.type = normalizeType(payload.currentType);
                state.page = Math.max(1, parseInt(String(payload.currentPage || nextPage), 10) || 1);
                state.maxPages = Math.max(1, parseInt(String(payload.maxPages || state.page), 10) || state.page);
                state.hasMore = typeof payload.hasMore === 'boolean'
                    ? payload.hasMore
                    : state.page < state.maxPages;

                updateFilterState();
                updateLoadMoreState();

                if (pushHistory) {
                    updateHistory();
                }
            }).fail(function () {
                if (replaceMode) {
                    window.location.href = buildTypeUrl(archiveUrl, nextType);
                }
            }).always(function () {
                state.loading = false;
                updateLoadMoreState();
            });
        };

        updateFilterState();
        updateLoadMoreState();

        if (!ajaxReady) {
            if ($loadMore.length) {
                $loadMore.prop('hidden', true);
            }

            return;
        }

        $filters.on('click', function (event) {
            const selectedType = normalizeType($(this).attr('data-project-type'));

            if (selectedType === '') {
                return;
            }

            event.preventDefault();

            const nextType = state.type === selectedType ? '' : selectedType;
            loadProjects(nextType, 1, true, true);
        });

        if ($loadMore.length) {
            $loadMore.on('click', function (event) {
                event.preventDefault();

                if (state.loading || state.page >= state.maxPages) {
                    return;
                }

                loadProjects(state.type, state.page + 1, false, false);
            });
        }

        $(window).on('popstate', function () {
            const typeFromUrl = parseTypeFromCurrentUrl();
            loadProjects(typeFromUrl, 1, true, false);
        });
    });
});

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
