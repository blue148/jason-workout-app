import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { WorkoutRound, Move } from '../types';
import { audioPlayer } from '../utils/audio';

interface TimerProps {
  onRoundComplete: () => void;
  onCombinationComplete: () => void;
  isCooldown?: boolean;
  currentRound?: number;
  currentCombination?: number;
  workoutRounds: WorkoutRound[];
  moves: Move[];
}

export function Timer({
  onRoundComplete,
  onCombinationComplete,
  isCooldown = false,
  currentRound = 1,
  currentCombination = 0,
  workoutRounds,
  moves,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(isCooldown ? 60 : 30);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number>();
  const completionHandledRef = useRef(false);
  
  const currentWorkoutRound = workoutRounds.find(r => r.roundNumber === currentRound);
  const currentCombinationData = currentWorkoutRound?.combinations[currentCombination];

  // Reset timer and completion flag when changing rounds, combinations, or cooldown state
  useEffect(() => {
    setTimeLeft(isCooldown ? 60 : 30);
    completionHandledRef.current = false;
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    // Play start round bell sequence when a new round starts (not during cooldown)
    if (!isCooldown) {
      audioPlayer.playStartRound();
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [isCooldown, currentRound, currentCombination]);

  // Handle the timer countdown
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Clear interval immediately
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = undefined;
          }

          // Only handle completion once
          if (!completionHandledRef.current) {
            completionHandledRef.current = true;
            
            if (isCooldown) {
              onRoundComplete();
            } else {
              // Play end round bell sequence
              audioPlayer.playEndRound();
              
              // Check if there are more combinations in the current round
              if (currentWorkoutRound && currentCombination < currentWorkoutRound.combinations.length - 1) {
                onCombinationComplete();
              } else {
                onRoundComplete();
              }
            }
          }

          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [
    isRunning,
    isCooldown,
    currentRound,
    currentCombination,
    currentWorkoutRound,
    onRoundComplete,
    onCombinationComplete
  ]);

  const toggleTimer = () => {
    if (!isRunning && timeLeft === 0) {
      // Reset timer when starting from 0
      setTimeLeft(isCooldown ? 60 : 30);
      completionHandledRef.current = false;
    }
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    setIsRunning(false);
    setTimeLeft(isCooldown ? 60 : 30);
    completionHandledRef.current = false;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className={`text-6xl font-bold mb-4 ${isCooldown ? 'text-green-600' : 'text-blue-600'}`}>
        {formatTime(timeLeft)}
      </div>
      
      {/* Current Combination */}
      {!isCooldown && currentCombinationData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{currentCombinationData.name}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {currentCombinationData.moves.map((moveId, index) => {
              const move = moves.find(m => m.id === moveId);
              return (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  {move?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`${
            isCooldown 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-6 py-2 rounded-full transition-colors`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}