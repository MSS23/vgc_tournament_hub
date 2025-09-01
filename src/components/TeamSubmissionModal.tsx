import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Trophy, GameController2, Upload, 
  Calendar, MapPin, Users, Clock, Download, Copy, Eye, EyeOff 
} from 'lucide-react';
import { Team, Tournament, TournamentSubmission } from '../types';
import Modal from './Modal';

interface TeamSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submissionData: TournamentSubmissionData) => void;
  tournament: Tournament;
  selectedTeam: Team;
  submissionDetails: {
    battleTeamName: string;
    switchProfile: string;
    switchModel: 'Switch' | 'Switch Lite' | 'Switch OLED';
    rentalTeamId: string;
  };
  playerDetails: {
    playerId: string;
    playerName: string;
  };
}

export interface TournamentSubmissionData {
  teamId: string;
  tournamentId: string;
  battleTeamName: string;
  switchProfile: string;
  switchModel: 'Switch' | 'Switch Lite' | 'Switch OLED';
  rentalTeamId?: string;
  playerId: string;
  playerName: string;
  teamList: TeamPokemonEntry[];
  submittedAt: string;
  confirmationCode: string;
}

interface TeamPokemonEntry {
  position: number;
  name: string;
  item?: string;
  ability?: string;
  teraType?: string;
  moves: string[];
  nature?: string;
  stats?: string; // EVs/IVs display
}

const TeamSubmissionModal: React.FC<TeamSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tournament,
  selectedTeam,
  submissionDetails,
  playerDetails
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [showTeamDetails, setShowTeamDetails] = useState(true);
  const [agreedToSubmission, setAgreedToSubmission] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Generate team list from selected team
  const teamList: TeamPokemonEntry[] = selectedTeam.pokemon.map((pokemon, index) => ({
    position: index + 1,
    name: pokemon.name || 'Unknown',
    item: pokemon.item,
    ability: pokemon.ability,
    teraType: pokemon.teraType,
    moves: pokemon.moves || [],
    nature: pokemon.nature,
    stats: pokemon.evs ? 
      `${pokemon.evs.hp}/${pokemon.evs.atk}/${pokemon.evs.def}/${pokemon.evs.spa}/${pokemon.evs.spd}/${pokemon.evs.spe}` : 
      undefined
  }));

  // Validate submission data
  const validateSubmission = (): string[] => {
    const errors: string[] = [];
    
    if (!submissionDetails.battleTeamName.trim()) {
      errors.push('Battle Team Name is required');
    }
    
    if (!submissionDetails.switchProfile.trim()) {
      errors.push('Switch Profile Name is required');
    }
    
    if (!playerDetails.playerId.trim()) {
      errors.push('Player ID is required');
    }
    
    if (!playerDetails.playerName.trim()) {
      errors.push('Player Name is required');
    }
    
    if (selectedTeam.pokemon.length !== 6) {
      errors.push('Team must have exactly 6 Pokémon');
    }
    
    // Check if all Pokemon have names
    const missingNames = selectedTeam.pokemon.some(p => !p.name);
    if (missingNames) {
      errors.push('All Pokémon must have names');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateSubmission();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    setIsSubmitting(true);
    
    try {
      // Generate confirmation code
      const confirmationCode = `${tournament.id.slice(-4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      
      const submissionData: TournamentSubmissionData = {
        teamId: selectedTeam.id,
        tournamentId: tournament.id,
        battleTeamName: submissionDetails.battleTeamName,
        switchProfile: submissionDetails.switchProfile,
        switchModel: submissionDetails.switchModel,
        rentalTeamId: submissionDetails.rentalTeamId || undefined,
        playerId: playerDetails.playerId,
        playerName: playerDetails.playerName,
        teamList,
        submittedAt: new Date().toISOString(),
        confirmationCode
      };
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(submissionData);
      
      // Success - modal will close automatically
      setIsSubmitting(false);
    } catch (error) {
      console.error('Submission failed:', error);
      setValidationErrors(['Submission failed. Please try again.']);
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const exportTeamList = () => {
    const exportData = {
      tournament: tournament.name,
      player: playerDetails.playerName,
      battleTeamName: submissionDetails.battleTeamName,
      switchProfile: submissionDetails.switchProfile,
      switchModel: submissionDetails.switchModel,
      rentalTeamId: submissionDetails.rentalTeamId,
      team: teamList,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${tournament.name.replace(/\s+/g, '_')}_${submissionDetails.battleTeamName.replace(/\s+/g, '_')}_team.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="h-6 w-6 text-white" />
          <h2 className="text-xl font-bold text-white">Submit Team</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Tournament Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-blue-900">{tournament.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{new Date(tournament.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-3 w-3" />
              <span>{tournament.totalPlayers} players</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-3 w-3" />
              <span>VGC {tournament.tournamentDetails?.format || '2024'}</span>
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Submission Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Battle Team Name</label>
              <p className="font-medium text-gray-900">{submissionDetails.battleTeamName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Switch Profile</label>
              <p className="font-medium text-gray-900">{submissionDetails.switchProfile}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Switch Model</label>
              <p className="font-medium text-gray-900">{submissionDetails.switchModel}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rental Team ID</label>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900">
                  {submissionDetails.rentalTeamId || 'Not provided'}
                </p>
                {submissionDetails.rentalTeamId && (
                  <button
                    onClick={() => copyToClipboard(submissionDetails.rentalTeamId)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Copy Rental Code"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Player Name</label>
              <p className="font-medium text-gray-900">{playerDetails.playerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Player ID</label>
              <p className="font-medium text-gray-900">{playerDetails.playerId}</p>
            </div>
          </div>
        </div>

        {/* Team List */}
        <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <GameController2 className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Team: {selectedTeam.name}</h4>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTeamDetails(!showTeamDetails)}
                className="p-1 text-gray-500 hover:text-gray-700"
                title={showTeamDetails ? 'Hide Details' : 'Show Details'}
              >
                {showTeamDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={exportTeamList}
                className="p-1 text-gray-500 hover:text-gray-700"
                title="Export Team List"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {showTeamDetails && (
            <div className="p-4 space-y-3">
              {teamList.map((pokemon, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {pokemon.position}
                      </div>
                      <span className="font-semibold text-gray-900">{pokemon.name}</span>
                      {pokemon.item && (
                        <span className="text-sm text-gray-600">@ {pokemon.item}</span>
                      )}
                    </div>
                    {pokemon.teraType && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Tera {pokemon.teraType}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {pokemon.ability && (
                      <div>
                        <span className="text-gray-600">Ability:</span>
                        <span className="ml-1 font-medium">{pokemon.ability}</span>
                      </div>
                    )}
                    {pokemon.nature && (
                      <div>
                        <span className="text-gray-600">Nature:</span>
                        <span className="ml-1 font-medium">{pokemon.nature}</span>
                      </div>
                    )}
                  </div>
                  
                  {pokemon.moves.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">Moves:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pokemon.moves.map((move, moveIndex) => (
                          <span
                            key={moveIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {move}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {pokemon.stats && (
                    <div className="mt-2 text-xs text-gray-500">
                      EVs: {pokemon.stats}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-red-800">Validation Errors</h4>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submission Agreement */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="submission-agreement"
              checked={agreedToSubmission}
              onChange={(e) => setAgreedToSubmission(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="text-sm">
              <label htmlFor="submission-agreement" className="font-medium text-amber-800">
                Submission Agreement
              </label>
              <p className="text-amber-700 mt-1">
                I confirm that this team list is accurate and complete. I understand that this 
                submission is final and changes cannot be made after confirmation. I agree to 
                use only the Pokémon listed above during tournament play.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreedToSubmission || isSubmitting || validationErrors.length > 0}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Submit Team</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamSubmissionModal;