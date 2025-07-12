import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DateOfBirthCollection from './components/DateOfBirthCollection';
import CompetitorView from './components/CompetitorView';
import AdminProfessorView from './components/AdminProfessorView';
import HomePage from './components/HomePage';
import { UserSession } from './types';
import { CheckCircle } from 'lucide-react';

type AuthMode = 'login' | 'signup';

function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showHome, setShowHome] = useState(true);
  const [needsDateOfBirth, setNeedsDateOfBirth] = useState(false);
  const [tempUserInfo, setTempUserInfo] = useState<{ email: string; password: string } | null>(null);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  const handleLogin = (userInfo: {
    email: string;
    password: string;
  }) => {
    // Store user info temporarily and show date of birth collection
    setTempUserInfo(userInfo);
    setNeedsDateOfBirth(true);
  };

  const handleDateOfBirthComplete = (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => {
    // Create user session with the determined division
    const session: UserSession = {
      userId: 'user-123',
      division: division,
      isGuardian: false,
      permissions: division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: dateOfBirth,
    };
    setUserSession(session);
    setNeedsDateOfBirth(false);
    setTempUserInfo(null);
  };

  const handleSignUp = (userInfo: {
    name: string;
    email: string;
    dateOfBirth: string;
    division: 'junior' | 'senior' | 'master';
    password: string;
    requiresGuardian: boolean;
  }) => {
    // In a real app, this would create a user account in the backend
    const session: UserSession = {
      userId: 'user-123',
      division: userInfo.division,
      isGuardian: false,
      permissions: userInfo.division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: userInfo.dateOfBirth,
    };
    setUserSession(session);
  };

  // Mock Pokémon Company approval status (in real app, this would come from user profile)
  const isPokemonCompanyApproved = userSession?.userId === '1' || userSession?.userId === '2' || userSession?.userId === '3';
  const approvalLevel = userSession?.userId === '1' ? 'official_analyst' : 
                       userSession?.userId === '2' ? 'content_creator' : 
                       userSession?.userId === '3' ? 'brand_ambassador' : undefined;

  // Mock professor status (in real app, this would come from user profile)
  const isProfessor = userSession?.userId === '1' || userSession?.userId === '2' || userSession?.userId === '4';
  const professorLevel = userSession?.userId === '1' ? 'full' : 
                        userSession?.userId === '2' ? 'associate' : 
                        userSession?.userId === '4' ? 'assistant' : undefined;
  const certificationNumber = userSession?.userId === '1' ? 'PROF-2023-001' : 
                             userSession?.userId === '2' ? 'PROF-2023-045' : 
                             userSession?.userId === '4' ? 'PROF-2024-012' : undefined;

  // Mock admin and Pokémon Company official status
  const isAdmin = userSession?.userId === '1';
  const isPokemonCompanyOfficial = userSession?.userId === '1';

  const handleSwitchToSignUp = () => {
    setAuthMode('signup');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleLogout = () => {
    setShowLogoutNotification(true);
    // Clear user session after showing notification
    setTimeout(() => {
      setUserSession(null);
      setShowLogoutNotification(false);
      setShowHome(true); // Return to homepage
    }, 2000); // Show notification for 2 seconds
  };

  const handleGoHome = () => {
    // Reset any deep navigation states and return to main dashboard
    setShowHome(false); // Ensure we're not on the landing page
    // The main dashboard will be shown by the existing logic
  };

  const renderMainContent = () => {
    if (!userSession) return null;

    // Determine user type and render appropriate view
    if (isAdmin || isProfessor || isPokemonCompanyOfficial) {
      return (
        <AdminProfessorView
          userSession={userSession}
          onLogout={handleLogout}
          onGoHome={handleGoHome}
          isAdmin={isAdmin}
          isProfessor={isProfessor}
          isPokemonCompanyOfficial={isPokemonCompanyOfficial}
          professorLevel={professorLevel}
          certificationNumber={certificationNumber}
        />
      );
    } else {
      return (
        <CompetitorView
          userSession={userSession}
          onLogout={handleLogout}
          onGoHome={handleGoHome}
        />
      );
    }
  };

  // Show logout notification overlay
  if (showLogoutNotification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Logged Out</h3>
          <p className="text-gray-600">You have been logged out successfully.</p>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show homepage if not bypassed
  if (showHome) {
    return (
      <HomePage onEnter={() => setShowHome(false)} />
    );
  }

  // Show date of birth collection if needed after login
  if (needsDateOfBirth) {
    return (
      <DateOfBirthCollection onComplete={handleDateOfBirthComplete} />
    );
  }

  // Show authentication if no user session
  if (!userSession) {
    return authMode === 'login' ? (
      <Login onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />
    ) : (
      <SignUp onComplete={handleSignUp} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderMainContent()}
    </div>
  );
}

export default App;