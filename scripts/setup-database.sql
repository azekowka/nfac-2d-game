-- Create players table if it doesn't exist
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  color TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to select players
CREATE POLICY "Allow anyone to select players" 
  ON players FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert players
CREATE POLICY "Allow anyone to insert players" 
  ON players FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to update their own players
CREATE POLICY "Allow users to update their own players" 
  ON players FOR UPDATE 
  USING (true);

-- Create policy to allow users to delete their own players
CREATE POLICY "Allow users to delete their own players" 
  ON players FOR DELETE 
  USING (true);

-- Enable realtime subscriptions for this table
ALTER PUBLICATION supabase_realtime ADD TABLE players;
