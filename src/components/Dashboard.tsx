import React, { useState } from 'react';
import { Calendar, Trophy, TrendingUp, Users, ChevronRight, Heart } from 'lucide-react';
import { mockTournaments, mockPlayerStats } from '../data/mockData';
import TournamentCard from './TournamentCard';
import StatCard from './StatCard';
import { SavedTeamData } from './TeamSaveModal';

const Dashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [savedTeams, setSavedTeams] = useState<SavedTeamData[]>([]);

  const filters = [
    { id: 'all', label: 'All Time' },
    { id: '2024', label: '2024' },
    { id: '2023', label: '2023' },
    { id: 'regionals', label: 'Regionals' },
  ];

  const recentTournaments = mockTournaments.slice(0, 3);
  const stats = mockPlayerStats;

  const handleSaveTeam = (teamData: SavedTeamData) => {
    setSavedTeams(prev => [...prev, { ...teamData, id: Date.now().toString() }]);
    // You could also save to localStorage or send to backend here
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Trainer!</h2>
        <p className="text-blue-100">Ready to analyze your tournament performance?</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalTournaments}</p>
            <p className="text-sm text-blue-100">Tournaments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.winRate}%</p>
            <p className="text-sm text-blue-100">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">#{stats.bestFinish}</p>
            <p className="text-sm text-blue-100">Best Finish</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Trophy}
          title="Current Season"
          value={`${stats.seasonWins}W-${stats.seasonLosses}L`}
          trend={`+${stats.seasonWins - stats.seasonLosses}`}
          color="text-yellow-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Resistance"
          value={`${stats.resistance}%`}
          trend="+2.4%"
          color="text-green-600"
        />
        <StatCard
          icon={Users}
          title="Opponents Beat"
          value={stats.opponentsBeat.toString()}
          trend="+12"
          color="text-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="This Month"
          value={`${stats.monthlyGames} games`}
          trend="+5"
          color="text-purple-600"
        />
      </div>

      {/* Tournament Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedFilter === filter.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Recent Tournaments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tournaments</h3>
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {recentTournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onSaveTeam={handleSaveTeam}
            />
          ))}
        </div>
      </div>

      {/* Saved Teams Preview */}
      {savedTeams.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recently Saved Teams</h3>
            <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {savedTeams.slice(-2).map((team, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{team.name}</h4>
                    {team.originalTournament && (
                      <p className="text-sm text-gray-600">From: {team.originalTournament}</p>
                    )}
                  </div>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.team.slice(0, 6).map((pokemon, pokemonIndex) => (
                    <span
                      key={pokemonIndex}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                    >
                      {pokemon.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;