import React, { useState } from 'react';
import { FavoriteRound } from '../types';
import { Trash, Edit2, ChevronDown, ChevronRight } from 'lucide-react';

interface FavoriteRoundsProps {
  favorites: FavoriteRound[];
  onLoadFavorite: (round: FavoriteRound) => void;
  onRemoveFavorite: (id: string) => void;
  onRenameFavorite: (id: string, newName: string) => void;
}

export function FavoriteRounds({
  favorites,
  onLoadFavorite,
  onRemoveFavorite,
  onRenameFavorite,
}: FavoriteRoundsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRename = (id: string, currentName: string) => {
    const newName = prompt('Enter a new name for this round:', currentName);
    if (newName) {
      onRenameFavorite(id, newName);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
      >
        <h2 className="text-xl font-bold">Favorite Rounds</h2>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {isExpanded && (
        <div className="p-6 border-t">
          {favorites.length === 0 ? (
            <p className="text-gray-500">No favorite rounds saved yet.</p>
          ) : (
            <div className="space-y-2">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{favorite.name}</h3>
                    <button
                      onClick={() => handleRename(favorite.id, favorite.name)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                    <p className="text-sm text-gray-600">
                      ({favorite.combinations.length} combinations)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoadFavorite(favorite)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(favorite.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}