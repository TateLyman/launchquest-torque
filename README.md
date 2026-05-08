# LaunchQuest

LaunchQuest is a Torque MCP hackathon project for secure launch loops around MCP servers and AI-built apps.

It turns defensive launch-readiness work into measurable Torque custom events:

- `secure_launch_scan_completed`
- `secure_launch_fix_verified`
- `secure_launch_report_shared`
- `secure_launch_builder_referred`

The app includes a local quest console, event payload generator, leaderboard, friction log, and a server-side event-ingestion proxy for Torque.

## Why Torque

The Superteam Earn Torque MCP track rewards projects that use Torque MCP to create a growth loop with measurable live activity. LaunchQuest uses custom events so builders can earn leaderboard points for scanning, fixing, sharing, and referring other secure-launch participants.

## Local Development

```bash
npm install
npm run dev
```

## Torque Setup

Install the Torque MCP server in an MCP client:

```bash
claude mcp add torque -e TORQUE_API_TOKEN=your-token -- npx @torque-labs/mcp@latest
```

Create a Torque project named `LaunchQuest`, then create or attach these custom events:

```txt
secure_launch_scan_completed
secure_launch_fix_verified
secure_launch_report_shared
secure_launch_builder_referred
```

Use this field schema for each event:

```json
[
  { "fieldName": "repoUrl", "type": "STRING", "label": "Repository URL" },
  { "fieldName": "reportScore", "type": "NUMBER", "label": "Shipcheck score" },
  { "fieldName": "highFindings", "type": "NUMBER", "label": "High findings" },
  { "fieldName": "mediumFindings", "type": "NUMBER", "label": "Medium findings" },
  { "fieldName": "points", "type": "NUMBER", "label": "Quest points" },
  { "fieldName": "source", "type": "STRING", "label": "Origin app" }
]
```

Then create a leaderboard incentive from custom events with `sum(points)` as the metric and a fixed-prize formula, for example:

```txt
RANK == 1 ? 150 : RANK == 2 ? 100 : RANK == 3 ? 50 : 0
```

## Event Ingestion

The browser should not contain a Torque event-ingestion API key. Deploy with a serverless proxy and set:

```bash
TORQUE_EVENT_API_KEY=...
```

The included `api/ingest.js` endpoint forwards allowed LaunchQuest events to:

```txt
https://ingest.torque.so/events
```

## Submission Checklist

- Public GitHub repo
- Deployed project URL
- Short demo video on X tagging `@torqueprotocol`
- Superteam Earn submission for `Build with Torque MCP`
- Colosseum project profile if submitting to the Frontier hackathon
- Friction log: [docs/friction-log.md](docs/friction-log.md)
