'use client'
import { useCallback, useEffect, useState } from 'react'

export type Id = { id: string }
export type About = Id & { text: string }
export type Timeline = Id & { period: string; title: string; text: string }
export type Goal = Id & { area: string; text: string }
export type Skill = Id & { name: string; level: string; value: number }
export type Project = Id & { name: string; status: string; date: string; text: string; tech: string; progress: number }
export type Book = Id & { title: string; author: string; status: 'want' | 'reading' | 'done'; percent: number; note: string }
export type Note = Id & { date: string; category: string; title: string; text: string }
export type Finance = Id & { month: string; income: number; expense: number; sales: number }
export type Workout = Id & { date: string; kind: 'gym' | 'swim' }
export type Social = Id & { label: string; url: string }

export const uid = () => Math.random().toString(36).slice(2, 10)
const s = <T,>(a: Omit<T, 'id'>[]) => a.map(x => ({ ...x, id: uid() })) as unknown as T[]

// Стартовые данные: только то, что Арсений сам сообщил. Значения прогресса — стартовые, не измерения.
export const SEED = {
  about: s<About>([
    { text: 'Мне 16 лет, я живу в Севастополе и учусь в 10 классе.' },
    { text: 'Сейчас я в том возрасте, когда ещё можно пробовать много разных вещей и не бояться менять направление. Поэтому я изучаю AI и программирование, пробую создавать проекты, учусь продавать, занимаюсь спортом и собираю своё понимание того, чем хочу заниматься дальше.' },
    { text: 'Я пока не знаю точного ответа. И именно поэтому мне интересно наблюдать за своим развитием.' }]),
  timeline: s<Timeline>([
    { period: '15 лет', title: 'Первая работа', text: 'Фотограф в детском аквапарке. Первый опыт работы и общения с людьми.' },
    { period: 'Следующий этап', title: 'Кафе', text: 'Работа поваром. Другой ритм, другая ответственность и новый опыт.' },
    { period: '2026', title: 'Поиск своего направления', text: 'Начинаю пробовать онлайн-продажи, перепродажу товаров, AI и автоматизацию.' },
    { period: 'Сейчас', title: 'Строю фундамент', text: 'Изучаю Python, AI, AI-агентов, продажи, английский и чтение. Занимаюсь: зал, плавание.' },
    { period: 'Дальше', title: 'Собственные проекты', text: 'AI-агенты, автоматизации, игры, цифровые проекты и собственные источники дохода.' }]),
  goals: s<Goal>([
    { area: 'Финансы', text: 'Ближайший этап: 50 000 ₽+ стабильного дохода в месяц.' },
    { area: 'Развитие', text: 'Память, речь, мышление, концентрация, привычка читать.' },
    { area: 'Технологии', text: 'Python, AI, AI-агенты, автоматизация, разработка игр.' },
    { area: 'Спорт', text: 'Тренажёрный зал, плавание, физическая форма.' },
    { area: 'English', text: 'Постепенно улучшать английский для будущей учёбы и работы.' },
    { area: 'Путешествия', text: 'Побывать в разных странах и однажды не привязывать жизнь к одному месту.' }]),
  skills: s<Skill>([
    { name: 'Python', level: 'BEGINNER', value: 4 }, { name: 'AI', level: 'BEGINNER', value: 5 },
    { name: 'Sales', level: 'BEGINNER', value: 3 }, { name: 'English', level: 'B1 / развиваю', value: 4 },
    { name: 'Automation', level: 'BEGINNER', value: 3 }, { name: 'Content', level: 'Изучаю', value: 2 },
    { name: 'Reading', level: 'Привычка только строится', value: 2 }, { name: 'Sport', level: 'Развиваю', value: 4 }]),
  projects: s<Project>([
    { name: 'AI Agent', status: 'IN PROGRESS', date: '2026', text: 'Собственный AI-агент для автоматизации задач.', tech: 'Python, LLM API', progress: 20 },
    { name: 'Яндекс Игра', status: 'IDEA', date: '2026', text: 'Разработка собственной игры для Яндекс Игр.', tech: 'HTML5, JavaScript', progress: 0 },
    { name: 'Avito Resale', status: 'EXPERIMENT', date: '2026', text: 'Первые эксперименты с онлайн-продажами и перепродажей.', tech: 'Avito, продажи', progress: 10 },
    { name: 'Personal Website', status: 'BUILDING', date: '2026', text: 'Этот сайт — первая версия моего цифрового дневника.', tech: 'Next.js, TypeScript, GSAP, Three.js', progress: 40 }]),
  books: [] as Book[],
  notes: s<Note>([{ date: '02.10.2026', category: 'Мысли', title: 'Почему я вообще решил вести этот сайт?', text: 'Хочу сохранить точку старта и посмотреть, куда приведёт мой путь.' }]),
  finance: [] as Finance[],
  workouts: [] as Workout[],
  social: s<Social>([
    { label: 'Telegram', url: 'https://t.me/YOUR_TELEGRAM' }, { label: 'TikTok', url: 'https://tiktok.com/@YOUR_TIKTOK' },
    { label: 'YouTube', url: 'https://youtube.com/@YOUR_YOUTUBE' }]),
}
export type Key = keyof typeof SEED

// Каждая коллекция лежит под своим ключом. Для перехода на Supabase/Firebase/PostgreSQL
// достаточно заменить load()/save() — компоненты не меняются.
const load = <T,>(k: string, d: T[]): T[] => { try { const v = localStorage.getItem('ars:' + k); return v ? JSON.parse(v) : d } catch { return d } }
const save = (k: string, v: unknown) => { try { localStorage.setItem('ars:' + k, JSON.stringify(v)) } catch {} }

export function useCol<T extends Id>(key: Key): [T[], (v: T[]) => void] {
  const [d, setD] = useState<T[]>(SEED[key] as unknown as T[])
  useEffect(() => { setD(load(key, SEED[key] as unknown as T[])) }, [key])
  const set = useCallback((v: T[]) => { setD(v); save(key, v) }, [key])
  return [d, set]
}
