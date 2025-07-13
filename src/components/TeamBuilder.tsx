import React, { useState } from 'react';
import { Plus, Save, Share2, Download, Upload } from 'lucide-react';
import Modal from './Modal';

interface TeamPokemon {
  name: string;
  item: string;
  ability: string;
  teraType: string;
  moves: string[];
  nature?: string;
  evs?: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
}

const TeamBuilder: React.FC = () => {
  const [team, setTeam] = useState<TeamPokemon[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('');
  const [showExport, setShowExport] = useState(false);

  const pokemonDatabase = [
    'Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee',
    'Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri',
    'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'
  ];

  const items = [
    'Focus Sash', 'Leftovers', 'Choice Specs', 'Choice Band', 'Choice Scarf',
    'Sitrus Berry', 'Clear Amulet', 'Booster Energy', 'Assault Vest', 'Life Orb'
  ];

  const teraTypes = [
    'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison',
    'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  const addPokemon = () => {
    if (team.length < 6) {
      const newPokemon: TeamPokemon = {
        name: '',
        item: '',
        ability: '',
        teraType: '',
        moves: ['', '', '', ''],
      };
      setTeam([...team, newPokemon]);
      setSelectedSlot(team.length);
    }
  };

  const removePokemon = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
    setSelectedSlot(null);
  };

  const updatePokemon = (index: number, field: keyof TeamPokemon, value: any) => {
    const updatedTeam = [...team];
    updatedTeam[index] = { ...updatedTeam[index], [field]: value };
    setTeam(updatedTeam);
  };

  const updateMove = (pokemonIndex: number, moveIndex: number, move: string) => {
    const updatedTeam = [...team];
    const updatedMoves = [...updatedTeam[pokemonIndex].moves];
    updatedMoves[moveIndex] = move;
    updatedTeam[pokemonIndex] = { ...updatedTeam[pokemonIndex], moves: updatedMoves };
    setTeam(updatedTeam);
  };

  const exportToShowdown = () => {
    const showdownFormat = team.map(pokemon => {
      if (!pokemon.name) return '';
      
      let output = `${pokemon.name}`;
      if (pokemon.item) output += ` @ ${pokemon.item}`;
      output += '\n';
      
      if (pokemon.ability) output += `Ability: ${pokemon.ability}\n`;
      if (pokemon.teraType) output += `Tera Type: ${pokemon.teraType}\n`;
      
      pokemon.moves.forEach(move => {
        if (move) output += `- ${move}\n`;
      });
      
      return output;
    }).filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(showdownFormat);
    setShowExport(false);
  };

  const selectedPokemon = selectedSlot !== null ? team[selectedSlot] : null;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Team Builder</h2>
        <p className="text-green-100">Create and customize your VGC teams</p>
      </div>

      {/* Team Name */}
      <div>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = team[index];
          return (
            <button
              key={index}
              onClick={() => setSelectedSlot(index)}
              className={`aspect-square rounded-xl border-2 border-dashed transition-all ${
                selectedSlot === index
                  ? 'border-green-500 bg-green-50'
                  : pokemon
                  ? 'border-gray-300 bg-white hover:border-green-300'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {pokemon ? (
                <div className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {pokemon.name.charAt(0) || '?'}
                  </div>
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {pokemon.name || 'Empty Slot'}
                  </p>
                  {pokemon.item && (
                    <p className="text-xs text-gray-500 truncate">{pokemon.item}</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Plus className="h-8 w-8 mb-2" />
                  <span className="text-sm">Add Pokémon</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Pokemon Button */}
      {team.length < 6 && (
        <button
          onClick={addPokemon}
          className="w-full py-3 border-2 border-dashed border-green-400 text-green-600 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <Plus className="h-5 w-5 inline mr-2" />
          Add Pokémon
        </button>
      )}

      {/* Pokemon Editor */}
      {selectedPokemon && selectedSlot !== null && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Pokémon #{selectedSlot + 1}</h3>
            <button
              onClick={() => removePokemon(selectedSlot)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Pokemon Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pokémon</label>
              <select
                value={selectedPokemon.name}
                onChange={(e) => updatePokemon(selectedSlot, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Pokémon</option>
                {pokemonDatabase.map(pokemon => (
                  <option key={pokemon} value={pokemon}>{pokemon}</option>
                ))}
              </select>
            </div>

            {/* Item */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
              <select
                value={selectedPokemon.item}
                onChange={(e) => updatePokemon(selectedSlot, 'item', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Item</option>
                {items.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Ability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ability</label>
              <input
                type="text"
                value={selectedPokemon.ability}
                onChange={(e) => updatePokemon(selectedSlot, 'ability', e.target.value)}
                placeholder="Enter ability..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tera Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tera Type</label>
              <select
                value={selectedPokemon.teraType}
                onChange={(e) => updatePokemon(selectedSlot, 'teraType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Tera Type</option>
                {teraTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Moves */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moves</label>
              <div className="space-y-2">
                {selectedPokemon.moves.map((move, moveIndex) => (
                  <input
                    key={moveIndex}
                    type="text"
                    value={move}
                    onChange={(e) => updateMove(selectedSlot, moveIndex, e.target.value)}
                    placeholder={`Move ${moveIndex + 1}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setShowExport(true)}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors">
          <Save className="h-4 w-4" />
          <span>Save</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        title="Export Team"
        size="sm"
      >
        <div className="space-y-3">
          <button
            onClick={exportToShowdown}
            className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Copy Showdown Format</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Export as Image</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamBuilder;