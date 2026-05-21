import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VisitorState {
  visitorId: string | null
  nickname: string | null
  isLoading: boolean
  error: string | null
  setVisitor: (visitorId: string, nickname: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      visitorId: null,
      nickname: null,
      isLoading: false,
      error: null,
      setVisitor: (visitorId, nickname) =>
        set({ visitorId, nickname, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'visitor-storage',
      partialize: (state) => ({
        visitorId: state.visitorId,
        nickname: state.nickname,
      }),
    },
  ),
)
