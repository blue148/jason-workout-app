import React, { useState } from 'react';
import { Plus, Save, Trash, Edit2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import { Combination, Move } from '../types';

interface CombinationEditorProps {
  moves: Move[];
  combinations: Combination[];
  onUpdateCombinations: (combinations: Combination[]) => void;
  onSaveToFavorites: () => void;
}

export function CombinationEditor({
  moves,
  combinations,
  onUpdateCombinations,
  onSaveToFavorites,
}: CombinationEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const addCombination = () => {
    if (combinations.length < 4) {
      const name = prompt('Enter a name for the combination:') || `Combination ${combinations.length + 1}`;
      onUpdateCombinations([
        ...combinations,
        { id: crypto.randomUUID(), name, moves: [] },
      ]);
    }
  };

  const updateCombination = (combinationId: string, moveId: string) => {
    onUpdateCombinations(
      combinations.map((c) =>
        c.id === combinationId
          ? { ...c, moves: [...c.moves, moveId] }
          : c
      )
    );
  };

  const removeMoveFromCombination = (combinationId: string, moveIndex: number) => {
    onUpdateCombinations(
      combinations.map((c) =>
        c.id === combinationId
          ? {
              ...c,
              moves: c.moves.filter((_, index) => index !== moveIndex),
            }
          : c
      )
    );
  };

  const removeCombination = (combinationId: string) => {
    onUpdateCombinations(combinations.filter((c) => c.id !== combinationId));
  };

  const renameCombination = (combinationId: string, currentName: string) => {
    const newName = prompt('Enter a new name for the combination:', currentName);
    if (newName) {
      onUpdateCombinations(
        combinations.map((c) =>
          c.id === combinationId ? { ...c, name: newName } : c
        )
      );
    }
  };

  const moveCombination = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === combinations.length - 1)
    ) {
      return;
    }

    const newCombinations = [...combinations];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newCombinations[index], newCombinations[newIndex]] = [
      newCombinations[newIndex],
      newCombinations[index],
    ];
    onUpdateCombinations(newCombinations);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Build a Routine</h2>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-6 border-t">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={onSaveToFavorites}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Save size={20} /> Save Round
            </button>
            <button
              onClick={addCombination}
              disabled={combinations.length >= 4}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={20} /> Add Combination
            </button>
          </div>

          <div className="space-y-4">
            {combinations.map((combination, index) => (
              <div
                key={combination.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveCombination(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveCombination(index, 'down')}
                        disabled={index === combinations.length - 1}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold">{combination.name}</h3>
                    <button
                      onClick={() => renameCombination(combination.id, combination.name)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeCombination(combination.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash size={20} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Sequence:</h4>
                  <div className="flex flex-wrap gap-2">
                    {combination.moves.map((moveId, moveIndex) => {
                      const move = moves.find(m => m.id === moveId);
                      return (
                        <div
                          key={`${moveId}-${moveIndex}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2"
                        >
                          <span>{move?.name}</span>
                          <button
                            onClick={() => removeMoveFromCombination(combination.id, moveIndex)}
                            className="text-white hover:text-red-200"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {moves.map((move) => (
                    <button
                      key={move.id}
                      onClick={() => updateCombination(combination.id, move.id)}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      {move.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}