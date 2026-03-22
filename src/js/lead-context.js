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
