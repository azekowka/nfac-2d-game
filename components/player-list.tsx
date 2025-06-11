"use client"
import useRealtimePlayers from "@/hooks/use-realtime-players"

export default function PlayerList() {
  const { players } = useRealtimePlayers()

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Players Online</h2>
      <div className="space-y-2">
        {Object.values(players).length === 0 ? (
          <p className="text-gray-400">No players online</p>
        ) : (
          Object.values(players).map((player) => (
            <div key={player.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: player.color }}></div>
              <span className="text-white">{player.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
