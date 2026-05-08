# Friction Log

## Torque MCP setup

- `npx @torque-labs/mcp@latest --help` exposes the API token, private-key, API URL, platform URL, and ingester URL flags clearly.
- The package advertises `@torque-labs/mcp@0.4.7` as latest on npm.
- Custom-event incentives need a first ingested event before the custom event has query-ready column mapping.

## Product decision

LaunchQuest uses custom events instead of on-chain instructions first because the hackathon asks for measurable live activity, and off-chain launch-readiness work is easier to trigger from a security workflow.

## Integration boundary

The browser never stores the Torque event-ingestion API key. Production deployment should route events through `api/ingest.js` with `TORQUE_EVENT_API_KEY` configured server-side.

## Submission blockers

- Listing checked May 8, 2026: open, human-only, 7 submissions, 3,000 USDC total prizes, winner announcement May 26, 2026.
- Needs a Torque account and auth token.
- Needs a Torque event-ingestion API key.
- Needs a Superteam Earn submission.
- Needs a public X demo video tagging `@torqueprotocol`.
- Needs a Colosseum project profile URL if submitting to the Frontier hackathon.
