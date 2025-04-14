# Heavy Bag Workout App

A React-based web application for creating and managing heavy bag workout routines. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- Create and save custom workout combinations
- AI-powered workout generator
- Timer with round and combination tracking
- Boxing bell sounds for round start/end
- Save favorite combinations and full workouts
- Responsive design for all devices

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Supabase (Backend & Database)
- Vite (Build Tool)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workout.git
   cd workout
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

The application uses Supabase as its backend. The database schema includes:

- `moves` table: Stores available workout moves
- `favorite_rounds` table: Stores user's favorite combinations
- `saved_workouts` table: Stores complete workout routines

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
