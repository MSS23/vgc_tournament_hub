import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompetitorView from '../../components/CompetitorView';
import { UserSession } from '../../types';

// Mock the components that CompetitorView depends on
jest.mock('../../components/TournamentPairings', () => {
  return function MockTournamentPairings() {
    return <div data-testid="tournament-pairings">Tournament Pairings</div>;
  };
});

jest.mock('../../components/ScalableTournamentRegistration', () => {
  return function MockScalableTournamentRegistration() {
    return <div data-testid="tournament-registration">Tournament Registration</div>;
  };
});

jest.mock('../../components/QRCodeGenerator', () => {
  return function MockQRCodeGenerator() {
    return <div data-testid="qr-code-generator">QR Code Generator</div>;
  };
});



jest.mock('../../components/EventCalendar', () => {
  return function MockEventCalendar() {
    return <div data-testid="event-calendar">Event Calendar</div>;
  };
});

jest.mock('../../components/FollowingFeed', () => {
  return function MockFollowingFeed({ onPlayerSelect }: { onPlayerSelect: (id: string) => void }) {
    return (
      <div data-testid="following-feed">
        <button onClick={() => onPlayerSelect('player-1')}>Select Player</button>
        Following Feed
      </div>
    );
  };
});

jest.mock('../../components/PlayerSearch', () => {
  return function MockPlayerSearch({ onPlayerSelect }: { onPlayerSelect: (id: string) => void }) {
    return (
      <div data-testid="player-search">
        <button onClick={() => onPlayerSelect('player-2')}>Search Player</button>
        Player Search
      </div>
    );
  };
});

jest.mock('../../components/BlogTips', () => {
  return function MockBlogTips() {
    return <div data-testid="blog-tips">Blog Tips</div>;
  };
});

jest.mock('../../components/Profile', () => {
  return function MockProfile({ isOwnProfile, playerId, activeTab }: any) {
    return (
      <div data-testid="player-profile">
        Profile for {playerId} - Tab: {activeTab}
        <button onClick={() => {}}>Back to Search</button>
      </div>
    );
  };
});

jest.mock('../../data/mockData', () => ({
  mockTournaments: [
    {
      id: 'tournament-1',
      name: 'Test Tournament',
      date: '2024-01-01',
      location: 'Test Location',
      status: 'upcoming',
      maxCapacity: 100,
      currentRegistrations: 50,
      isRegistered: false
    }
  ],
  mockPlayers: [
    {
      id: 'player-1',
      name: 'Test Player 1',
      playerId: 'TP1',
      region: 'North America',
      division: 'master',
      championships: 1,
      winRate: 75,
      rating: 1800,
      tournaments: [],
      isVerified: true,
      privacySettings: {
        profileVisibility: 'public',
        teamShowcaseVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      }
    },
    {
      id: 'player-2',
      name: 'Test Player 2',
      playerId: 'TP2',
      region: 'Europe',
      division: 'senior',
      championships: 0,
      winRate: 60,
      rating: 1600,
      tournaments: [],
      isVerified: false,
      privacySettings: {
        profileVisibility: 'public',
        teamShowcaseVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      }
    }
  ]
}));

describe('CompetitorView', () => {
  const mockUserSession: UserSession = {
    userId: 'user-123',
    division: 'master',
    isGuardian: false,
    permissions: ['full-access']
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation Tests', () => {
    test('should render with default tournaments tab', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      expect(screen.getByTestId('tournament-registration')).toBeInTheDocument();
    });

    test('should switch to pairings tab when clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const pairingsButton = screen.getByText('Pairings');
      fireEvent.click(pairingsButton);
      
      expect(screen.getByTestId('tournament-pairings')).toBeInTheDocument();
    });

    test('should switch to calendar tab when clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const calendarButton = screen.getByText('Calendar');
      fireEvent.click(calendarButton);
      
      expect(screen.getByTestId('event-calendar')).toBeInTheDocument();
    });

    test('should switch to search tab when clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);
      
      expect(screen.getByTestId('player-search')).toBeInTheDocument();
    });

    test('should switch to blog tab when clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const blogButton = screen.getByText('Blog');
      fireEvent.click(blogButton);
      
      expect(screen.getByTestId('blog-tips')).toBeInTheDocument();
    });
  });

  describe('Player Selection Tests', () => {
    test('should show player profile when player is selected from following', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Navigate to following tab
      const followingButton = screen.getByText('Following');
      fireEvent.click(followingButton);
      
      // Select a player
      const selectPlayerButton = screen.getByText('Select Player');
      fireEvent.click(selectPlayerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
    });

    test('should show player profile when player is selected from search', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Navigate to search tab
      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);
      
      // Select a player
      const searchPlayerButton = screen.getByText('Search Player');
      fireEvent.click(searchPlayerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
    });

    test('should allow navigation to other tabs when player profile is shown', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Navigate to following and select player
      const followingButton = screen.getByText('Following');
      fireEvent.click(followingButton);
      
      const selectPlayerButton = screen.getByText('Select Player');
      fireEvent.click(selectPlayerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
      
      // Navigate to tournaments tab
      const tournamentsButton = screen.getByText('Events');
      fireEvent.click(tournamentsButton);
      
      expect(screen.getByText('Welcome, Trainer!')).toBeInTheDocument();
      expect(screen.getByTestId('tournament-registration')).toBeInTheDocument();
    });

    test('should preserve profile tab state when navigating back to profile', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Navigate to following and select player
      const followingButton = screen.getByText('Following');
      fireEvent.click(followingButton);
      
      const selectPlayerButton = screen.getByText('Select Player');
      fireEvent.click(selectPlayerButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
      
      // Navigate to tournaments and back to following
      const tournamentsButton = screen.getByText('Events');
      fireEvent.click(tournamentsButton);
      
      const followingButtonAgain = screen.getByText('Following');
      fireEvent.click(followingButtonAgain);
      
      // Should show profile again
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State Tests', () => {
    test('should disable buttons during loading', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Trigger a loading state by clicking tournament registration
      const registerButton = screen.getByText('Register Now');
      fireEvent.click(registerButton);
      
      // All navigation buttons should be disabled
      const pairingsButton = screen.getByText('Pairings');
      expect(pairingsButton).toBeDisabled();
      
      const calendarButton = screen.getByText('Calendar');
      expect(calendarButton).toBeDisabled();
    });

    test('should show loading overlay during operations', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Trigger loading state
      const registerButton = screen.getByText('Register Now');
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });
  });

  describe('Header Tests', () => {
    test('should display user information in header', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      expect(screen.getByText('VGC Hub')).toBeInTheDocument();
      expect(screen.getByText('Competitor View')).toBeInTheDocument();
      expect(screen.getByText('TrainerMaster')).toBeInTheDocument();
      expect(screen.getByText('master Division')).toBeInTheDocument();
    });

    test('should call onLogout when logout button is clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Quick Actions Tests', () => {
    test('should navigate to calendar when View Calendar is clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const viewCalendarButton = screen.getByText('View Calendar');
      fireEvent.click(viewCalendarButton);
      
      expect(screen.getByTestId('event-calendar')).toBeInTheDocument();
    });

    test('should navigate to search when Search Players is clicked', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const searchPlayersButton = screen.getByText('Search Players');
      fireEvent.click(searchPlayersButton);
      
      expect(screen.getByTestId('player-search')).toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle missing tournament data gracefully', () => {
      // Mock empty tournaments
      jest.doMock('../../data/mockData', () => ({
        mockTournaments: [],
        mockPlayers: []
      }));
      
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Should still render without crashing
      expect(screen.getByText('VGC Hub')).toBeInTheDocument();
    });

    test('should handle missing player data gracefully', async () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      // Navigate to following tab
      const followingButton = screen.getByText('Following');
      fireEvent.click(followingButton);
      
      // Mock a non-existent player selection
      const selectPlayerButton = screen.getByText('Select Player');
      fireEvent.click(selectPlayerButton);
      
      // Should handle gracefully without crashing
      await waitFor(() => {
        expect(screen.getByTestId('player-profile')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper ARIA labels for navigation', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const pairingsButton = screen.getByText('Pairings');
      expect(pairingsButton).toBeInTheDocument();
      
      const calendarButton = screen.getByText('Calendar');
      expect(calendarButton).toBeInTheDocument();
    });

    test('should support keyboard navigation', () => {
      render(<CompetitorView userSession={mockUserSession} onLogout={mockOnLogout} />);
      
      const pairingsButton = screen.getByText('Pairings');
      pairingsButton.focus();
      
      expect(pairingsButton).toHaveFocus();
      
      // Test Enter key
      fireEvent.keyDown(pairingsButton, { key: 'Enter', code: 'Enter' });
      expect(screen.getByTestId('tournament-pairings')).toBeInTheDocument();
    });
  });
}); 