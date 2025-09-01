import React, { useState, useEffect } from 'react';
import { Plus, Save, Share2, Download, Upload, Grid, Folder, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { useTeamSlots } from '../hooks/useTeamSlots';
import { Team } from '../types';
import Modal from './Modal';
import TeamSlot from './TeamSlot';

const TeamBuilder: React.FC = () => {
  // Team slots integration
  const { 
    teamSlots, 
    saveTeamToSlot, 
    getNextAvailableSlot,
    getAllTeams,
    loading: slotsLoading,
    error: slotsError
  } = useTeamSlots();
  
  const [currentTeam, setCurrentTeam] = useState<Team>({
    id: `team-${Date.now()}`,
    name: '',
    pokemon: [],
    format: 'VGC 2024',
    description: '',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
    tags: [],
    usageCount: 0,
    battleTeamName: '',
    switchProfile: '',
    switchModel: 'Switch'
  });
  
  const [selectedPokemonSlot, setSelectedPokemonSlot] = useState<number | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [saveToSlotNumber, setSaveToSlotNumber] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

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

  // Auto-save timer for current team
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentTeam.name && currentTeam.pokemon.length > 0) {
        setCurrentTeam(prev => ({
          ...prev,
          updatedAt: new Date().toISOString()
        }));
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(timer);
  }, [currentTeam.name, currentTeam.pokemon.length]);

  const addPokemon = () => {
    if (currentTeam.pokemon.length < 6) {
      const newPokemon = {
        name: '',
        item: '',
        ability: '',
        teraType: '',
        moves: ['', '', '', ''],
        nature: '',
        level: 50
      };
      
      setCurrentTeam(prev => ({
        ...prev,
        pokemon: [...prev.pokemon, newPokemon],
        updatedAt: new Date().toISOString()
      }));
      setSelectedPokemonSlot(currentTeam.pokemon.length);
    }
  };

  const removePokemon = (index: number) => {
    setCurrentTeam(prev => ({
      ...prev,
      pokemon: prev.pokemon.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString()
    }));
    setSelectedPokemonSlot(null);
  };

  const updatePokemon = (index: number, field: string, value: any) => {
    setCurrentTeam(prev => {
      const updatedPokemon = [...prev.pokemon];
      updatedPokemon[index] = { ...updatedPokemon[index], [field]: value };
      
      return {
        ...prev,
        pokemon: updatedPokemon,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const updateMove = (pokemonIndex: number, moveIndex: number, move: string) => {
    setCurrentTeam(prev => {
      const updatedPokemon = [...prev.pokemon];
      const updatedMoves = [...updatedPokemon[pokemonIndex].moves || []];
      updatedMoves[moveIndex] = move;
      updatedPokemon[pokemonIndex] = { ...updatedPokemon[pokemonIndex], moves: updatedMoves };
      
      return {
        ...prev,
        pokemon: updatedPokemon,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const loadTeamFromSlot = (team: Team) => {
    setCurrentTeam({
      ...team,
      id: `team-${Date.now()}`, // Generate new ID for editing
      updatedAt: new Date().toISOString()
    });
    setShowSlotSelector(false);
  };

  const saveTeamToSlot = async (slotNumber: number) => {
    if (!currentTeam.name.trim()) {
      alert('Please enter a team name before saving');
      return;
    }
    
    if (currentTeam.pokemon.length === 0) {
      alert('Cannot save empty team');
      return;
    }
    
    try {
      await saveTeamToSlot(slotNumber, {
        ...currentTeam,
        slotNumber,
        updatedAt: new Date().toISOString()
      });
      
      setSaveSuccess(`Team saved to Slot ${slotNumber}!`);
      setTimeout(() => setSaveSuccess(null), 3000);
      setShowSaveOptions(false);
    } catch (error) {
      console.error('Failed to save team:', error);
      alert('Failed to save team. Please try again.');
    }
  };

  const startNewTeam = () => {
    setCurrentTeam({
      id: `team-${Date.now()}`,
      name: '',
      pokemon: [],
      format: 'VGC 2024',
      description: '',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      tags: [],
      usageCount: 0,
      battleTeamName: '',
      switchProfile: '',
      switchModel: 'Switch'
    });
    setSelectedPokemonSlot(null);
  };

  const exportToShowdown = () => {
    const showdownFormat = currentTeam.pokemon.map(pokemon => {
      if (!pokemon.name) return '';
      
      let output = `${pokemon.name}`;
      if (pokemon.item) output += ` @ ${pokemon.item}`;
      output += '\n';
      
      if (pokemon.ability) output += `Ability: ${pokemon.ability}\n`;
      if (pokemon.teraType) output += `Tera Type: ${pokemon.teraType}\n`;
      if (pokemon.nature) output += `Nature: ${pokemon.nature}\n`;
      
      (pokemon.moves || []).forEach(move => {
        if (move) output += `- ${move}\n`;
      });
      
      return output;
    }).filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(showdownFormat);
    setShowExport(false);
  };

  const selectedPokemon = selectedPokemonSlot !== null ? currentTeam.pokemon[selectedPokemonSlot] : null;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header with Slot Actions */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Team Builder</h2>
            <p className="text-green-100">Create and customize your VGC teams</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSlotSelector(true)}
              className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Folder className="h-4 w-4" />
              <span>Load</span>
            </button>
            <button
              onClick={startNewTeam}
              className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Current Team Info */}
        {currentTeam.name && (
          <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium">{currentTeam.name}</div>
                <div className="text-green-200 text-xs">
                  {currentTeam.pokemon.length}/6 Pokémon • Last saved: {new Date(currentTeam.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
            {currentTeam.slotNumber && (
              <div className="bg-white/20 px-2 py-1 rounded text-xs">
                Slot {currentTeam.slotNumber}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{saveSuccess}</span>
        </div>
      )}

      {/* Slots Error */}
      {slotsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{slotsError}</span>
        </div>
      )}

      {/* Team Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
          <input
            type="text"
            value={currentTeam.name}
            onChange={(e) => setCurrentTeam(prev => ({ ...prev, name: e.target.value, updatedAt: new Date().toISOString() }))}
            placeholder="Enter team name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Battle Team Name</label>
          <input
            type="text"
            value={currentTeam.battleTeamName || ''}
            onChange={(e) => setCurrentTeam(prev => ({ ...prev, battleTeamName: e.target.value, updatedAt: new Date().toISOString() }))}
            placeholder="Enter battle team name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Switch Profile</label>
          <input
            type="text"
            value={currentTeam.switchProfile || ''}
            onChange={(e) => setCurrentTeam(prev => ({ ...prev, switchProfile: e.target.value, updatedAt: new Date().toISOString() }))}
            placeholder="Enter Switch profile name..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Switch Model</label>
          <select
            value={currentTeam.switchModel || 'Switch'}
            onChange={(e) => setCurrentTeam(prev => ({ 
              ...prev, 
              switchModel: e.target.value as 'Switch' | 'Switch Lite' | 'Switch OLED',
              updatedAt: new Date().toISOString() 
            }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Switch">Nintendo Switch</option>
            <option value="Switch Lite">Nintendo Switch Lite</option>
            <option value="Switch OLED">Nintendo Switch OLED</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={currentTeam.description || ''}
          onChange={(e) => setCurrentTeam(prev => ({ ...prev, description: e.target.value, updatedAt: new Date().toISOString() }))}
          placeholder="Describe your team strategy..."
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Team Slots */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = currentTeam.pokemon[index];
          return (
            <button
              key={index}
              onClick={() => setSelectedPokemonSlot(index)}
              className={`aspect-square rounded-xl border-2 border-dashed transition-all ${
                selectedPokemonSlot === index
                  ? 'border-green-500 bg-green-50'
                  : pokemon
                  ? 'border-gray-300 bg-white hover:border-green-300'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {pokemon ? (
                <div className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {pokemon.name?.charAt(0) || '?'}
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
      {currentTeam.pokemon.length < 6 && (
        <button
          onClick={addPokemon}
          className="w-full py-3 border-2 border-dashed border-green-400 text-green-600 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <Plus className="h-5 w-5 inline mr-2" />
          Add Pokémon
        </button>
      )}

      {/* Pokemon Editor */}
      {selectedPokemon && selectedPokemonSlot !== null && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Pokémon #{selectedPokemonSlot + 1}</h3>
            <button
              onClick={() => removePokemon(selectedPokemonSlot)}
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
                value={selectedPokemon.name || ''}
                onChange={(e) => updatePokemon(selectedPokemonSlot, 'name', e.target.value)}
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
                value={selectedPokemon.item || ''}
                onChange={(e) => updatePokemon(selectedPokemonSlot, 'item', e.target.value)}
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
                value={selectedPokemon.ability || ''}
                onChange={(e) => updatePokemon(selectedPokemonSlot, 'ability', e.target.value)}
                placeholder="Enter ability..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Nature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nature</label>
              <input
                type="text"
                value={selectedPokemon.nature || ''}
                onChange={(e) => updatePokemon(selectedPokemonSlot, 'nature', e.target.value)}
                placeholder="Enter nature..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Tera Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tera Type</label>
              <select
                value={selectedPokemon.teraType || ''}
                onChange={(e) => updatePokemon(selectedPokemonSlot, 'teraType', e.target.value)}
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
                {(selectedPokemon.moves || []).map((move, moveIndex) => (
                  <input
                    key={moveIndex}
                    type="text"
                    value={move || ''}
                    onChange={(e) => updateMove(selectedPokemonSlot, moveIndex, e.target.value)}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setShowExport(true)}
          disabled={currentTeam.pokemon.length === 0}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
        <button 
          onClick={() => setShowSaveOptions(true)}
          disabled={!currentTeam.name.trim() || currentTeam.pokemon.length === 0}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>Save to Slot</span>
        </button>
        <button 
          onClick={() => setShowSlotSelector(true)}
          className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Grid className="h-4 w-4" />
          <span>Load Team</span>
        </button>
        <button 
          onClick={exportToShowdown}
          disabled={currentTeam.pokemon.length === 0}
          className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="h-4 w-4" />
          <span>Copy Format</span>
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
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(currentTeam, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const exportFileDefaultName = `${currentTeam.name.replace(/\s+/g, '_')}_team.json`;
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
              setShowExport(false);
            }}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Export as JSON</span>
          </button>
        </div>
      </Modal>

      {/* Team Slot Selector Modal */}
      <Modal
        isOpen={showSlotSelector}
        onClose={() => setShowSlotSelector(false)}
        title="Load Team from Slot"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamSlots.filter(slot => slot.team).map((slot) => (
              <div key={slot.slotId} className="cursor-pointer" onClick={() => loadTeamFromSlot(slot.team!)}>
                <TeamSlot
                  slot={slot}
                  showActions={false}
                  className="h-full hover:ring-2 hover:ring-green-500 transition-all"
                />
              </div>
            ))}
          </div>
          {teamSlots.filter(slot => slot.team).length === 0 && (
            <div className="text-center py-8">
              <Grid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Teams</h3>
              <p className="text-gray-500">Save teams to slots to load them here</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Save to Slot Modal */}
      <Modal
        isOpen={showSaveOptions}
        onClose={() => setShowSaveOptions(false)}
        title="Save Team to Slot"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Team: {currentTeam.name}</h4>
            <p className="text-sm text-blue-700">
              {currentTeam.pokemon.length} Pokémon • {currentTeam.description || 'No description'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Slot</label>
            <div className="grid grid-cols-4 gap-2">
              {teamSlots.map((slot) => {
                const isOccupied = slot.team !== null;
                const nextAvailable = getNextAvailableSlot();
                const isRecommended = slot.slotNumber === nextAvailable;
                
                return (
                  <button
                    key={slot.slotId}
                    onClick={() => setSaveToSlotNumber(slot.slotNumber)}
                    disabled={slot.isLocked}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      saveToSlotNumber === slot.slotNumber
                        ? 'border-green-500 bg-green-50'
                        : isOccupied
                        ? 'border-amber-300 bg-amber-50 hover:border-amber-400'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    } ${slot.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{slot.slotNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {slot.isLocked ? 'Locked' : isOccupied ? slot.team?.name : 'Empty'}
                      </div>
                      {isRecommended && !isOccupied && (
                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                          Next
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {saveToSlotNumber && teamSlots.find(s => s.slotNumber === saveToSlotNumber)?.team && (
              <div className="mt-2 text-sm text-amber-600">
                ⚠️ This will overwrite the existing team in Slot {saveToSlotNumber}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowSaveOptions(false)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => saveToSlotNumber && saveTeamToSlot(saveToSlotNumber)}
              disabled={!saveToSlotNumber}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>Save Team</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamBuilder;