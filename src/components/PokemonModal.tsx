import React from 'react';
import { X, Zap, Package, Star, Copy, Share2 } from 'lucide-react';
import { Pokemon } from '../types';

interface PokemonModalProps {
  pokemon: Pokemon;
  isOpen: boolean;
  onClose: () => void;
  tournamentName?: string;
  playerName?: string;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ 
  pokemon, 
  isOpen, 
  onClose, 
  tournamentName,
  playerName 
}) => {
  if (!isOpen) return null;

  const getTeraTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Fire': 'from-red-500 to-orange-500',
      'Water': 'from-blue-500 to-cyan-500',
      'Electric': 'from-yellow-400 to-yellow-600',
      'Grass': 'from-green-500 to-emerald-500',
      'Ice': 'from-cyan-300 to-blue-400',
      'Fighting': 'from-red-600 to-red-800',
      'Poison': 'from-purple-500 to-purple-700',
      'Ground': 'from-yellow-600 to-orange-600',
      'Flying': 'from-indigo-400 to-blue-500',
      'Psychic': 'from-pink-500 to-purple-500',
      'Bug': 'from-green-400 to-lime-500',
      'Rock': 'from-yellow-700 to-orange-700',
      'Ghost': 'from-purple-600 to-indigo-600',
      'Dragon': 'from-indigo-600 to-purple-600',
      'Dark': 'from-gray-700 to-gray-900',
      'Steel': 'from-gray-400 to-gray-600',
      'Fairy': 'from-pink-400 to-rose-400',
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  const handleCopyBuild = () => {
    const buildText = `${pokemon.name} @ ${pokemon.item}
Ability: ${pokemon.ability}
Tera Type: ${pokemon.teraType}
${pokemon.moves?.join('\n') || ''}`;
    
    navigator.clipboard.writeText(buildText);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTeraTypeColor(pokemon.teraType || 'Normal')} p-6 text-white rounded-t-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{pokemon.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {tournamentName && (
            <div className="text-sm opacity-90">
              <p>From: {tournamentName}</p>
              {playerName && <p>Used by: {playerName}</p>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tera Type */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getTeraTypeColor(pokemon.teraType || 'Normal')} flex items-center justify-center`}>
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tera Type</p>
              <p className="font-semibold text-gray-900">{pokemon.teraType}</p>
            </div>
          </div>

          {/* Item */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Held Item</p>
              <p className="font-semibold text-gray-900">{pokemon.item}</p>
            </div>
          </div>

          {/* Ability */}
          {pokemon.ability && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ability</p>
                <p className="font-semibold text-gray-900">{pokemon.ability}</p>
              </div>
            </div>
          )}

          {/* Moves */}
          {pokemon.moves && pokemon.moves.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">Moves</p>
              <div className="grid grid-cols-2 gap-2">
                {pokemon.moves.map((move, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                  >
                    {move}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={handleCopyBuild}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Build</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;