export interface Loop {
  id: number
  title: string
  status: 'active' | 'blocked' | 'waiting'
  blocker: string
  next: string
  done: boolean
  created: string
}

export interface Question {
  id: number
  text: string
  context: string
  asked: boolean
}

export interface LogEntry {
  date: string
  today: string
  tomorrow: string
}

export interface ContextSwitch {
  id: number
  task: string
  state: string
  next: string
  time: string
}

export interface AppState {
  loops: Loop[]
  questions: Question[]
  notes: string
  log: LogEntry[]
  switches: ContextSwitch[]
}

export type UpdateStore = (updater: (prev: AppState) => AppState) => void

export interface SectionProps {
  state: AppState
  update: UpdateStore
}
