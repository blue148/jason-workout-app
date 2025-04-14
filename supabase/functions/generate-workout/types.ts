export interface Combination {
  id: string;
  name: string;
  moves: string[];
}

export interface WorkoutRound {
  roundNumber: number;
  combinations: Combination[];
}

export interface Move {
  id: string;
  name: string;
}

export interface WorkoutRequest {
  goal: string;
  duration: number;
  intensity: string;
}