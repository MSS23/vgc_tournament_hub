import React, { useState } from 'react';
import { Heart, Users, Trophy, Calendar, Trash2 } from 'lucide-react';
import { mockTournaments, mockPlayers } from '../data/mockData';

const Bookmarks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'players' | 'teams'>('tournaments');

  const savedTournaments = mockTournaments.slice(0, 3);
  const savedPlayers = mockPlayers.slice(0, 3);
  const savedTeams = [
    {
      id: '1',
      name: 'World Champion Team',
      format: '2024 Worlds',
      creator: 'ChampionPlayer',
      pokemon: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'],
      winRate: 85,
    },
    {
      id: '2',
      name: 'Regional Winner',
      format: '2024 Regional',
      creator: 'RegionalAce',
      pokemon: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
      winRate: 78,
    },
  ];

  const tabs = [
    { id: 'tournaments' as const, label: 'Tournaments', icon: Trophy },
    { id: 'players' as const, label: 'Players', icon: Users },
    { id: 'teams' as const, label: 'Teams', icon: Heart },
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Saved Items</h2>
        <p className="text-pink-100">Your bookmarked tournaments, players, and teams</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          {savedTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{tournament.name}</h4>
                  <p className="text-sm text-gray-600">{tournament.location}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(tournament.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">#{tournament.placement}</span>
                  <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{tournament.wins}W-{tournament.losses}L</span>
                <span className="text-gray-600">{tournament.resistance}% resistance</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'players' && (
        <div className="space-y-4">
          {savedPlayers.map((player) => (
            <div key={player.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{player.name}</h4>
                    <p className="text-sm text-gray-600">{player.region}</p>
                  </div>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-semibold text-gray-900">{player.championships}</p>
                  <p className="text-xs text-gray-600">Championships</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{player.winRate}%</p>
                  <p className="text-xs text-gray-600">Win Rate</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{player.rating}</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="space-y-4">
          {savedTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{team.name}</h4>
                  <p className="text-sm text-gray-600">by {team.creator}</p>
                  <p className="text-xs text-gray-500 mt-1">{team.format}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600">{team.winRate}% WR</span>
                  <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Team Composition</p>
                <div className="flex flex-wrap gap-2">
                  {team.pokemon.map((pokemon, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                    >
                      {pokemon}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'tournaments' && savedTournaments.length === 0) ||
        (activeTab === 'players' && savedPlayers.length === 0) ||
        (activeTab === 'teams' && savedTeams.length === 0)) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved items yet</h3>
          <p className="text-gray-600">
            Start exploring and bookmark your favorite {activeTab} to see them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;