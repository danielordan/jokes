export type JokeError = 'INVALID_TOPIC' | 'TOPIC_NOT_ALLOWED' | 'GENERATION_FAILED' | 'TIMEOUT' | 'OFFLINE'

export type JokeResult = { ok: true; joke: string } | { ok: false; error: JokeError }

const KNOWN_ERRORS: JokeError[] = ['INVALID_TOPIC', 'TOPIC_NOT_ALLOWED', 'GENERATION_FAILED']

const CLIENT_TIMEOUT_MS = 25_000

export async function requestJoke(topic: string): Promise<JokeResult> {
  // Known to be offline: don't send a request at all.
  if (!navigator.onLine) return { ok: false, error: 'OFFLINE' }

  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, CLIENT_TIMEOUT_MS)

  try {
    let response: Response
    try {
      response = await fetch('/api/joke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
        signal: controller.signal,
      })
    } catch {
      // Aborted by our timeout, or no response from the server at all.
      return { ok: false, error: timedOut ? 'TIMEOUT' : 'OFFLINE' }
    }

    const body: unknown = await response.json().catch(() => null)
    if (timedOut) return { ok: false, error: 'TIMEOUT' }
    const data = (body ?? {}) as { joke?: unknown; error?: unknown }

    if (response.ok && typeof data.joke === 'string' && data.joke) {
      return { ok: true, joke: data.joke }
    }
    const error = KNOWN_ERRORS.find((code) => code === data.error) ?? 'GENERATION_FAILED'
    return { ok: false, error }
  } finally {
    clearTimeout(timer)
  }
}
