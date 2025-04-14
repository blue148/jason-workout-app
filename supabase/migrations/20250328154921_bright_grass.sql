/*
  # Update moves table to use name as id

  1. Changes
    - Create temporary table to store moves
    - Drop existing moves table
    - Recreate moves table with name as id
    - Reinsert data with normalized ids
*/

-- Create temporary table to store moves
CREATE TEMP TABLE temp_moves AS
SELECT name, name as id, created_at
FROM moves;

-- Drop existing table
DROP TABLE moves;

-- Recreate table with new schema
CREATE TABLE moves (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reinsert data with normalized ids
INSERT INTO moves (id, name, created_at)
SELECT 
  CASE name
    WHEN 'Left Jab' THEN 'Left Jab'
    WHEN 'Right Cross' THEN 'Right Cross'
    WHEN 'Left Hook' THEN 'Left Hook'
    WHEN 'Right Hook' THEN 'Right Hook'
    WHEN 'Push Kicks' THEN 'Push Kicks'
    WHEN 'Left Kick' THEN 'Left Kick'
    WHEN 'Right Kick' THEN 'Right Kick'
    WHEN 'Left Knee' THEN 'Left Knee'
    WHEN 'Right Knee' THEN 'Right Knee'
    WHEN 'Pepper Punches' THEN 'Pepper Punches'
    WHEN 'Squat' THEN 'Squat'
  END as id,
  name,
  created_at
FROM temp_moves;

-- Enable RLS
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read moves data
CREATE POLICY "Anyone can view moves"
  ON moves
  FOR SELECT
  TO public
  USING (true);