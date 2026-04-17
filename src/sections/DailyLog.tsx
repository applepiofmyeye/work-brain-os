import { useState } from 'react'
import { useToast } from '../components/Toast'
import { exportLog, downloadMd } from '../utils/markdown'
import type { SectionProps, LogEntry } from '../types'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface LogEntryProps {
  entry: LogEntry
  isOpen: boolean
  onToggle: () => void
  onSave: (date: string, today: string, tomorrow: string) => void
  onDelete: (date: string) => void
}

function LogEntryRow({ entry, isOpen, onToggle, onSave, onDelete }: LogEntryProps) {
  const [today, setToday] = useState(entry.today)
  const [tomorrow, setTomorrow] = useState(entry.tomorrow)
  const preview = entry.today
    ? entry.today.split('\n')[0].replace(/^-\s*/, '')
    : 'Empty entry'

  return (
    <div className={`log-day${isOpen ? ' open' : ''}`}>
      <div className="log-day-header" onClick={onToggle}>
        <div className="log-date">{entry.date}</div>
        <div className="log-preview">{preview}</div>
        <button
          className="delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(entry.date) }}
        >
          ×
        </button>
      </div>
      {isOpen && (
        <div className="log-body">
          <div className="log-section-label">Today I did</div>
          <textarea
            className="log-textarea"
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder={'- Set up local env\n- Investigated API timeout\n- Started PR for logging fix'}
          />
          <div className="log-section-label">Tomorrow</div>
          <textarea
            className="log-textarea"
            value={tomorrow}
            onChange={(e) => setTomorrow(e.target.value)}
            placeholder={'- Ask about retry logic\n- Continue PR'}
          />
          <button className="log-save" onClick={() => onSave(entry.date, today, tomorrow)}>
            save entry ↵
          </button>
        </div>
      )}
    </div>
  )
}

export default function DailyLog({ state, update }: SectionProps) {
  const toast = useToast()
  const [openDates, setOpenDates] = useState<Set<string>>(new Set())

  function addToday() {
    const key = todayKey()
    if (state.log.find((l) => l.date === key)) {
      setOpenDates((prev) => new Set([...prev, key]))
      return
    }
    update((s) => ({ ...s, log: [{ date: key, today: '', tomorrow: '' }, ...s.log] }))
    setOpenDates((prev) => new Set([...prev, key]))
    toast('Log entry added')
  }

  function toggleDate(date: string) {
    setOpenDates((prev) => {
      const next = new Set(prev)
      next.has(date) ? next.delete(date) : next.add(date)
      return next
    })
  }

  function saveEntry(date: string, today: string, tomorrow: string) {
    update((s) => ({
      ...s,
      log: s.log.map((l) => (l.date === date ? { ...l, today, tomorrow } : l)),
    }))
    toast('Log saved')
  }

  function deleteEntry(date: string) {
    update((s) => ({ ...s, log: s.log.filter((l) => l.date !== date) }))
  }

  function handleExport() {
    downloadMd(exportLog(state.log), `daily-log-${new Date().toISOString().slice(0, 10)}.md`)
    toast('Exported daily-log.md')
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <span className="emoji">📅 5 MINS/DAY</span>
          Daily Log
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleExport}>
            Export .md
          </button>
          <button className="btn btn-primary" onClick={addToday}>
            + Today
          </button>
        </div>
      </div>

      {state.log.length === 0 ? (
        <div className="empty-state">
          <div className="big">📅</div>
          Start your first log entry
        </div>
      ) : (
        state.log.map((entry) => (
          <LogEntryRow
            key={entry.date}
            entry={entry}
            isOpen={openDates.has(entry.date)}
            onToggle={() => toggleDate(entry.date)}
            onSave={saveEntry}
            onDelete={deleteEntry}
          />
        ))
      )}
    </div>
  )
}
