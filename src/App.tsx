import React, { Suspense, lazy } from 'react';
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

function ProfileRouteWrapper() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Profile 
      playerId={playerId} 
      isOwnProfile={false}
      onTabChange={(tab) => {
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

function App() {
  const [userSession, setUserSession] = React.useState<UserSession | null>(null);
  const [tempUserInfo, setTempUserInfo] = React.useState<{ email: string; password: string } | null>(null);

  const handleLogin = (userInfo: { email: string; password: string }) => {
    setTempUserInfo(userInfo);
  };

  const handleDateOfBirthComplete = (division: 'junior' | 'senior' | 'master', dateOfBirth: string) => {
    const isManrajSidhu = tempUserInfo?.email === 'manraj.sidhu@gmail.com';
    const session: UserSession = {
      userId: isManrajSidhu ? 'manraj-sidhu' : 'user-123',
      division: division,
      isGuardian: false,
      permissions: division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: dateOfBirth,
      name: isManrajSidhu ? 'Manraj Sidhu' : undefined,
    };
    setUserSession(session);
    setTempUserInfo(null);
  };

  const handleSignUp = (userInfo: { name: string; email: string; dateOfBirth: string; division: 'junior' | 'senior' | 'master'; password: string; requiresGuardian: boolean; }) => {
    const session: UserSession = {
      userId: 'user-123',
      division: userInfo.division,
      isGuardian: false,
      permissions: userInfo.division === 'master' ? ['full-access'] : ['restricted-access'],
      dateOfBirth: userInfo.dateOfBirth,
    };
    setUserSession(session);
  };

  const handleLogout = () => {
    setUserSession(null);
    window.location.href = '/login';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 pt-[64px] pb-[56px] sm:pt-[64px] sm:pb-[56px]"> {/* Add padding to offset header and bottom nav */}
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<HomePage onEnter={() => { window.location.href = '/login'; }} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToSignUp={() => { window.location.href = '/signup'; }} />} />
            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} onSwitchToLogin={() => { window.location.href = '/login'; }} />} />
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
  );
}

export default App;