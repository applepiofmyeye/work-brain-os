import { useState, useCallback } from 'react'

const STORAGE_KEY = 'workos'

const SEED = {
  loops: [
    {
      id: 1,
      title: 'Set up local dev environment',
      status: 'active',
      blocker: '',
      next: 'Follow README in repo root, ask team if stuck',
      done: false,
      created: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Understand service ownership map',
      status: 'waiting',
      blocker: 'Onboarding doc from manager',
      next: 'Ping manager for the architecture overview doc',
      done: false,
      created: new Date().toISOString(),
    },
  ],
  questions: [
    {
      id: 1,
      text: 'What is the standard retry policy across services?',
      context: "Relevant to the timeout bug I'm investigating",
      asked: false,
    },
    {
      id: 2,
      text: 'Who is the oncall for auth service this week?',
      context: '',
      asked: false,
    },
  ],
  notes: '',
  log: [],
  switches: [],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        loops: parsed.loops ?? [],
        questions: parsed.questions ?? [],
        notes: parsed.notes ?? '',
        log: parsed.log ?? [],
        switches: parsed.switches ?? [],
      }
    }
  } catch {}
  return SEED
}

export function useStore() {
  const [state, setState] = useState(load)

  const update = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return [state, update]
}
