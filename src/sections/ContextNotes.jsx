import { useState, useEffect, useRef } from 'react'
import { useToast } from '../components/Toast'
import { exportNotes, downloadMd } from '../utils/markdown'

export default function ContextNotes({ state, update }) {
  const toast = useToast()
  const [notes, setNotes] = useState(state.notes)
  const notesRef = useRef(notes)

  useEffect(() => {
    notesRef.current = notes
  }, [notes])

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        update((s) => ({ ...s, notes: notesRef.current }))
        toast('Context saved')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function save() {
    update((s) => ({ ...s, notes }))
    toast('Context saved')
  }

  function handleExport() {
    downloadMd(exportNotes(notes), `context-${new Date().toISOString().slice(0, 10)}.md`)
    toast('Exported context.md')
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <span className="emoji">🧠 SECOND BRAIN</span>
          Context & Notes
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export .md
          </button>
          <button className="btn btn-ghost" onClick={save}>
            Save
          </button>
        </div>
      </div>

      <p
        style={{
          fontSize: 13,
          color: 'var(--muted)',
          marginBottom: 16,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1.6,
        }}
      >
        Dump things you learn. No need to be pretty.
      </p>

      <textarea
        className="notes-area"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => update((s) => ({ ...s, notes }))}
        placeholder={
          '- Service A owns user auth\n' +
          '- Feature flags handled via AppConfig\n' +
          '- Deployments go through XYZ pipeline\n' +
          '- Retry policy is exponential backoff, max 3 attempts\n' +
          '- John is the oncall this week\n' +
          '...'
        }
      />

      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: 'var(--muted)',
          marginTop: 8,
        }}
      >
        auto-saved on blur · cmd+s to save
      </div>
    </div>
  )
}
