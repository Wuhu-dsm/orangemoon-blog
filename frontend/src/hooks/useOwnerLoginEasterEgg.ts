import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const OWNER_SEQUENCE = 'sorablog'
const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function useOwnerLoginEasterEgg() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let buffer = ''

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const tagName = target?.tagName

      if (tagName && IGNORED_TAGS.has(tagName)) {
        return
      }

      if (event.key.length !== 1) {
        return
      }

      buffer = `${buffer}${event.key.toLowerCase()}`.slice(
        -OWNER_SEQUENCE.length,
      )

      if (buffer === OWNER_SEQUENCE) {
        const returnTo = `${location.pathname}${location.search}`
        navigate(`/owner-login?returnTo=${encodeURIComponent(returnTo)}`)
        buffer = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [location.pathname, location.search, navigate])
}
