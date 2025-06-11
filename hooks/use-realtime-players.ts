"use client"

import { useState, useEffect, useRef } from "react"
import { onPlayersChange, type Player } from "@/services/supabase"

export default function useRealtimePlayers() {
  const [players, setPlayers] = useState<Record<string, Player>>({})
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (isInitializedRef.current) {
      return
    }
    
    isInitializedRef.current = true

    // Clean up any existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    // Subscribe to player changes
    const unsubscribe = onPlayersChange((playersData) => {
      setPlayers(playersData)
    })

    unsubscribeRef.current = unsubscribe

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [])

  return { players }
}
