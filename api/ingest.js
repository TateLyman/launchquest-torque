const allowedEvents = new Set([
  'secure_launch_scan_completed',
  'secure_launch_fix_verified',
  'secure_launch_report_shared',
  'secure_launch_builder_referred',
])

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'method_not_allowed' })
  }

  const apiKey = process.env.TORQUE_EVENT_API_KEY
  if (!apiKey) {
    return response.status(500).json({ error: 'missing_torque_event_api_key' })
  }

  const event = request.body
  if (!event || typeof event !== 'object') {
    return response.status(400).json({ error: 'invalid_event' })
  }

  if (!allowedEvents.has(event.eventName)) {
    return response.status(400).json({ error: 'event_not_allowed' })
  }

  if (!event.userPubkey || typeof event.userPubkey !== 'string') {
    return response.status(400).json({ error: 'missing_user_pubkey' })
  }

  const normalizedEvent = {
    ...event,
    timestamp:
      typeof event.timestamp === 'number'
        ? new Date(event.timestamp).toISOString()
        : event.timestamp || new Date().toISOString(),
  }

  const torqueResponse = await fetch('https://ingest.torque.so/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(normalizedEvent),
  })

  const text = await torqueResponse.text()
  let payload
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    payload = { raw: text }
  }

  return response.status(torqueResponse.status).json(payload)
}
