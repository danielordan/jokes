export type JokeError = 'INVALID_TOPIC' | 'TOPIC_NOT_ALLOWED' | 'GENERATION_FAILED' | 'NETWORK'

export type JokeResult = { ok: true; joke: string } | { ok: false; error: JokeError }

const KNOWN_ERRORS: JokeError[] = ['INVALID_TOPIC', 'TOPIC_NOT_ALLOWED', 'GENERATION_FAILED']

export async function requestJoke(topic: string): Promise<JokeResult> {
  let response: Response
  try {
    response = await fetch('/api/joke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    })
  } catch {
    // No response from the server at all.
    return { ok: false, error: 'NETWORK' }
  }

  const body: unknown = await response.json().catch(() => null)
  const data = (body ?? {}) as { joke?: unknown; error?: unknown }

  if (response.ok && typeof data.joke === 'string' && data.joke) {
    return { ok: true, joke: data.joke }
  }
  const error = KNOWN_ERRORS.find((code) => code === data.error) ?? 'GENERATION_FAILED'
  return { ok: false, error }
}
