# QURAL-SAIMAN — сайт проката строительного инструмента (Шымкент)

Статический сайт: HTML + CSS + ванильный JavaScript. Сборки нет — файлы в репозитории и есть сайт.

## Как выложить

**Cloudflare Pages** (рекомендуется)

1. Залить этот репозиторий на GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git → выбрать репозиторий.
3. Настройки сборки:
   - Framework preset: **None**
   - Build command: **пусто**
   - Build output directory: **/** (корень)
4. Deploy. Дальше каждый push в `main` деплоится автоматически.
5. Custom domains → добавить домен, Cloudflare сам пропишет DNS.

**Netlify** — то же самое, либо просто перетащить папку на `app.netlify.com/drop`.

## Перед первым деплоем

Домен в файлах прописан как `https://qural-saiman.kz`. Если домен другой — заменить во всех файлах:

- `sitemap.xml` — все `<loc>`
- `robots.txt` — строка `Sitemap:`
- `<link rel="canonical">` и `og:url` / `og:image` в каждом HTML

## После деплоя

1. Google Search Console → добавить домен → отправить `sitemap.xml`.
2. Проверить сайт на телефоне: «Добавить на главный экран» (PWA), офлайн-режим.
3. Проверить, что кнопки заявок открывают WhatsApp менеджера.

## Структура

```
index.html          главная
catalog.html        каталог с фильтрами
product.html        карточка инструмента (?id=slug)
dgu.html            дизельные генераторы
cart.html           заявка (localStorage → WhatsApp)
contacts.html       контакты, карта 2ГИС
info.html           раздел «Ещё»
discounts / delivery / payment / return / terms / privacy / responsibility / faq
admin.html          МАКЕТ будущей админки, не рабочий (закрыт в robots.txt)

app.css             все стили
tools-data.js       КАТАЛОГ: 88 позиций, категории, ДГУ
catalog-app.js      фильтры и рендер каталога
product-app.js      карточка товара, SEO-разметка Product
cart-app.js         корзина и сборка сообщения в WhatsApp
app-cart.js         состояние корзины (localStorage)
app-search.js       общий поиск
cat-icons.js        иконки категорий
callback-widget.js  обратный звонок → WhatsApp
sw.js               service worker (офлайн, кэш qs-v3)
manifest.webmanifest / offline.html / _headers
assets/             фото инструментов, иконки, шрифт
```

## Как править каталог

Пока данные лежат в `tools-data.js`. Добавить инструмент — новая строка в массиве `tools`:

```js
T('slug-instrumenta','Название','категория','БРЕНД','Электрический',5000,'Краткая характеристика','slug-instrumenta.png','','',false)
//  id            name       cat        brand    power           price spec        photo             priceNote badge top
```

Фото положить в `assets/tools/` с тем же именем, квадратное, на белом фоне, минимум 800×800.

После правки данных поднять версию кэша в `sw.js` (`qs-v3` → `qs-v4`), иначе у постоянных посетителей останется старый каталог.

## Планы

Перенос на Next.js + Supabase с админкой — ТЗ и дизайн в `design_handoff_nextjs_admin/`.
