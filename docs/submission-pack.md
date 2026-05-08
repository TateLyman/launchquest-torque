# LaunchQuest Submission Pack

## Project Title

LaunchQuest

## Project Description

LaunchQuest turns secure-launch work for MCP servers and AI-built apps into a measurable Torque growth loop.

Builders earn points when they run a Shipcheck-style launch scan, fix launch blockers, share a report, and refer another builder into the secure-launch loop. The app generates Torque custom-event payloads, shows a leaderboard, and includes a server-side ingestion proxy so the Torque API key stays out of the browser.

The project is built for the Torque MCP track because it uses Torque's custom-event model for off-chain activity and gives MCP builders a practical reason to invite more users: each secure launch action increases their leaderboard score.

## Links

- GitHub: https://github.com/TateLyman/launchquest-torque
- Live app: https://tatelyman.github.io/launchquest-torque/
- Demo video file: https://github.com/TateLyman/launchquest-torque/raw/main/docs/media/launchquest-demo.mp4
- Torque MCP docs: https://platform.torque.so/docs/mcp/quickstart
- Torque event proof: https://github.com/TateLyman/launchquest-torque/blob/main/docs/torque-event-proof.md
- Superteam listing: https://superteam.fun/earn/listing/build-with-torque-mcp-1/
- Listing status checked May 8, 2026: open, human-only, 7 submissions, 3,000 USDC total prizes, winner announcement May 26, 2026.

## Torque Events

```txt
secure_launch_scan_completed
secure_launch_fix_verified
secure_launch_report_shared
secure_launch_builder_referred
```

## Demo Video Outline

1. Open LaunchQuest and show the quest console.
2. Add a repo URL and wallet.
3. Click `Shipcheck scan`, `Fix verified`, and `Report shared`.
4. Show the generated Torque event payload.
5. Show the leaderboard updating.
6. Open the README section with the Torque MCP setup command.
7. Explain that production ingestion uses `api/ingest.js` with `TORQUE_EVENT_API_KEY` server-side.

## X Post Draft

Built LaunchQuest for the Torque MCP track.

It turns secure-launch work for MCP servers and AI-built apps into Torque custom events: scan completed, fix verified, report shared, builder referred.

Repo: https://github.com/TateLyman/launchquest-torque
Demo: https://tatelyman.github.io/launchquest-torque/

@torqueprotocol

Post from: https://x.com/tateprograms

## Superteam Form Answers

Project Title:
LaunchQuest

Project Description:
LaunchQuest turns secure-launch work for MCP servers and AI-built apps into a measurable Torque growth loop. Builders earn points for scanning a repo, fixing launch blockers, sharing a report, and referring another builder. The app generates Torque custom-event payloads, displays a leaderboard, and ships a server-side ingestion proxy that forwards allowed events to Torque without exposing the event API key in the browser. All four custom events were created in Torque and accepted by the Torque event API.

Project GitHub Link:
https://github.com/TateLyman/launchquest-torque

Project Website:
https://tatelyman.github.io/launchquest-torque/

Did you submit this project to the official Frontier Hackathon on Colosseum?:
No. Frontier registration had already passed, so this is being submitted for the Torque MCP track on Superteam Earn.

Link to your project's Colosseum profile:
https://github.com/TateLyman/launchquest-torque/blob/main/docs/colosseum-status.md

Link to your Demo Video on X:
Pending. Video file is ready at https://github.com/TateLyman/launchquest-torque/raw/main/docs/media/launchquest-demo.mp4

Presentation Link:
https://github.com/TateLyman/launchquest-torque/blob/main/docs/submission-pack.md

Project Twitter Profile Link:
https://x.com/tateprograms

## Manual Submission Blockers

- Parent/legal guardian consent for Superteam Earn terms if the operator is under 18.
- Colosseum Frontier project profile URL.
- Public X demo post tagging `@torqueprotocol`; use the MP4 linked above.
- Torque platform credentials if we want to configure live custom-event ingestion rather than the static GitHub Pages demo.
