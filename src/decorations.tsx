// Decorative SVG icons only — none of these are interactive.

type IconProps = { className?: string }

export function Heart({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.5c2.2 0 3.6 1.3 5.4 3.4 1.8-2.1 3.2-3.4 5.4-3.4 3.7 0 5.7 3.9 4.2 7.3C19.5 16.4 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Sparkles({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8z" fill="currentColor" />
      <path d="M18 13l.9 2.6 2.6.9-2.6.9L18 20l-.9-2.6-2.6-.9 2.6-.9z" fill="currentColor" />
      <path d="M18.5 2l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="currentColor" />
    </svg>
  )
}

export function Paw({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="12" cy="16.5" rx="5" ry="4.2" />
        <ellipse cx="5.5" cy="10.5" rx="2.2" ry="2.8" />
        <ellipse cx="9.3" cy="6.5" rx="2.2" ry="2.9" />
        <ellipse cx="14.7" cy="6.5" rx="2.2" ry="2.9" />
        <ellipse cx="18.5" cy="10.5" rx="2.2" ry="2.8" />
      </g>
    </svg>
  )
}

export function Smiley({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 120 80" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
        <circle cx="60" cy="40" r="24" />
        <path d="M49 46c5 7 17 7 22 0" />
        <path d="M14 22l10 6M10 40h12M14 58l10-6M106 22l-10 6M110 40H98M106 58l-10-6" />
      </g>
      <circle cx="51" cy="34" r="3" fill="currentColor" />
      <circle cx="69" cy="34" r="3" fill="currentColor" />
    </svg>
  )
}

// Short "burst" strokes shown beside the title and the button.
export function Burst({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 6l6 3" />
        <path d="M3 13h7" />
        <path d="M4 20l6-3" />
      </g>
    </svg>
  )
}

export function Warning({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.3 3.9a2 2 0 0 1 3.4 0l8 13.6A2 2 0 0 1 20 20.5H4a2 2 0 0 1-1.7-3L10.3 3.9z"
        fill="currentColor"
      />
      <rect x="11" y="8.5" width="2" height="6" rx="1" fill="#fff" />
      <circle cx="12" cy="17.2" r="1.2" fill="#fff" />
    </svg>
  )
}
