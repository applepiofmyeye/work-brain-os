import { useState } from 'react'
import { useToast } from '../components/Toast'

const EMPTY = { task: '', state: '', next: '' }

export default function SwitchHelper({ state, update }) {
  const toast = useToast()
  const [form, setForm] = useState(EMPTY)

  function field(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function saveSwitch() {
    if (!form.task.trim()) return toast('What are you working on?', true)
    if (!form.next.trim()) return toast('Add a next step for when you return', true)
    update((s) => ({
      ...s,
      switches: [
        {
          id: Date.now(),
          task: form.task.trim(),
          state: form.state.trim(),
          next: form.next.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...s.switches,
      ],
    }))
    setForm(EMPTY)
    toast('State saved — go switch tasks')
  }

  function deleteSwitch(id) {
    update((s) => ({ ...s, switches: s.switches.filter((x) => x.id !== id) }))
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <span className="emoji">⚡ CONTEXT SWITCH</span>
          Switch Helper
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
        Before switching tasks — snapshot your state here. When you come back, you don't restart
        from zero.
      </p>

      <div className="switch-box">
        <h3>Save Current State</h3>
        <div className="form-row">
          <label className="switch-label">What are you working on?</label>
          <input
            className="form-input"
            placeholder="e.g. Debugging timeout in auth service"
            value={form.task}
            onChange={field('task')}
          />
        </div>
        <div className="form-row">
          <label className="switch-label">Current state / where you're at</label>
          <textarea
            className="form-input"
            style={{ height: 70, resize: 'none' }}
            placeholder="e.g. Narrowed it down to the retry logic. Suspect exponential backoff isn't kicking in."
            value={form.state}
            onChange={field('state')}
          />
        </div>
        <div className="form-row">
          <label className="switch-label">Next step when you return</label>
          <input
            className="form-input"
            placeholder="e.g. Check logs in X service for the retry count field"
            value={form.next}
            onChange={field('next')}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" onClick={saveSwitch}>
            Save Snapshot
          </button>
        </div>
      </div>

      {state.switches.length > 0 && (
        <>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Saved States
          </div>
          {state.switches.slice(0, 5).map((s) => (
            <div key={s.id} className="switch-box" style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: 'var(--accent2)',
                    fontWeight: 700,
                  }}
                >
                  {s.task}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      color: 'var(--muted)',
                    }}
                  >
                    {s.time}
                  </span>
                  <button className="delete-btn" onClick={() => deleteSwitch(s.id)}>
                    ×
                  </button>
                </div>
              </div>
              {s.state && (
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginBottom: 6,
                  }}
                >
                  {s.state}
                </div>
              )}
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                <span style={{ color: 'var(--accent)' }}>→ next: </span>
                <span style={{ color: 'var(--text)' }}>{s.next}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
