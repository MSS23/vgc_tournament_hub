import React, { useState } from 'react';
import { X, Save, Heart, Users, Trophy } from 'lucide-react';
import { Pokemon } from '../types';
import Modal from './Modal';

interface TeamSaveModalProps {
  team: Pokemon[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamData: SavedTeamData) => void;
  tournamentName?: string;
  playerName?: string;
}

export interface SavedTeamData {
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  team: Pokemon[];
  originalTournament?: string;
  originalPlayer?: string;
}

const TeamSaveModal: React.FC<TeamSaveModalProps> = ({
  team,
  isOpen,
  onClose,
  onSave,
  tournamentName,
  playerName
}) => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(true);



  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!teamName.trim()) return;

    const teamData: SavedTeamData = {
      name: teamName,
      description,
      tags,
      isPublic,
      team,
      originalTournament: tournamentName,
      originalPlayer: playerName,
    };

    onSave(teamData);
    onClose();
    
    // Reset form
    setTeamName('');
    setDescription('');
    setTags([]);
    setIsPublic(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="overflow-hidden"
      headerClassName="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-b-0"
      bodyClassName="p-6 space-y-6"
    >
      {/* Custom Header Content */}
      <div className="flex items-center space-x-3">
        <Heart className="h-6 w-6" />
        <h2 className="text-xl font-bold">Save Team</h2>
      </div>

      {/* Content */}
      <div className="space-y-6">
          {/* Team Preview */}
          <div>
            <p className="text-sm text-gray-600 mb-3">Team Composition</p>
            <div className="flex flex-wrap gap-2">
              {team.map((pokemon, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {pokemon.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{pokemon.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Original Source */}
          {(tournamentName || playerName) && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium">Original Source</p>
              {tournamentName && <p className="text-sm text-blue-600">Tournament: {tournamentName}</p>}
              {playerName && <p className="text-sm text-blue-600">Player: {playerName}</p>}
            </div>
          )}

          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your team strategy..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Make Public</p>
                <p className="text-sm text-gray-600">Allow others to discover this team</p>
              </div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!teamName.trim()}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>Save Team</span>
            </button>
          </div>
        </div>
      </Modal>
    );
};

export default TeamSaveModal;