<?php

if (!defined('ABSPATH')) {
    exit;
}

function tanyatheme_normalize_phone(string $raw_phone): string
{
    $digits = preg_replace('/\D+/', '', $raw_phone);
    $digits = is_string($digits) ? $digits : '';

    if (strlen($digits) === 11 && $digits[0] === '8') {
        $digits = '7' . substr($digits, 1);
    }

    return $digits;
}

function tanyatheme_is_valid_phone(string $raw_phone): bool
{
    $normalized_phone = tanyatheme_normalize_phone($raw_phone);

    if (strlen($normalized_phone) !== 11) {
        return false;
    }

    return $normalized_phone[0] === '7';
}

function tanyatheme_get_acf_text_option_field(string $field_name): string
{
    if (!function_exists('get_field')) {
        return '';
    }

    $contexts = ['options_userfield', 'userfield', 'options', 'option'];
    $field_names = array_values(array_unique(array_filter([
        $field_name,
        str_replace('-', '_', $field_name),
    ])));

    foreach ($contexts as $context) {
        foreach ($field_names as $name_candidate) {
            $raw_value = get_field($name_candidate, $context);

            if (!is_scalar($raw_value)) {
                continue;
            }

            $value = trim((string) $raw_value);
            if ($value !== '') {
                return $value;
            }
        }
    }

    $option_keys = array_values(array_unique(array_filter([
        'options_' . $field_name,
        'options_' . str_replace('-', '_', $field_name),
    ])));

    foreach ($option_keys as $option_key) {
        $raw_option = get_option($option_key);
        if (!is_scalar($raw_option)) {
            continue;
        }

        $value = trim((string) $raw_option);
        if ($value !== '') {
            return $value;
        }
    }

    return '';
}

function tanyatheme_get_recaptcha_settings(): array
{
    static $settings_cache = null;

    if (is_array($settings_cache)) {
        return $settings_cache;
    }

    $public_key = tanyatheme_get_acf_text_option_field('public-key');
    $secret_key = tanyatheme_get_acf_text_option_field('secret-key');
    $is_enabled = $public_key !== '' && $secret_key !== '';

    $settings_cache = [
        'public_key' => $public_key,
        'secret_key' => $secret_key,
        'enabled'    => $is_enabled,
    ];

    return $settings_cache;
}

function tanyatheme_validate_recaptcha_token(string $captcha_token): array
{
    $settings = tanyatheme_get_recaptcha_settings();

    if (empty($settings['enabled']) || empty($settings['secret_key'])) {
        return [
            'ok'      => false,
            'code'    => 'captcha_not_configured',
            'message' => 'Капча не настроена на сайте. Проверьте ключи в админке.',
        ];
    }

    $token = trim($captcha_token);

    if ($token === '') {
        return [
            'ok'      => false,
            'code'    => 'captcha_missing',
            'message' => 'Подтвердите капчу перед отправкой формы.',
        ];
    }

    $request_body = [
        'secret'   => (string) $settings['secret_key'],
        'response' => $token,
    ];

    if (!empty($_SERVER['REMOTE_ADDR'])) {
        $request_body['remoteip'] = sanitize_text_field(wp_unslash((string) $_SERVER['REMOTE_ADDR']));
    }

    $response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
        'timeout' => 12,
        'body'    => $request_body,
    ]);

    if (is_wp_error($response)) {
        return [
            'ok'      => false,
            'code'    => 'captcha_verify_unavailable',
            'message' => 'Не удалось проверить капчу. Попробуйте еще раз.',
        ];
    }

    $status_code = (int) wp_remote_retrieve_response_code($response);

    if ($status_code < 200 || $status_code >= 300) {
        return [
            'ok'      => false,
            'code'    => 'captcha_verify_failed',
            'message' => 'Проверка капчи завершилась ошибкой. Попробуйте еще раз.',
        ];
    }

    $response_body = wp_remote_retrieve_body($response);
    $payload = json_decode((string) $response_body, true);

    if (!is_array($payload)) {
        return [
            'ok'      => false,
            'code'    => 'captcha_invalid_response',
            'message' => 'Не удалось обработать ответ капчи. Попробуйте еще раз.',
        ];
    }

    if (!empty($payload['success'])) {
        return [
            'ok' => true,
        ];
    }

    return [
        'ok'      => false,
        'code'    => 'captcha_invalid',
        'message' => 'Капча не пройдена. Повторите проверку.',
    ];
}

function tanyatheme_create_named_attachment_copy(string $tmp_file, string $source_file_name): ?string
{
    $safe_file_name = sanitize_file_name($source_file_name);

    if ($safe_file_name === '') {
        $safe_file_name = 'attachment-' . time() . '.jpg';
    }

    $upload_dir = wp_upload_dir();
    $upload_base_dir = isset($upload_dir['basedir']) ? (string) $upload_dir['basedir'] : '';
    $target_base_dir = $upload_base_dir !== '' ? $upload_base_dir : sys_get_temp_dir();
    $target_dir = trailingslashit($target_base_dir) . 'tanyatheme-mail-attachments';

    if (!wp_mkdir_p($target_dir)) {
        return null;
    }

    $target_file_name = wp_unique_filename($target_dir, $safe_file_name);
    $target_path = trailingslashit($target_dir) . $target_file_name;

    if (!@copy($tmp_file, $target_path)) {
        return null;
    }

    return $target_path;
}

function tanyatheme_collect_upload_attachments(array $files): array
{
    $result = [
        'attachments' => [],
        'cleanup' => [],
    ];

    if (!isset($files['attachments'])) {
        return $result;
    }

    $names = $files['attachments']['name'] ?? null;
    $tmp_names = $files['attachments']['tmp_name'] ?? null;
    $errors = $files['attachments']['error'] ?? null;

    if (!is_array($names) || !is_array($tmp_names) || !is_array($errors)) {
        return $result;
    }

    $count = count($tmp_names);

    for ($index = 0; $index < $count; $index++) {
        $tmp_file = isset($tmp_names[$index]) ? (string) $tmp_names[$index] : '';
        $error_code = isset($errors[$index]) ? (int) $errors[$index] : UPLOAD_ERR_NO_FILE;
        $file_name = isset($names[$index]) ? sanitize_file_name((string) $names[$index]) : '';

        if ($error_code !== UPLOAD_ERR_OK || $tmp_file === '' || !is_uploaded_file($tmp_file)) {
            continue;
        }

        $file_info = wp_check_filetype_and_ext($tmp_file, $file_name);
        $mime_type = isset($file_info['type']) ? (string) $file_info['type'] : '';
        $file_ext = isset($file_info['ext']) ? (string) $file_info['ext'] : '';

        if ($mime_type === '' && function_exists('wp_get_image_mime')) {
            $mime_type = (string) wp_get_image_mime($tmp_file);
        }

        $allowed_mime_types = ['image/png', 'image/jpeg'];
        $allowed_extensions = ['png', 'jpg', 'jpeg'];
        $is_allowed = in_array($mime_type, $allowed_mime_types, true) || in_array(strtolower($file_ext), $allowed_extensions, true);

        if (!$is_allowed) {
            continue;
        }

        $named_copy_path = tanyatheme_create_named_attachment_copy($tmp_file, $file_name);

        if (is_string($named_copy_path) && $named_copy_path !== '') {
            $result['attachments'][] = $named_copy_path;
            $result['cleanup'][] = $named_copy_path;
            continue;
        }

        $result['attachments'][] = $tmp_file;
    }

    return $result;
}

function tanyatheme_mail_block(string $title, string $content): string
{
    if ($content === '') {
        return '';
    }

    return sprintf(
        '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;border-collapse:collapse;"><tr><td style="background:rgb(27, 27, 27);color:#ffffff;padding:20px;"><div style="font-size:20px;line-height:1.3;font-weight:700;margin:0 0 12px 0;">%s</div><div style="font-size:15px;line-height:1.5;color:#ffffff;">%s</div></td></tr></table>',
        esc_html($title),
        $content
    );
}

function tanyatheme_build_mail_source_content(array $form_meta): string
{
    $form_source = isset($form_meta['source']) ? sanitize_text_field((string) $form_meta['source']) : '';
    $form_page = isset($form_meta['page']) ? sanitize_text_field((string) $form_meta['page']) : '';
    $form_url = isset($form_meta['url']) ? esc_url_raw((string) $form_meta['url']) : '';

    if ($form_source === '' && $form_page === '' && $form_url === '') {
        return '';
    }

    $rows = [];
    $rows[] = '<div><strong>Тип:</strong> ' . esc_html($form_source !== '' ? $form_source : '—') . '</div>';
    $rows[] = '<div><strong>Страница:</strong> ' . esc_html($form_page !== '' ? $form_page : '—') . '</div>';
    $rows[] = '<div><strong>URL:</strong> ' . ($form_url !== '' ? '<a href="' . esc_url($form_url) . '" style="color:#ffffff;text-decoration:underline;">' . esc_html($form_url) . '</a>' : '—') . '</div>';

    return implode('', $rows);
}

function tanyatheme_build_mail_contact_content(string $name, string $normalized_phone, string $message): string
{
    if ($name === '' && $normalized_phone === '' && $message === '') {
        return '';
    }

    $rows = [];
    $rows[] = '<div><strong>Имя:</strong> ' . esc_html($name !== '' ? $name : '—') . '</div>';
    $rows[] = '<div><strong>Телефон:</strong> ' . esc_html($normalized_phone !== '' ? $normalized_phone : '—') . '</div>';
    $rows[] = '<div><strong>Сообщение:</strong> ' . esc_html($message !== '' ? $message : '—') . '</div>';

    return implode('', $rows);
}

function tanyatheme_build_mail_calculator_content(array $projects): string
{
    $items = [];

    foreach ($projects as $project_index => $project) {
        if (!is_array($project)) {
            continue;
        }

        $project_meta = isset($project['projectMeta']) && is_array($project['projectMeta']) ? $project['projectMeta'] : [];
        $project_title = isset($project_meta['title']) ? sanitize_text_field((string) $project_meta['title']) : '';
        $project_id = isset($project_meta['id']) ? sanitize_text_field((string) $project_meta['id']) : '';
        $project_path = isset($project_meta['path']) ? sanitize_text_field((string) $project_meta['path']) : '';
        $calculator = isset($project['calculator']) && is_array($project['calculator']) ? $project['calculator'] : [];
        $totals = isset($calculator['totals']) && is_array($calculator['totals']) ? $calculator['totals'] : [];
        $selected_options = isset($calculator['selectedOptions']) && is_array($calculator['selectedOptions']) ? $calculator['selectedOptions'] : [];

        if (empty($calculator) && empty($totals) && empty($selected_options)) {
            continue;
        }

        $option_lines = [];
        foreach ($selected_options as $selected_option) {
            if (!is_array($selected_option)) {
                continue;
            }

            $group_title = sanitize_text_field((string) ($selected_option['groupTitle'] ?? ''));
            $option_title = sanitize_text_field((string) ($selected_option['optionTitle'] ?? ''));
            $option_price = sanitize_text_field((string) ($selected_option['priceFormatted'] ?? '0 ₽'));
            $option_lines[] = '<li>' . esc_html(($group_title !== '' ? $group_title : 'Группа') . ': ' . ($option_title !== '' ? $option_title : 'Пункт') . ' (' . $option_price . ')') . '</li>';
        }

        $project_title_safe = $project_title !== '' ? $project_title : ('Проект ' . ($project_index + 1));
        $project_heading = '<div style="font-weight:700;margin:14px 0 6px 0;">' . esc_html($project_title_safe) . '</div>';
        $project_meta_line = '<div style="margin:0 0 8px 0;color:#d8d8d8;">ID: ' . esc_html($project_id !== '' ? $project_id : '—') . ' | Путь: ' . esc_html($project_path !== '' ? $project_path : '—') . '</div>';
        $totals_html = '<div><strong>База:</strong> ' . esc_html(sanitize_text_field((string) ($totals['baseFormatted'] ?? '—'))) . '</div>'
            . '<div><strong>Изменения:</strong> ' . esc_html(sanitize_text_field((string) ($totals['changesFormatted'] ?? '—'))) . '</div>'
            . '<div><strong>Итог:</strong> ' . esc_html(sanitize_text_field((string) ($totals['totalFormatted'] ?? '—'))) . '</div>';
        $selected_html = !empty($option_lines)
            ? '<div style="margin:8px 0 0 0;"><strong>Выбрано:</strong><ul style="margin:8px 0 0 18px;padding:0;">' . implode('', $option_lines) . '</ul></div>'
            : '';

        $items[] = $project_heading . $project_meta_line . $totals_html . $selected_html;
    }

    return implode('', $items);
}

function tanyatheme_build_mail_plan_editor_content(array $projects, array $warnings): string
{
    $items = [];

    foreach ($projects as $project_index => $project) {
        if (!is_array($project)) {
            continue;
        }

        $project_meta = isset($project['projectMeta']) && is_array($project['projectMeta']) ? $project['projectMeta'] : [];
        $project_title = isset($project_meta['title']) ? sanitize_text_field((string) $project_meta['title']) : '';
        $project_id = isset($project_meta['id']) ? sanitize_text_field((string) $project_meta['id']) : '';
        $project_path = isset($project_meta['path']) ? sanitize_text_field((string) $project_meta['path']) : '';
        $plan_editor = isset($project['planEditor']) && is_array($project['planEditor']) ? $project['planEditor'] : [];
        $plans = isset($plan_editor['plans']) && is_array($plan_editor['plans']) ? $plan_editor['plans'] : [];

        if (empty($plans)) {
            continue;
        }

        $plan_lines = [];
        foreach ($plans as $plan_index => $plan) {
            if (!is_array($plan)) {
                continue;
            }

            $plan_title = sanitize_text_field((string) ($plan['planTitle'] ?? 'План ' . ($plan_index + 1)));
            $plan_comment = sanitize_text_field((string) ($plan['comment'] ?? ''));
            $has_edits = !empty($plan['hasEdits']);

            if (!$has_edits && $plan_comment === '') {
                continue;
            }

            $plan_lines[] = '<li>'
                . esc_html($plan_title)
                . ' | правки: '
                . esc_html($has_edits ? 'да' : 'нет')
                . ' | комментарий: '
                . esc_html($plan_comment !== '' ? $plan_comment : '—')
                . '</li>';
        }

        if (empty($plan_lines)) {
            continue;
        }

        $project_title_safe = $project_title !== '' ? $project_title : ('Проект ' . ($project_index + 1));
        $items[] =
            '<div style="font-weight:700;margin:14px 0 6px 0;">' . esc_html($project_title_safe) . '</div>'
            . '<div style="margin:0 0 8px 0;color:#d8d8d8;">ID: ' . esc_html($project_id !== '' ? $project_id : '—') . ' | Путь: ' . esc_html($project_path !== '' ? $project_path : '—') . '</div>'
            . '<ul style="margin:0 0 0 18px;padding:0;">' . implode('', $plan_lines) . '</ul>';
    }

    if (!empty($warnings)) {
        $warnings_lines = [];
        foreach ($warnings as $warning) {
            $warning_text = sanitize_text_field((string) $warning);
            if ($warning_text !== '') {
                $warnings_lines[] = '<li>' . esc_html($warning_text) . '</li>';
            }
        }

        if (!empty($warnings_lines)) {
            $items[] = '<div style="font-weight:700;margin:14px 0 6px 0;">Предупреждения</div><ul style="margin:0 0 0 18px;padding:0;">' . implode('', $warnings_lines) . '</ul>';
        }
    }

    return implode('', $items);
}

function tanyatheme_build_mail_html(array $blocks): string
{
    $safe_blocks = array_values(array_filter($blocks, static function ($block) {
        return is_string($block) && $block !== '';
    }));

    return '<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:24px;background:#f1f1f1;color:#111111;font-family:Arial,Helvetica,sans-serif;"><div style="max-width:760px;margin:0 auto;"><div style="font-size:24px;line-height:1.3;font-weight:700;color:#111111;margin:0 0 18px 0;">Новая заявка с сайта</div>' . implode('', $safe_blocks) . '</div></body></html>';
}

function tanyatheme_handle_send_lead(): void
{
    if (!check_ajax_referer('tanyatheme_send_lead', 'nonce', false)) {
        wp_send_json_error([
            'message' => 'Проверка безопасности не пройдена.',
        ], 403);
    }

    $name = isset($_POST['name']) ? sanitize_text_field(wp_unslash((string) $_POST['name'])) : '';
    $phone = isset($_POST['phone']) ? sanitize_text_field(wp_unslash((string) $_POST['phone'])) : '';
    $message = isset($_POST['message']) ? sanitize_textarea_field(wp_unslash((string) $_POST['message'])) : '';
    $captcha_token = isset($_POST['captchaToken']) ? sanitize_text_field(wp_unslash((string) $_POST['captchaToken'])) : '';
    $form_meta_raw = isset($_POST['formMeta']) ? wp_unslash((string) $_POST['formMeta']) : '';
    $projects_context_raw = isset($_POST['projectsContext']) ? wp_unslash((string) $_POST['projectsContext']) : '';
    $warnings_raw = isset($_POST['contextWarnings']) ? wp_unslash((string) $_POST['contextWarnings']) : '';

    $captcha_validation = tanyatheme_validate_recaptcha_token($captcha_token);

    if (empty($captcha_validation['ok'])) {
        wp_send_json_error([
            'message' => isset($captcha_validation['message']) ? (string) $captcha_validation['message'] : 'Капча не пройдена.',
            'field'   => 'captcha',
            'code'    => isset($captcha_validation['code']) ? (string) $captcha_validation['code'] : 'captcha_invalid',
        ], 422);
    }

    if (!tanyatheme_is_valid_phone($phone)) {
        wp_send_json_error([
            'message' => 'Укажите корректный номер телефона.',
            'field' => 'phone',
        ], 422);
    }

    $normalized_phone = tanyatheme_normalize_phone($phone);

    $form_meta = json_decode($form_meta_raw, true);
    if (!is_array($form_meta)) {
        $form_meta = [];
    }

    $projects_context = json_decode($projects_context_raw, true);
    if (!is_array($projects_context)) {
        $projects_context = [];
    }

    $warnings = json_decode($warnings_raw, true);
    if (!is_array($warnings)) {
        $warnings = [];
    }

    $projects = isset($projects_context['projects']) && is_array($projects_context['projects'])
        ? $projects_context['projects']
        : [];
    $project_keys = isset($projects_context['projectKeys']) && is_array($projects_context['projectKeys'])
        ? array_values(array_filter(array_map('sanitize_text_field', $projects_context['projectKeys'])))
        : [];

    $mail_recipient = sanitize_email((string) get_option('admin_email'));
    if ($mail_recipient === '') {
        wp_send_json_error([
            'message' => 'Не настроен email получателя в WordPress.',
        ], 500);
    }

    $attachments_payload = tanyatheme_collect_upload_attachments($_FILES);
    $attachments = isset($attachments_payload['attachments']) && is_array($attachments_payload['attachments'])
        ? $attachments_payload['attachments']
        : [];
    $attachments_cleanup = isset($attachments_payload['cleanup']) && is_array($attachments_payload['cleanup'])
        ? $attachments_payload['cleanup']
        : [];
    $source_content = tanyatheme_build_mail_source_content($form_meta);
    $contact_content = tanyatheme_build_mail_contact_content($name, $normalized_phone, $message);
    $calculator_content = tanyatheme_build_mail_calculator_content($projects);
    $plan_editor_content = tanyatheme_build_mail_plan_editor_content($projects, $warnings);

    $mail_blocks = [
        tanyatheme_mail_block('Источник формы', $source_content),
        tanyatheme_mail_block('Контактные данные', $contact_content),
        tanyatheme_mail_block('Данные клиента в калькуляторе', $calculator_content),
        tanyatheme_mail_block('Изменение планировок в проектах', $plan_editor_content),
    ];
    $mail_body = tanyatheme_build_mail_html($mail_blocks);

    $mail_subject = sprintf(
        'Заявка с сайта%s',
        $name !== '' ? ' от ' . $name : ''
    );
    $mail_headers = [
        'Content-Type: text/html; charset=UTF-8',
    ];

    $mail_sent = wp_mail($mail_recipient, $mail_subject, $mail_body, $mail_headers, $attachments);

    foreach ($attachments_cleanup as $attachment_path) {
        if (is_string($attachment_path) && file_exists($attachment_path)) {
            @unlink($attachment_path);
        }
    }

    if (!$mail_sent) {
        wp_send_json_error([
            'message' => 'Не удалось отправить письмо. Попробуйте еще раз.',
        ], 500);
    }

    wp_send_json_success([
        'message' => 'Заявка успешно отправлена.',
        'sentProjectKeys' => $project_keys,
    ]);
}

add_action('wp_ajax_tanyatheme_send_lead', 'tanyatheme_handle_send_lead');
add_action('wp_ajax_nopriv_tanyatheme_send_lead', 'tanyatheme_handle_send_lead');
