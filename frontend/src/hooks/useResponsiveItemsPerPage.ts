import { useEffect, useState } from 'react'

function getItemsPerPage(desktopItems: number) {
  if (typeof window === 'undefined') {
    return desktopItems
  }

  if (window.matchMedia('(max-width: 639px)').matches) {
    return 1
  }

  if (window.matchMedia('(max-width: 1023px)').matches) {
    return Math.min(2, desktopItems)
  }

  return desktopItems
}

export function useResponsiveItemsPerPage(desktopItems: number) {
  const [itemsPerPage, setItemsPerPage] = useState(() =>
    getItemsPerPage(desktopItems)
  )

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(desktopItems))
    }

    updateItemsPerPage()

    const smallQuery = window.matchMedia('(max-width: 639px)')
    const mediumQuery = window.matchMedia('(max-width: 1023px)')

    smallQuery.addEventListener('change', updateItemsPerPage)
    mediumQuery.addEventListener('change', updateItemsPerPage)

    return () => {
      smallQuery.removeEventListener('change', updateItemsPerPage)
      mediumQuery.removeEventListener('change', updateItemsPerPage)
    }
  }, [desktopItems])

  return itemsPerPage
}
