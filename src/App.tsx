import { useState } from 'react'
import { ToastProvider, useToast } from './components/Toast'
import Header from './components/Header'
import Nav, { type TabId } from './components/Nav'
import OpenLoops from './sections/OpenLoops'
import Questions from './sections/Questions'
import ContextNotes from './sections/ContextNotes'
import DailyLog from './sections/DailyLog'
import SwitchHelper from './sections/SwitchHelper'
import { useStore } from './store'
import { exportAll, downloadMd } from './utils/markdown'

function AppInner() {
  const [tab, setTab] = useState<TabId>('loops')
  const [state, update] = useStore()
  const toast = useToast()

  const openLoops = state.loops.filter((l) => !l.done).length
  const openQ = state.questions.filter((q) => !q.asked).length

  function handleExportAll() {
    downloadMd(exportAll(state), `work-os-${new Date().toISOString().slice(0, 10)}.md`)
    toast('Full export downloaded')
  }

  const sections: Record<TabId, React.ReactElement> = {
    loops: <OpenLoops state={state} update={update} />,
    questions: <Questions state={state} update={update} />,
    context: <ContextNotes state={state} update={update} />,
    log: <DailyLog state={state} update={update} />,
    switch: <SwitchHelper state={state} update={update} />,
  }

  return (
    <>
      <Header onExportAll={handleExportAll} />
      <div className="layout">
        <Nav active={tab} onChange={setTab} loopCount={openLoops} questionCount={openQ} />
        <main>{sections[tab]}</main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
