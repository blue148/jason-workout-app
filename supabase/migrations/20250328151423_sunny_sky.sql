/*
  # Create workout database schema

  1. New Tables
    - `favorite_rounds`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `combinations` (jsonb)
      - `created_at` (timestamptz)

    - `saved_workouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `rounds` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create favorite_rounds table
CREATE TABLE IF NOT EXISTS favorite_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  combinations jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS and create policies for favorite_rounds
ALTER TABLE favorite_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorite rounds"
  ON favorite_rounds
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorite rounds"
  ON favorite_rounds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorite rounds"
  ON favorite_rounds
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorite rounds"
  ON favorite_rounds
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create saved_workouts table
CREATE TABLE IF NOT EXISTS saved_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  rounds jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS and create policies for saved_workouts
ALTER TABLE saved_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved workouts"
  ON saved_workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved workouts"
  ON saved_workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved workouts"
  ON saved_workouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved workouts"
  ON saved_workouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);