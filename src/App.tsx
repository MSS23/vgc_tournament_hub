import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
// Lazy load all route components
const Login = lazy(() => import('./components/Login'));
const SignUp = lazy(() => import('./components/SignUp'));
const DateOfBirthCollection = lazy(() => import('./components/DateOfBirthCollection'));
const CompetitorView = lazy(() => import('./components/CompetitorView'));
const AdminProfessorView = lazy(() => import('./components/AdminProfessorView'));
const HomePage = lazy(() => import('./components/HomePage'));
const FollowingFeed = lazy(() => import('./components/FollowingFeed'));
const Profile = lazy(() => import('./components/Profile'));
const AppLayout = lazy(() => import('./components/AppLayout'));
const TicketsPage = lazy(() => import('./components/TicketsPage'));
const MyProfile = lazy(() => import('./components/MyProfile'));
const QRCodeTestPage = lazy(() => import('./components/QRCodeTestPage'));
import { UserSession } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProfileRouteWrapper() {
  const { playerId } = useParams();
  
  return (
    <Profile 
      playerId={playerId} 
      isOwnProfile={false}
      onTabChange={() => {
        // Handle tab changes if needed
      }}
    />
  );
}

function DOBRouteWrapper({ onComplete }: { onComplete: (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => void }) {
  const navigate = useNavigate();
  const handleComplete = (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => {
    onComplete(division, dateOfBirth);
    navigate('/competitor');
  };
  return <DateOfBirthCollection onComplete={handleComplete} />;
}

function HomePageWrapper() {
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/login');
  };
  return <HomePage onEnter={handleEnter} />;
}

function LoginWrapper({ onLogin }: { onLogin: (userInfo: { email: string; password: string }) => void }) {
  const navigate = useNavigate();
  const handleLogin = (userInfo: { email: string; password: string }) => {
    onLogin(userInfo);
    navigate('/dob');
  };
  const handleSwitchToSignUp = () => {
    navigate('/signup');
  };
  return <Login onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />;
}

function SignUpWrapper({ onSignUp }: { onSignUp: (userInfo: { name: string; email: string; dateOfBirth: string; division: 'junior' | 'senior' | 'master'; password: string; requiresGuardian: boolean; }) => void }) {
  const navigate = useNavigate();
  const handleSignUp = (userInfo: { name: string; email: string; dateOfBirth: string; division: 'junior' | 'senior' | 'master'; password: string; requiresGuardian: boolean; }) => {
    onSignUp(userInfo);
    navigate('/competitor');
  };
  const handleSwitchToLogin = () => {
    navigate('/login');
  };
  return <SignUp onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />;
}

function AppContent() {
  const { state: { user: userSession, isLoading }, login } = useAuth();
  const [tempUserInfo, setTempUserInfo] = React.useState<{ email: string; password: string } | null>(null);

  const handleLogin = (userInfo: { email: string; password: string }) => {
    setTempUserInfo(userInfo);
  };

  const handleDateOfBirthComplete = (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => {
    if (!tempUserInfo) return;
    
    const session: UserSession = {
      userId: `user-${Date.now()}`, // Generate unique user ID
      division: division,
      isGuardian: false,
      isAdmin: false,
      isProfessor: false,
      isPokemonCompanyOfficial: false,
      permissions: division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: dateOfBirth,
      email: tempUserInfo.email,
    };
    login(session);
    setTempUserInfo(null);
  };

  const handleSignUp = (userInfo: { name: string; email: string; dateOfBirth: string; division: 'junior' | 'senior' | 'master'; password: string; requiresGuardian: boolean; }) => {
    const session: UserSession = {
      userId: `user-${Date.now()}`,
      division: userInfo.division,
      isGuardian: false,
      isAdmin: false,
      isProfessor: false,
      isPokemonCompanyOfficial: false,
      permissions: userInfo.division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: userInfo.dateOfBirth,
      name: userInfo.name,
      email: userInfo.email,
    };
    login(session);
  };

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  const handleGoHome = () => {
    // This function can be removed as navigation should use React Router
  };

  // Show loading spinner while session is being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50 pt-[64px] pb-[56px] sm:pt-[64px] sm:pb-[56px]"> {/* Add padding to offset header and bottom nav */}
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/login" element={<LoginWrapper onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpWrapper onSignUp={handleSignUp} />} />
            <Route path="/dob" element={<DOBRouteWrapper onComplete={handleDateOfBirthComplete} />} />
            <Route path="/competitor" element={
              userSession ? (
                <CompetitorView userSession={userSession} onLogout={handleLogout} onGoHome={handleGoHome} />
              ) : <Navigate to="/login" />
            } />
            <Route path="/admin" element={
              userSession ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <AdminProfessorView userSession={userSession} isAdmin={true} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="/following" element={
              userSession ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <FollowingFeed />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="/profile/:playerId" element={
              userSession ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <ProfileRouteWrapper />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="/profile/me" element={
              userSession ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <MyProfile userSession={userSession} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="/tickets" element={
              userSession ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <TicketsPage userSession={userSession} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="/qr-test" element={
              userSession && (userSession.isAdmin || userSession.isStaff) ? (
                <AppLayout userSession={userSession} onLogout={handleLogout} showBottomNav={false}>
                  <QRCodeTestPage userSession={userSession} />
                </AppLayout>
              ) : <Navigate to="/login" />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;