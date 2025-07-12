import React, { useState, useEffect } from 'react';
import TournamentPolicyService, { 
  TournamentOperation, 
  AlternativeMethod, 
  CheckInMethod, 
  ResultSubmissionMethod, 
  CommunicationMethod 
} from '../services/TournamentPolicyService';

interface TournamentPhoneBanHandlerProps {
  tournamentId: string;
  operation: TournamentOperation;
  onMethodSelected?: (method: string) => void;
  showInstructions?: boolean;
}

const TournamentPhoneBanHandler: React.FC<TournamentPhoneBanHandlerProps> = ({
  tournamentId,
  operation,
  onMethodSelected,
  showInstructions = true,
}) => {
  const [isPhoneBanned, setIsPhoneBanned] = useState(false);
  const [alternativeMethods, setAlternativeMethods] = useState<AlternativeMethod[]>([]);
  const [checkInMethods, setCheckInMethods] = useState<CheckInMethod[]>([]);
  const [resultMethods, setResultMethods] = useState<ResultSubmissionMethod[]>([]);
  const [communicationMethods, setCommunicationMethods] = useState<CommunicationMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  useEffect(() => {
    const checkPhoneBanStatus = () => {
      const banned = TournamentPolicyService.isPhoneBanned(tournamentId);
      setIsPhoneBanned(banned);
      
      if (banned) {
        setAlternativeMethods(TournamentPolicyService.getAlternativeMethods(tournamentId, operation));
        setCheckInMethods(TournamentPolicyService.getCheckInMethods(tournamentId));
        setResultMethods(TournamentPolicyService.getResultSubmissionMethods(tournamentId));
        setCommunicationMethods(TournamentPolicyService.getCommunicationMethods(tournamentId));
      }
    };

    checkPhoneBanStatus();
  }, [tournamentId, operation]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    onMethodSelected?.(method);
  };

  const getOperationTitle = (): string => {
    const titles: Record<TournamentOperation, string> = {
      'match_reporting': 'Match Result Submission',
      'pairing_check': 'Check Pairings',
      'tournament_updates': 'Tournament Updates',
      'team_verification': 'Team Verification',
      'dispute_resolution': 'Dispute Resolution',
    };
    return titles[operation];
  };

  const getOperationDescription = (): string => {
    const descriptions: Record<TournamentOperation, string> = {
      'match_reporting': 'Submit your match results to the tournament system',
      'pairing_check': 'Find your next opponent and table assignment',
      'tournament_updates': 'Get the latest tournament information and announcements',
      'team_verification': 'Verify your team composition with tournament officials',
      'dispute_resolution': 'Resolve any issues or disputes during your match',
    };
    return descriptions[operation];
  };

  if (!isPhoneBanned) {
    return null; // Don't show anything if phones aren't banned
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Phones Banned - Alternative Methods Available
          </h3>
        </div>
      </div>

      <div className="text-sm text-yellow-700 mb-4">
        <p className="font-medium">{getOperationTitle()}</p>
        <p className="mt-1">{getOperationDescription()}</p>
      </div>

      {/* Alternative Methods */}
      {alternativeMethods.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Available Methods:</h4>
          <div className="space-y-2">
            {alternativeMethods.map((method, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.method
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-yellow-200 bg-white hover:bg-yellow-100'
                }`}
                onClick={() => handleMethodSelect(method.method)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {method.description}
                    </h5>
                    {showInstructions && (
                      <p className="text-sm text-gray-600 mt-1">
                        {method.instructions}
                      </p>
                    )}
                    {method.requiresJudge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-2">
                        Requires Judge
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <input
                      type="radio"
                      name="method"
                      value={method.method}
                      checked={selectedMethod === method.method}
                      onChange={() => handleMethodSelect(method.method)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in Methods */}
      {operation === 'match_reporting' && checkInMethods.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Check-in Methods:</h4>
          <div className="space-y-2">
            {checkInMethods.map((method, index) => (
              <div key={index} className="p-2 bg-white border border-yellow-200 rounded">
                <p className="text-sm font-medium text-gray-900">{method.description}</p>
                <p className="text-xs text-gray-600">{method.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result Submission Methods */}
      {operation === 'match_reporting' && resultMethods.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Result Submission:</h4>
          <div className="space-y-2">
            {resultMethods.map((method, index) => (
              <div key={index} className="p-2 bg-white border border-yellow-200 rounded">
                <p className="text-sm font-medium text-gray-900">{method.description}</p>
                <p className="text-xs text-gray-600">{method.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Methods */}
      {operation === 'tournament_updates' && communicationMethods.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Communication Methods:</h4>
          <div className="space-y-2">
            {communicationMethods.map((method, index) => (
              <div key={index} className="p-2 bg-white border border-yellow-200 rounded">
                <p className="text-sm font-medium text-gray-900">{method.description}</p>
                <p className="text-xs text-gray-600">{method.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Instructions */}
      <div className="bg-white border border-yellow-200 rounded p-3">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Notes:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Phones are not allowed during tournament play</li>
          <li>• Use the provided alternatives to complete tournament operations</li>
          <li>• Ask a judge if you need assistance with any method</li>
          <li>• All results will be manually verified by tournament staff</li>
        </ul>
      </div>

      {/* Action Button */}
      {selectedMethod && (
        <div className="mt-4">
          <button
            onClick={() => onMethodSelected?.(selectedMethod)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Proceed with Selected Method
          </button>
        </div>
      )}
    </div>
  );
};

export default TournamentPhoneBanHandler; 