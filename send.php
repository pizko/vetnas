<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'bad_json'], JSON_UNESCAPED_UNICODE);
    exit;
}

$to = 'vetnasvyaz@mail.ru';
$page = trim((string)($data['page'] ?? ''));
$title = trim((string)($data['title'] ?? ''));
$form = trim((string)($data['form'] ?? 'Форма сайта'));
$fields = $data['fields'] ?? [];

if (!is_array($fields)) {
    $fields = [];
}

$lines = [
    'Новая заявка с сайта vetnasvyaz.ru',
    '',
    'Форма: ' . ($form !== '' ? $form : 'Форма сайта'),
    'Страница: ' . ($title !== '' ? $title : 'не указана'),
    'URL: ' . ($page !== '' ? $page : 'не указан'),
    '',
    'Данные:',
];

$hasContact = false;
foreach ($fields as $name => $value) {
    $name = trim(strip_tags((string)$name));
    $value = trim(strip_tags((string)$value));

    if ($name === '' || $value === '') {
        continue;
    }

    if (preg_match('/тел|phone|номер/i', $name . ' ' . $value)) {
        $hasContact = true;
    }

    $lines[] = $name . ': ' . $value;
}

if (!$hasContact) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'phone_required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$message = implode("\n", $lines);
$subject = 'Заявка с сайта vetnasvyaz.ru';
$host = $_SERVER['HTTP_HOST'] ?? 'vetnasvyaz.ru';
$from = 'no-reply@' . preg_replace('/[^a-z0-9.-]/i', '', $host);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Ветеринар на связи <' . $from . '>',
    'Reply-To: ' . $to,
];

$sent = mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
