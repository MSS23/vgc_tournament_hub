import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TournamentPairings from '../../components/TournamentPairings';
import { Tournament, TournamentPairing } from '../../types';

describe('TournamentPairings Component', () => {
  const mockPairings: TournamentPairing[] = [
    {
      round: 1,
      table: 1,
      player1: { id: 'p1', name: 'Alex Rodriguez', record: '0-0' },
      player2: { id: 'p2', name: 'Sarah Chen', record: '0-0' },
      result: { winner: 'p1', score: '2-0' }
    },
    {
      round: 1,
      table: 2,
      player1: { id: 'p3', name: 'Marcus Johnson', record: '0-0' },
      player2: { id: 'p4', name: 'Emily Davis', record: '0-0' },
      result: { winner: 'p4', score: '2-1' }
    },
    {
      round: 2,
      table: 1,
      player1: { id: 'p1', name: 'Alex Rodriguez', record: '1-0' },
      player2: { id: 'p4', name: 'Emily Davis', record: '1-0' },
      result: { winner: 'p1', score: '2-0' }
    },
    {
      round: 2,
      table: 2,
      player1: { id: 'p2', name: 'Sarah Chen', record: '0-1' },
      player2: { id: 'p3', name: 'Marcus Johnson', record: '0-1' },
      result: { winner: 'p2', score: '2-1' }
    },
    {
      round: 3,
      table: 1,
      player1: { id: 'p1', name: 'Alex Rodriguez', record: '2-0' },
      player2: { id: 'p5', name: 'David Kim', record: '2-0' }
    },
    {
      round: 3,
      table: 2,
      player1: { id: 'p4', name: 'Emily Davis', record: '1-1' },
      player2: { id: 'p2', name: 'Sarah Chen', record: '1-1' }
    }
  ];

  const mockTournament: Tournament = {
    id: 'tournament-1',
    name: 'Phoenix Regional Championships',
    date: '2024-03-15',
    location: 'Phoenix Convention Center, AZ',
    totalPlayers: 600,
    status: 'ongoing',
    maxCapacity: 700,
    currentRegistrations: 650,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 50,
    registrationType: 'first-come-first-served',
    isRegistered: true
  };

  const defaultProps = {
    tournamentId: 'tournament-1',
    tournamentName: 'Phoenix Regional Championships',
    isRegistered: true,
    userDivision: 'master' as const,
    pairings: mockPairings,
    tournament: mockTournament
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render tournament pairings with header', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('Phoenix Regional Championships')).toBeInTheDocument();
      expect(screen.getByText('Tournament Pairings')).toBeInTheDocument();
      expect(screen.getByText('Round 1')).toBeInTheDocument();
    });

    test('should render all rounds', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('Round 1')).toBeInTheDocument();
      expect(screen.getByText('Round 2')).toBeInTheDocument();
      expect(screen.getByText('Round 3')).toBeInTheDocument();
    });

    test('should render pairing information', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
      expect(screen.getByText('Emily Davis')).toBeInTheDocument();
    });

    test('should show table numbers', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('Table 1')).toBeInTheDocument();
      expect(screen.getByText('Table 2')).toBeInTheDocument();
    });
  });

  describe('Match Results', () => {
    test('should display completed match results', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Round 1, Table 1 - completed match
      expect(screen.getByText('2-0')).toBeInTheDocument();
      expect(screen.getByText('Alex Rodriguez')).toHaveClass('font-semibold'); // Winner
    });

    test('should display pending matches', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Round 3 matches are pending
      expect(screen.getByText('vs')).toBeInTheDocument();
    });

    test('should show correct winner styling', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Alex Rodriguez won round 1, table 1
      const alexElement = screen.getByText('Alex Rodriguez');
      expect(alexElement).toHaveClass('font-semibold');
    });
  });

  describe('Filtering', () => {
    test('should show all pairings by default', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
      expect(screen.getByText('Emily Davis')).toBeInTheDocument();
    });

    test('should filter to show only current player matches when currentPlayerId is provided', () => {
      render(<TournamentPairings {...defaultProps} currentPlayerId="p1" />);
      
      // Should only show matches involving player p1 (Alex Rodriguez)
      expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument(); // Opponent in round 1
      expect(screen.getByText('Emily Davis')).toBeInTheDocument(); // Opponent in round 2
      expect(screen.getByText('David Kim')).toBeInTheDocument(); // Opponent in round 3
      
      // Should not show matches not involving p1
      expect(screen.queryByText('Marcus Johnson')).not.toBeInTheDocument();
    });

    test('should show toggle for filtering own matches', () => {
      render(<TournamentPairings {...defaultProps} currentPlayerId="p1" />);
      
      expect(screen.getByText('Show only my matches')).toBeInTheDocument();
    });

    test('should toggle filtering when checkbox is clicked', () => {
      render(<TournamentPairings {...defaultProps} currentPlayerId="p1" />);
      
      const filterCheckbox = screen.getByLabelText('Show only my matches');
      
      // Initially should show all matches
      expect(screen.getByText('Marcus Johnson')).toBeInTheDocument();
      
      // Click to filter
      fireEvent.click(filterCheckbox);
      
      // Should now only show p1's matches
      expect(screen.queryByText('Marcus Johnson')).not.toBeInTheDocument();
      expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
    });
  });

  describe('Day 2 Qualification', () => {
    test('should show Day 2 qualification badge for 6-2 or better record', () => {
      const pairingsWithQualifiedPlayer: TournamentPairing[] = [
        {
          round: 8,
          table: 1,
          player1: { id: 'p1', name: 'Alex Rodriguez', record: '6-2' },
          player2: { id: 'p2', name: 'Sarah Chen', record: '5-3' },
          result: { winner: 'p1', score: '2-0' }
        }
      ];

      render(<TournamentPairings 
        {...defaultProps} 
        pairings={pairingsWithQualifiedPlayer}
        currentPlayerId="p1"
      />);
      
      expect(screen.getByText('Day 2 Qualified')).toBeInTheDocument();
    });

    test('should not show Day 2 qualification badge for 5-3 record', () => {
      const pairingsWithNonQualifiedPlayer: TournamentPairing[] = [
        {
          round: 8,
          table: 1,
          player1: { id: 'p1', name: 'Alex Rodriguez', record: '5-3' },
          player2: { id: 'p2', name: 'Sarah Chen', record: '4-4' },
          result: { winner: 'p1', score: '2-0' }
        }
      ];

      render(<TournamentPairings 
        {...defaultProps} 
        pairings={pairingsWithNonQualifiedPlayer}
        currentPlayerId="p1"
      />);
      
      expect(screen.queryByText('Day 2 Qualified')).not.toBeInTheDocument();
    });

    test('should show Day 2 qualification badge for 7-1 record', () => {
      const pairingsWithQualifiedPlayer: TournamentPairing[] = [
        {
          round: 8,
          table: 1,
          player1: { id: 'p1', name: 'Alex Rodriguez', record: '7-1' },
          player2: { id: 'p2', name: 'Sarah Chen', record: '6-2' },
          result: { winner: 'p1', score: '2-0' }
        }
      ];

      render(<TournamentPairings 
        {...defaultProps} 
        pairings={pairingsWithQualifiedPlayer}
        currentPlayerId="p1"
      />);
      
      expect(screen.getByText('Day 2 Qualified')).toBeInTheDocument();
    });
  });

  describe('Round Navigation', () => {
    test('should allow expanding and collapsing rounds', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Initially all rounds should be visible
      expect(screen.getByText('Round 1')).toBeInTheDocument();
      expect(screen.getByText('Round 2')).toBeInTheDocument();
      expect(screen.getByText('Round 3')).toBeInTheDocument();
      
      // Click to collapse round 1
      const round1Header = screen.getByText('Round 1').closest('div');
      if (round1Header) {
        fireEvent.click(round1Header);
      }
      
      // Round 1 content should be hidden
      expect(screen.queryByText('Table 1')).not.toBeInTheDocument();
    });
  });

  describe('Match Status', () => {
    test('should show correct status for completed matches', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Round 1, Table 1 is completed
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    test('should show correct status for pending matches', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Round 3 matches are pending
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Player Records', () => {
    test('should display player records correctly', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      expect(screen.getByText('(0-0)')).toBeInTheDocument();
      expect(screen.getByText('(1-0)')).toBeInTheDocument();
      expect(screen.getByText('(0-1)')).toBeInTheDocument();
    });

    test('should update records as rounds progress', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      // Alex Rodriguez starts 0-0, wins round 1 to become 1-0, wins round 2 to become 2-0
      const alexElements = screen.getAllByText('Alex Rodriguez');
      expect(alexElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels for interactive elements', () => {
      render(<TournamentPairings {...defaultProps} currentPlayerId="p1" />);
      
      const filterCheckbox = screen.getByLabelText('Show only my matches');
      expect(filterCheckbox).toBeInTheDocument();
    });

    test('should have proper heading structure', () => {
      render(<TournamentPairings {...defaultProps} />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle empty pairings array', () => {
      render(<TournamentPairings {...defaultProps} pairings={[]} />);
      
      expect(screen.getByText('No pairings available')).toBeInTheDocument();
    });

    test('should handle missing tournament data', () => {
      render(<TournamentPairings {...defaultProps} tournament={undefined} />);
      
      expect(screen.getByText('Phoenix Regional Championships')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('should render large number of pairings efficiently', () => {
      const largePairings: TournamentPairing[] = Array.from({ length: 100 }, (_, i) => ({
        round: Math.floor(i / 10) + 1,
        table: (i % 10) + 1,
        player1: { id: `p${i * 2}`, name: `Player ${i * 2}`, record: '0-0' },
        player2: { id: `p${i * 2 + 1}`, name: `Player ${i * 2 + 1}`, record: '0-0' },
        result: i % 2 === 0 ? { winner: `p${i * 2}`, score: '2-0' } : undefined
      }));

      const startTime = performance.now();
      render(<TournamentPairings {...defaultProps} pairings={largePairings} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should render in under 1 second
    });
  });
}); 