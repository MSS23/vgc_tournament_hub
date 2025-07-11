import React, { useState } from 'react';
import { X, Image, Trophy, Users, Camera, MapPin } from 'lucide-react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (post: any) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPost }) => {
  const [postType, setPostType] = useState<'update' | 'team' | 'result'>('update');
  const [content, setContent] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [placement, setPlacement] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<string[]>([]);

  const pokemonOptions = [
    'Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee',
    'Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri',
    'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'
  ];

  if (!isOpen) return null;

  const handlePokemonToggle = (pokemon: string) => {
    if (selectedPokemon.includes(pokemon)) {
      setSelectedPokemon(selectedPokemon.filter(p => p !== pokemon));
    } else if (selectedPokemon.length < 6) {
      setSelectedPokemon([...selectedPokemon, pokemon]);
    }
  };

  const handleSubmit = () => {
    const newPost = {
      id: Date.now().toString(),
      type: postType,
      user: { name: 'TrainerMaster', avatar: 'TM' },
      timestamp: 'Just now',
      content: {
        title: content,
        tournament: selectedTournament,
        placement: placement ? parseInt(placement) : undefined,
        team: selectedPokemon,
        teamName: teamName,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
    };

    onPost(newPost);
    onClose();
    
    // Reset form
    setContent('');
    setSelectedTournament('');
    setPlacement('');
    setTeamName('');
    setSelectedPokemon([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Post Type Selection */}
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setPostType('update')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                postType === 'update' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>Update</span>
            </button>
            <button
              onClick={() => setPostType('team')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                postType === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </button>
            <button
              onClick={() => setPostType('result')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                postType === 'result' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Result</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Main Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'update' ? "What's happening in your VGC journey?" :
              postType === 'team' ? "Tell us about your team..." :
              "How did your tournament go?"
            }
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Tournament Result Fields */}
          {postType === 'result' && (
            <div className="space-y-3">
              <input
                type="text"
                value={selectedTournament}
                onChange={(e) => setSelectedTournament(e.target.value)}
                placeholder="Tournament name..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                placeholder="Final placement..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Team Fields */}
          {(postType === 'team' || postType === 'result') && (
            <div className="space-y-3">
              {postType === 'team' && (
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Select Pokémon ({selectedPokemon.length}/6)
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {pokemonOptions.map((pokemon) => (
                    <button
                      key={pokemon}
                      onClick={() => handlePokemonToggle(pokemon)}
                      className={`p-2 text-sm rounded-lg transition-all ${
                        selectedPokemon.includes(pokemon)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pokemon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Image className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MapPin className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;