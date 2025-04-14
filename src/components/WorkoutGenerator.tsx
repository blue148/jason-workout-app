import React, { useState, useEffect } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import type { WorkoutRound, Move } from '../types';
import { supabase } from '../lib/supabase';

interface WorkoutGeneratorProps {
  onWorkoutGenerated: (rounds: WorkoutRound[]) => void;
}

export function WorkoutGenerator({ onWorkoutGenerated }: WorkoutGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('balanced');
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedIntensity, setSelectedIntensity] = useState('medium');
  const [error, setError] = useState<string | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);

  useEffect(() => {
    // Fetch moves from Supabase
    const fetchMoves = async () => {
      const { data, error } = await supabase
        .from('moves')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching moves:', error);
        setError('Failed to load moves data');
      } else if (data) {
        setMoves(data);
      }
    };

    fetchMoves();
  }, []);

  const goals = [
    { id: 'cardio', name: 'Cardio', description: 'High-intensity workout focused on burning calories' },
    { id: 'power', name: 'Power', description: 'Heavy strikes and power combinations' },
    { id: 'technique', name: 'Technique', description: 'Perfect form and technical combinations' },
    { id: 'balanced', name: 'Balanced', description: 'Well-rounded workout with mixed elements' },
  ];

  const intensityLevels = [
    { id: 'low', name: 'Low', description: 'Shorter combinations, longer rest periods' },
    { id: 'medium', name: 'Medium', description: 'Balanced intensity and complexity' },
    { id: 'high', name: 'High', description: 'Complex combinations, challenging pace' },
  ];

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
  ];

  function generateCombination(goal: string, intensity: string, position: number): { id: string; name: string; moves: string[] } {
    const moveCount = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;
    const selectedMoves = selectMoves(goal, intensity, position, moveCount);
    
    return {
      id: crypto.randomUUID(),
      name: `Combination ${position}`,
      moves: selectedMoves.map(move => move.id),
    };
  }

  function selectMoves(goal: string, intensity: string, position: number, count: number): Move[] {
    const punches = moves.filter(m => ['Left Jab', 'Right Cross', 'Left Hook', 'Right Hook'].includes(m.id));
    const kicks = moves.filter(m => ['Left Kick', 'Right Kick'].includes(m.id));
    const pushKicks = moves.find(m => m.id === 'Push Kicks');
    const knees = moves.filter(m => ['Left Knee', 'Right Knee'].includes(m.id));
    const squat = moves.find(m => m.id === 'Squat');
    const pepperPunches = moves.find(m => m.id === 'Pepper Punches');

    // 20% chance to select Push Kicks as a standalone move
    if (pushKicks && Math.random() < 0.2) {
      return [pushKicks];
    }

    // 20% chance to select Pepper Punches as a standalone move
    if (pepperPunches && Math.random() < 0.2) {
      return [pepperPunches];
    }
    
    switch (goal.toLowerCase()) {
      case 'cardio':
        return selectCardioMoves(punches, kicks, count);
      case 'power':
        return selectPowerMoves(punches, kicks, knees, count);
      case 'technique':
        return selectTechniqueMoves(punches, kicks, count);
      default: // balanced
        return selectBalancedMoves(punches, kicks, knees, squat, count);
    }
  }

  function selectCardioMoves(punches: Move[], kicks: Move[], count: number): Move[] {
    const selected: Move[] = [];
    
    // Add basic strikes
    while (selected.length < count) {
      selected.push(
        selected.length % 2 === 0
          ? punches[Math.floor(Math.random() * punches.length)]
          : kicks[Math.floor(Math.random() * kicks.length)]
      );
    }
    
    return selected;
  }

  function selectPowerMoves(punches: Move[], kicks: Move[], knees: Move[], count: number): Move[] {
    const selected: Move[] = [];
    
    // Focus on power strikes
    const powerPunches = punches.filter(m => ['Right Cross', 'Right Hook'].includes(m.id));
    const powerKicks = kicks.filter(m => ['Right Kick'].includes(m.id));
    
    while (selected.length < count) {
      const pool = selected.length % 2 === 0 ? powerPunches : [...powerKicks, ...knees];
      selected.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    
    return selected;
  }

  function selectTechniqueMoves(punches: Move[], kicks: Move[], count: number): Move[] {
    const selected: Move[] = [];
    
    while (selected.length < count) {
      if (selected.length % 2 === 0) {
        selected.push(punches[Math.floor(Math.random() * punches.length)]);
      } else {
        selected.push(kicks[Math.floor(Math.random() * kicks.length)]);
      }
    }
    
    return selected;
  }

  function selectBalancedMoves(
    punches: Move[], 
    kicks: Move[], 
    knees: Move[], 
    squat: Move | undefined, 
    count: number
  ): Move[] {
    const selected: Move[] = [];
    
    // If we have a squat, decide if we want to use it (20% chance)
    if (squat && Math.random() < 0.2) {
      selected.push(squat);
      // Only add punches with squats
      while (selected.length < count) {
        selected.push(punches[Math.floor(Math.random() * punches.length)]);
      }
      return selected;
    }
    
    // Otherwise, use a mix of all moves except squats
    const movePool = [...punches, ...kicks, ...knees];
    
    while (selected.length < count) {
      const randomMove = movePool[Math.floor(Math.random() * movePool.length)];
      if (!selected.includes(randomMove)) {
        selected.push(randomMove);
      }
    }
    
    return selected;
  }

  const generateWorkout = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create workout structure
      const roundsCount = Math.floor(selectedDuration / 3);
      const rounds: WorkoutRound[] = [];

      for (let i = 1; i <= roundsCount; i++) {
        const combinations = [];
        const combinationCount = selectedIntensity === 'high' ? 4 : selectedIntensity === 'medium' ? 3 : 2;

        for (let j = 1; j <= combinationCount; j++) {
          const combination = generateCombination(selectedGoal, selectedIntensity, j);
          combinations.push(combination);
        }

        rounds.push({
          roundNumber: i,
          combinations,
        });
      }

      onWorkoutGenerated(rounds);

      // Scroll to the Build Your Workout section
      const workoutBuilder = document.querySelector('[data-section="workout-builder"]');
      if (workoutBuilder) {
        workoutBuilder.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error generating workout:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold">AI Workout Generator</h2>
      </div>

      <div className="space-y-6">
        {/* Workout Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select your workout goal:
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedGoal === goal.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <h3 className="font-semibold mb-1">{goal.name}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Workout Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select workout duration:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {durations.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedDuration(value)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  selectedDuration === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select intensity level:
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            {intensityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedIntensity(level.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedIntensity === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <h3 className="font-semibold mb-1">{level.name}</h3>
                <p className="text-sm text-gray-600">{level.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <button
        onClick={generateWorkout}
        disabled={isGenerating || moves.length === 0}
        className="w-full mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Generating Workout...
          </>
        ) : (
          <>
            <Brain size={20} />
            Generate Custom Workout
          </>
        )}
      </button>
    </div>
  );
}