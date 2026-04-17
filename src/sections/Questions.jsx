import { useState } from 'react'
import { useToast } from '../components/Toast'
import { exportQuestions, downloadMd } from '../utils/markdown'

const EMPTY = { text: '', context: '' }

export default function Questions({ state, update }) {
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)

  function addQuestion() {
    if (!form.text.trim()) return toast('Add a question', true)
    update((s) => ({
      ...s,
      questions: [
        { id: Date.now(), text: form.text.trim(), context: form.context.trim(), asked: false },
        ...s.questions,
      ],
    }))
    setForm(EMPTY)
    setShowForm(false)
    toast('Question logged')
  }

  function markAsked(id) {
    update((s) => ({
      ...s,
      questions: s.questions.map((q) => (q.id === id ? { ...q, asked: !q.asked } : q)),
    }))
  }

  function deleteQ(id) {
    update((s) => ({ ...s, questions: s.questions.filter((q) => q.id !== id) }))
  }

  function handleExport() {
    downloadMd(
      exportQuestions(state.questions),
      `questions-${new Date().toISOString().slice(0, 10)}.md`
    )
    toast('Exported questions.md')
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <span className="emoji">❓ BATCH & ASK</span>
          Questions
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export .md
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            + Add
          </button>
        </div>
      </div>

      <p
        style={{
          fontSize: 13,
          color: 'var(--muted)',
          marginBottom: 20,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1.6,
        }}
      >
        Collect questions here. Batch them before standups or syncs — not one-by-one.
      </p>

      {showForm && (
        <div className="add-form">
          <div className="form-row">
            <label className="form-label">Question</label>
            <input
              className="form-input"
              placeholder="e.g. Why does service A call service B synchronously?"
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
              autoFocus
            />
          </div>
          <div className="form-row">
            <label className="form-label">Context (optional)</label>
            <input
              className="form-input"
              placeholder="e.g. Relevant to the auth flow redesign"
              value={form.context}
              onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={addQuestion}>
              Add
            </button>
          </div>
        </div>
      )}

      {state.questions.length === 0 ? (
        <div className="empty-state">
          <div className="big">?</div>
          No questions yet
        </div>
      ) : (
        state.questions.map((q) => (
          <div key={q.id} className={`q-item${q.asked ? ' asked' : ''}`}>
            <div style={{ flex: 1 }}>
              <div className="q-text">{q.text}</div>
              {q.context && <div className="q-context">{q.context}</div>}
            </div>
            <button className="ask-btn" onClick={() => markAsked(q.id)}>
              {q.asked ? 'asked ✓' : 'mark asked'}
            </button>
            <button className="delete-btn" onClick={() => deleteQ(q.id)}>
              ×
            </button>
          </div>
        ))
      )}
    </div>
  )
}
