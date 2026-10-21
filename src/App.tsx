import { useState } from 'react'
import { requestJoke, type JokeError } from './api'
import kitten from './assets/kitten.svg'
import { Burst, Heart, Paw, Smiley, Sparkles, Warning } from './decorations'
import { TEXTS, TOPIC_MAX_LENGTH } from './texts'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline'

// Status line text per failure (DESIGN 1.3 / 1.4).
const ERROR_TEXT: Record<JokeError, string> = {
  INVALID_TOPIC: TEXTS.errorGeneral,
  GENERATION_FAILED: TEXTS.errorGeneral,
  TIMEOUT: TEXTS.errorGeneral,
  TOPIC_NOT_ALLOWED: TEXTS.errorNotAllowed,
  OFFLINE: TEXTS.offline,
}

export default function App() {
  const [topic, setTopic] = useState('')
  const [joke, setJoke] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleCreate() {
    if (status === 'loading') return
    setStatus('loading')
    setErrorMessage(null)
    const result = await requestJoke(topic)
    if (result.ok) {
      setJoke(result.joke)
      setStatus('success')
    } else {
      // Keep the topic and the previous joke on failure.
      setErrorMessage(ERROR_TEXT[result.error])
      setStatus(result.error === 'OFFLINE' ? 'offline' : 'error')
    }
  }

  const statusText = status === 'loading' ? TEXTS.loading : errorMessage

  return (
    <div className="app">
      <header className="hero">
        <Heart className="hero-heart hero-heart--1" />
        <Heart className="hero-heart hero-heart--2" />
        <Heart className="hero-heart hero-heart--3" />
        <Heart className="hero-heart hero-heart--4" />
        <Heart className="hero-heart hero-heart--5" />
        <h1 className="title">
          <Burst className="title-burst" />
          <span>{TEXTS.title}</span>
          <Burst className="title-burst title-burst--mirror" />
        </h1>
        <img className="kitten" src={kitten} alt="" width={220} height={198} />
      </header>

      <main className="content">
        <section className="topic">
          <h2 className="topic-label">
            <label htmlFor="topic">{TEXTS.topicLabel}</label>
          </h2>
          <div className="input-wrap">
            <input
              id="topic"
              className="topic-input"
              type="text"
              value={topic}
              maxLength={TOPIC_MAX_LENGTH}
              placeholder={TEXTS.topicPlaceholder}
              aria-describedby="topic-counter"
              autoComplete="off"
              onChange={(e) => setTopic(e.target.value.slice(0, TOPIC_MAX_LENGTH))}
            />
            <Paw className="input-paw" />
          </div>
          <p id="topic-counter" className="counter">
            {topic.length}/{TOPIC_MAX_LENGTH}
          </p>
        </section>

        <div className="action">
          <Burst className="action-burst" />
          <button
            type="button"
            className="primary-button"
            disabled={status === 'loading'}
            onClick={handleCreate}
          >
            <Sparkles className="button-sparkles" />
            <span>{TEXTS.button}</span>
          </button>
          <Burst className="action-burst action-burst--mirror" />
        </div>

        <p className={`status status--${status}`} role="status" aria-live="polite">
          {status === 'error' && <Warning className="status-icon" />}
          {statusText}
        </p>

        <section className={status === 'loading' ? 'joke-card is-loading' : 'joke-card'}>
          <Heart className="card-heart card-heart--1" />
          <Heart className="card-heart card-heart--2" />
          <Heart className="card-heart card-heart--3" />
          {joke ? (
            <p className="joke-text" dir="auto">
              {joke}
            </p>
          ) : (
            <div className="joke-empty">
              <Smiley className="joke-smiley" />
              <p className="joke-empty-text">{TEXTS.emptyCard}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
