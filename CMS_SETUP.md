# Ветеринар на связи — Strapi CMS + Next.js

Легаси-статика сайта `vetnasvyaz.ru` перенесена в headless-CMS **Strapi v5**, а сам
сайт рендерит **Next.js**-фронтенд, забирающий контент из Strapi API.

## Структура

```
vetnas/
├── cms/                     # Strapi v5 (headless CMS, SQLite)
│   ├── src/api/page/        # Тип «Page» — лендинги + статические страницы
│   ├── src/api/article/     # Тип «Article» — новости
│   ├── src/api/global/      # Single type «Global» — меню, телефон, футер, карта
│   ├── src/index.js         # bootstrap: сидинг из data/seed + публичные права
│   └── data/seed/           # pages.json, articles.json, global.json
├── web/                     # Next.js (App Router) фронтенд
│   ├── app/layout.js        # Шапка/меню/футер из Global
│   ├── app/page.js          # Главная (slug "home")
│   ├── app/[slug]/page.js   # Лендинги и статические страницы
│   ├── app/news/[slug]/     # Новости
│   ├── lib/strapi.js        # Клиент Strapi REST API
│   └── public/              # Скопированные CSS/шрифты/JS/картинки
├── scripts/extract.mjs      # Парсер легаси-HTML → cms/data/seed/*.json
└── *.html                   # Исходный статический снапшот (источник контента)
```

## Данные в CMS

- **236** страниц (Page), включая главную (`home`)
- **22** новости (Article)
- **Global**: название, телефон, меню, адрес, карта, футер

Права на чтение (`find`/`findOne`) для роли Public выставляются автоматически в `cms/src/index.js`.

## Запуск (локально)

1. Strapi (порт 1337):
   ```bash
   cd cms && npm run develop
   ```
   Админка: http://localhost:1337/admin (при первом входе создать администратора).

2. Next.js (порт 3000):
   ```bash
   cd web && npm run dev
   ```
   Сайт: http://localhost:3000

`web/.env.local` содержит `STRAPI_URL=http://localhost:1337`.

## Повторный импорт контента

Если нужно перепарсить исходный HTML и обновить сид:
```bash
node scripts/extract.mjs          # обновит cms/data/seed/*.json
# перезапустить Strapi — bootstrap сделает upsert по slug (идемпотентно)
```

## Что дальше (не входит в первый этап)

- Редактирование главной по блокам (сейчас — единый HTML-блок в поле body).
- Загрузка картинок в Media Library Strapi вместо `web/public`.
- Формы записи (сейчас статические), sitemap/robots, редиректы с легаси-URL.
- Деплой на VPS (Strapi + Next.js в отдельном контейнере).
