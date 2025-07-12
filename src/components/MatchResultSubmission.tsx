import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import MatchSlipService from '../services/MatchSlipService';
import TournamentPolicyService from '../services/TournamentPolicyService';
import TournamentPhoneBanHandler from './TournamentPhoneBanHandler';

interface MatchResultSubmissionProps {
  tournamentId: string;
  matchSlipId: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  currentPlayerId: string;
  onResultSubmitted?: (result: any) => void;
}

const MatchResultSubmission: React.FC<MatchResultSubmissionProps> = ({
  tournamentId,
  matchSlipId,
  player1Id,
  player1Name,
  player2Id,
  player2Name,
  currentPlayerId,
  onResultSubmitted,
}) => {
  const [matchSlip, setMatchSlip] = useState<any>(null);
  const [gameResults, setGameResults] = useState<Array<{
    gameNumber: number;
    winnerId: string;
    score: string;
    duration: number;
    notes: string;
  }>>([]);
  const [currentGame, setCurrentGame] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<string>('');
  const [paperSlipNumber, setPaperSlipNumber] = useState('');
  const [showPaperForm, setShowPaperForm] = useState(false);

  useEffect(() => {
    const loadMatchSlip = async () => {
      const response = await MatchSlipService.getMatchSlip(matchSlipId);
      if (response.success) {
        setMatchSlip(response.data);
        // Initialize game results if not already set
        if (response.data.games.length === 0) {
          setGameResults([
            { gameNumber: 1, winnerId: '', score: '', duration: 0, notes: '' },
            { gameNumber: 2, winnerId: '', score: '', duration: 0, notes: '' },
            { gameNumber: 3, winnerId: '', score: '', duration: 0, notes: '' },
          ]);
        }
      }
    };

    loadMatchSlip();
  }, [matchSlipId]);

  const isPhoneBanned = TournamentPolicyService.isPhoneBanned(tournamentId);
  const isCurrentPlayer = currentPlayerId === player1Id || currentPlayerId === player2Id;

  const handleGameResultChange = (gameNumber: number, field: string, value: any) => {
    setGameResults(prev => prev.map(game => 
      game.gameNumber === gameNumber 
        ? { ...game, [field]: value }
        : game
    ));
  };

  const handleMethodSelected = (method: string) => {
    setSubmissionMethod(method);
    if (method === 'paper_slip') {
      setShowPaperForm(true);
    }
  };

  const submitDigitalResults = async () => {
    if (!isCurrentPlayer) {
      alert('Only players in this match can submit results');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit each game result
      for (const gameResult of gameResults) {
        if (gameResult.winnerId && gameResult.score) {
          await MatchSlipService.submitGameResult(
            matchSlipId,
            gameResult.gameNumber,
            gameResult.winnerId,
            gameResult.score,
            gameResult.duration,
            currentPlayerId,
            gameResult.notes
          );
        }
      }

      // Submit signature
      const deviceInfo = {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      await MatchSlipService.submitSignature(
        matchSlipId,
        currentPlayerId,
        'digital',
        `DIGITAL_SIGNATURE_${Date.now()}`,
        deviceInfo
      );

      onResultSubmitted?.(gameResults);
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('Failed to submit results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPaperResults = async () => {
    if (!paperSlipNumber.trim()) {
      alert('Please enter a paper slip number');
      return;
    }

    setIsSubmitting(true);
    try {
      await MatchSlipService.submitPaperMatchSlip(
        matchSlipId,
        currentPlayerId,
        paperSlipNumber
      );

      onResultSubmitted?.({
        method: 'paper',
        paperSlipNumber,
        gameResults,
      });
    } catch (error) {
      console.error('Error submitting paper results:', error);
      alert('Failed to submit paper results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWinnerName = (winnerId: string) => {
    return winnerId === player1Id ? player1Name : player2Name;
  };

  if (!matchSlip) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-600">Loading match slip...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Result Submission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-900">{player1Name}</div>
            <div className="text-sm text-blue-600">Player 1</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="font-medium text-red-900">{player2Name}</div>
            <div className="text-sm text-red-600">Player 2</div>
          </div>
        </div>
      </div>

      {/* Phone Ban Handler */}
      {isPhoneBanned && (
        <TournamentPhoneBanHandler
          tournamentId={tournamentId}
          operation="match_reporting"
          onMethodSelected={handleMethodSelected}
        />
      )}

      {/* Digital Result Submission */}
      {(!isPhoneBanned || submissionMethod === 'table_terminal') && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Game Results</h4>
          
          {gameResults.map((game, index) => (
            <div key={game.gameNumber} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Game {game.gameNumber}</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Winner Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Winner
                  </label>
                  <select
                    value={game.winnerId}
                    onChange={(e) => handleGameResultChange(game.gameNumber, 'winnerId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select winner</option>
                    <option value={player1Id}>{player1Name}</option>
                    <option value={player2Id}>{player2Name}</option>
                  </select>
                </div>

                {/* Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score
                  </label>
                  <input
                    type="text"
                    value={game.score}
                    onChange={(e) => handleGameResultChange(game.gameNumber, 'score', e.target.value)}
                    placeholder="e.g., 2-1"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={game.duration}
                    onChange={(e) => handleGameResultChange(game.gameNumber, 'duration', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    value={game.notes}
                    onChange={(e) => handleGameResultChange(game.gameNumber, 'notes', e.target.value)}
                    placeholder="Any special notes"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={submitDigitalResults}
              disabled={isSubmitting || !isCurrentPlayer}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Results'}
            </button>
          </div>
        </div>
      )}

      {/* Paper Result Submission */}
      {showPaperForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Paper Match Slip Submission</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Slip Number
            </label>
            <input
              type="text"
              value={paperSlipNumber}
              onChange={(e) => setPaperSlipNumber(e.target.value)}
              placeholder="Enter the paper slip number"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-800">
                Paper slips will be manually verified by tournament staff. 
                Please ensure all information is accurate.
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={submitPaperResults}
              disabled={isSubmitting || !paperSlipNumber.trim()}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Paper Slip'}
            </button>
          </div>
        </div>
      )}

      {/* Match Status */}
      {matchSlip.status !== 'pending' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Match Status</h4>
          <div className="flex items-center space-x-2">
            {matchSlip.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : matchSlip.status === 'disputed' ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              Status: {matchSlip.status.charAt(0).toUpperCase() + matchSlip.status.slice(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchResultSubmission; 