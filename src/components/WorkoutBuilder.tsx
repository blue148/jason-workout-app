import React, { useState } from 'react';
import { FavoriteRound, WorkoutRound, Move } from '../types';
import { Plus, Trash, ArrowUp, ArrowDown, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

interface WorkoutBuilderProps {
  favorites: FavoriteRound[];
  workoutRounds: WorkoutRound[];
  moves: Move[];
  onUpdateWorkoutRound: (roundNumber: number, favoriteRound: FavoriteRound) => void;
  onClearWorkoutRound: (roundNumber: number) => void;
  onReorderRounds: (fromIndex: number, toIndex: number) => void;
}

export function WorkoutBuilder({
  favorites,
  workoutRounds,
  moves,
  onUpdateWorkoutRound,
  onClearWorkoutRound,
  onReorderRounds,
}: WorkoutBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const reorderCombinations = (roundIndex: number, fromIndex: number, toIndex: number) => {
    const updatedRounds = [...workoutRounds];
    const round = { ...updatedRounds[roundIndex] };
    const [movedCombo] = round.combinations.splice(fromIndex, 1);
    round.combinations.splice(toIndex, 0, movedCombo);
    updatedRounds[roundIndex] = round;
    
    // Update the round using the existing favorite round structure
    const favoriteRoundFormat: FavoriteRound = {
      id: `temp-${round.roundNumber}`,
      name: `Round ${round.roundNumber}`,
      combinations: round.combinations
    };
    onUpdateWorkoutRound(round.roundNumber, favoriteRoundFormat);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg" data-section="workout-builder">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Build Your Workout</h2>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-6 border-t">
          <div className="grid gap-4">
            {workoutRounds.map((round, roundIndex) => (
              <div
                key={round.roundNumber}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        onClick={() => onReorderRounds(roundIndex, roundIndex - 1)}
                        disabled={roundIndex === 0}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => onReorderRounds(roundIndex, roundIndex + 1)}
                        disabled={roundIndex === workoutRounds.length - 1}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold text-lg">Round {round.roundNumber}</h3>
                  </div>
                  <button
                    onClick={() => onClearWorkoutRound(round.roundNumber)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {round.combinations.map((combo, comboIndex) => (
                    <div 
                      key={combo.id}
                      className="bg-white rounded p-3 shadow-sm border"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex flex-col">
                          <button
                            onClick={() => reorderCombinations(roundIndex, comboIndex, comboIndex - 1)}
                            disabled={comboIndex === 0}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => reorderCombinations(roundIndex, comboIndex, comboIndex + 1)}
                            disabled={comboIndex === round.combinations.length - 1}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                        <GripVertical className="text-gray-400" size={20} />
                        <div className="font-medium text-gray-700">
                          {combo.name}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {combo.moves.map((moveId, moveIndex) => {
                          const move = moves.find(m => m.id === moveId);
                          return (
                            <span
                              key={`${moveId}-${moveIndex}`}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {move?.name || moveId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {workoutRounds.length < 9 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">
                  Choose a favorite round to add:
                </p>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((favorite) => (
                    <button
                      key={favorite.id}
                      onClick={() => onUpdateWorkoutRound(workoutRounds.length + 1, favorite)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      {favorite.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}