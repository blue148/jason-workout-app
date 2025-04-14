/*
  # Remove authentication requirements

  1. Changes
    - Remove user_id foreign key constraints
    - Update RLS policies to allow public access
    - Make user_id optional
*/

-- Modify favorite_rounds table
ALTER TABLE favorite_rounds
  DROP CONSTRAINT favorite_rounds_user_id_fkey,
  ALTER COLUMN user_id DROP NOT NULL;

-- Modify saved_workouts table
ALTER TABLE saved_workouts
  DROP CONSTRAINT saved_workouts_user_id_fkey,
  ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies for favorite_rounds
DROP POLICY IF EXISTS "Users can view their own favorite rounds" ON favorite_rounds;
DROP POLICY IF EXISTS "Users can insert their own favorite rounds" ON favorite_rounds;
DROP POLICY IF EXISTS "Users can update their own favorite rounds" ON favorite_rounds;
DROP POLICY IF EXISTS "Users can delete their own favorite rounds" ON favorite_rounds;

CREATE POLICY "Public can view favorite rounds"
  ON favorite_rounds
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert favorite rounds"
  ON favorite_rounds
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update favorite rounds"
  ON favorite_rounds
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete favorite rounds"
  ON favorite_rounds
  FOR DELETE
  TO public
  USING (true);

-- Update RLS policies for saved_workouts
DROP POLICY IF EXISTS "Users can view their own saved workouts" ON saved_workouts;
DROP POLICY IF EXISTS "Users can insert their own saved workouts" ON saved_workouts;
DROP POLICY IF EXISTS "Users can update their own saved workouts" ON saved_workouts;
DROP POLICY IF EXISTS "Users can delete their own saved workouts" ON saved_workouts;

CREATE POLICY "Public can view saved workouts"
  ON saved_workouts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert saved workouts"
  ON saved_workouts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update saved workouts"
  ON saved_workouts
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete saved workouts"
  ON saved_workouts
  FOR DELETE
  TO public
  USING (true);