import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Save, Share2, Shield, AlertTriangle, Search, Settings, Zap, Heart, Star, Target, Users, Calendar } from 'lucide-react';
import { Pokemon, TeamShowcase as TeamShowcaseType } from '../types';
import { getLegalMoves, isLegalMove } from '../data/moveData';

interface TeamShowcaseProps {
  userDivision: 'junior' | 'senior' | 'master';
  isGuardianApprovalRequired: boolean;
  onSave: (showcase: Omit<TeamShowcaseType, 'id' | 'createdAt'>) => void;
  userId?: string;
}

const TeamShowcase: React.FC<TeamShowcaseProps> = ({
  userDivision,
  isGuardianApprovalRequired,
  onSave,
  userId = 'user-123'
}) => {
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'guardians-only'>(
    userDivision === 'master' ? 'public' : 'private'
  );
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [userTeams, setUserTeams] = useState<TeamShowcaseType[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTeamIndex, setShareTeamIndex] = useState<number | null>(null);
  const [shareType, setShareType] = useState<'open' | 'evs'>('open');
  const [shareWith, setShareWith] = useState<'public' | 'friend'>('public');
  const [shareLink, setShareLink] = useState<string>('');
  const [showEVs, setShowEVs] = useState(false);
  const [showEVsForSlot, setShowEVsForSlot] = useState<number | null>(null);
  const [pokemonSearch, setPokemonSearch] = useState('');

  const pokemonDatabase = [
    'Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee',
    'Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri',
    'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W',
    'Iron Hands', 'Iron Bundle', 'Iron Valiant', 'Great Tusk', 'Scream Tail', 'Brute Bonnet',
    'Flutter Mane', 'Slither Wing', 'Sandy Shocks', 'Roaring Moon', 'Iron Jugulis', 'Iron Moth',
    'Iron Thorns', 'Iron Treads', 'Iron Leaves', 'Walking Wake', 'Iron Boulder', 'Iron Crown'
  ];

  const typeColors: { [key: string]: string } = {
    'Normal': 'bg-gray-400',
    'Fire': 'bg-red-500',
    'Water': 'bg-blue-500',
    'Electric': 'bg-yellow-400',
    'Grass': 'bg-green-500',
    'Ice': 'bg-blue-200',
    'Fighting': 'bg-red-700',
    'Poison': 'bg-purple-500',
    'Ground': 'bg-yellow-600',
    'Flying': 'bg-indigo-400',
    'Psychic': 'bg-pink-500',
    'Bug': 'bg-green-400',
    'Rock': 'bg-yellow-700',
    'Ghost': 'bg-purple-700',
    'Dragon': 'bg-indigo-700',
    'Dark': 'bg-gray-700',
    'Steel': 'bg-gray-500',
    'Fairy': 'bg-pink-300'
  };

  const addPokemon = () => {
    if (team.length < 6) {
      const newPokemon: Pokemon = {
        name: '',
        item: '',
        ability: '',
        teraType: '',
        moves: ['', '', '', ''],
        nature: '',
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      };
      setTeam([...team, newPokemon]);
      setSelectedSlot(team.length);
    }
  };

  const updatePokemon = (index: number, field: keyof Pokemon, value: any) => {
    const updatedTeam = [...team];
    updatedTeam[index] = { ...updatedTeam[index], [field]: value };
    setTeam(updatedTeam);
    if (field === 'name') {
      // Reset moves to legal moves only
      updatedTeam[index].moves = ['', '', '', ''];
    }
  };

  const updateMove = (pokemonIndex: number, moveIndex: number, move: string) => {
    const updatedTeam = [...team];
    if (!updatedTeam[pokemonIndex].moves) {
      updatedTeam[pokemonIndex].moves = ['', '', '', ''];
    }
    updatedTeam[pokemonIndex].moves![moveIndex] = move;
    setTeam(updatedTeam);
  };

  const updateEV = (pokemonIndex: number, stat: keyof typeof team[0]['evs'], value: number) => {
    const updatedTeam = [...team];
    if (!updatedTeam[pokemonIndex].evs) {
      updatedTeam[pokemonIndex].evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    }
    updatedTeam[pokemonIndex].evs![stat] = Math.max(0, Math.min(252, value));
    setTeam(updatedTeam);
  };

  const handleSave = () => {
    if (!title.trim() || team.length === 0) return;
    // Validate all moves are legal
    for (const poke of team) {
      if (!poke.name) return;
      const legalMoves = getLegalMoves(poke.name);
      if (!poke.moves || poke.moves.some(m => m && !legalMoves.includes(m))) {
        alert(`Illegal move detected for ${poke.name}. Please only select legal moves.`);
        return;
      }
    }
    const showcase: Omit<TeamShowcaseType, 'id' | 'createdAt'> = {
      playerId: 'current-user',
      tournamentId: 'current-tournament',
      team,
      title,
      description,
      visibility,
      isApproved: !isGuardianApprovalRequired,
    };
    onSave(showcase);
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public': return <Eye className="h-4 w-4" />;
      case 'guardians-only': return <Shield className="h-4 w-4" />;
      default: return <EyeOff className="h-4 w-4" />;
    }
  };

  const handleShareClick = (index: number) => {
    setShareTeamIndex(index);
    setShareType('open');
    setShareWith('public');
    setShowShareModal(true);
    setShareLink('');
  };

  const handleShareConfirm = () => {
    if (shareTeamIndex === null) return;
    const team = userTeams[shareTeamIndex];
    const hasEVs = team.team.some(p => p.evs);
    const sharedTeam: TeamShowcaseType = {
      ...team,
      sharedType: shareType,
      sharedWith: shareWith,
      sharedAt: new Date().toISOString(),
      sharedLink: shareWith === 'friend' ? `https://vgchub.com/team/${team.id}?token=${Math.random().toString(36).slice(2)}` : undefined,
      visibility: shareWith === 'public' ? 'public' : 'private',
    };
    setUserTeams(prev => prev.map((t, i) => i === shareTeamIndex ? sharedTeam : t));
    setShowShareModal(false);
    setShareTeamIndex(null);
    setShareLink(sharedTeam.sharedLink || '');
    if (shareWith === 'public') {
      onSave(sharedTeam);
    }
  };

  const filteredPokemon = pokemonDatabase.filter(pokemon =>
    pokemon.toLowerCase().includes(pokemonSearch.toLowerCase())
  );

  const getPokemonGradient = (name: string) => {
    const gradients = [
      'from-red-400 to-orange-500',
      'from-blue-400 to-purple-500',
      'from-green-400 to-teal-500',
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-indigo-400 to-blue-500'
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  // Base stats for common VGC Pokémon (simplified - in a real app this would come from a database)
  const baseStats: Record<string, { hp: number; atk: number; def: number; spa: number; spd: number; spe: number }> = {
    'Charizard': { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 },
    'Gholdengo': { hp: 87, atk: 60, def: 95, spa: 133, spd: 91, spe: 84 },
    'Urshifu': { hp: 100, atk: 130, def: 100, spa: 63, spd: 60, spe: 97 },
    'Rillaboom': { hp: 100, atk: 125, def: 90, spa: 60, spd: 70, spe: 85 },
    'Amoonguss': { hp: 114, atk: 85, def: 70, spa: 85, spd: 80, spe: 30 },
    'Indeedee': { hp: 60, atk: 65, def: 55, spa: 105, spd: 95, spe: 95 },
    'Miraidon': { hp: 100, atk: 85, def: 100, spa: 135, spd: 91, spe: 135 },
    'Flutter Mane': { hp: 55, atk: 55, def: 55, spa: 135, spd: 135, spe: 135 },
    'Annihilape': { hp: 110, atk: 115, def: 80, spa: 50, spd: 90, spe: 90 },
    'Torkoal': { hp: 70, atk: 85, def: 140, spa: 85, spd: 70, spe: 20 },
    'Dondozo': { hp: 150, atk: 100, def: 115, spa: 65, spd: 65, spe: 35 },
    'Tatsugiri': { hp: 68, atk: 64, def: 60, spa: 111, spd: 60, spe: 82 },
    'Calyrex-Ice': { hp: 100, atk: 165, def: 150, spa: 85, spd: 130, spe: 50 },
    'Incineroar': { hp: 95, atk: 115, def: 90, spa: 80, spd: 90, spe: 60 },
    'Grimmsnarl': { hp: 95, atk: 120, def: 65, spa: 95, spd: 75, spe: 60 },
    'Raging Bolt': { hp: 125, atk: 73, def: 91, spa: 137, spd: 89, spe: 75 },
    'Landorus-T': { hp: 89, atk: 145, def: 90, spa: 105, spd: 80, spe: 91 },
    'Ogerpon-W': { hp: 80, atk: 120, def: 84, spa: 60, spd: 96, spe: 110 },
  };

  // Nature modifiers
  const natureModifiers: Record<string, { plus: string; minus: string }> = {
    'Hardy': { plus: 'none', minus: 'none' },
    'Lonely': { plus: 'atk', minus: 'def' },
    'Brave': { plus: 'atk', minus: 'spe' },
    'Adamant': { plus: 'atk', minus: 'spa' },
    'Naughty': { plus: 'atk', minus: 'spd' },
    'Bold': { plus: 'def', minus: 'atk' },
    'Docile': { plus: 'none', minus: 'none' },
    'Relaxed': { plus: 'def', minus: 'spe' },
    'Impish': { plus: 'def', minus: 'spa' },
    'Lax': { plus: 'def', minus: 'spd' },
    'Timid': { plus: 'spe', minus: 'atk' },
    'Hasty': { plus: 'spe', minus: 'def' },
    'Serious': { plus: 'none', minus: 'none' },
    'Jolly': { plus: 'spe', minus: 'spa' },
    'Naive': { plus: 'spe', minus: 'spd' },
    'Modest': { plus: 'spa', minus: 'atk' },
    'Mild': { plus: 'spa', minus: 'def' },
    'Quiet': { plus: 'spa', minus: 'spe' },
    'Bashful': { plus: 'none', minus: 'none' },
    'Rash': { plus: 'spa', minus: 'spd' },
    'Calm': { plus: 'spd', minus: 'atk' },
    'Gentle': { plus: 'spd', minus: 'def' },
    'Sassy': { plus: 'spd', minus: 'spe' },
    'Careful': { plus: 'spd', minus: 'spa' },
    'Quirky': { plus: 'none', minus: 'none' },
  };

  // Calculate final stats based on base stats, EVs, and nature
  const calculateFinalStats = (pokemon: Pokemon) => {
    const base = baseStats[pokemon.name] || { hp: 50, atk: 50, def: 50, spa: 50, spd: 50, spe: 50 };
    const evs = pokemon.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    const nature = pokemon.nature || 'Hardy';
    const natureMod = natureModifiers[nature] || { plus: 'none', minus: 'none' };

    const calculateStat = (baseStat: number, ev: number, statName: string, isHP: boolean = false) => {
      if (isHP) {
        return Math.floor(((2 * baseStat + 31 + Math.floor(ev / 4)) * 50) / 100) + 50 + 10;
      }
      
      let natureMultiplier = 1;
      if (natureMod.plus === statName) natureMultiplier = 1.1;
      if (natureMod.minus === statName) natureMultiplier = 0.9;
      
      return Math.floor((Math.floor(((2 * baseStat + 31 + Math.floor(ev / 4)) * 50) / 100) + 5) * natureMultiplier);
    };

    return {
      hp: calculateStat(base.hp, evs.hp, 'hp', true),
      atk: calculateStat(base.atk, evs.atk, 'atk'),
      def: calculateStat(base.def, evs.def, 'def'),
      spa: calculateStat(base.spa, evs.spa, 'spa'),
      spd: calculateStat(base.spd, evs.spd, 'spd'),
      spe: calculateStat(base.spe, evs.spe, 'spe'),
    };
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Team Showcase</h2>
            <p className="text-purple-100">Build and share your tournament team</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEVs(!showEVs)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showEVs ? 'bg-white text-purple-600' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">EVs</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{team.length}/6</p>
            <p className="text-sm text-purple-100">Pokémon</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{userTeams.length}</p>
            <p className="text-sm text-purple-100">Saved Teams</p>
          </div>
          <div>
            <p className="text-2xl font-bold capitalize">{userDivision}</p>
            <p className="text-sm text-purple-100">Division</p>
          </div>
        </div>
      </div>

      {/* Privacy Notice for Minors */}
      {(userDivision === 'junior' || userDivision === 'senior') && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Privacy Protection Active</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your showcase will be private by default. {isGuardianApprovalRequired && 'Guardian approval is required to make it public.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team Display */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Team</h3>
          {team.length < 6 && (
            <button
              onClick={addPokemon}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Pokémon</span>
            </button>
          )}
        </div>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => {
            const pokemon = team[index];
            return (
              <div
                key={index}
                onClick={() => setSelectedSlot(index)}
                className={`relative rounded-xl border-2 transition-all cursor-pointer ${
                  selectedSlot === index
                    ? 'border-purple-500 bg-purple-50'
                    : pokemon
                    ? 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    : 'border-dashed border-gray-300 hover:border-purple-400'
                }`}
              >
                {pokemon ? (
                  <div className="p-4">
                    {/* Pokémon Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPokemonGradient(pokemon.name)} flex items-center justify-center text-white font-bold text-lg`}>
                        {pokemon.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{pokemon.name}</h4>
                        {pokemon.item && (
                          <p className="text-sm text-gray-600">{pokemon.item}</p>
                        )}
                      </div>
                    </div>

                    {/* Tera Type */}
                    {pokemon.teraType && (
                      <div className="mb-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[pokemon.teraType] || 'bg-gray-500'}`}>
                          Tera: {pokemon.teraType}
                        </span>
                      </div>
                    )}

                    {/* Moves */}
                    <div className="space-y-1 mb-3">
                      {pokemon.moves?.map((move, moveIndex) => (
                        <div key={moveIndex} className="text-sm text-gray-700">
                          {moveIndex + 1}. {move || 'Empty'}
                        </div>
                      ))}
                    </div>

                    {/* EVs (if enabled) */}
                    {showEVs && pokemon.evs && (
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        {(() => {
                          const finalStats = calculateFinalStats(pokemon);
                          return (
                            <>
                              <div>HP: {finalStats.hp}</div>
                              <div>Atk: {finalStats.atk}</div>
                              <div>Def: {finalStats.def}</div>
                              <div>SpA: {finalStats.spa}</div>
                              <div>SpD: {finalStats.spd}</div>
                              <div>Spe: {finalStats.spe}</div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-sm">Add Pokémon</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pokémon Editor */}
      {selectedSlot !== null && team[selectedSlot] && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Edit Pokémon #{selectedSlot + 1}</h4>
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Showdown-style horizontal card layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Sprite/Initial */}
            <div className="flex flex-col items-center md:items-start w-full md:w-1/5">
              <div className={`w-20 h-20 rounded-lg bg-gradient-to-r ${getPokemonGradient(team[selectedSlot].name)} flex items-center justify-center text-white font-bold text-4xl mb-2`}>
                {team[selectedSlot].name ? team[selectedSlot].name.charAt(0) : '?'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Lv. 50</div>
            </div>

            {/* Middle: Info & Moves */}
            <div className="flex-1 space-y-3">
              {/* Header: Name, Item, Ability, Tera, Nature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Pokémon</label>
                  <select
                    value={team[selectedSlot]?.name || ''}
                    onChange={e => updatePokemon(selectedSlot, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Pokémon</option>
                    {filteredPokemon.map(pokemon => (
                      <option key={pokemon} value={pokemon}>{pokemon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Item</label>
                  <input
                    type="text"
                    value={team[selectedSlot]?.item || ''}
                    onChange={e => updatePokemon(selectedSlot, 'item', e.target.value)}
                    placeholder="e.g., Choice Scarf, Life Orb..."
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ability</label>
                  <input
                    type="text"
                    value={team[selectedSlot]?.ability || ''}
                    onChange={e => updatePokemon(selectedSlot, 'ability', e.target.value)}
                    placeholder="e.g., Intimidate, Levitate..."
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tera Type</label>
                  <select
                    value={team[selectedSlot]?.teraType || ''}
                    onChange={e => updatePokemon(selectedSlot, 'teraType', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Tera Type</option>
                    {Object.keys(typeColors).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nature</label>
                  <select
                    value={team[selectedSlot]?.nature || 'Hardy'}
                    onChange={e => updatePokemon(selectedSlot, 'nature', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {Object.keys(natureModifiers).map(nature => (
                      <option key={nature} value={nature}>{nature}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Moves */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Moves</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map(moveIndex => (
                    <select
                      key={moveIndex}
                      value={team[selectedSlot]?.moves?.[moveIndex] || ''}
                      onChange={e => updateMove(selectedSlot, moveIndex, e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Move {moveIndex + 1}</option>
                      {getLegalMoves(team[selectedSlot].name).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stats, EV/IV sliders, bars */}
            <div className="w-full md:w-2/5 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">Stats</span>
                <span className="text-xs text-gray-500">EVs Remaining: {508 - (Object.values(team[selectedSlot]?.evs || {}).reduce((a, b) => a + b, 0))}</span>
              </div>
              {(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const).map(stat => {
                const base = baseStats[team[selectedSlot].name]?.[stat] || 50;
                const ev = team[selectedSlot]?.evs?.[stat] || 0;
                const iv = 31; // For now, assume 31 IVs for all stats
                const finalStats = calculateFinalStats(team[selectedSlot]);
                // Bar width: base + EV/IV contribution
                const barWidth = Math.min(100, Math.round((finalStats[stat] / 255) * 100));
                return (
                  <div key={stat} className="flex items-center space-x-2 mb-1">
                    <span className="w-8 text-xs text-gray-600 capitalize">{stat}</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden relative">
                      <div
                        className={`absolute left-0 top-0 h-3 rounded ${
                          stat === 'hp' ? 'bg-green-400' :
                          stat === 'atk' ? 'bg-red-400' :
                          stat === 'def' ? 'bg-yellow-400' :
                          stat === 'spa' ? 'bg-blue-400' :
                          stat === 'spd' ? 'bg-teal-400' :
                          'bg-pink-400'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                      <div className="absolute left-2 top-0 text-xs text-white font-bold" style={{ zIndex: 2 }}>{finalStats[stat]}</div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="252"
                      step="4"
                      value={ev}
                      onChange={e => updateEV(selectedSlot, stat, parseInt(e.target.value) || 0)}
                      className="w-24 ml-2"
                    />
                    <span className="w-8 text-xs text-gray-500">EV: {ev}</span>
                  </div>
                );
              })}
              {/* IV quick set (future: add dropdown for IV spreads) */}
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-500 mr-2">IVs: 31 (default)</span>
                {/* Placeholder for IV spread dropdown */}
                {/* <select className="text-xs border border-gray-300 rounded px-2 py-1">
                  <option>All 31</option>
                  <option>All 0</option>
                  <option>VGC Standard</option>
                </select> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showcase Details */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Showcase Details</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your team a catchy title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your team strategy, key synergies, or tournament experience..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Visibility Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="space-y-2">
              {userDivision === 'master' && (
                <button
                  onClick={() => setVisibility('public')}
                  className={`w-full p-3 border rounded-lg transition-colors text-left ${
                    visibility === 'public'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Public</p>
                      <p className="text-sm text-gray-600">Visible to everyone</p>
                    </div>
                  </div>
                </button>
              )}
              
              {(userDivision === 'junior' || userDivision === 'senior') && (
                <button
                  onClick={() => setVisibility('guardians-only')}
                  className={`w-full p-3 border rounded-lg transition-colors text-left ${
                    visibility === 'guardians-only'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Guardians Only</p>
                      <p className="text-sm text-gray-600">Visible to guardians and event staff</p>
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => setVisibility('private')}
                className={`w-full p-3 border rounded-lg transition-colors text-left ${
                  visibility === 'private'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <EyeOff className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">Private</p>
                    <p className="text-sm text-gray-600">Only visible to you</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Approval Notice */}
      {isGuardianApprovalRequired && visibility !== 'private' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Guardian Approval Required</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your showcase will be saved but won't be visible until your guardian approves it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          disabled={!title.trim() || team.length === 0}
          className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>Save Showcase</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* User's Teams List */}
      {userTeams.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Saved Teams</h3>
          {userTeams.map((team, idx) => (
            <div key={team.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{team.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                  
                  {/* Team Preview */}
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {team.team.map((p, i) => (
                      <div key={i} className="text-center">
                        <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-r ${getPokemonGradient(p.name)} flex items-center justify-center text-white text-xs font-bold mb-1`}>
                          {p.name.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600 truncate block">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleShareClick(idx)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
              
              {/* Team Status */}
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  team.visibility === 'public' ? 'bg-green-100 text-green-800' :
                  team.visibility === 'guardians-only' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {team.visibility.charAt(0).toUpperCase() + team.visibility.slice(1)}
                </span>
                {team.sharedType && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                    {team.sharedType === 'open' ? 'Open Team Sheet' : 'With EVs'}
                  </span>
                )}
                {team.sharedLink && (
                  <button
                    onClick={() => navigator.clipboard.writeText(team.sharedLink!)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Copy Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareTeamIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Share Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share as</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShareType('open')}
                    className={`px-4 py-2 rounded-full ${shareType === 'open' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Open Team Sheet
                  </button>
                  {userTeams[shareTeamIndex].team.some(p => p.evs) && (
                    <button
                      onClick={() => setShareType('evs')}
                      className={`px-4 py-2 rounded-full ${shareType === 'evs' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      With EVs
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share with</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShareWith('public')}
                    className={`px-4 py-2 rounded-full ${shareWith === 'public' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setShareWith('friend')}
                    className={`px-4 py-2 rounded-full ${shareWith === 'friend' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Friend (Private Link)
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareConfirm}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamShowcase;