"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { updatePlayerPosition, removePlayer } from "@/services/supabase"

// Game constants
const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const PLAYER_SIZE = 4
const MOVEMENT_SPEED = 2

// Generate a random color
const getRandomColor = () => {
  const colors = [
    "#FF5252", // Red
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#FFEB3B", // Yellow
    "#9C27B0", // Purple
    "#FF9800", // Orange
    "#00BCD4", // Cyan
    "#F06292", // Pink
    "#69F0AE", // Light Green
    "#FFCC80", // Light Orange
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default function usePlayerMovement(playerName: string) {
  const [playerId] = useState(() => uuidv4())
  const [currentPlayer, setCurrentPlayer] = useState<{
    id: string
    x: number
    y: number
    color: string
    name: string
  } | null>(null)

  // Initialize player
  useEffect(() => {
    const initialX = Math.floor(Math.random() * (GAME_WIDTH - PLAYER_SIZE))
    const initialY = Math.floor(Math.random() * (GAME_HEIGHT - PLAYER_SIZE))
    const color = getRandomColor()

    const player = {
      id: playerId,
      x: initialX,
      y: initialY,
      color,
      name: playerName,
    }

    setCurrentPlayer(player)
    updatePlayerPosition(player)

    // Clean up when component unmounts
    return () => {
      removePlayer(playerId)
    }
  }, [playerId, playerName])

  // Handle keyboard input
  useEffect(() => {
    if (!currentPlayer) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPlayer) return

      let newX = currentPlayer.x
      let newY = currentPlayer.y

      switch (e.key.toLowerCase()) {
        case "w":
          newY = Math.max(0, currentPlayer.y - MOVEMENT_SPEED)
          break
        case "s":
          newY = Math.min(GAME_HEIGHT - PLAYER_SIZE, currentPlayer.y + MOVEMENT_SPEED)
          break
        case "a":
          newX = Math.max(0, currentPlayer.x - MOVEMENT_SPEED)
          break
        case "d":
          newX = Math.min(GAME_WIDTH - PLAYER_SIZE, currentPlayer.x + MOVEMENT_SPEED)
          break
        default:
          return // Exit if not a movement key
      }

      // Only update if position changed
      if (newX !== currentPlayer.x || newY !== currentPlayer.y) {
        const updatedPlayer = {
          ...currentPlayer,
          x: newX,
          y: newY,
        }
        setCurrentPlayer(updatedPlayer)
        updatePlayerPosition(updatedPlayer)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentPlayer])

  return { currentPlayer }
}
