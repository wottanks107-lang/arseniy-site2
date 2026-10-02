'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCol, About, Timeline, Goal, Skill, Project, Book, Note, Workout, Social, uid } from '@/lib/store'
const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false })

const Sec = ({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) =>
  <section id={id} className="rv"><h2>{title}</h2>{children}</section>
const Bar = ({ v }: { v: number }) => <div className="bar"><i style={{ width: v + '%' }} /></div>

export default function Home() {
  const [about] = useCol<About>('about'), [tl] = useCol<Timeline>('timeline'), [goals] = useCol<Goal>('goals')
  const [skills] = useCol<Skill>('skills'), [projects] = useCol<Project>('projects'), [books] = useCol<Book>('books')
  const [notes] = useCol<Note>('notes'), [social] = useCol<Social>('social'), [wk, setWk] = useCol<Workout>('workouts')
  const [open, setOpen] = useState(false), [sm, setSm] = useState(false), [cat, setCat] = useState('Все')
  const root = useRef<HTMLDivElement>(null), cur = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.in', { y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.rv').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }))
      gsap.to('.ph', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', scrub: true } }) // parallax
    }, root)
    return () => ctx.revert()
  }, [])
  useEffect(() => {
    const sc = () => setSm(scrollY > 40), mv = (e: MouseEvent) => {
      const c = cur.current; if (!c) return
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'
      c.classList.toggle('h', !!(e.target as HTMLElement).closest('a,button,.card,summary'))
    }
    addEventListener('scroll', sc, { passive: true }); addEventListener('mousemove', mv)
    return () => { removeEventListener('scroll', sc); removeEventListener('mousemove', mv) }
  }, [])

  // Статистика тренировок считается из записей
  const day = (d: string) => d.slice(0, 10), today = new Date()
  const ago = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10) }
  const dates = new Set(wk.map(w => day(w.date)))
  const week = wk.filter(w => day(w.date) >= ago(6)).length, month = wk.filter(w => day(w.date) >= ago(29)).length
  let streak = 0; while (dates.has(ago(streak))) streak++
  const cats = ['Все', ...Array.from(new Set(notes.map(n => n.category)))]
  const nav = ['about', 'path', 'goals', 'projects', 'notes']
  const tg = social.find(s => s.label === 'Telegram')?.url ?? '#'

  return <div ref={root}>
    <div id="cur" ref={cur} />
    <nav className={sm ? 'sm' : ''}><b>ARSENIY</b>
      <button className="btn burger" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Закрыть' : 'Меню'}</button>
      <div className={'links' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        {nav.map(n => <a key={n} href={'#' + n}>{n.toUpperCase()}</a>)}<a className="btn" href={tg}>Telegram ↗</a></div></nav>
    <main>
      <section className="hero"><Hero3D />
        <div><div className="who in">АРСЕНИЙ</div>
          <h1 className="in">Мне 16.<br />И всё только начинается.</h1>
          <p className="sub in">Севастополь · 2026<br />Учусь. Пробую. Создаю. Ошибаюсь. Двигаюсь дальше.</p>
          <div className="tags in">AI · CODE · BUSINESS · SPORT · LIFE</div>
          <div className="row in"><a className="btn fill" href="#path">Смотреть мой путь ↓</a><a className="btn" href="#projects">Мои проекты</a></div></div>
        <div className="ph"><img src="/assets/avatar.jpg" alt="Арсений" onError={e => { const i = e.currentTarget; if (!i.dataset.f) { i.dataset.f = '1'; i.src = '/assets/placeholder.svg' } }} /></div>
      </section>

      <section id="about" className="rv"><div className="two"><div><h2>Немного обо мне.</h2>{about.map(a => <p key={a.id}>{a.text}</p>)}</div>
        <div className="stats"><div><b>16</b>лет</div><div><b>10</b>класс</div><div><b className="red">2026</b>точка старта</div><div><b>∞</b>дальше</div></div></div></section>

      <Sec id="path" title="Отсюда всё начинается."><div className="tl">{tl.map(e => <div key={e.id}><span className="meta">{e.period}</span><h3>{e.title}</h3><p>{e.text}</p></div>)}</div></Sec>

      <Sec title="Сейчас."><div className="grid">{[['AI', 'Изучаю искусственный интеллект и пытаюсь понять, как использовать его не только для общения, но и для создания реальных инструментов.'], ['Code', 'Начинаю изучать Python и программирование.'], ['Business', 'Изучаю продажи и пробую разные способы заработка.'], ['Projects', 'Хочу создавать собственные цифровые проекты.'], ['Sport', 'Зал, плавание и работа над физической формой.'], ['Mind', 'Чтение, память, речь, английский и развитие мышления.']].map(([t, p]) => <div key={t} className="card lg"><h3>{t}</h3><p style={{ marginTop: 12 }}>{p}</p></div>)}</div></Sec>

      <Sec id="goals" title="Куда я хочу прийти.">
        <h3 style={{ fontSize: 36 }}>Финансовая свобода.</h3>
        <p style={{ margin: '12px 0 40px', fontSize: 19 }}>Не ради цифры на счёте. Ради свободы выбирать, где жить, чем заниматься и куда двигаться дальше.</p>
        <div className="grid">{goals.map(g => <div key={g.id} className="card"><h3>{g.area}</h3><p style={{ marginTop: 12 }}>{g.text}</p></div>)}</div>
        <h2 style={{ margin: '100px 0 16px' }}>Сейчас / Цель</h2><p>Стартовые значения, а не измерения. Меняются в админке.</p>
        <div className="grid">{skills.map(s => <div key={s.id} className="card"><h3>{s.name}</h3><Bar v={s.value * 10} /><span className="meta">{s.level}</span></div>)}</div></Sec>

      <Sec id="projects" title="То, что я создаю."><p>Пока это только начало. Некоторые идеи существуют только на бумаге.</p>
        <div className="grid" style={{ marginTop: 30 }}>{projects.map(p => <div key={p.id} className="card"><span className="pill">{p.status}</span> <span className="meta">{p.date}</span>
          <h3 style={{ margin: '16px 0 8px' }}>{p.name}</h3><p>{p.text}</p><Bar v={p.progress} />
          <details><summary>Подробнее</summary><p style={{ marginTop: 10 }}>Технологии: {p.tech}. Прогресс: {p.progress}%.</p></details></div>)}</div></Sec>

      <Sec title="Работа над собой."><p>Я хочу быть сильнее не только в голове, но и физически.</p>
        <div className="grid">{[['Тренировок за неделю', week], ['Тренировок за месяц', month], ['Текущая серия', streak]].map(([l, v]) => <div key={l} className="card cnt"><span className="meta">{l}</span><b>{v}</b></div>)}
          <div className="card"><h3>GYM · SWIMMING</h3><div className="row">{(['gym', 'swim'] as const).map(k => <button key={k} className="btn" onClick={() => setWk([...wk, { id: uid(), date: new Date().toISOString(), kind: k }])}>+ {k === 'gym' ? 'Gym' : 'Swim'}</button>)}</div></div></div></Sec>

      <Sec title="Сейчас читаю.">{books.length === 0 ? <p>Полка пока пуста. Книги добавляются в админке.</p> :
        <div className="grid">{(['reading', 'want', 'done'] as const).map(st => <div key={st}><div className="meta" style={{ marginBottom: 12 }}>{{ reading: 'Читаю', want: 'Хочу прочитать', done: 'Прочитано' }[st]}</div>
          {books.filter(b => b.status === st).map(b => <div key={b.id} className="card" style={{ marginBottom: 12 }}><h3>{b.title}</h3><p>{b.author}</p><Bar v={b.percent} />{b.note && <p>{b.note}</p>}</div>)}</div>)}</div>}</Sec>

      <Sec id="notes" title="Мысли по пути.">
        <div className="chips">{cats.map(c => <button key={c} className={'btn' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="grid">{notes.filter(n => cat === 'Все' || n.category === cat).map(n => <div key={n.id} className="card"><span className="meta">{n.date} · {n.category}</span><h3 style={{ margin: '10px 0' }}>{n.title}</h3><details><summary>Читать →</summary><p style={{ marginTop: 10 }}>{n.text}</p></details></div>)}</div></Sec>

      <Sec title="Через несколько лет."><div className="grid">{[['Freedom', 'Финансовая независимость.'], ['Travel', 'Новые страны и города.'], ['Business', 'Собственные проекты.'], ['Media', 'YouTube, TikTok, личный бренд.'], ['People', 'Близкие люди, друзья, отношения.'], ['Life', 'Жизнь, которую я сам выбрал.']].map(([t, p]) => <div key={t} className="card lg"><h3>{t}</h3><p style={{ marginTop: 12 }}>{p}</p></div>)}</div>
        <p style={{ marginTop: 40, fontSize: 19, color: '#fff' }}>Я не знаю, каким будет этот список через пять лет.<br />В этом и смысл.</p></Sec>

      <section className="rv" style={{ textAlign: 'center' }}><h2>Если хочешь связаться — напиши.</h2>
        <div className="row" style={{ justifyContent: 'center' }}>{social.map((s, i) => <a key={s.id} className={'btn' + (i === 0 ? ' fill' : '')} href={s.url}>{s.label} ↗</a>)}</div>
        <div className="big">Это только <span className="red">начало.</span></div><p style={{ margin: '0 auto', fontWeight: 500 }}>Arseniy · Sevastopol · 2026 — Keep moving.</p></section>
    </main>
    <footer><div><b style={{ color: '#fff', letterSpacing: '.12em' }}>ARSENIY</b><br />16 лет · Севастополь<br />AI · CODE · BUSINESS · SPORT · LIFE</div>
      <div>{social.map(s => s.label).join(' · ')}<br />© 2026 Arseniy</div></footer>
  </div>
}
