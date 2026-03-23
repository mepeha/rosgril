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
