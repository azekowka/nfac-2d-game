"use client"

import { useEffect, useRef } from "react"
import usePlayerMovement from "@/hooks/use-player-movement"
import useRealtimePlayers from "@/hooks/use-realtime-players"

interface GameFieldProps {
  playerName: string
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SIZE = 4

export default function GameField({ playerName }: GameFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { players } = useRealtimePlayers()
  const { currentPlayer } = usePlayerMovement(playerName)

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Draw all players
    Object.values(players).forEach((player) => {
      ctx.fillStyle = player.color
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE)
    })

    // Draw current player with a slight highlight
    if (currentPlayer) {
      ctx.fillStyle = currentPlayer.color
      ctx.fillRect(currentPlayer.x, currentPlayer.y, PLAYER_SIZE, PLAYER_SIZE)

      // Draw a subtle highlight around current player
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.strokeRect(currentPlayer.x - 1, currentPlayer.y - 1, PLAYER_SIZE + 2, PLAYER_SIZE + 2)
    }
  }, [players, currentPlayer])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border border-gray-700 rounded-lg shadow-lg bg-gray-800"
      />
      <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">Use W/A/S/D to move</div>
    </div>
  )
}
