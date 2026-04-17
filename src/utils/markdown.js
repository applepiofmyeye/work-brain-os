const stamp = () =>
  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export function exportLoops(loops) {
  const open = loops.filter((l) => !l.done)
  const done = loops.filter((l) => l.done)

  let md = `# Open Loops\n_${stamp()}_\n\n`
  md += `## Summary\n| Status | Count |\n|--------|-------|\n`
  md += `| Active | ${open.filter((l) => l.status === 'active').length} |\n`
  md += `| Blocked | ${open.filter((l) => l.status === 'blocked').length} |\n`
  md += `| Waiting | ${open.filter((l) => l.status === 'waiting').length} |\n`
  md += `| Done | ${done.length} |\n\n`

  for (const status of ['active', 'blocked', 'waiting']) {
    const items = open.filter((l) => l.status === status)
    if (!items.length) continue
    md += `## ${status[0].toUpperCase() + status.slice(1)}\n`
    for (const l of items) {
      md += `\n### ${l.title}\n`
      if (l.blocker)
        md += `- **${status === 'waiting' ? 'Waiting on' : 'Blocked by'}:** ${l.blocker}\n`
      md += `- **Next step:** ${l.next}\n`
    }
    md += '\n'
  }

  if (done.length) {
    md += `## Completed\n`
    done.forEach((l) => { md += `- ~~${l.title}~~\n` })
    md += '\n'
  }

  return md
}

export function exportQuestions(questions) {
  let md = `# Questions\n_${stamp()}_\n\n`

  const open = questions.filter((q) => !q.asked)
  const asked = questions.filter((q) => q.asked)

  if (open.length) {
    md += `## To Ask\n`
    open.forEach((q) => {
      md += `\n- ${q.text}`
      if (q.context) md += `\n  - _Context: ${q.context}_`
      md += '\n'
    })
    md += '\n'
  }

  if (asked.length) {
    md += `## Asked\n`
    asked.forEach((q) => { md += `- ~~${q.text}~~\n` })
    md += '\n'
  }

  return md
}

export function exportLog(log) {
  let md = `# Daily Log\n_${stamp()}_\n\n`

  if (!log.length) return md + '_No entries yet._\n'

  log.forEach((entry) => {
    md += `## ${entry.date}\n`
    if (entry.today) md += `\n**Done**\n${entry.today}\n`
    if (entry.tomorrow) md += `\n**Tomorrow**\n${entry.tomorrow}\n`
    md += '\n'
  })

  return md
}

export function exportNotes(notes) {
  return `# Context & Notes\n_${stamp()}_\n\n${notes || '_No notes yet._'}\n`
}

export function exportAll(state) {
  return [
    exportLoops(state.loops),
    '---\n\n',
    exportQuestions(state.questions),
    '---\n\n',
    exportLog(state.log),
    '---\n\n',
    exportNotes(state.notes),
  ].join('')
}

export function downloadMd(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
