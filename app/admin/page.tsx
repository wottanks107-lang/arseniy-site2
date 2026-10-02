'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCol, uid, Id, Key, Finance } from '@/lib/store'

type F = [string, 'text' | 'number' | 'area' | string[]]
const SCHEMA: Record<string, { label: string; f: F[] }> = {
  about: { label: 'About', f: [['text', 'area']] },
  timeline: { label: 'Timeline', f: [['period', 'text'], ['title', 'text'], ['text', 'area']] },
  goals: { label: 'Goals', f: [['area', 'text'], ['text', 'area']] },
  skills: { label: 'Progress / Skills', f: [['name', 'text'], ['level', 'text'], ['value', 'number']] },
  projects: { label: 'Projects', f: [['name', 'text'], ['status', ['IDEA', 'EXPERIMENT', 'BUILDING', 'IN PROGRESS', 'DONE']], ['date', 'text'], ['text', 'area'], ['tech', 'text'], ['progress', 'number']] },
  books: { label: 'Books', f: [['title', 'text'], ['author', 'text'], ['status', ['want', 'reading', 'done']], ['percent', 'number'], ['note', 'area']] },
  notes: { label: 'Notes', f: [['date', 'text'], ['category', ['AI', 'Учёба', 'Работа', 'Спорт', 'Книги', 'Мысли', 'Проекты']], ['title', 'text'], ['text', 'area']] },
  social: { label: 'Social links', f: [['label', 'text'], ['url', 'text']] },
  finance: { label: 'Finance (private)', f: [['month', 'text'], ['income', 'number'], ['expense', 'number'], ['sales', 'number']] },
}

function Crud({ k }: { k: Key }) {
  const sc = SCHEMA[k]
  const [rows, set] = useCol<Id & Record<string, any>>(k)
  const [ed, setEd] = useState<(Id & Record<string, any>) | null>(null)
  const blank = () => ({ id: '', ...Object.fromEntries(sc.f.map(([n, t]) => [n, t === 'number' ? 0 : Array.isArray(t) ? t[0] : ''])) })
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!ed) return
    set(ed.id ? rows.map(r => r.id === ed.id ? ed : r) : [...rows, { ...ed, id: uid() }]); setEd(null)
  }
  return <div>
    <div className="row"><button className="btn fill" onClick={() => setEd(blank())}>+ Add</button></div>
    {ed && <form onSubmit={submit}>{sc.f.map(([n, t]) => <label key={n}>{n}
      {t === 'area' ? <textarea rows={3} value={ed[n]} onChange={e => setEd({ ...ed, [n]: e.target.value })} />
        : Array.isArray(t) ? <select value={ed[n]} onChange={e => setEd({ ...ed, [n]: e.target.value })}>{t.map(o => <option key={o}>{o}</option>)}</select>
        : <input type={t} value={ed[n]} required onChange={e => setEd({ ...ed, [n]: t === 'number' ? +e.target.value : e.target.value })} />}</label>)}
      <div className="row"><button className="btn fill">Save</button><button type="button" className="btn" onClick={() => setEd(null)}>Cancel</button></div></form>}
    <div className="wrap"><table><tbody>{rows.map(r => <tr key={r.id}>
      <td>{sc.f.map(([n]) => String(r[n])).join(' · ').slice(0, 140)}</td>
      <td style={{ whiteSpace: 'nowrap' }}><button className="x" onClick={() => setEd(r)}>Edit</button><button className="x" onClick={() => confirm('Удалить запись?') && set(rows.filter(x => x.id !== r.id))}>Delete</button></td></tr>)}
      {rows.length === 0 && <tr><td>Пока пусто.</td></tr>}</tbody></table></div>
    {k === 'finance' && <FinSummary rows={rows as unknown as Finance[]} />}
  </div>
}

function FinSummary({ rows }: { rows: Finance[] }) {
  const I = rows.reduce((a, x) => a + x.income, 0), X = rows.reduce((a, x) => a + x.expense, 0), S = rows.reduce((a, x) => a + x.sales, 0)
  const mx = Math.max(50000, ...rows.map(x => Math.abs(x.income - x.expense))), w = 600 / Math.max(rows.length, 6)
  const R = (n: number) => n.toLocaleString('ru-RU') + ' ₽'
  return <div style={{ marginTop: 40 }}>
    <div className="grid">{[['Доход', R(I)], ['Расходы', R(X)], ['Чистый результат', R(I - X)], ['Продаж', S], ['Цель', '50 000 ₽/мес']].map(([l, v]) => <div key={l} className="card"><span className="meta">{l}</span><h3 style={{ fontSize: 28 }}>{v}</h3></div>)}</div>
    <div className="card" style={{ marginTop: 16 }}><svg viewBox="0 0 600 160" width="100%" role="img" aria-label="Чистый результат по месяцам"><line x1="0" x2="600" y1="130" y2="130" stroke="#222" />
      {rows.length === 0 ? <text x="300" y="80" textAnchor="middle">Нет данных — добавь первый месяц</text> : rows.map((x, i) => { const v = x.income - x.expense, h = Math.abs(v) / mx * 110
        return <g key={x.id}><rect x={i * w + 8} y={v >= 0 ? 130 - h : 130} width={w - 16} height={Math.max(h, 2)} fill={v >= 0 ? '#E5202E' : '#555'} /><text x={i * w + w / 2} y="150" textAnchor="middle">{x.month}</text></g> })}</svg></div></div>
}

export default function Admin() {
  const [k, setK] = useState<Key>('about')
  return <div className="adm">
    <p><Link href="/" className="red">← На сайт</Link></p>
    <h1 style={{ fontSize: 48, margin: '8px 0 24px' }}>Admin</h1>
    <p>Данные хранятся только в этом браузере (LocalStorage). Страница не защищена паролем — не публикуй её как есть.</p>
    <div className="chips">{(Object.keys(SCHEMA) as Key[]).map(x => <button key={x} className={'btn' + (x === k ? ' on' : '')} onClick={() => setK(x)}>{SCHEMA[x].label}</button>)}</div>
    <Crud key={k} k={k} />
  </div>
}
