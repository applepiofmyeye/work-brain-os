import { useState } from 'react'
import { useToast } from '../components/Toast'
import { exportLoops, downloadMd } from '../utils/markdown'

const EMPTY_FORM = { title: '', status: 'active', blocker: '', next: '' }

export default function OpenLoops({ state, update }) {
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)
  const [expanded, setExpanded] = useState(new Set())

  const open = state.loops.filter((l) => !l.done)

  function addLoop() {
    if (!form.title.trim()) return toast('Add a task title', true)
    if (!form.next.trim()) return toast('Add a next step — this is required', true)
    update((s) => ({
      ...s,
      loops: [
        {
          id: Date.now(),
          title: form.title.trim(),
          status: form.status,
          blocker: form.blocker.trim(),
          next: form.next.trim(),
          done: false,
          created: new Date().toISOString(),
        },
        ...s.loops,
      ],
    }))
    setForm(EMPTY_FORM)
    setShowForm(false)
    toast('Loop added')
  }

  function toggleDone(id) {
    update((s) => ({
      ...s,
      loops: s.loops.map((l) => (l.id === id ? { ...l, done: !l.done } : l)),
    }))
  }

  function deleteLoop(id) {
    update((s) => ({ ...s, loops: s.loops.filter((l) => l.id !== id) }))
  }

  function toggleExpanded(id) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function field(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleExport() {
    downloadMd(exportLoops(state.loops), `loops-${today()}.md`)
    toast('Exported loops.md')
  }

  let items = state.loops
  if (filter === 'done') items = items.filter((l) => l.done)
  else if (filter !== 'all') items = items.filter((l) => !l.done && l.status === filter)

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <span className="emoji">🔴 PRIORITY ONE</span>
          Open Loops
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export .md
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            + Add Loop
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--accent3)' }}>
            {open.filter((l) => l.status === 'active').length}
          </div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--red)' }}>
            {open.filter((l) => l.status === 'blocked').length}
          </div>
          <div className="stat-label">Blocked</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: 'var(--yellow)' }}>
            {open.filter((l) => l.status === 'waiting').length}
          </div>
          <div className="stat-label">Waiting</div>
        </div>
      </div>

      {showForm && (
        <div className="add-form">
          <div className="form-row">
            <label className="form-label">Task</label>
            <input
              className="form-input"
              placeholder="e.g. Fix API timeout in service X"
              value={form.title}
              onChange={field('title')}
              onKeyDown={(e) => e.key === 'Enter' && addLoop()}
              autoFocus
            />
          </div>
          <div className="form-row-2">
            <div className="form-row">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={field('status')}>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="waiting">Waiting</option>
              </select>
            </div>
            <div className="form-row">
              <label className="form-label">Blocked by / Waiting on</label>
              <input
                className="form-input"
                placeholder="e.g. John's review"
                value={form.blocker}
                onChange={field('blocker')}
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Next Step (required)</label>
            <input
              className="form-input"
              placeholder="e.g. Check logs in service X for timeout pattern"
              value={form.next}
              onChange={field('next')}
              onKeyDown={(e) => e.key === 'Enter' && addLoop()}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={addLoop}>
              Add Loop
            </button>
          </div>
        </div>
      )}

      <div className="filter-bar">
        {['all', 'active', 'blocked', 'waiting', 'done'].map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="big">✓</div>
          Nothing here{filter !== 'all' ? ' in this filter' : ' — brain is clear'}
        </div>
      ) : (
        items.map((l) => (
          <div
            key={l.id}
            className={`loop-item${l.done ? ' done' : ''}${expanded.has(l.id) ? ' expanded' : ''}`}
          >
            <div className="loop-top">
              <div
                className={`checkbox${l.done ? ' checked' : ''}`}
                onClick={() => toggleDone(l.id)}
              />
              <div className="loop-title">{l.title}</div>
              <button className="expand-btn" onClick={() => toggleExpanded(l.id)}>
                ···
              </button>
              <button className="delete-btn" onClick={() => deleteLoop(l.id)}>
                ×
              </button>
            </div>
            <div className="loop-meta">
              <span className={`tag tag-${l.status}`}>{l.status}</span>
              <span className="tag tag-next">→ {l.next}</span>
            </div>
            {expanded.has(l.id) && (
              <div className="loop-detail">
                {l.blocker && (
                  <div className="detail-row">
                    <span className="detail-label">
                      {l.status === 'waiting' ? 'waiting on:' : 'blocked by:'}
                    </span>
                    <span className="detail-value">{l.blocker}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">next step:</span>
                  <span className="detail-value">{l.next}</span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
