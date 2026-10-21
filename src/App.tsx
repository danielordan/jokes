import { useState } from 'react'
import kitten from './assets/kitten.svg'
import { Burst, Heart, Paw, Smiley, Sparkles } from './decorations'
import { TEXTS, TOPIC_MAX_LENGTH } from './texts'

export default function App() {
  const [topic, setTopic] = useState('')

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
          {/* Disabled until the AI service is connected (Milestone 2). */}
          <button type="button" className="primary-button" disabled>
            <Sparkles className="button-sparkles" />
            <span>{TEXTS.button}</span>
          </button>
          <Burst className="action-burst action-burst--mirror" />
        </div>

        <p className="status" role="status" aria-live="polite"></p>

        <section className="joke-card">
          <Heart className="card-heart card-heart--1" />
          <Heart className="card-heart card-heart--2" />
          <Heart className="card-heart card-heart--3" />
          <div className="joke-empty">
            <Smiley className="joke-smiley" />
            <p className="joke-empty-text">{TEXTS.emptyCard}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
