interface HeaderProps {
  onExportAll: () => void
}

function formatDate(d: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function Header({ onExportAll }: HeaderProps) {
  return (
    <header>
      <div className="logo">
        JOEY — <span>WORK OS</span>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={onExportAll}>
          export all .md
        </button>
        <div className="date-badge">{formatDate(new Date())}</div>
      </div>
    </header>
  )
}
