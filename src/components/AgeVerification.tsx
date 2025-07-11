import React, { useState } from 'react';
import { Shield, Users, Calendar, AlertTriangle } from 'lucide-react';

interface AgeVerificationProps {
  onComplete: (userInfo: {
    division: 'junior' | 'senior' | 'master';
    age: number;
    requiresGuardian: boolean;
  }) => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'age' | 'division' | 'guardian'>('age');
  const [age, setAge] = useState<number | null>(null);
  const [division, setDivision] = useState<'junior' | 'senior' | 'master' | null>(null);

  const handleAgeSubmit = (selectedAge: number) => {
    setAge(selectedAge);
    if (selectedAge < 13) {
      setDivision('junior');
      setStep('guardian');
    } else if (selectedAge < 18) {
      setStep('division');
    } else {
      setDivision('master');
      onComplete({
        division: 'master',
        age: selectedAge,
        requiresGuardian: false,
      });
    }
  };

  const handleDivisionSubmit = () => {
    if (division && age) {
      onComplete({
        division,
        age,
        requiresGuardian: division === 'junior' || (division === 'senior' && age < 18),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VGC Hub</h1>
          <p className="text-gray-600">We need to verify your age to provide the best experience</p>
        </div>

        {step === 'age' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your age?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 8).map((ageOption) => (
                  <button
                    key={ageOption}
                    onClick={() => handleAgeSubmit(ageOption)}
                    className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                  >
                    {ageOption}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => handleAgeSubmit(21)}
                  className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  20+
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'division' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Which division do you compete in?
              </label>
              <div className="space-y-3">
                <button
                  onClick={() => setDivision('junior')}
                  className={`w-full p-4 border rounded-lg transition-colors text-left ${
                    division === 'junior'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Junior Division</p>
                      <p className="text-sm text-gray-600">Born in 2010 or later</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setDivision('senior')}
                  className={`w-full p-4 border rounded-lg transition-colors text-left ${
                    division === 'senior'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Senior Division</p>
                      <p className="text-sm text-gray-600">Born 2007-2009</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setDivision('master')}
                  className={`w-full p-4 border rounded-lg transition-colors text-left ${
                    division === 'master'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Master Division</p>
                      <p className="text-sm text-gray-600">Born in 2006 or earlier</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <button
              onClick={handleDivisionSubmit}
              disabled={!division}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'guardian' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Guardian Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    For your safety, a parent or guardian needs to set up your account and manage your privacy settings.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Please ask your parent or guardian to complete the registration process.
              </p>
              <button
                onClick={() => onComplete({
                  division: 'junior',
                  age: age!,
                  requiresGuardian: true,
                })}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                I'll Ask My Guardian
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            We take privacy seriously. Your information is protected according to COPPA and GDPR guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;