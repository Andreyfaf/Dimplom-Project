# Gidrobas

Учебный дипломный проект компании Gidrobas. Фронтенд работает на `React + Vite`, бэкенд добавлен на `Django + Django REST Framework`.

## Что теперь есть

- каталог товаров загружается с Django API
- регистрация и вход работают через backend
- корзина и заказы хранятся в базе данных
- заявки на ремонт отправляются на backend
- контакты, руководство и услуги ремонта тоже приходят из API

## Стек

- `React 19`
- `Vite`
- `Django 5`
- `Django REST Framework`
- `django-cors-headers`
- `SQLite`

## Запуск фронтенда

```bash
npm install
npm run dev
```

Фронтенд будет доступен на [http://localhost:5173](http://localhost:5173).

## Запуск бэкенда

Установить Python-зависимости:

```bash
py -m pip install -r backend/requirements.txt
```

Применить миграции:

```bash
npm run backend:migrate
```

Запустить сервер Django:

```bash
npm run backend:dev
```

Бэкенд будет доступен на [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Основные API-эндпоинты

- `GET /api/bootstrap/`
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/profile/`
- `GET /api/cart/`
- `POST /api/cart/items/`
- `DELETE /api/cart/items/<id>/`
- `DELETE /api/cart/clear/`
- `GET /api/orders/`
- `POST /api/orders/`
- `POST /api/repair-requests/`

## Примечания

- проект использует `SQLite`, файл базы данных создаётся в `backend/db.sqlite3`
- стартовые товары, контакты и услуги создаются автоматически при первом запросе к `bootstrap`
