import React, { useState, useEffect, useCallback } from 'react';
import { Timer } from './components/Timer';
import { CombinationEditor } from './components/CombinationEditor';
import { FavoriteRounds } from './components/FavoriteRounds';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { SavedWorkouts } from './components/SavedWorkouts';
import { WorkoutGenerator } from './components/WorkoutGenerator';
import type { Combination, FavoriteRound, WorkoutRound, SavedWorkout, Move } from './types';
import { Dumbbell, Save, ArrowLeft, Edit2 } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentCombination, setCurrentCombination] = useState(0);
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRound[]>([]);
  const [workoutRounds, setWorkoutRounds] = useState<WorkoutRound[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [spokenCombinations, setSpokenCombinations] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(null);

  // Initialize speech synthesis voice
  const [voiceReady, setVoiceReady] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Function to find and set the British English voice
    const findBritishVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(voice => 
        voice.lang.startsWith('en-GB') && voice.name.toLowerCase().includes('arthur')
      ) || voices.find(voice => 
        voice.lang.startsWith('en-GB')
      ) || voices[0];

      if (britishVoice) {
        setSelectedVoice(britishVoice);
        setVoiceReady(true);
      }
    };

    // Handle voice loading
    if (window.speechSynthesis.getVoices().length > 0) {
      findBritishVoice();
    }

    window.speechSynthesis.onvoiceschanged = findBritishVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    supabase
      .from('moves')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading moves:', error);
        } else {
          setMoves(data);
        }
      });

    supabase
      .from('favorite_rounds')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading favorite rounds:', error);
        } else {
          setFavorites(data.map(row => ({
            id: row.id,
            name: row.name,
            combinations: row.combinations
          })));
        }
      });

    supabase
      .from('saved_workouts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error loading saved workouts:', error);
        } else {
          setSavedWorkouts(data.map(row => ({
            id: row.id,
            name: row.name,
            rounds: row.rounds,
            createdAt: row.created_at
          })));
        }
      });
  }, []);

  const currentWorkoutRound = workoutRounds.find(r => r.roundNumber === currentRound);
  const currentCombinationData = currentWorkoutRound?.combinations[currentCombination];

  useEffect(() => {
    if (isWorkoutActive && !isCooldown && currentCombinationData && !isEditing && voiceReady) {
      const combinationKey = `${currentRound}-${currentCombination}`;
      if (!spokenCombinations.has(combinationKey)) {
        const moveNames = currentCombinationData.moves.map(moveId => 
          moves.find(m => m.id === moveId)?.name || ''
        ).filter(Boolean);

        if (moveNames.length > 0) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(moveNames.join(', '));
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
          utterance.rate = 0.9; // Slightly slower for clarity
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
          setSpokenCombinations(prev => new Set([...prev, combinationKey]));
        }
      }
    }
  }, [currentRound, currentCombination, currentCombinationData, isWorkoutActive, isCooldown, moves, isEditing, voiceReady, selectedVoice]);

  const handleRoundComplete = () => {
    if (isCooldown) {
      setIsCooldown(false);
      return;
    }

    if (currentRound < workoutRounds.length) {
      setIsCooldown(true);
      setCurrentRound(currentRound + 1);
      setCurrentCombination(0);
    } else {
      setCurrentRound(1);
      setCurrentCombination(0);
      setIsWorkoutActive(false);
      setIsCooldown(false);
    }
  };

  const handleCombinationComplete = () => {
    const currentWorkoutRound = workoutRounds.find(r => r.roundNumber === currentRound);
    if (currentWorkoutRound && currentCombination < currentWorkoutRound.combinations.length - 1) {
      setCurrentCombination(prev => {
        const nextCombination = prev + 1;
        const combinationKey = `${currentRound}-${nextCombination}`;
        setSpokenCombinations(prev => {
          const newSet = new Set(prev);
          newSet.delete(combinationKey);
          return newSet;
        });
        return nextCombination;
      });
    }
  };

  const handleSaveToFavorites = async () => {
    const name = prompt('Enter a name for this round:');
    if (name) {
      const { data, error } = await supabase
        .from('favorite_rounds')
        .insert({
          name,
          combinations,
          user_id: null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving favorite round:', error);
        alert('Failed to save round. Please try again.');
      } else {
        setFavorites([...favorites, {
          id: data.id,
          name: data.name,
          combinations: data.combinations
        }]);
      }
    }
  };

  const handleLoadFavorite = (favorite: FavoriteRound) => {
    setCombinations([...favorite.combinations]);
  };

  const handleRemoveFavorite = async (id: string) => {
    const { error } = await supabase
      .from('favorite_rounds')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing favorite round:', error);
    } else {
      setFavorites(favorites.filter((f) => f.id !== id));
    }
  };

  const handleRenameFavorite = async (id: string, newName: string) => {
    const { error } = await supabase
      .from('favorite_rounds')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Error renaming favorite round:', error);
    } else {
      setFavorites(
        favorites.map((f) => (f.id === id ? { ...f, name: newName } : f))
      );
    }
  };

  const handleUpdateWorkoutRound = (roundNumber: number, favoriteRound: FavoriteRound) => {
    const existingRoundIndex = workoutRounds.findIndex(
      (r) => r.roundNumber === roundNumber
    );

    if (existingRoundIndex >= 0) {
      const updatedRounds = [...workoutRounds];
      updatedRounds[existingRoundIndex] = {
        roundNumber,
        combinations: [...favoriteRound.combinations],
      };
      setWorkoutRounds(updatedRounds);

      // If this is part of a saved workout, update it
      if (currentWorkoutId) {
        handleSaveWorkoutChanges(updatedRounds);
      }
    } else {
      const newRounds = [
        ...workoutRounds,
        {
          roundNumber,
          combinations: [...favoriteRound.combinations],
        },
      ];
      setWorkoutRounds(newRounds);

      // If this is part of a saved workout, update it
      if (currentWorkoutId) {
        handleSaveWorkoutChanges(newRounds);
      }
    }
  };

  const handleClearWorkoutRound = (roundNumber: number) => {
    const updatedRounds = workoutRounds.filter((r) => r.roundNumber !== roundNumber)
      .map((round, index) => ({
        ...round,
        roundNumber: index + 1
      }));
    
    setWorkoutRounds(updatedRounds);

    // If this is part of a saved workout, update it
    if (currentWorkoutId) {
      handleSaveWorkoutChanges(updatedRounds);
    }
  };

  const handleReorderWorkoutRounds = (fromIndex: number, toIndex: number) => {
    const reorderedRounds = [...workoutRounds];
    const [movedRound] = reorderedRounds.splice(fromIndex, 1);
    reorderedRounds.splice(toIndex, 0, movedRound);

    const renumberedRounds = reorderedRounds.map((round, index) => ({
      ...round,
      roundNumber: index + 1,
    }));

    setWorkoutRounds(renumberedRounds);

    // If this is part of a saved workout, update it
    if (currentWorkoutId) {
      handleSaveWorkoutChanges(renumberedRounds);
    }
  };

  const handleSaveWorkoutChanges = async (rounds: WorkoutRound[]) => {
    if (!currentWorkoutId) return;

    const { error } = await supabase
      .from('saved_workouts')
      .update({ rounds })
      .eq('id', currentWorkoutId);

    if (error) {
      console.error('Error updating workout:', error);
      alert('Failed to save workout changes. Please try again.');
    } else {
      // Update the saved workouts list
      setSavedWorkouts(prev =>
        prev.map(workout =>
          workout.id === currentWorkoutId
            ? { ...workout, rounds }
            : workout
        )
      );
    }
  };

  const handleSaveWorkout = async () => {
    if (currentWorkoutId) {
      // Update existing workout
      const { error } = await supabase
        .from('saved_workouts')
        .update({ rounds: workoutRounds })
        .eq('id', currentWorkoutId);

      if (error) {
        console.error('Error updating workout:', error);
        alert('Failed to save workout changes. Please try again.');
      }
    } else {
      // Create new workout
      const name = prompt('Enter a name for this workout:');
      if (name) {
        const { data, error } = await supabase
          .from('saved_workouts')
          .insert({
            name,
            rounds: workoutRounds,
            user_id: null
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving workout:', error);
          alert('Failed to save workout. Please try again.');
        } else {
          setSavedWorkouts([...savedWorkouts, {
            id: data.id,
            name: data.name,
            rounds: data.rounds,
            createdAt: data.created_at
          }]);
          setCurrentWorkoutId(data.id);
        }
      }
    }
  };

  const handleLoadWorkout = (workout: SavedWorkout) => {
    setWorkoutRounds(workout.rounds);
    setCurrentWorkoutId(workout.id);
  };

  const handlePlayWorkout = (workout: SavedWorkout) => {
    setWorkoutRounds(workout.rounds);
    setCurrentWorkoutId(workout.id);
    startWorkout();
  };

  const handleDeleteWorkout = async (id: string) => {
    const { error } = await supabase
      .from('saved_workouts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout:', error);
    } else {
      setSavedWorkouts(savedWorkouts.filter((w) => w.id !== id));
      if (currentWorkoutId === id) {
        setCurrentWorkoutId(null);
      }
    }
  };

  const handleRenameWorkout = async (id: string, newName: string) => {
    const { error } = await supabase
      .from('saved_workouts')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Error renaming workout:', error);
    } else {
      setSavedWorkouts(
        savedWorkouts.map((w) => (w.id === id ? { ...w, name: newName } : w))
      );
    }
  };

  const startWorkout = () => {
    setCurrentRound(1);
    setCurrentCombination(0);
    setIsWorkoutActive(true);
    setIsCooldown(false);
    setSpokenCombinations(new Set());
    setIsEditing(false);
  };

  const stopWorkout = () => {
    if (confirm('Are you sure you want to stop the current workout?')) {
      setIsWorkoutActive(false);
      setIsCooldown(false);
      setCurrentRound(1);
      setCurrentCombination(0);
      setSpokenCombinations(new Set());
      setIsEditing(false);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Dumbbell size={32} />
            <h1 className="text-3xl font-bold">Heavy Bag Workout</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isWorkoutActive ? (
          isEditing ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <button
                  onClick={toggleEditing}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={24} />
                  <span>Back to Workout</span>
                </button>
                <h2 className="text-2xl font-bold">Edit Workout</h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                  <CombinationEditor
                    moves={moves}
                    combinations={combinations}
                    onUpdateCombinations={setCombinations}
                    onSaveToFavorites={handleSaveToFavorites}
                  />
                </div>
                <div className="space-y-8">
                  <FavoriteRounds
                    favorites={favorites}
                    onLoadFavorite={handleLoadFavorite}
                    onRemoveFavorite={handleRemoveFavorite}
                    onRenameFavorite={handleRenameFavorite}
                  />
                  <WorkoutBuilder
                    favorites={favorites}
                    workoutRounds={workoutRounds}
                    moves={moves}
                    onUpdateWorkoutRound={handleUpdateWorkoutRound}
                    onClearWorkoutRound={handleClearWorkoutRound}
                    onReorderRounds={handleReorderWorkoutRounds}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex justify-between items-center">
                <button
                  onClick={stopWorkout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={24} />
                  <span>Back to Dashboard</span>
                </button>
                <h2 className="text-2xl font-bold">
                  {isCooldown ? (
                    <span className="text-green-600">Cooldown Period</span>
                  ) : (
                    `Round ${currentRound}/${workoutRounds.length}`
                  )}
                </h2>
              </div>
              <Timer
                onRoundComplete={handleRoundComplete}
                onCombinationComplete={handleCombinationComplete}
                isCooldown={isCooldown}
                currentRound={currentRound}
                currentCombination={currentCombination}
                workoutRounds={workoutRounds}
                moves={moves}
              />
            </div>
          )
        ) : (
          <div className="space-y-8">
            <SavedWorkouts
              workouts={savedWorkouts}
              onLoadWorkout={handleLoadWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onRenameWorkout={handleRenameWorkout}
              onPlayWorkout={handlePlayWorkout}
            />
            <WorkoutGenerator onWorkoutGenerated={setWorkoutRounds} />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-8">
                <CombinationEditor
                  moves={moves}
                  combinations={combinations}
                  onUpdateCombinations={setCombinations}
                  onSaveToFavorites={handleSaveToFavorites}
                />
              </div>
              <div className="space-y-8">
                <FavoriteRounds
                  favorites={favorites}
                  onLoadFavorite={handleLoadFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                  onRenameFavorite={handleRenameFavorite}
                />
                <WorkoutBuilder
                  favorites={favorites}
                  workoutRounds={workoutRounds}
                  moves={moves}
                  onUpdateWorkoutRound={handleUpdateWorkoutRound}
                  onClearWorkoutRound={handleClearWorkoutRound}
                  onReorderRounds={handleReorderWorkoutRounds}
                />
                <div className="flex justify-center gap-4">
                  <button
                    onClick={startWorkout}
                    disabled={workoutRounds.length === 0}
                    className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Workout
                  </button>
                  <button
                    onClick={handleSaveWorkout}
                    disabled={workoutRounds.length === 0}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Save size={24} />
                    Save Workout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;