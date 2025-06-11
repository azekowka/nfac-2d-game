"use client"

import type React from "react"
import { useEffect, useState } from "react"
import GameField from "@/components/game-field"
import PlayerList from "@/components/player-list"
import { initializeSupabase } from "@/services/supabase"

export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Supabase
    initializeSupabase()
      .then((success) => {
        if (success) {
          setIsLoading(false)
        } else {
          setError("Failed to initialize Supabase")
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error("Initialization error:", err)
        setError("Failed to initialize game")
        setIsLoading(false)
      })
  }, [])

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim()) {
      setIsPlaying(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  if (!isPlaying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">2D Multiplayer Game</h1>
          <form onSubmit={handleStartGame}>
            <div className="mb-4">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your name
              </label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            <GameField playerName={playerName} />
          </div>
          <div className="md:w-1/4">
            <PlayerList />
          </div>
        </div>
      </div>
    </div>
  )
}
