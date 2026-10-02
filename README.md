# Arseniy — My Journey

Next.js 14 (App Router) + TypeScript + GSAP + Three.js. Без Tailwind — обычный CSS в `app/globals.css`.

## Запуск
```
npm install
npm run dev        # http://localhost:3000
npm run lint       # проверка типов (tsc)
npm run build && npm start
```

## Редактирование
- `/admin` — добавлять / править / удалять: About, Timeline, Goals, Progress, Projects, Books, Notes, Finance, Social links. Изменения сохраняются в LocalStorage браузера.
- Фото: положи файл в `public/assets/avatar.jpg` (до этого показывается заглушка).
- Ссылки: замени YOUR_TELEGRAM / YOUR_TIKTOK / YOUR_YOUTUBE в `/admin` → Social links (или в `lib/store.ts`, раздел `social`).
- Стартовые данные: `lib/store.ts` → `SEED`.
- Тренировки: кнопки «+ Gym» / «+ Swim» на сайте; неделя, месяц и серия считаются из записей.

## Переход на базу данных
Каждая коллекция (about, timeline, goals, skills, projects, books, notes, finance, workouts, social) хранится отдельно. Для Supabase/Firebase/PostgreSQL замени только `load()` и `save()` в `lib/store.ts`.

## Важно
- LocalStorage — только в браузере владельца: чужие посетители не увидят твои правки, а смена браузера их сбросит.
- `/admin` и Finance не защищены паролем. Перед публикацией добавь авторизацию (например, Supabase Auth).
