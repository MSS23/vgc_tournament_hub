import React, { useState } from 'react';
import { UserSession } from '../types';
import { mockUserSession } from '../data/mockData';

interface MyProfileProps {
  userSession: UserSession;
}

// Utility function to validate numeric Player ID
const validatePlayerId = (playerId: string): { isValid: boolean; error?: string } => {
  if (!playerId.trim()) {
    return { isValid: false, error: 'Player ID is required' };
  }
  
  // Check if it contains only numbers
  if (!/^\d+$/.test(playerId)) {
    return { isValid: false, error: 'Player ID must contain only numbers' };
  }
  
  // Check length (typically 6-8 digits for Pokémon Player IDs)
  if (playerId.length < 6 || playerId.length > 8) {
    return { isValid: false, error: 'Player ID must be 6-8 digits long' };
  }
  
  return { isValid: true };
};

// Utility function to format Player ID with proper spacing
const formatPlayerId = (playerId: string): string => {
  // Remove all non-numeric characters
  const numericOnly = playerId.replace(/\D/g, '');
  
  // Format as XXXX-XXXX or similar based on length
  if (numericOnly.length === 8) {
    return `${numericOnly.slice(0, 4)}-${numericOnly.slice(4)}`;
  } else if (numericOnly.length === 7) {
    return `${numericOnly.slice(0, 3)}-${numericOnly.slice(3)}`;
  } else if (numericOnly.length === 6) {
    return `${numericOnly.slice(0, 3)}-${numericOnly.slice(3)}`;
  }
  
  return numericOnly;
};

const MyProfile: React.FC<MyProfileProps> = ({ userSession }) => {
  // Use mockUserSession as initial data for demo
  const [profile, setProfile] = useState({
    playerId: mockUserSession.userId || '',
    vgTrainerName: mockUserSession.name || '',
    fullName: '',
    dateOfBirth: userSession.dateOfBirth || '',
  });
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'playerId') {
      // Only allow numeric input for Player ID
      const numericValue = value.replace(/\D/g, '');
      setProfile(prev => ({ ...prev, [name]: numericValue }));
      
      // Clear error when user starts typing
      if (errors.playerId) {
        setErrors(prev => ({ ...prev, playerId: '' }));
      }
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
      // Clear error for other fields
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    
    setSaved(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate Player ID
    const playerIdValidation = validatePlayerId(profile.playerId);
    if (!playerIdValidation.isValid) {
      newErrors.playerId = playerIdValidation.error || 'Invalid Player ID';
    }

    // Validate VG Trainer Name
    if (!profile.vgTrainerName.trim()) {
      newErrors.vgTrainerName = 'VG Trainer Name is required';
    } else if (profile.vgTrainerName.length < 2) {
      newErrors.vgTrainerName = 'VG Trainer Name must be at least 2 characters';
    }

    // Validate Full Name
    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Validate Date of Birth
    if (!profile.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const age = calculateAge(profile.dateOfBirth);
      if (age < 8) {
        newErrors.dateOfBirth = 'You must be at least 8 years old';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setEditMode(false);
    setSaved(true);
    // In a real app, save to backend here
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrors({});
    // Reset to original values if needed
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pokémon Player ID
          </label>
          <input
            type="text"
            name="playerId"
            value={editMode ? profile.playerId : formatPlayerId(profile.playerId)}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter 6-8 digit Player ID"
            maxLength={editMode ? 8 : undefined}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`w-full p-3 border rounded-lg transition-colors ${
              editMode 
                ? errors.playerId 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
            } focus:outline-none focus:ring-2`}
          />
          {errors.playerId && (
            <p className="mt-1 text-sm text-red-600">{errors.playerId}</p>
          )}
          {editMode && (
            <p className="mt-1 text-xs text-gray-500">
              Enter your 6-8 digit Pokémon Player ID (numbers only)
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VG Trainer Name
          </label>
          <input
            type="text"
            name="vgTrainerName"
            value={profile.vgTrainerName}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter your trainer name"
            className={`w-full p-3 border rounded-lg transition-colors ${
              editMode 
                ? errors.vgTrainerName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
            } focus:outline-none focus:ring-2`}
          />
          {errors.vgTrainerName && (
            <p className="mt-1 text-sm text-red-600">{errors.vgTrainerName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            disabled={!editMode}
            placeholder="Enter your full name"
            className={`w-full p-3 border rounded-lg transition-colors ${
              editMode 
                ? errors.fullName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
            } focus:outline-none focus:ring-2`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
            disabled={!editMode}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full p-3 border rounded-lg transition-colors ${
              editMode 
                ? errors.dateOfBirth 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                : 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
            } focus:outline-none focus:ring-2`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
        
        <div className="flex space-x-3 pt-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {saved && (
          <div className="text-green-600 font-medium mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            ✓ Profile saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile; 