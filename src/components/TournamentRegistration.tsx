import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Ticket, AlertCircle, CheckCircle, User, CreditCard, FileText, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Tournament } from '../types';
import { mockUserSession } from '../data/mockData';

interface TournamentRegistrationProps {
  tournament: Tournament;
  userDivision: 'junior' | 'senior' | 'master';
  onRegister: (tournamentId: string) => void;
}

type RegistrationStep = 'initial' | 'queue' | 'player-details' | 'team-select' | 'terms' | 'payment' | 'complete';

interface PlayerDetails {
  playerId: string;
  playerName: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const TournamentRegistration: React.FC<TournamentRegistrationProps> = ({
  tournament,
  userDivision,
  onRegister
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('initial');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLotteryInfo, setShowLotteryInfo] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [queueWaitTime, setQueueWaitTime] = useState<number>(0);
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails>({ playerId: '', playerName: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [customTeam, setCustomTeam] = useState<any[]>([]);
  const [teamError, setTeamError] = useState<string | null>(null);

  // Simulate queue processing
  useEffect(() => {
    if (currentStep === 'queue' && queuePosition !== null) {
      const interval = setInterval(() => {
        setQueueWaitTime(prev => prev + 1);
        // Randomly advance queue position
        if (Math.random() < 0.1) { // 10% chance per second
          setQueuePosition(prev => prev ? Math.max(0, prev - 1) : 0);
        }
        // When queue position reaches 0, advance to next step
        if (queuePosition === 0) {
          clearInterval(interval);
          setCurrentStep('player-details');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, queuePosition]);

  const getRegistrationStatus = () => {
    const now = new Date();
    const regStart = tournament.registrationStart ? new Date(tournament.registrationStart) : null;
    const regEnd = tournament.registrationEnd ? new Date(tournament.registrationEnd) : null;

    if (tournament.isRegistered) return 'registered';
    if (tournament.status === 'ongoing') return 'in-progress';
    if (!regStart || !regEnd) return 'not-available';
    if (now < regStart) return 'not-open';
    if (now > regEnd) return 'closed';
    return 'open';
  };

  const registrationStatus = getRegistrationStatus();

  const handleJoinQueue = () => {
    setIsRegistering(true);
    // Simulate joining queue
    setTimeout(() => {
      setQueuePosition(Math.floor(Math.random() * 100) + 50); // Random position 50-150
      setQueueWaitTime(0);
      setCurrentStep('queue');
      setIsRegistering(false);
    }, 1500);
  };

  const handlePlayerDetailsSubmit = () => {
    if (playerDetails.playerId.trim() && playerDetails.playerName.trim()) {
      setCurrentStep('team-select');
    }
  };

  const handleTeamSelect = () => {
    if (selectedTeamId) {
      setCurrentStep('terms');
      setTeamError(null);
    } else if (customTeam.length === 6) {
      setCurrentStep('terms');
      setTeamError(null);
    } else {
      setTeamError('Please select a team or pick 6 Pokémon.');
    }
  };

  const handleTermsAccept = () => {
    if (acceptedTerms) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSubmit = async () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep('complete');
      onRegister(tournament.id);
    }, 3000);
  };

  const getStatusColor = () => {
    switch (registrationStatus) {
      case 'registered': return 'from-green-600 to-emerald-600';
      case 'in-progress': return 'from-red-600 to-pink-600';
      case 'open': return 'from-blue-600 to-indigo-600';
      case 'not-open': return 'from-yellow-600 to-orange-600';
      case 'closed': return 'from-gray-600 to-gray-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusText = () => {
    switch (registrationStatus) {
      case 'registered': return 'You are registered!';
      case 'in-progress': return 'Tournament in Progress';
      case 'open': return 'Registration Open';
      case 'not-open': return 'Registration Opens Soon';
      case 'closed': return 'Registration Closed';
      default: return 'Registration Unavailable';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQueueStatus = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-yellow-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Please wait for allocation of ticket</h3>
        <p className="text-sm text-yellow-700 mb-4">
          You are in the registration queue. Please wait while we process your request.
        </p>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Queue Position:</span>
            <span className="font-bold text-lg text-yellow-800">#{queuePosition}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Wait Time:</span>
            <span className="font-medium text-yellow-800">{formatTime(queueWaitTime)}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(0, 100 - (queuePosition || 0))}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderPlayerDetailsForm = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Player Information</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player ID *</label>
          <input
            type="text"
            value={playerDetails.playerId}
            onChange={(e) => setPlayerDetails(prev => ({ ...prev, playerId: e.target.value }))}
            placeholder="Enter your official Player ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Player Name *</label>
          <input
            type="text"
            value={playerDetails.playerName}
            onChange={(e) => setPlayerDetails(prev => ({ ...prev, playerName: e.target.value }))}
            placeholder="Enter your full name as it appears on your ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setCurrentStep('queue')}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handlePlayerDetailsSubmit}
          disabled={!playerDetails.playerId.trim() || !playerDetails.playerName.trim()}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderTeamSelect = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Your Team</h3>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Saved Teams</h4>
        {mockUserSession.privateTeams.length === 0 ? (
          <div className="text-gray-500">No teams saved. Import a team from your profile first.</div>
        ) : (
          <div className="space-y-2">
            {mockUserSession.privateTeams.map(team => (
              <div key={team.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedTeamId === team.id ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}
                onClick={() => { setSelectedTeamId(team.id); setCustomTeam([]); }}
              >
                <div>
                  <div className="font-medium text-gray-900">{team.name}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {team.pokemon.map((p: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">{p.name}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Saved: {team.dateSaved}</div>
                </div>
                {selectedTeamId === team.id && <span className="ml-4 px-2 py-1 bg-blue-600 text-white rounded text-xs">Selected</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Or Pick 6 Pokémon</h4>
        <div className="flex flex-wrap gap-2">
          {['Charizard','Gholdengo','Urshifu','Rillaboom','Amoonguss','Indeedee','Miraidon','Flutter Mane','Annihilape','Torkoal','Dondozo','Tatsugiri'].map(pokemon => (
            <button
              key={pokemon}
              className={`px-2 py-1 rounded-full border text-xs font-medium ${customTeam.some(p => p.name === pokemon) ? 'bg-green-600 text-white border-green-700' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
              onClick={() => {
                if (customTeam.some(p => p.name === pokemon)) {
                  setCustomTeam(customTeam.filter(p => p.name !== pokemon));
                } else if (customTeam.length < 6) {
                  setCustomTeam([...customTeam, { name: pokemon }]);
                  setSelectedTeamId(null);
                }
              }}
              disabled={customTeam.length >= 6 && !customTeam.some(p => p.name === pokemon)}
            >
              {pokemon}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">{customTeam.length} / 6 selected</div>
      </div>
      {teamError && <div className="text-red-600 text-sm mb-2">{teamError}</div>}
      <div className="flex justify-end gap-2 mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setCurrentStep('player-details')}>Back</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleTeamSelect}>Continue</button>
      </div>
    </div>
  );

  const renderTermsConfirmation = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Terms and Conditions</h3>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
        <div className="space-y-3 text-sm text-gray-700">
          <h4 className="font-medium text-gray-900">Tournament Registration Terms</h4>
          <p>By registering for this tournament, you agree to the following terms:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>You will arrive at least 30 minutes before the tournament start time</li>
            <li>You will bring your own device and team</li>
            <li>You will follow all tournament rules and regulations</li>
            <li>You understand that late arrivals may result in disqualification</li>
            <li>You consent to the use of your name and likeness for tournament coverage</li>
            <li>You agree to conduct yourself in a sportsmanlike manner</li>
            <li>You understand that tournament fees are non-refundable</li>
            <li>You will comply with all venue and safety requirements</li>
          </ul>
          <p className="mt-3">
            <strong>Registration Fee:</strong> ${tournament.registrationFee || 25}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 mb-6">
        <input
          type="checkbox"
          id="accept-terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="accept-terms" className="text-sm text-gray-700">
          I have read and agree to the terms and conditions above
        </label>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep('player-details')}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleTermsAccept}
          disabled={!acceptedTerms}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
          <input
            type="text"
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
            placeholder="1234 5678 9012 3456"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
            <input
              type="text"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
            <input
              type="text"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
          <input
            type="text"
            value={paymentDetails.cardholderName}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
            placeholder="Name on card"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Registration Fee:</span>
          <span className="font-semibold text-gray-900">${tournament.registrationFee || 25}</span>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setCurrentStep('terms')}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handlePaymentSubmit}
          disabled={isProcessingPayment || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              <span>Pay ${tournament.registrationFee || 25}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Complete!</h3>
      <p className="text-green-700 mb-4">
        You have successfully registered for {tournament.name}. A confirmation email has been sent to your registered email address.
      </p>
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Player ID:</span>
            <span className="font-medium">{playerDetails.playerId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Player Name:</span>
            <span className="font-medium">{playerDetails.playerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tournament:</span>
            <span className="font-medium">{tournament.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{new Date(tournament.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Tournament Header */}
      <div className={`bg-gradient-to-r ${getStatusColor()} rounded-xl p-6 text-white`}>
        <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(tournament.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{tournament.totalPlayers} players expected</span>
          </div>
        </div>
      </div>

      {/* Registration Status */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Registration Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            registrationStatus === 'registered' ? 'bg-green-100 text-green-800' :
            registrationStatus === 'in-progress' ? 'bg-red-100 text-red-800' :
            registrationStatus === 'open' ? 'bg-blue-100 text-blue-800' :
            registrationStatus === 'not-open' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {getStatusText()}
          </div>
        </div>

        {/* Registration Timeline */}
        {tournament.registrationStart && tournament.registrationEnd && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Registration Opens:</span>
              <span className="font-medium">
                {new Date(tournament.registrationStart).toLocaleDateString()} at{' '}
                {new Date(tournament.registrationStart).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Registration Closes:</span>
              <span className="font-medium">
                {new Date(tournament.registrationEnd).toLocaleDateString()} at{' '}
                {new Date(tournament.registrationEnd).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lottery System Info */}
      {tournament.requiresLottery && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Ticket className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">Lottery-Based Registration</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This tournament uses a lottery system due to high demand. Registration guarantees entry into the lottery, not the tournament.
              </p>
              <button
                onClick={() => setShowLotteryInfo(!showLotteryInfo)}
                className="text-sm text-yellow-800 underline mt-2"
              >
                Learn more about the lottery system
              </button>
            </div>
          </div>

          {showLotteryInfo && (
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <div className="space-y-2 text-sm text-yellow-700">
                <p>• Registration enters you into a random lottery</p>
                <p>• Winners are selected randomly after registration closes</p>
                <p>• You'll be notified if you're selected within 24 hours</p>
                <p>• Waitlist spots may become available closer to the event</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Division Notice for Minors */}
      {(userDivision === 'junior' || userDivision === 'senior') && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Guardian Consent Required</h4>
              <p className="text-sm text-blue-700 mt-1">
                As a {userDivision} division player, your parent or guardian must approve your tournament registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Flow */}
      {currentStep === 'initial' && (
        <div className="space-y-4">
          {registrationStatus === 'registered' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Successfully Registered!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    You're all set for this tournament. Check back for pairings and updates.
                  </p>
                </div>
              </div>
            </div>
          ) : registrationStatus === 'in-progress' ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Clock className="h-5 w-5" />
              <span>Tournament in Progress</span>
            </button>
          ) : registrationStatus === 'open' ? (
            <button
              onClick={handleJoinQueue}
              disabled={isRegistering}
              className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isRegistering ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining Queue...</span>
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5" />
                  <span>Register Now</span>
                </>
              )}
            </button>
          ) : registrationStatus === 'not-open' ? (
            <div className="text-center py-4">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Registration will open soon. Check back later!</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Registration is no longer available for this tournament.</p>
            </div>
          )}
        </div>
      )}

      {/* Queue Status */}
      {currentStep === 'queue' && renderQueueStatus()}

      {/* Player Details Form */}
      {currentStep === 'player-details' && renderPlayerDetailsForm()}

      {/* Team Selection */}
      {currentStep === 'team-select' && renderTeamSelect()}

      {/* Terms Confirmation */}
      {currentStep === 'terms' && renderTermsConfirmation()}

      {/* Payment Form */}
      {currentStep === 'payment' && renderPaymentForm()}

      {/* Complete */}
      {currentStep === 'complete' && renderComplete()}

      {/* Tournament Rules & Info */}
      {currentStep === 'initial' && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Tournament Information</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Format: VGC 2024 Regulation H</p>
            <p>• Swiss rounds followed by top cut</p>
            <p>• Bring your own device and team</p>
            <p>• Check-in opens 30 minutes before start time</p>
            <p>• Late arrivals may be disqualified</p>
            <p>• Registration fee: ${tournament.registrationFee || 25}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentRegistration;