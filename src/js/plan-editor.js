$(function () {
    const STORAGE_KEY = 'planEditor:v1:' + String(window.location && window.location.pathname ? window.location.pathname : '/');
    const STORAGE_SAVE_DELAY = 250;

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
        imageNaturalWidth: 0,
        imageNaturalHeight: 0,
        drawWidth: 0,
        drawHeight: 0,
        zoom: 1,
        minZoom: 0.6,
        maxZoom: 3,
        zoomStep: 0.2,
        panX: 0,
        panY: 0,
        isPanning: false,
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

            planEditorState.persistedState = {
                activePlanIndex: parseNumberOr(parsedValue && parsedValue.activePlanIndex, 0),
                plansState: parsedPlansState && typeof parsedPlansState === 'object' ? parsedPlansState : {}
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
        const snapshot = ensurePlanSnapshot(planEditorState.activeIndex);

        if (!snapshot) {
            return;
        }

        if (withObjects !== false) {
            snapshot.fabricObjectsJson = getCanvasObjectsJson();
        }

        snapshot.comment = String($planEditorComment.val() || '');
        snapshot.zoom = clampPlanEditorZoom(parseNumberOr(planEditorState.zoom, 1));
        snapshot.panX = parseNumberOr(planEditorState.panX, 0);
        snapshot.panY = parseNumberOr(planEditorState.panY, 0);
        snapshot.updatedAt = Date.now();

        planEditorState.persistedState.activePlanIndex = planEditorState.activeIndex;
    };

    const queueCurrentPlanSave = function (withObjects) {
        saveCurrentPlanState(withObjects);
        schedulePersistState();
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

    const applyPlanEditorZoom = function () {
        if (!planEditorState.fabricCanvas || !planEditorState.fabricCanvas.wrapperEl) {
            return;
        }

        planEditorState.panX = clampPlanEditorPan(planEditorState.panX, 'x');
        planEditorState.panY = clampPlanEditorPan(planEditorState.panY, 'y');

        const transformValue = 'translate(-50%, -50%) translate(' + planEditorState.panX + 'px, ' + planEditorState.panY + 'px) scale(' + planEditorState.zoom + ')';
        const zoomLabel = String(Math.round(planEditorState.zoom * 100)) + '%';

        $(planEditorState.fabricCanvas.wrapperEl).css({
            transform: transformValue
        });

        $planEditorBaseImage.css({
            transform: transformValue
        });

        $planEditorZoomValue.text(zoomLabel);
        planEditorState.fabricCanvas.calcOffset();
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

        $planEditorBaseImage.css({
            width: drawWidth + 'px',
            height: drawHeight + 'px'
        });

        planEditorState.fabricCanvas.setDimensions({
            width: drawWidth,
            height: drawHeight
        });
        $(planEditorState.fabricCanvas.wrapperEl).css({
            width: drawWidth + 'px',
            height: drawHeight + 'px'
        });
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

    const setPlanEditorTool = function (tool) {
        if (!planEditorState.fabricCanvas) {
            return;
        }

        planEditorState.activeTool = tool;
        planEditorState.lineDraft = null;
        planEditorState.lineStart = null;
        stopPlanEditorPanning();

        $planEditorToolButtons.removeClass('is-active');
        $planEditorToolButtons.filter('[data-plan-tool="' + tool + '"]').addClass('is-active');

        if (tool === 'brush' || tool === 'eraser') {
            const brush = new fabric.PencilBrush(planEditorState.fabricCanvas);
            brush.width = tool === 'eraser' ? 22 : 3;
            brush.color = tool === 'eraser' ? 'rgba(0,0,0,1)' : 'rgba(30,30,30,1)';

            planEditorState.fabricCanvas.freeDrawingBrush = brush;
            planEditorState.fabricCanvas.isDrawingMode = true;
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'crosshair';
            planEditorState.fabricCanvas.hoverCursor = 'crosshair';
            planEditorState.fabricCanvas.moveCursor = 'crosshair';
            return;
        }

        if (tool === 'hand') {
            planEditorState.fabricCanvas.isDrawingMode = false;
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'grab';
            planEditorState.fabricCanvas.hoverCursor = 'grab';
            planEditorState.fabricCanvas.moveCursor = 'grab';
            return;
        }

        if (tool === 'text') {
            planEditorState.fabricCanvas.selection = true;
            planEditorState.fabricCanvas.defaultCursor = 'text';
            planEditorState.fabricCanvas.hoverCursor = 'text';
            planEditorState.fabricCanvas.moveCursor = 'text';
        } else {
            planEditorState.fabricCanvas.selection = false;
            planEditorState.fabricCanvas.defaultCursor = 'crosshair';
            planEditorState.fabricCanvas.hoverCursor = 'crosshair';
            planEditorState.fabricCanvas.moveCursor = 'crosshair';
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

        planEditorState.zoom = clampPlanEditorZoom(parseNumberOr(snapshot && snapshot.zoom, 1));
        planEditorState.panX = parseNumberOr(snapshot && snapshot.panX, 0);
        planEditorState.panY = parseNumberOr(snapshot && snapshot.panY, 0);
        applyPlanEditorZoom();

        const restorePayload = {
            objects: objectsJson
        };

        try {
            const loadResult = planEditorState.fabricCanvas.loadFromJSON(restorePayload);

            if (loadResult && typeof loadResult.then === 'function') {
                loadResult
                    .then(function () {
                        planEditorState.fabricCanvas.discardActiveObject();
                        planEditorState.fabricCanvas.requestRenderAll();
                    })
                    .catch(function (error) {
                        console.warn('[PlanEditor] Failed to restore plan snapshot', error);
                        clearPlanAnnotations(false);
                    });
                return;
            }

            planEditorState.fabricCanvas.discardActiveObject();
            planEditorState.fabricCanvas.requestRenderAll();
        } catch (error) {
            console.warn('[PlanEditor] Failed to restore plan snapshot', error);
            clearPlanAnnotations(false);
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
            preserveObjectStacking: true
        });

        planEditorState.fabricCanvas.on('path:created', function (event) {
            const path = event.path;

            if (planEditorState.activeTool === 'eraser') {
                path.globalCompositeOperation = 'destination-out';
            } else {
                path.globalCompositeOperation = 'source-over';
            }

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

        const baseImageElement = $planEditorBaseImage.get(0);

        if (baseImageElement && baseImageElement.complete) {
            outputContext.drawImage(baseImageElement, 0, 0, outputWidth, outputHeight);
        }

        outputContext.drawImage(planEditorState.fabricCanvas.lowerCanvasEl, 0, 0, outputWidth, outputHeight);
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

        const plans = planEditorState.plans.map(function (plan, index) {
            const snapshot = planEditorState.persistedState.plansState[plan.planKey] || {};
            const hasObjects = Array.isArray(snapshot.fabricObjectsJson) && snapshot.fabricObjectsJson.length > 0;

            return {
                planIndex: index,
                planKey: plan.planKey,
                planTitle: plan.displayTitle || plan.title || 'План ' + (index + 1),
                sourceImage: plan.imageSrc || '',
                comment: typeof snapshot.comment === 'string' ? snapshot.comment : '',
                zoom: clampPlanEditorZoom(parseNumberOr(snapshot.zoom, 1)),
                panX: parseNumberOr(snapshot.panX, 0),
                panY: parseNumberOr(snapshot.panY, 0),
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
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape') {
                closePlanEditor();
            }
        });

        $(document).on('mouseup', function () {
            stopPlanEditorPanning();
        });

        $(window).on('resize', function () {
            if ($planEditorModal.hasClass('is-open')) {
                fitPlanEditorStage();
            }
        });

        $(window).on('beforeunload', function () {
            saveCurrentPlanState(true);
            flushPersistState();
        });

        window.planEditorApi = {
            open: openPlanEditor,
            close: closePlanEditor,
            getPayload: getPlanEditorPayload,
            getAllPlansPayload: getAllPlansPayload
        };
    }
});
