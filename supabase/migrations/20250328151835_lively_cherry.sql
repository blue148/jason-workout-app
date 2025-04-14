/*
  # Create moves table and add initial data

  1. New Tables
    - `moves`
      - `id` (text, primary key) - Short identifier for the move
      - `name` (text) - Display name of the move
      - `created_at` (timestamp)

  2. Initial Data
    - Inserts all predefined moves
*/

CREATE TABLE IF NOT EXISTS moves (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert initial moves data
INSERT INTO moves (id, name) VALUES
  ('Jab', 'Left Jab'),
  ('Cross', 'Right Cross'),
  ('LH', 'Left Hook'),
  ('RH', 'Right Hook'),
  ('PK', 'Push Kicks'),
  ('LKick', 'Left Kick'),
  ('RKick', 'Right Kick'),
  ('LKnee', 'Left Knee'),
  ('RKnee', 'Right Knee'),
  ('Pepper', 'Pepper Punches'),
  ('SQ', 'Squat');

-- Enable RLS
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read moves data
CREATE POLICY "Anyone can view moves"
  ON moves
  FOR SELECT
  TO public
  USING (true);