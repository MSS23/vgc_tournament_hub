import React from 'react';
import { Trophy, Youtube, Twitch, Twitter, Newspaper, ArrowRight } from 'lucide-react';
import { mockTournaments, mockBlogPosts } from '../data/mockData';
import LanguageDropdown from './LanguageDropdown';
import icon from '/icon.svg';

const latestNews = [
  {
    id: 'news-1',
    title: 'Pokémon World Championships Announced!',
    date: '2024-07-01',
    summary: 'The Pokémon World Championships are coming to Hawaii! Get ready for the biggest VGC event of the year.',
    link: 'https://www.pokemon.com/us/play-pokemon/worlds/'
  },
  {
    id: 'news-2',
    title: 'Regulation H Format Now Live',
    date: '2024-06-15',
    summary: 'Regulation H is now the official format for all VGC tournaments. Check out the new rules and strategies.',
    link: 'https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources/'
  }
];

const currentFormat = {
  name: 'Regulation H',
  description: 'The current official format for VGC tournaments. Includes new Pokémon, moves, and strategies. Make sure your team is ready!'
};

const mostActiveTournament = mockTournaments.find(t => t.status === 'ongoing') || mockTournaments[0];
const featuredBlogPosts = mockBlogPosts.slice(0, 2);

const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/user/pokemon',
    icon: Youtube,
    color: 'text-red-600'
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/pokemon',
    icon: Twitch,
    color: 'text-purple-600'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/Pokemon',
    icon: Twitter,
    color: 'text-blue-500'
  }
];

interface HomePageProps {
  onEnter?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20 flex flex-col items-center">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageDropdown />
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl w-full mx-auto py-16 px-4 text-center flex flex-col items-center">
        <img src={icon} alt="VGC Hub Logo" className="mx-auto w-20 h-20 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">VGC Hub</h1>
        <p className="text-lg text-gray-600 mb-6">Your home for competitive Pokémon VGC tournaments, news, and community.</p>
        <div className="flex justify-center space-x-4 mb-6">
          {socialLinks.map(link => {
            const Icon = link.icon;
            return (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-full bg-white shadow hover:scale-110 transition-transform ${link.color}`}> <Icon className="h-6 w-6" /> </a>
            );
          })}
        </div>
        <button
          className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 transition-all text-lg"
          onClick={onEnter}
        >
          Enter VGC Hub
        </button>
      </div>

      {/* Latest News */}
      <div className="max-w-4xl w-full mx-auto px-4 mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Newspaper className="h-6 w-6 mr-2 text-blue-600" /> Latest Pokémon News</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {latestNews.map(news => (
            <div key={news.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{new Date(news.date).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">{news.summary}</p>
              </div>
              <button
                className="inline-flex items-center text-blue-600 font-medium hover:underline mt-auto"
                onClick={onEnter}
              >
                Read more <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Format */}
      <div className="max-w-2xl w-full mx-auto px-4 mb-14">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white flex items-center justify-between shadow">
          <div>
            <h2 className="text-xl font-bold mb-1">Current Format: {currentFormat.name}</h2>
            <p className="text-white/90">{currentFormat.description}</p>
          </div>
          <Trophy className="h-10 w-10 text-yellow-300" />
        </div>
      </div>

      {/* Most Active Tournament */}
      <div className="max-w-2xl w-full mx-auto px-4 mb-14">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between shadow">
          <div className="mb-4 md:mb-0 md:mr-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Most Active Tournament</h2>
            <p className="text-gray-700 font-medium">{mostActiveTournament.name}</p>
            <p className="text-sm text-gray-500">{mostActiveTournament.location} • {new Date(mostActiveTournament.date).toLocaleDateString()}</p>
          </div>
          <button
            className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
            onClick={onEnter}
          >
            View Live Pairings <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Featured Blog Posts */}
      <div className="max-w-4xl w-full mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><Newspaper className="h-6 w-6 mr-2 text-purple-600" /> Featured Blog Posts</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {featuredBlogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">by {post.author.name}</p>
                <p className="text-gray-700 mb-4">{post.summary}</p>
              </div>
              <button
                className="inline-flex items-center text-purple-600 font-medium hover:underline mt-auto"
                onClick={onEnter}
              >
                Read more <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 