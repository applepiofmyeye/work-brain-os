const ITEMS = [
  { id: 'loops', label: 'Open Loops', hasBadge: true },
  { id: 'questions', label: 'Questions', hasBadge: true },
  { id: 'context', label: 'Context' },
  { id: 'log', label: 'Daily Log' },
  { id: 'switch', label: 'Switch Helper' },
]

export default function Nav({ active, onChange, loopCount, questionCount }) {
  const badges = { loops: loopCount, questions: questionCount }

  return (
    <nav>
      <div className="nav-label">Sections</div>
      {ITEMS.map((item) => (
        <div
          key={item.id}
          className={`nav-item${active === item.id ? ' active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <div className="dot" />
          {item.label}
          {item.hasBadge && (
            <span className="badge">{badges[item.id]}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
