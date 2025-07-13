import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Calendar, MapPin } from 'lucide-react';

interface HomePageProps {
  onEnter: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('common.tournament', 'Tournament')} Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {t('common.tournaments', 'Tournaments')} • {t('common.players', 'Players')} • {t('common.community', 'Community')}
          </p>
          
          {/* Language Test Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Language Test</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Tournament:</strong> {t('common.tournament', 'Tournament')}</p>
              <p><strong>Player:</strong> {t('common.player', 'Player')}</p>
              <p><strong>Match:</strong> {t('common.match', 'Match')}</p>
              <p><strong>Leaderboard:</strong> {t('common.leaderboard', 'Leaderboard')}</p>
            </div>
          </div>
          
          <button
            onClick={onEnter}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('common.enter', 'Enter')} VGC Hub
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="flex-1 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tournament Management */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('common.tournaments', 'Tournaments')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.tournament.description', 'Manage and participate in tournaments')}
              </p>
            </div>

            {/* Player Profiles */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('common.players', 'Players')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.players.description', 'Connect with players worldwide')}
              </p>
            </div>

            {/* Event Calendar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
              <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('common.calendar', 'Calendar')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.calendar.description', 'Track upcoming events')}
              </p>
            </div>

            {/* Global Community */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
              <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('common.community', 'Community')}</h3>
              <p className="text-gray-600 text-sm">
                {t('common.community.description', 'Join the global VGC community')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 