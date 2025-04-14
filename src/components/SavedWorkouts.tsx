import React from 'react';
import { SavedWorkout } from '../types';
import { Trash, Edit2, Clock, Download, Play } from 'lucide-react';

interface SavedWorkoutsProps {
  workouts: SavedWorkout[];
  onLoadWorkout: (workout: SavedWorkout) => void;
  onDeleteWorkout: (id: string) => void;
  onRenameWorkout: (id: string, newName: string) => void;
  onPlayWorkout: (workout: SavedWorkout) => void;
}

export function SavedWorkouts({
  workouts,
  onLoadWorkout,
  onDeleteWorkout,
  onRenameWorkout,
  onPlayWorkout,
}: SavedWorkoutsProps) {
  const handleRename = (id: string, currentName: string) => {
    const newName = prompt('Enter a new name for this workout:', currentName);
    if (newName) {
      onRenameWorkout(id, newName);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Saved Workouts</h2>
      {workouts.length === 0 ? (
        <p className="text-gray-500">No workouts saved yet.</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{workout.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Clock size={14} />
                    <span>{formatDate(workout.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {workout.rounds.length} configured rounds
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPlayWorkout(workout)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Play size={16} />
                    Play
                  </button>
                  <button
                    onClick={() => onLoadWorkout(workout)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Load
                  </button>
                  <button
                    onClick={() => handleRename(workout.id, workout.name)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDeleteWorkout(workout.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}