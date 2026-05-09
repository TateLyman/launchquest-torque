import {
  Activity,
  BadgeCheck,
  ClipboardCheck,
  Copy,
  CircleCheck,
  ExternalLink,
  Flame,
  GitBranch,
  RadioTower,
  Send,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Trophy,
  Wallet,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

type QuestKey = 'scan_completed' | 'critical_fixed' | 'report_shared' | 'builder_referred'

type Quest = {
  key: QuestKey
  label: string
  points: number
  eventName: string
  signal: string
}

type ActivityEvent = {
  userPubkey: string
  timestamp: string
  eventName: string
  data: {
    repoUrl: string
    reportScore: number
    highFindings: number
    mediumFindings: number
    points: number
    source: string
  }
}

type IngestState = {
  status: 'idle' | 'sending' | 'sent' | 'error'
  message: string
}

const demoWallets = [
  'F1xSafe11111111111111111111111111111111111',
  'McpReady2222222222222222222222222222222222',
  'LaunchLoop3333333333333333333333333333333',
]

const quests: Quest[] = [
  {
    key: 'scan_completed',
    label: 'Shipcheck scan',
    points: 12,
    eventName: 'secure_launch_scan_completed',
    signal: 'Evidence that a repo was scanned before launch.',
  },
  {
    key: 'critical_fixed',
    label: 'Fix verified',
    points: 30,
    eventName: 'secure_launch_fix_verified',
    signal: 'A high or medium launch blocker was remediated.',
  },
  {
    key: 'report_shared',
    label: 'Report shared',
    points: 18,
    eventName: 'secure_launch_report_shared',
    signal: 'The builder shared proof of launch-readiness publicly.',
  },
  {
    key: 'builder_referred',
    label: 'Builder referred',
    points: 24,
    eventName: 'secure_launch_builder_referred',
    signal: 'A second builder joined the secure-launch loop.',
  },
]

const frictionLog = [
  'Torque MCP install path is clear with npx @torque-labs/mcp@latest.',
  'Custom events need one ingested sample before query generation is useful.',
  'The ingester API key must stay server-side; the app includes a Vercel proxy.',
  'Hackathon submissions require an X demo video and a Colosseum profile link.',
]

function App() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/TateLyman/shipcheck-demo-app')
  const [wallet, setWallet] = useState(demoWallets[0])
  const [proxyUrl, setProxyUrl] = useState(import.meta.env.VITE_EVENT_PROXY_URL ?? '/api/ingest')
  const [score, setScore] = useState(72)
  const [highFindings, setHighFindings] = useState(1)
  const [mediumFindings, setMediumFindings] = useState(2)
  const [activity, setActivity] = useState<ActivityEvent[]>(() =>
    quests.slice(0, 2).map((quest, index) =>
      buildEvent(quest, demoWallets[index], repoUrl, score - index * 8, highFindings, mediumFindings),
    ),
  )
  const [copied, setCopied] = useState('')
  const [ingestState, setIngestState] = useState<IngestState>({
    status: 'idle',
    message: 'Ready to send through the server-side Torque proxy.',
  })

  const leaderboard = useMemo(() => {
    const rows = new Map<string, { wallet: string; events: number; points: number; lastSeen: number }>()
    for (const event of activity) {
      const current = rows.get(event.userPubkey) ?? {
        wallet: event.userPubkey,
        events: 0,
        points: 0,
        lastSeen: 0,
      }
      current.events += 1
      current.points += event.data.points
      current.lastSeen = Math.max(current.lastSeen, new Date(event.timestamp).getTime())
      rows.set(event.userPubkey, current)
    }
    return [...rows.values()].sort((a, b) => b.points - a.points || b.lastSeen - a.lastSeen)
  }, [activity])

  const selectedPayload = activity[0] ?? buildEvent(quests[0], wallet, repoUrl, score, highFindings, mediumFindings)

  const totalPoints = leaderboard.reduce((sum, row) => sum + row.points, 0)
  const totalEvents = activity.length
  const launchStatus = score >= 85 && highFindings === 0 ? 'ready' : score >= 70 ? 'needs fixes' : 'blocked'

  function addEvent(quest: Quest, user = wallet) {
    setActivity((events) => [
      buildEvent(quest, user, repoUrl, score, highFindings, mediumFindings),
      ...events,
    ])
  }

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1600)
  }

  async function sendSelectedEvent() {
    setIngestState({ status: 'sending', message: 'Sending selected event through the proxy.' })

    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedPayload),
      })
      const text = await response.text()
      let parsed: unknown

      try {
        parsed = text ? JSON.parse(text) : {}
      } catch {
        parsed = text
      }

      if (!response.ok) {
        const detail =
          parsed && typeof parsed === 'object' && 'error' in parsed
            ? String(parsed.error)
            : `HTTP ${response.status}`
        throw new Error(detail)
      }

      setIngestState({ status: 'sent', message: 'Proxy accepted the Torque event.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown proxy error'
      setIngestState({ status: 'error', message })
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="LaunchQuest status">
        <div className="brand-block">
          <span className="brand-mark"><ShieldCheck size={20} /></span>
          <div>
            <p className="eyebrow">Torque MCP hackathon build</p>
            <h1>LaunchQuest</h1>
          </div>
        </div>
        <div className="status-strip" aria-label="Current metrics">
          <Metric label="events" value={totalEvents.toString()} />
          <Metric label="points" value={totalPoints.toString()} />
          <Metric label="status" value={launchStatus} />
        </div>
      </section>

      <section className="workspace">
        <div className="control-panel">
          <div className="panel-heading">
            <span><GitBranch size={18} /></span>
            <h2>Quest console</h2>
          </div>

          <label className="field-label" htmlFor="repo">
            Repo
            <input id="repo" value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} />
          </label>

          <label className="field-label" htmlFor="wallet">
            Wallet
            <input id="wallet" value={wallet} onChange={(event) => setWallet(event.target.value)} />
          </label>

          <div className="score-grid">
            <label className="field-label" htmlFor="score">
              Score
              <input
                id="score"
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(event) => setScore(Number(event.target.value))}
              />
            </label>
            <label className="field-label" htmlFor="high">
              High
              <input
                id="high"
                type="number"
                min="0"
                value={highFindings}
                onChange={(event) => setHighFindings(Number(event.target.value))}
              />
            </label>
            <label className="field-label" htmlFor="medium">
              Medium
              <input
                id="medium"
                type="number"
                min="0"
                value={mediumFindings}
                onChange={(event) => setMediumFindings(Number(event.target.value))}
              />
            </label>
          </div>

          <div className="quest-list" aria-label="Quest actions">
            {quests.map((quest) => (
              <button className="quest-button" key={quest.key} type="button" onClick={() => addEvent(quest)}>
                <span>
                  <BadgeCheck size={17} />
                  {quest.label}
                </span>
                <strong>{quest.points}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="event-panel">
          <div className="panel-heading">
            <span><RadioTower size={18} /></span>
            <h2>Torque event</h2>
            <button
              className="icon-button"
              type="button"
              aria-label="Copy event payload"
              onClick={() => copyText('payload', JSON.stringify(selectedPayload, null, 2))}
            >
              <Copy size={16} />
            </button>
          </div>
          <label className="field-label" htmlFor="proxy">
            Proxy
            <input id="proxy" value={proxyUrl} onChange={(event) => setProxyUrl(event.target.value)} />
          </label>
          <pre className="payload"><code>{JSON.stringify(selectedPayload, null, 2)}</code></pre>
          <div className="ingest-row">
            <button
              className="send-button"
              type="button"
              disabled={ingestState.status === 'sending'}
              onClick={sendSelectedEvent}
            >
              <Send size={16} />
              {ingestState.status === 'sending' ? 'Sending' : 'Send event'}
            </button>
            <span className={`ingest-state ${ingestState.status}`}>
              {ingestState.status === 'sent' ? <CircleCheck size={15} /> : null}
              {ingestState.status === 'error' ? <TriangleAlert size={15} /> : null}
              {ingestState.status === 'idle' || ingestState.status === 'sending' ? <RadioTower size={15} /> : null}
              {ingestState.message}
            </span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="board">
          <div className="panel-heading">
            <span><Trophy size={18} /></span>
            <h2>Leaderboard</h2>
          </div>
          <div className="leaderboard">
            {leaderboard.map((row, index) => (
              <div className="leader-row" key={row.wallet}>
                <span className="rank">{index + 1}</span>
                <span className="wallet">{row.wallet}</span>
                <span>{row.events} events</span>
                <strong>{row.points}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="board">
          <div className="panel-heading">
            <span><Activity size={18} /></span>
            <h2>Custom events</h2>
          </div>
          <div className="event-table">
            {quests.map((quest) => (
              <div key={quest.key}>
                <code>{quest.eventName}</code>
                <span>{quest.signal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="board">
          <div className="panel-heading">
            <span><Flame size={18} /></span>
            <h2>Friction log</h2>
          </div>
          <ul className="friction-list">
            {frictionLog.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="submission-panel">
        <div>
          <p className="eyebrow">Submission pack</p>
          <h2>Built for the Torque MCP track.</h2>
        </div>
        <div className="submission-actions">
          <a href="https://superteam.fun/earn/listing/build-with-torque-mcp-1/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Track
          </a>
          <a href="https://platform.torque.so/docs/mcp/quickstart" target="_blank" rel="noreferrer">
            <Sparkles size={16} />
            MCP docs
          </a>
          <button
            type="button"
            onClick={() => copyText('setup', torqueSetup)}
          >
            <ClipboardCheck size={16} />
            {copied === 'setup' ? 'Copied' : 'Setup'}
          </button>
          <button
            type="button"
            onClick={() => copyText('event-schema', JSON.stringify(eventSchema, null, 2))}
          >
            <Wallet size={16} />
            {copied === 'event-schema' ? 'Copied' : 'Schema'}
          </button>
        </div>
      </section>
    </main>
  )
}

function buildEvent(
  quest: Quest,
  userPubkey: string,
  repoUrl: string,
  reportScore: number,
  highFindings: number,
  mediumFindings: number,
): ActivityEvent {
  return {
    userPubkey,
    timestamp: new Date().toISOString(),
    eventName: quest.eventName,
    data: {
      repoUrl,
      reportScore,
      highFindings,
      mediumFindings,
      points: quest.points,
      source: 'launchquest',
    },
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

const eventSchema = {
  name: 'Secure Launch Quest',
  eventName: 'secure_launch_scan_completed',
  fields: [
    { fieldName: 'repoUrl', type: 'STRING', label: 'Repository URL' },
    { fieldName: 'reportScore', type: 'NUMBER', label: 'Shipcheck score' },
    { fieldName: 'highFindings', type: 'NUMBER', label: 'High findings' },
    { fieldName: 'mediumFindings', type: 'NUMBER', label: 'Medium findings' },
    { fieldName: 'points', type: 'NUMBER', label: 'Quest points' },
    { fieldName: 'source', type: 'STRING', label: 'Origin app' },
  ],
}

const torqueSetup = `claude mcp add torque -e TORQUE_API_TOKEN=your-token -- npx @torque-labs/mcp@latest

Create project:
LaunchQuest - secure-launch growth loops for MCP and app builders.

Create custom events:
secure_launch_scan_completed
secure_launch_fix_verified
secure_launch_report_shared
secure_launch_builder_referred

Generate incentive query:
source: custom_event
metric: sum(points)
distribution: leaderboard
customFormula: RANK == 1 ? 150 : RANK == 2 ? 100 : RANK == 3 ? 50 : 0`

export default App
