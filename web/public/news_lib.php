<?php
declare(strict_types=1);

date_default_timezone_set('Europe/Moscow');

function news_csv_path(): string
{
    $candidates = [
        __DIR__ . '/news_content.csv',
        __DIR__ . '/news_content_template.csv',
    ];
    foreach ($candidates as $path) {
        if (is_file($path)) {
            return $path;
        }
    }
    return $candidates[0];
}

function parse_publish_at(?string $value): ?DateTimeImmutable
{
    $value = trim((string)$value);
    if ($value === '') {
        return null;
    }

    $timezone = new DateTimeZone('Europe/Moscow');
    $formats = [
        'Y-m-d H:i:s',
        'Y-m-d H:i',
        'd.m.Y H:i:s',
        'd.m.Y H:i',
        'Y-m-d',
        'd.m.Y',
    ];

    foreach ($formats as $format) {
        $dt = DateTimeImmutable::createFromFormat($format, $value, $timezone);
        if ($dt instanceof DateTimeImmutable) {
            return $dt;
        }
    }

    try {
        return new DateTimeImmutable($value, $timezone);
    } catch (Throwable $e) {
        return null;
    }
}

function csv_rows(string $path): array
{
    if (!is_file($path)) {
        return [];
    }

    $handle = fopen($path, 'rb');
    if ($handle === false) {
        return [];
    }

    $rows = [];
    $headers = null;

    while (($row = fgetcsv($handle, 0, ';')) !== false) {
        if ($row === [null] || $row === false) {
            continue;
        }

        if ($headers === null) {
            $headers = array_map(static fn($h) => trim((string)$h), $row);
            if (isset($headers[0])) {
                $headers[0] = preg_replace('/^\xEF\xBB\xBF/', '', $headers[0]); // strip UTF-8 BOM
            }
            continue;
        }

        $assoc = [];
        foreach ($headers as $index => $header) {
            $assoc[$header] = isset($row[$index]) ? trim((string)$row[$index]) : '';
        }
        $rows[] = $assoc;
    }

    fclose($handle);
    return $rows;
}

function normalize_status(?string $status): string
{
    $status = mb_strtolower(trim((string)$status));
    if ($status === '') {
        return 'published';
    }
    return $status;
}

function build_url(array $item): string
{
    $url = trim((string)($item['url'] ?? ''));
    if ($url !== '') {
        return $url;
    }

    $slug = trim((string)($item['slug'] ?? ''));
    if ($slug === '') {
        return 'article.php';
    }

    return 'article.php?slug=' . rawurlencode($slug);
}

function is_visible_now(array $item, ?DateTimeImmutable $now = null): bool
{
    $now ??= new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
    $status = normalize_status($item['status'] ?? '');

    if ($status === 'draft') {
        return false;
    }

    $publishAt = parse_publish_at($item['publish_at'] ?? '');
    if ($publishAt instanceof DateTimeImmutable && $publishAt > $now) {
        return false;
    }

    return true;
}

function get_all_news(): array
{
    $rows = csv_rows(news_csv_path());
    foreach ($rows as &$row) {
        $row['status'] = normalize_status($row['status'] ?? '');
        $row['publish_dt'] = parse_publish_at($row['publish_at'] ?? '');
        $row['resolved_url'] = build_url($row);
    }
    unset($row);

    usort($rows, static function (array $a, array $b): int {
        $aDt = $a['publish_dt'] ?? null;
        $bDt = $b['publish_dt'] ?? null;

        if ($aDt instanceof DateTimeImmutable && $bDt instanceof DateTimeImmutable) {
            return $bDt <=> $aDt;
        }
        if ($aDt instanceof DateTimeImmutable) {
            return -1;
        }
        if ($bDt instanceof DateTimeImmutable) {
            return 1;
        }
        return strcmp((string)($a['title'] ?? ''), (string)($b['title'] ?? ''));
    });

    return $rows;
}

function get_visible_news(): array
{
    $all = get_all_news();
    $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow'));
    return array_values(array_filter($all, static fn(array $item): bool => is_visible_now($item, $now)));
}

function find_article_by_slug(string $slug): ?array
{
    foreach (get_all_news() as $item) {
        if (($item['slug'] ?? '') === $slug) {
            return $item;
        }
    }
    return null;
}

function e(?string $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
