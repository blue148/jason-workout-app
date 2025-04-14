/*
  # Insert predefined favorite rounds

  1. Changes
    - Insert predefined favorite rounds data with combinations
    - Each round contains 4-5 combinations of moves
    - Combinations include various move patterns for boxing, kicks, and conditioning
    - Using proper UUID format for IDs
*/

INSERT INTO favorite_rounds (id, name, combinations)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Boxing Fundamentals',
    '[
      {
        "id": "pL8fR2vX9tZ3",
        "name": "Basic 1-2",
        "moves": ["Left Jab", "Right Cross"]
      },
      {
        "id": "qW4rT7yU1iO5",
        "name": "Double Jab Cross",
        "moves": ["Left Jab", "Left Jab", "Right Cross"]
      },
      {
        "id": "mN3bV6cX8zL2",
        "name": "Three-Punch Combo",
        "moves": ["Left Jab", "Right Cross", "Left Hook"]
      },
      {
        "id": "kJ7hG4fD1sA9",
        "name": "Four-Punch Combo",
        "moves": ["Left Jab", "Right Cross", "Left Hook", "Right Cross"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Hook Combinations',
    '[
      {
        "id": "bN7vC8xZ2lK3",
        "name": "Jab Hook",
        "moves": ["Left Jab", "Left Hook"]
      },
      {
        "id": "aS2dF4gH6jK8",
        "name": "Cross Hook",
        "moves": ["Right Cross", "Left Hook"]
      },
      {
        "id": "pO9iU7yT5rE3",
        "name": "Double Hook",
        "moves": ["Left Hook", "Right Hook"]
      },
      {
        "id": "wQ2eR4tY6uI8",
        "name": "Four-Punch Hook Finish",
        "moves": ["Left Jab", "Right Cross", "Left Hook", "Right Hook"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Kick Integration',
    '[
      {
        "id": "tF5rG7yH9jK2",
        "name": "Punches to Kick",
        "moves": ["Left Jab", "Right Cross", "Left Kick"]
      },
      {
        "id": "lP3oI5uY7tR9",
        "name": "Hook to Kick",
        "moves": ["Right Cross", "Left Hook", "Right Kick"]
      },
      {
        "id": "jN2bM4vC6xZ8",
        "name": "Kick Combo",
        "moves": ["Left Kick", "Right Kick"]
      },
      {
        "id": "gH7jK9lL1zX3",
        "name": "Jab to Power Kick",
        "moves": ["Left Jab", "Right Kick"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Knee Strikes',
    '[
      {
        "id": "yU5iO7pA9sD1",
        "name": "Punches to Knee",
        "moves": ["Left Jab", "Right Cross", "Left Knee"]
      },
      {
        "id": "rE3wQ5tY7uI9",
        "name": "Hook to Knee",
        "moves": ["Left Hook", "Right Knee"]
      },
      {
        "id": "fG2hJ4kL6zX8",
        "name": "Double Knee",
        "moves": ["Left Knee", "Right Knee"]
      },
      {
        "id": "vB5nM7cX9zL1",
        "name": "Combo to Knee",
        "moves": ["Left Jab", "Right Cross", "Left Hook", "Right Knee"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Push and Pepper',
    '[
      {
        "id": "dF4gH6jK8lL0",
        "name": "Pepper and Push",
        "moves": ["Pepper Punches", "Push Kicks"]
      },
      {
        "id": "sA2dF4gH6jK8",
        "name": "Jab Push Pepper",
        "moves": ["Left Jab", "Push Kicks", "Pepper Punches"]
      },
      {
        "id": "oI9uY7tR5eW3",
        "name": "Combo to Push",
        "moves": ["Right Cross", "Left Hook", "Push Kicks"]
      },
      {
        "id": "xZ1cV3bN5mL7",
        "name": "Pepper Squat Push",
        "moves": ["Pepper Punches", "Squat", "Push Kicks"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'Lower Body Focus',
    '[
      {
        "id": "uI7oP9aS1dF3",
        "name": "Squat Left Kick",
        "moves": ["Squat", "Left Kick"]
      },
      {
        "id": "tR5eW7yU9iO1",
        "name": "Squat Right Kick",
        "moves": ["Squat", "Right Kick"]
      },
      {
        "id": "gH2jK4lL6zX8",
        "name": "Squat Left Knee",
        "moves": ["Squat", "Left Knee"]
      },
      {
        "id": "bN3mL5cX7zL9",
        "name": "Squat Right Knee",
        "moves": ["Squat", "Right Knee"]
      },
      {
        "id": "vC5xZ7lK9mN1",
        "name": "Squat Push Kick",
        "moves": ["Squat", "Push Kicks"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
    'Full Combinations',
    '[
      {
        "id": "lL1zX3cV5bN7",
        "name": "Full Combo with Kick",
        "moves": ["Left Jab", "Right Cross", "Left Hook", "Right Kick"]
      },
      {
        "id": "iO7pA9sD1fG3",
        "name": "Kick Cross Knee",
        "moves": ["Left Kick", "Right Cross", "Left Knee"]
      },
      {
        "id": "eW5rT7yU9iO1",
        "name": "Push Pepper Hook",
        "moves": ["Push Kicks", "Pepper Punches", "Right Hook"]
      },
      {
        "id": "aS3dF5gH7jK9",
        "name": "Squat Full Combo",
        "moves": ["Squat", "Left Jab", "Right Cross", "Left Hook", "Right Cross"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
    'Speed and Power',
    '[
      {
        "id": "jK2lL4zX6cV8",
        "name": "Pepper Hook Kick",
        "moves": ["Pepper Punches", "Left Hook", "Right Kick"]
      },
      {
        "id": "gH4jK6lL8zX0",
        "name": "Fast Punches Double Knee",
        "moves": ["Left Jab", "Right Cross", "Left Knee", "Right Knee"]
      },
      {
        "id": "dF6gH8jK0lL2",
        "name": "Explosive Squat Punches",
        "moves": ["Squat", "Left Jab", "Right Cross"]
      },
      {
        "id": "bN8mL0cX2zL4",
        "name": "Push Double Hook",
        "moves": ["Push Kicks", "Left Hook", "Right Hook"]
      }
    ]'::jsonb
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
    'Burnout Round',
    '[
      {
        "id": "vB7nM9cX1zL3",
        "name": "Continuous Pepper",
        "moves": ["Pepper Punches"]
      },
      {
        "id": "rT5eW7yU9iO1",
        "name": "Alternating Kicks",
        "moves": ["Left Kick", "Right Kick"]
      },
      {
        "id": "nM9bV1cX3zL5",
        "name": "Alternating Knees",
        "moves": ["Left Knee", "Right Knee"]
      },
      {
        "id": "jK1lL3zX5cV7",
        "name": "Power Push Kicks",
        "moves": ["Push Kicks"]
      }
    ]'::jsonb
  );