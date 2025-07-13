import React from 'react';
import { MapPin, Users, Trophy, Calendar, Heart, Share2 } from 'lucide-react';
import { Tournament } from '../types';
import { mockTournaments } from '../data/mockData';
import PokemonModal from './PokemonModal';
import TeamSaveModal, { SavedTeamData } from './TeamSaveModal';

interface TournamentCardProps {
  tournament: Tournament;
  onSaveTeam?: (teamData: SavedTeamData) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onSaveTeam }) => {
  const [selectedPokemon, setSelectedPokemon] = React.useState<any>(null);
  const [showTeamSave, setShowTeamSave] = React.useState(false);

  const getPlacementColor = (placement: number) => {
    if (placement <= 3) return 'text-yellow-600 bg-yellow-50';
    if (placement <= 8) return 'text-green-600 bg-green-50';
    if (placement <= 16) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePokemonClick = (pokemon: any) => {
    setSelectedPokemon(pokemon);
  };

  const handleSaveTeam = () => {
    setShowTeamSave(true);
  };

  const handleTeamSave = (teamData: SavedTeamData) => {
    if (onSaveTeam) {
      onSaveTeam(teamData);
    }
  };

  const anyTournamentOngoing = mockTournaments.some(t => t.status === 'ongoing');

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{tournament.name}</h4>
          <div className="flex items-center text-sm text-gray-500 space-x-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {tournament.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(tournament.date)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPlacementColor(tournament.placement)}`}>
            #{tournament.placement}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Players</p>
          <p className="font-semibold text-gray-900">{tournament.totalPlayers}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Record</p>
          <p className="font-semibold text-gray-900">{tournament.wins}W-{tournament.losses}L</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          </div>
          <p className="text-sm text-gray-600">Resistance</p>
          <p className="font-semibold text-gray-900">{tournament.resistance}%</p>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Team Preview</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveTeam}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Save Team"
            >
              <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors" title="Share Team">
              <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-500" />
            </button>
          </div>
        </div>
        {!anyTournamentOngoing ? (
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {tournament.team.slice(0, 6).map((pokemon, index) => (
              <button
                key={index}
                onClick={() => handlePokemonClick(pokemon)}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
              >
                {pokemon.name.charAt(0)}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4 text-center font-semibold mb-4">
            Teams are hidden while a tournament is ongoing.
          </div>
        )}
      </div>
      </div>

      {/* Pokemon Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        tournamentName={tournament.name}
      />

      {/* Team Save Modal */}
      <TeamSaveModal
        team={tournament.team}
        isOpen={showTeamSave}
        onClose={() => setShowTeamSave(false)}
        onSave={handleTeamSave}
        tournamentName={tournament.name}
      />
    </>
  );
};

export default TournamentCard;