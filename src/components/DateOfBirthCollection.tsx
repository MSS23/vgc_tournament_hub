import React, { useState } from 'react';
import { Calendar, ArrowRight, Shield } from 'lucide-react';
import LanguageDropdown from './LanguageDropdown';

interface DateOfBirthCollectionProps {
  onComplete: (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => void;
}

const DateOfBirthCollection: React.FC<DateOfBirthCollectionProps> = ({ onComplete }) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const determineDivision = (age: number): 'junior' | 'senior' | 'master' => {
    if (age >= 16) return 'master';
    if (age >= 10) return 'senior';
    return 'junior';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    const age = calculateAge(dateOfBirth);
    
    if (age < 0 || age > 120) {
      setError('Please enter a valid date of birth');
      return;
    }

    const division = determineDivision(age);
    onComplete(division, dateOfBirth);
  };

  const getDivisionInfo = (division: 'junior' | 'senior' | 'master') => {
    switch (division) {
      case 'junior':
        return {
          title: 'Junior Division',
          description: 'Ages 10 and under',
          icon: Shield,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'senior':
        return {
          title: 'Senior Division',
          description: 'Ages 10-15',
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'master':
        return {
          title: 'Master Division',
          description: 'Ages 16 and older',
          icon: Shield,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
    }
  };

  const previewDivision = dateOfBirth ? determineDivision(calculateAge(dateOfBirth)) : null;
  const divisionInfo = previewDivision ? getDivisionInfo(previewDivision) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageDropdown />
      </div>

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VGC Hub!</h1>
          <p className="text-gray-600">Please provide your date of birth to determine your division</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => {
                setDateOfBirth(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              max={new Date().toISOString().split('T')[0]}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Division Preview */}
          {divisionInfo && (
            <div className={`p-4 rounded-lg border ${divisionInfo.borderColor} ${divisionInfo.bgColor}`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${divisionInfo.bgColor}`}>
                  <divisionInfo.icon className={`h-5 w-5 ${divisionInfo.color}`} />
                </div>
                <div>
                  <p className={`font-semibold ${divisionInfo.color}`}>{divisionInfo.title}</p>
                  <p className="text-sm text-gray-600">{divisionInfo.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Division Rules */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Division Rules</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span><strong>Junior:</strong> Ages 10 and under</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span><strong>Senior:</strong> Ages 10-15</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span><strong>Master:</strong> Ages 16 and older</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!dateOfBirth}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Continue
          </button>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your date of birth is used only to determine your division and ensure fair competition. 
            We protect your privacy according to our data protection policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateOfBirthCollection; 