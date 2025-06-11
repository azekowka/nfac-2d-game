import { createClient, RealtimeChannel } from '@supabase/supabase-js'

// Supabase configuration using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Player {
  id: string
  x: number
  y: number
  color: string
  name: string
  created_at?: string
}

export const initializeSupabase = async (): Promise<boolean> => {
  try {
    // Test the connection
    const { data, error } = await supabase.from('players').select('count').limit(1)
    if (error) {
      console.error('Error connecting to Supabase:', error)
      return false
    }
    console.log('Supabase initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing Supabase:', error)
    return false
  }
}

export const updatePlayerPosition = async (player: Player): Promise<void> => {
  try {
    const { error } = await supabase
      .from('players')
      .upsert(
        {
          id: player.id,
          x: player.x,
          y: player.y,
          color: player.color,
          name: player.name,
        },
        {
          onConflict: 'id',
        }
      )

    if (error) {
      console.error('Error updating player position:', error)
    }
  } catch (error) {
    console.error('Error updating player position:', error)
  }
}

export const removePlayer = async (playerId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('Error removing player:', error)
    }
  } catch (error) {
    console.error('Error removing player:', error)
  }
}

export const onPlayersChange = (callback: (players: Record<string, Player>) => void): (() => void) => {
  // First, get initial data
  const fetchInitialPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')

      if (error) {
        console.error('Error fetching initial players:', error)
        return
      }

      // Convert array to object with id as key for compatibility
      const playersObject = (data || []).reduce((acc: Record<string, Player>, player: Player) => {
        acc[player.id] = player
        return acc
      }, {})

      callback(playersObject)
    } catch (error) {
      console.error('Error fetching initial players:', error)
    }
  }

  fetchInitialPlayers()

  // Create a unique channel name using timestamp to avoid conflicts
  const channelName = `players_changes_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Set up real-time subscription with unique channel
  const playersChannel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
      },
      async () => {
        // Refetch all players when any change occurs
        await fetchInitialPlayers()
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    if (playersChannel) {
      supabase.removeChannel(playersChannel)
    }
  }
}

// Helper function to get all players
export const getAllPlayers = async (): Promise<Player[]> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')

    if (error) {
      console.error('Error fetching players:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

// Clean up all channels (call this when the app/component unmounts)
export const cleanup = async (): Promise<void> => {
  // Remove all channels to clean up any remaining subscriptions
  supabase.removeAllChannels()
}
