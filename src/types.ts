export interface Move {
  id: string;
  name: string;
}

export interface Combination {
  id: string;
  name: string;
  moves: string[];
}

export interface Round {
  id: string;
  combinations: Combination[];
}

export interface FavoriteRound {
  id: string;
  name: string;
  combinations: Combination[];
}

export interface WorkoutRound {
  roundNumber: number;
  combinations: Combination[];
}

export interface SavedWorkout {
  id: string;
  name: string;
  rounds: WorkoutRound[];
  createdAt: string;
}