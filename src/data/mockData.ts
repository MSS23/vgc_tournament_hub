import { Tournament, Player, TournamentPairing, ChampionshipPointsBreakdown, Team, TeamSlot, TeamSlotManager, TournamentSubmission, Pokemon } from '../types';
import { validateTournamentPairings, logPairingValidation } from '../utils/pairingValidator';

// Helper function to generate default championship points breakdown
const generateDefaultChampionshipPoints = (playerId: string, basePoints: number = 0): ChampionshipPointsBreakdown => {
  return {
    tcg: {
      current: 0,
      season: 0,
      lifetime: 0,
      events: [],
      rank: undefined,
      tier: 'none' as const
    },
    vgc: {
      current: basePoints,
      season: basePoints * 1.5,
      lifetime: basePoints * 3,
      events: [],
      rank: undefined,
      tier: basePoints >= 500 ? 'gold' as const : basePoints >= 250 ? 'silver' as const : 'none' as const
    },
    go: {
      current: 0,
      season: 0,
      lifetime: 0,
      events: [],
      rank: undefined,
      tier: 'none' as const
    },
    total: basePoints
  };
};

// Comprehensive mock player data across multiple regions
const mockPlayerData = [
  // Manraj Sidhu - Active Live Tournament Player
  {
    id: 'manraj-sidhu',
    name: 'Manraj Sidhu',
    playerId: '12345678',
    region: 'North America',
    division: 'master',
    championships: 1,
    winRate: 75,
    rating: 1950,
    isVerified: true,
    achievements: [
      'Regional Champion 2023', 
      'Top 8 Worlds 2023', 
      'Live Tournament Player',
      'Meta Innovator',
      'Community Leader',
      'Team Builder Expert'
    ],
    country: 'Canada',
    isActiveInLiveTournament: true,
    currentTournament: 'tournament-1', // Phoenix Regional Championships
    currentRound: 3,
    currentTable: 12,
    currentMatch: {
      round: 3,
      table: 12,
      opponent: 'Sarah Chen',
      opponentId: 'p2',
      result: 'pending'
    },
    championshipPoints: 850,
    championshipPointsBreakdown: {
      tcg: {
        current: 0,
        season: 0,
        lifetime: 0,
        events: [],
        rank: undefined,
        tier: 'none' as const
      },
      vgc: {
        current: 850,
        season: 1200,
        lifetime: 2850,
        events: [
          {
            id: 'vgc-1',
            name: 'Phoenix Regional Championships 2024',
            date: '2024-03-15',
            location: 'Phoenix, AZ',
            placement: 3,
            totalPlayers: 650,
            points: 200,
            type: 'regional' as const,
            format: 'vgc' as const,
            season: '2024'
          },
          {
            id: 'vgc-2',
            name: 'Vancouver Regional Championships 2024',
            date: '2024-02-10',
            location: 'Vancouver, BC',
            placement: 1,
            totalPlayers: 420,
            points: 200,
            type: 'regional' as const,
            format: 'vgc' as const,
            season: '2024'
          },
          {
            id: 'vgc-3',
            name: 'Seattle Regional Championships 2024',
            date: '2024-01-20',
            location: 'Seattle, WA',
            placement: 5,
            totalPlayers: 380,
            points: 150,
            type: 'regional' as const,
            format: 'vgc' as const,
            season: '2024'
          },
          {
            id: 'vgc-4',
            name: 'World Championships 2023',
            date: '2023-08-12',
            location: 'Yokohama, Japan',
            placement: 8,
            totalPlayers: 256,
            points: 200,
            type: 'worlds' as const,
            format: 'vgc' as const,
            season: '2023'
          },
          {
            id: 'vgc-5',
            name: 'North America International Championships 2023',
            date: '2023-06-25',
            location: 'Columbus, OH',
            placement: 4,
            totalPlayers: 512,
            points: 200,
            type: 'international' as const,
            format: 'vgc' as const,
            season: '2023'
          }
        ],
        rank: 15,
        tier: 'gold' as const
      },
      go: {
        current: 0,
        season: 0,
        lifetime: 0,
        events: [],
        rank: undefined,
        tier: 'none' as const
      },
      total: 850
    },
    tournaments: [
      {
        id: 'tournament-1',
        name: 'Phoenix Regional Championships 2024',
        date: '2024-03-15',
        location: 'Phoenix Convention Center, AZ',
        placement: 3,
        totalPlayers: 650,
        wins: 6,
        losses: 2,
        resistance: 68.5,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'ongoing'
      },
      {
        id: 'tournament-2',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-02-10',
        location: 'Vancouver Convention Centre, BC',
        placement: 1,
        totalPlayers: 420,
        wins: 8,
        losses: 0,
        resistance: 72.3,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed',
        rounds: [
          { 
            round: 1, 
            opponent: 'Alex Rodriguez', 
            opponentTeam: [
              { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
              { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
              { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
              { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
              { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
              { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
            ], 
            result: 'win', 
            score: '2-1', 
            table: 15 
          },
          { 
            round: 2, 
            opponent: 'Marcus Johnson', 
            opponentTeam: [
              { name: 'Garchomp' }, { name: 'Tornadus' }, { name: 'Rillaboom' }, { name: 'Chi-Yu' }, { name: 'Iron Bundle' }, { name: 'Arcanine' }
            ],
            result: 'win',
            score: '2-0',
            table: 8
          },
          { 
            round: 3, 
            opponent: 'Sarah Chen', 
            opponentTeam: [
              { name: 'Flutter Mane' }, { name: 'Iron Hands' }, { name: 'Landorus-T' }, { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
            ],
            result: 'win',
            score: '2-0',
            table: 12
          }
        ]
      },
      {
        id: 'tournament-3',
        name: 'World Championships 2023',
        date: '2023-08-15',
        location: 'Yokohama, Japan',
        placement: 8,
        totalPlayers: 1200,
        wins: 5,
        losses: 3,
        resistance: 65.8,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      }
    ]
  },
  // North America - Top Players
  {
    id: 'p1',
    name: 'Alex Rodriguez',
    playerId: '12345678',
    region: 'North America',
    division: 'master',
    championships: 3,
    winRate: 78,
    rating: 2100,
    isVerified: true,
    achievements: [
      'Worlds Champion 2023', 
      'North America Champion 2022', 
      'Regional Champion x5',
      'Meta Analyst',
      'Content Creator',
      'Community Mentor'
    ],
    country: 'United States',
    championshipPoints: 1800,
    tournaments: [
      {
        id: 'tournament-4',
        name: 'San Diego Regional Championships 2024',
        date: '2024-02-10',
        location: 'San Diego Convention Center, CA',
        placement: 1,
        totalPlayers: 580,
        wins: 8,
        losses: 0,
        resistance: 75.2,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-5',
        name: 'World Championships 2023',
        date: '2023-08-15',
        location: 'Yokohama, Japan',
        placement: 1,
        totalPlayers: 1200,
        wins: 9,
        losses: 0,
        resistance: 78.9,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-6',
        name: 'North America International Championships 2023',
        date: '2023-06-20',
        location: 'Columbus, OH',
        placement: 1,
        totalPlayers: 850,
        wins: 8,
        losses: 1,
        resistance: 76.4,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p2',
    name: 'Sarah Chen',
    playerId: '23456789',
    region: 'North America',
    division: 'master',
    championships: 2,
    winRate: 72,
    rating: 1950,
    isVerified: true,
    achievements: [
      'Regional Champion x3', 
      'Top 8 Worlds 2023', 
      'Meta Expert',
      'Team Builder',
      'Strategy Guide Author',
      'Women in VGC Advocate'
    ],
    country: 'Canada',
    championshipPoints: 1400,
    tournaments: [
      {
        id: 'tournament-7',
        name: 'Toronto Regional Championships 2024',
        date: '2024-01-20',
        location: 'Metro Toronto Convention Centre',
        placement: 1,
        totalPlayers: 450,
        wins: 7,
        losses: 1,
        resistance: 73.8,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-8',
        name: 'World Championships 2023',
        date: '2023-08-15',
        location: 'Yokohama, Japan',
        placement: 8,
        totalPlayers: 1200,
        wins: 5,
        losses: 3,
        resistance: 67.2,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-9',
        name: 'Vancouver Regional Championships 2023',
        date: '2023-11-15',
        location: 'Vancouver Convention Centre, BC',
        placement: 1,
        totalPlayers: 380,
        wins: 8,
        losses: 0,
        resistance: 74.1,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p3',
    name: 'Marcus Johnson',
    playerId: '34567890',
    region: 'North America',
    division: 'master',
    championships: 1,
    winRate: 68,
    rating: 1850,
    isVerified: true,
    achievements: [
      'Regional Champion 2023', 
      'Community Leader',
      'Tournament Organizer',
      'Mentor Program Founder',
      'Diversity Advocate'
    ],
    country: 'Mexico',
    championshipPoints: 900,
    tournaments: [
      {
        id: 'tournament-10',
        name: 'Mexico City Regional Championships 2024',
        date: '2024-01-15',
        location: 'Centro Banamex, Mexico City',
        placement: 1,
        totalPlayers: 320,
        wins: 7,
        losses: 1,
        resistance: 71.5,
        team: [
          { name: 'Garchomp', item: 'Choice Scarf', ability: 'Rough Skin', teraType: 'Ground' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Chi-Yu', item: 'Choice Specs', ability: 'Beads of Ruin', teraType: 'Fire' },
          { name: 'Iron Bundle', item: 'Focus Sash', ability: 'Quark Drive', teraType: 'Ice' },
          { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-11',
        name: 'San Antonio Regional Championships 2023',
        date: '2023-12-10',
        location: 'Henry B. Gonzalez Convention Center',
        placement: 4,
        totalPlayers: 480,
        wins: 6,
        losses: 2,
        resistance: 69.8,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p4',
    name: 'Emily Davis',
    playerId: '45678901',
    region: 'North America',
    division: 'senior',
    championships: 0,
    winRate: 65,
    rating: 1750,
    isVerified: false,
    achievements: [
      'Top 16 Regionals 2023', 
      'Rising Star',
      'Junior Division Champion 2022',
      'Community Helper'
    ],
    country: 'United States',
    championshipPoints: 400,
    tournaments: [
      {
        id: 'tournament-12',
        name: 'Seattle Regional Championships 2024',
        date: '2024-02-25',
        location: 'Washington State Convention Center',
        placement: 16,
        totalPlayers: 520,
        wins: 4,
        losses: 3,
        resistance: 62.3,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-13',
        name: 'Junior Division World Championships 2023',
        date: '2023-08-15',
        location: 'Yokohama, Japan',
        placement: 8,
        totalPlayers: 200,
        wins: 5,
        losses: 3,
        resistance: 65.7,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p5',
    name: 'David Kim',
    playerId: '56789012',
    region: 'North America',
    division: 'master',
    championships: 0,
    winRate: 62,
    rating: 1700,
    isVerified: false,
    achievements: [
      'Top 32 Regionals 2023',
      'Consistent Performer',
      'Team Builder'
    ],
    country: 'United States',
    championshipPoints: 200,
    tournaments: [
      {
        id: 'tournament-14',
        name: 'Los Angeles Regional Championships 2024',
        date: '2024-01-30',
        location: 'Los Angeles Convention Center',
        placement: 32,
        totalPlayers: 680,
        wins: 3,
        losses: 4,
        resistance: 58.9,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      }
    ]
  },

  // Europe - Top Players
  {
    id: 'p6',
    name: 'Lars Andersen',
    playerId: '67890123',
    region: 'Europe',
    division: 'master',
    championships: 2,
    winRate: 75,
    rating: 2000,
    isVerified: true,
    achievements: [
      'European Champion 2023', 
      'Worlds Top 4 2023', 
      'Regional Champion x4',
      'Meta Analyst',
      'Content Creator',
      'Community Leader'
    ],
    country: 'United Kingdom',
    championshipPoints: 1500,
    tournaments: [
      {
        id: 'tournament-15',
        name: 'London Regional Championships 2024',
        date: '2024-02-15',
        location: 'ExCeL London',
        placement: 1,
        totalPlayers: 580,
        wins: 8,
        losses: 0,
        resistance: 76.2,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-16',
        name: 'World Championships 2023',
        date: '2023-08-15',
        location: 'Yokohama, Japan',
        placement: 4,
        totalPlayers: 1200,
        wins: 6,
        losses: 2,
        resistance: 72.8,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-17',
        name: 'European International Championships 2023',
        date: '2023-07-10',
        location: 'Berlin, Germany',
        placement: 1,
        totalPlayers: 720,
        wins: 8,
        losses: 1,
        resistance: 75.6,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p7',
    name: 'Sophie Müller',
    playerId: '78901234',
    region: 'Europe',
    division: 'master',
    championships: 1,
    winRate: 70,
    rating: 1900,
    isVerified: true,
    achievements: [
      'German Champion 2023', 
      'Top 8 Worlds 2022',
      'European Regional Champion x2',
      'Meta Analyst',
      'Strategy Guide Author'
    ],
    country: 'Germany',
    championshipPoints: 1100,
    tournaments: [
      {
        id: 'tournament-18',
        name: 'Berlin Regional Championships 2024',
        date: '2024-01-25',
        location: 'Messe Berlin',
        placement: 1,
        totalPlayers: 420,
        wins: 7,
        losses: 1,
        resistance: 72.9,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-19',
        name: 'World Championships 2022',
        date: '2022-08-20',
        location: 'London, UK',
        placement: 8,
        totalPlayers: 1100,
        wins: 5,
        losses: 3,
        resistance: 66.4,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p8',
    name: 'Pierre Dubois',
    playerId: '89012345',
    region: 'Europe',
    division: 'master',
    championships: 0,
    winRate: 67,
    rating: 1800,
    isVerified: false,
    achievements: [
      'French Regional Champion 2023',
      'Consistent Top 16',
      'Community Helper'
    ],
    country: 'France',
    championshipPoints: 700,
    tournaments: [
      {
        id: 'tournament-20',
        name: 'Paris Regional Championships 2024',
        date: '2024-02-05',
        location: 'Paris Expo Porte de Versailles',
        placement: 4,
        totalPlayers: 380,
        wins: 6,
        losses: 2,
        resistance: 69.1,
        team: [
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' }
        ],
        status: 'completed'
      },
      {
        id: 'tournament-21',
        name: 'Lyon Regional Championships 2023',
        date: '2023-11-20',
        location: 'Eurexpo Lyon',
        placement: 1,
        totalPlayers: 320,
        wins: 7,
        losses: 1,
        resistance: 71.8,
        team: [
          { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
          { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
          { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p9',
    name: 'Maria Garcia',
    playerId: '23456789',
    region: 'Europe',
    division: 'senior',
    championships: 0,
    winRate: 63,
    rating: 1650,
    isVerified: false,
    achievements: [
      'Spanish Regional Top 8 2023',
      'Rising Star',
      'Community Helper'
    ],
    country: 'Spain',
    championshipPoints: 350,
    tournaments: [
      {
        id: 'tournament-22',
        name: 'Madrid Regional Championships 2024',
        date: '2024-01-10',
        location: 'IFEMA Madrid',
        placement: 8,
        totalPlayers: 280,
        wins: 4,
        losses: 3,
        resistance: 64.2,
        team: [
          { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
          { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
          { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
          { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
        ],
        status: 'completed'
      }
    ]
  },
  {
    id: 'p10',
    name: 'Giuseppe Rossi',
    playerId: '34567890',
    region: 'Europe',
    division: 'master',
    championships: 0,
    winRate: 60,
    rating: 1600,
    isVerified: false,
    achievements: [
      'Italian Regional Participant 2023',
      'Consistent Performer',
      'Team Builder'
    ],
    country: 'Italy',
    championshipPoints: 150,
    tournaments: [
      {
        id: 'tournament-23',
        name: 'Milan Regional Championships 2024',
        date: '2024-02-20',
        location: 'Fiera Milano',
        placement: 16,
        totalPlayers: 240,
        wins: 3,
        losses: 4,
        resistance: 59.7,
        team: [
          { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
          { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
          { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
          { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
          { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
          { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
        ],
        status: 'completed'
      }
    ]
  },

  // Asia-Pacific - Top Players
  {
    id: 'p11',
    name: 'Yuki Tanaka',
    playerId: '45678901',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 3,
    winRate: 80,
    rating: 2150,
    isVerified: true,
    achievements: ['Worlds Champion 2022', 'Japan Champion 2023', 'Regional Champion x6'],
    country: 'Japan',
    championshipPoints: 2000,
    tournaments: []
  },
  {
    id: 'p12',
    name: 'Min-ji Park',
    playerId: '56789012',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 2,
    winRate: 73,
    rating: 1950,
    isVerified: true,
    achievements: ['Korean Champion 2023', 'Top 4 Worlds 2023', 'Regional Champion x3'],
    country: 'South Korea',
    championshipPoints: 1450,
    tournaments: []
  },
  {
    id: 'p13',
    name: 'Wei Chen',
    playerId: '67890123',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 1,
    winRate: 69,
    rating: 1850,
    isVerified: true,
    achievements: ['Chinese Regional Champion 2023'],
    country: 'China',
    championshipPoints: 900,
    tournaments: []
  },
  {
    id: 'p14',
    name: 'Akira Yamamoto',
    playerId: '78901234',
    region: 'Asia-Pacific',
    division: 'senior',
    championships: 0,
    winRate: 66,
    rating: 1750,
    isVerified: false,
    achievements: ['Japan Regional Top 16 2023'],
    country: 'Japan',
    championshipPoints: 400,
    tournaments: []
  },
  {
    id: 'p15',
    name: 'Jin-woo Kim',
    playerId: '89012345',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 0,
    winRate: 64,
    rating: 1700,
    isVerified: false,
    achievements: ['Korean Regional Top 32 2023'],
    country: 'South Korea',
    championshipPoints: 200,
    tournaments: []
  },

  // Latin America - Top Players
  {
    id: 'p16',
    name: 'Carlos Rodriguez',
    playerId: '90123456',
    region: 'Latin America',
    division: 'master',
    championships: 2,
    winRate: 71,
    rating: 1900,
    isVerified: true,
    achievements: ['Latin America Champion 2023', 'Top 8 Worlds 2023', 'Regional Champion x4'],
    country: 'Brazil',
    championshipPoints: 1600,
    tournaments: []
  },
  {
    id: 'p17',
    name: 'Ana Silva',
    playerId: '01234567',
    region: 'Latin America',
    division: 'master',
    championships: 1,
    winRate: 68,
    rating: 1800,
    isVerified: true,
    achievements: ['Brazilian Champion 2023', 'Top 16 Worlds 2022'],
    country: 'Brazil',
    championshipPoints: 1200,
    tournaments: []
  },
  {
    id: 'p18',
    name: 'Miguel Torres',
    playerId: '11111111',
    region: 'Latin America',
    division: 'master',
    championships: 0,
    winRate: 65,
    rating: 1750,
    isVerified: false,
    achievements: ['Mexican Regional Champion 2023'],
    country: 'Mexico',
    championshipPoints: 800,
    tournaments: []
  },
  {
    id: 'p19',
    name: 'Valentina Morales',
    playerId: '22222222',
    region: 'Latin America',
    division: 'senior',
    championships: 0,
    winRate: 62,
    rating: 1650,
    isVerified: false,
    achievements: ['Chilean Regional Top 8 2023'],
    country: 'Chile',
    championshipPoints: 500,
    tournaments: []
  },
  {
    id: 'p20',
    name: 'Diego Fernandez',
    playerId: '33333333',
    region: 'Latin America',
    division: 'master',
    championships: 0,
    winRate: 59,
    rating: 1600,
    isVerified: false,
    achievements: ['Argentine Regional Participant 2023'],
    country: 'Argentina',
    championshipPoints: 100,
    tournaments: []
  },

  // Junior Division Players
  {
    id: 'p21',
    name: 'Lucas Thompson',
    playerId: '44444444',
    region: 'North America',
    division: 'junior',
    championships: 1,
    winRate: 70,
    rating: 1650,
    isVerified: true,
    achievements: ['Junior Regional Champion 2023', 'Top 4 Junior Worlds 2023'],
    country: 'United States',
    championshipPoints: 600,
    tournaments: []
  },
  {
    id: 'p22',
    name: 'Emma Wilson',
    playerId: '55555555',
    region: 'North America',
    division: 'junior',
    championships: 0,
    winRate: 65,
    rating: 1550,
    isVerified: false,
    achievements: ['Junior Regional Top 8 2023'],
    country: 'Canada',
    championshipPoints: 300,
    tournaments: []
  },
  {
    id: 'p23',
    name: 'Hiroshi Sato',
    playerId: '66666666',
    region: 'Asia-Pacific',
    division: 'junior',
    championships: 2,
    winRate: 75,
    rating: 1700,
    isVerified: true,
    achievements: ['Junior World Champion 2023', 'Japan Junior Champion 2023'],
    country: 'Japan',
    championshipPoints: 1200,
    tournaments: []
  },
  {
    id: 'p24',
    name: 'Isabella Costa',
    playerId: '77777777',
    region: 'Latin America',
    division: 'junior',
    championships: 0,
    winRate: 60,
    rating: 1500,
    isVerified: false,
    achievements: ['Brazilian Junior Regional Top 16 2023'],
    country: 'Brazil',
    championshipPoints: 150,
    tournaments: []
  },

  // Senior Division Players
  {
    id: 'p25',
    name: 'Ryan O\'Connor',
    playerId: '88888888',
    region: 'North America',
    division: 'senior',
    championships: 1,
    winRate: 68,
    rating: 1750,
    isVerified: true,
    achievements: ['Senior Regional Champion 2023', 'Top 8 Senior Worlds 2023'],
    country: 'United States',
    championshipPoints: 800,
    tournaments: []
  },
  {
    id: 'p26',
    name: 'Lisa Anderson',
    playerId: '99999999',
    region: 'North America',
    division: 'senior',
    championships: 0,
    winRate: 63,
    rating: 1650,
    isVerified: false,
    achievements: ['Senior Regional Top 16 2023'],
    country: 'Canada',
    championshipPoints: 400,
    tournaments: []
  },
  {
    id: 'p27',
    name: 'Felix Weber',
    playerId: '10101010',
    region: 'Europe',
    division: 'senior',
    championships: 1,
    winRate: 69,
    rating: 1750,
    isVerified: true,
    achievements: ['German Senior Champion 2023', 'Top 4 Senior Worlds 2023'],
    country: 'Germany',
    championshipPoints: 900,
    tournaments: []
  },
  {
    id: 'p28',
    name: 'Yuki Nakamura',
    playerId: '20202020',
    region: 'Asia-Pacific',
    division: 'senior',
    championships: 0,
    winRate: 64,
    rating: 1650,
    isVerified: false,
    achievements: ['Japan Senior Regional Top 8 2023'],
    country: 'Japan',
    championshipPoints: 350,
    tournaments: []
  }
];

// Add a helper to map region to a country
const regionCountryMapForMock = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Austria', 'Switzerland'],
  'Asia-Pacific': ['Japan', 'South Korea', 'Taiwan', 'Australia', 'China', 'Hong Kong', 'Singapore', 'Malaysia', 'Thailand', 'Philippines', 'Indonesia', 'New Zealand', 'India'],
  'Latin America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Uruguay', 'Paraguay', 'Bolivia']
};

// Patch mockPlayerData to add a country field and required fields
mockPlayerData.forEach(player => {
  if (!player.country || player.country === 'Unknown') {
    const countries = (regionCountryMapForMock as Record<string, string[]>)[player.region] || ['United States'];
    player.country = countries[Math.floor(Math.random() * countries.length)];
  }
  // Ensure division is correct type
  if (typeof player.division === 'string' && !['junior', 'senior', 'master'].includes(player.division)) {
    player.division = 'master';
  }
  // Add missing required fields if not present
  if (!('teams' in player)) (player as any).teams = [];
  if (!('matchHistory' in player)) (player as any).matchHistory = [];
  if (!('achievements' in player)) (player as any).achievements = [];
  if (!('statistics' in player)) (player as any).statistics = {
    totalMatches: 0,
    totalWins: 0,
    totalLosses: 0,
    totalDraws: 0,
    winRate: player.winRate || 0,
    bestFinish: 0,
    tournamentsPlayed: 0,
    championships: player.championships || 0,
    currentStreak: 0,
    longestStreak: 0,
    averagePlacement: 0,
    mostUsedPokemon: [],
    mostUsedItems: [],
    mostUsedMoves: [],
    seasonalStats: []
  };
  if (!('preferences' in player)) (player as any).preferences = {
    notifications: {
      email: false,
      push: false,
      sms: false,
      tournamentUpdates: false,
      pairingNotifications: false,
      roundStartReminders: false,
      socialInteractions: false,
      achievementUnlocks: false
    },
    privacy: {
      profileVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    display: {
      theme: 'light',
      compactMode: false,
      showAdvancedStats: false,
      defaultView: 'dashboard',
    },
    accessibility: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
    },
    language: 'en',
    timezone: 'UTC',
  };
  if (!('accessibilitySettings' in player)) (player as any).accessibilitySettings = {
    screenReader: false,
    highContrast: false,
    dyslexiaFriendly: false,
    fontSize: 'medium',
    reducedMotion: false,
    keyboardNavigation: false,
    colorBlindSupport: false,
  };
  // Ensure all tournaments in player.tournaments have required Tournament fields
  if (Array.isArray(player.tournaments)) {
    player.tournaments = [];
  }
});

// Generate additional players to reach 600 total with unique names
const usedNames = new Set<string>();
const additionalPlayers: Player[] = Array.from({ length: 572 }, (_, i) => {
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
  const divisions: Array<'junior' | 'senior' | 'master'> = ['junior', 'senior', 'master'];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const division = divisions[Math.floor(Math.random() * divisions.length)];
  
  // Generate unique name
  let names: string;
  let attempts = 0;
  do {
    names = generateRegionalName(region, i);
    attempts++;
  } while (usedNames.has(names) && attempts < 10);
  
  usedNames.add(names);
  const playerId = `${Math.floor(10000000 + Math.random() * 90000000)}`;
  const countries = (regionCountryMapForMock as Record<string, string[]>)[region] || ['United States'];
  const country = countries[Math.floor(Math.random() * countries.length)];
  
  return {
    id: `p${i + 29}`,
    name: names,
    playerId: playerId,
    region: region,
    country: country,
    division: division,
    championships: Math.floor(Math.random() * 2),
    winRate: 45 + Math.floor(Math.random() * 35),
    rating: 1400 + Math.floor(Math.random() * 400),
    championshipPoints: Math.floor(Math.random() * 1000),
    tournaments: [],
    isVerified: Math.random() < 0.15,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    teams: [],
    matchHistory: [],
    achievements: [],
    statistics: {
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: 0,
      bestFinish: 0,
      tournamentsPlayed: 0,
      championships: 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePlacement: 0,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: false,
        push: false,
        sms: false,
        tournamentUpdates: false,
        pairingNotifications: false,
        roundStartReminders: false,
        socialInteractions: false,
        achievementUnlocks: false
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none',
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard',
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false,
      },
      language: 'en',
      timezone: 'UTC',
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
    },
  };
});

// Helper function to generate regional names with index for uniqueness
function generateRegionalName(region: string, index: number): string {
  const northAmericanNames = [
    'Michael Brown', 'Jessica Lee', 'Christopher Davis', 'Amanda Wilson', 'Daniel Martinez',
    'Ashley Taylor', 'Matthew Anderson', 'Nicole Garcia', 'Joshua Rodriguez', 'Stephanie Lopez',
    'Andrew White', 'Rachel Moore', 'Kevin Jackson', 'Lauren Martin', 'Steven Thompson',
    'Megan Clark', 'Brian Lewis', 'Amber Hall', 'Timothy Young', 'Samantha King',
    'Ryan Johnson', 'Emily Davis', 'Brandon Wilson', 'Hannah Miller', 'Justin Taylor',
    'Olivia Anderson', 'Tyler Thomas', 'Madison Jackson', 'Nathan White', 'Chloe Harris',
    'Zachary Martin', 'Grace Thompson', 'Cody Garcia', 'Lily Martinez', 'Dylan Robinson',
    'Ava Clark', 'Logan Rodriguez', 'Sophia Lewis', 'Hunter Lee', 'Isabella Walker'
  ];
  
  const europeanNames = [
    'Hans Mueller', 'Anna Schmidt', 'Thomas Wagner', 'Claudia Fischer', 'Wolfgang Meyer',
    'Petra Weber', 'Klaus Schulz', 'Monika Hoffmann', 'Dieter Koch', 'Gabriele Bauer',
    'Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'François Petit',
    'Isabella Rossi', 'Marco Bianchi', 'Giulia Romano', 'Luca Ferrari', 'Valentina Costa',
    'Lars Andersen', 'Eva Johansson', 'Anders Nilsson', 'Maria Svensson', 'Johan Eriksson',
    'Sophie Müller', 'Felix Weber', 'Lisa Schmidt', 'Maximilian Wagner', 'Julia Fischer',
    'Antonio Silva', 'Carmen Rodriguez', 'Miguel Garcia', 'Isabella Torres', 'Carlos Morales',
    'Ana Fernandez', 'Diego Costa', 'Valentina Santos', 'Gabriel Lima', 'Camila Oliveira'
  ];
  
  const asiaPacificNames = [
    'Takashi Yamamoto', 'Yuki Tanaka', 'Hiroshi Sato', 'Aiko Watanabe', 'Kenji Suzuki',
    'Min-ji Park', 'Jin-woo Kim', 'Soo-jin Lee', 'Hyun-woo Choi', 'Ji-eun Kim',
    'Wei Chen', 'Li Wang', 'Zhang Liu', 'Yang Zhao', 'Hui Wu',
    'Arjun Patel', 'Priya Sharma', 'Raj Singh', 'Anjali Gupta', 'Vikram Kumar',
    'Yuki Nakamura', 'Hiroshi Tanaka', 'Akira Yamamoto', 'Yumi Sato', 'Kenji Watanabe',
    'Min-seok Park', 'Ji-hyun Kim', 'Seung-woo Lee', 'Hye-jin Choi', 'Dong-hyun Kim',
    'Xiaoming Chen', 'Ying Wang', 'Ming Liu', 'Jian Zhao', 'Xiaoli Wu',
    'Rahul Patel', 'Neha Sharma', 'Amit Singh', 'Priya Gupta', 'Vikram Kumar'
  ];
  
  const latinAmericanNames = [
    'Carlos Rodriguez', 'Ana Silva', 'Miguel Torres', 'Valentina Morales', 'Diego Fernandez',
    'Isabella Costa', 'Gabriel Santos', 'Camila Lima', 'Rafael Oliveira', 'Mariana Pereira',
    'Javier Martinez', 'Sofia Gonzalez', 'Alejandro Lopez', 'Valeria Ramirez', 'Carlos Herrera',
    'Maria Garcia', 'Luis Rodriguez', 'Carmen Torres', 'Roberto Morales', 'Patricia Silva',
    'Lucas Thompson', 'Emma Wilson', 'Sarah Kim', 'David Chen', 'Lisa Anderson',
    'Felix Weber', 'Yuki Nakamura', 'Hiroshi Sato', 'Isabella Costa', 'Miguel Torres'
  ];
  
  let namePool: string[];
  switch (region) {
    case 'North America':
      namePool = northAmericanNames;
      break;
    case 'Europe':
      namePool = europeanNames;
      break;
    case 'Asia-Pacific':
      namePool = asiaPacificNames;
      break;
    case 'Latin America':
      namePool = latinAmericanNames;
      break;
    default:
      namePool = northAmericanNames;
  }
  
  // Use index to ensure more unique distribution
  const nameIndex = (index + Math.floor(Math.random() * 10)) % namePool.length;
  return namePool[nameIndex];
}

// Combine all players
const swissPlayers: Player[] = [
  ...mockPlayerData.map(player => ({
    ...player,
    division: (['junior', 'senior', 'master'].includes(player.division) ? player.division : 'master') as 'junior' | 'senior' | 'master',
    tournaments: Array.isArray(player.tournaments) ? (player.tournaments.map(t => {
      const baseTournament = {
        ...t,
        maxCapacity: t.maxCapacity ?? 512,
        currentRegistrations: t.currentRegistrations ?? t.totalPlayers ?? 0,
        waitlistEnabled: typeof t.waitlistEnabled === 'boolean' ? t.waitlistEnabled : true,
        waitlistCapacity: t.waitlistCapacity ?? 50,
        currentWaitlist: t.currentWaitlist ?? 0,
        registrationType: t.registrationType ?? 'first-come-first-served',
        status: (['ongoing', 'completed', 'upcoming', 'registration'].includes(t.status) ? t.status : 'completed') as 'ongoing' | 'completed' | 'upcoming' | 'registration',
        tournamentType: t.tournamentType ?? 'swiss',
        structure: t.structure ?? {
          totalRounds: 8,
          currentRound: 8,
          playersPerTable: 2,
          timePerRound: 50,
          breakTime: 15
        },
      };
      if (Array.isArray(t.rounds)) {
        return {
          ...baseTournament,
          rounds: t.rounds.map(r => ({
            ...r,
            result: typeof r.result === 'string' && ['win', 'loss', 'draw'].includes(r.result) ? r.result as 'win' | 'loss' | 'draw' : undefined
          })),
        } as Tournament;
      } else {
        return baseTournament as Tournament;
      }
    }) as Tournament[]) : [],
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    teams: player.teams || [],
    matchHistory: player.matchHistory || [],
    achievements: player.achievements || [],
    statistics: player.statistics || {
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: player.winRate || 0,
      bestFinish: 0,
      tournamentsPlayed: 0,
      championships: player.championships || 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePlacement: 0,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: player.preferences || {
      notifications: {
        email: false,
        push: false,
        sms: false,
        tournamentUpdates: false,
        pairingNotifications: false,
        roundStartReminders: false,
        socialInteractions: false,
        achievementUnlocks: false
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none',
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard',
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false,
      },
      language: 'en',
      timezone: 'UTC',
    },
    accessibilitySettings: player.accessibilitySettings || {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false,
    },
  })),
  ...additionalPlayers
];

// Enhance Alex Rodriguez (p1) with a tournament run
const alexTeam = [
  { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire', moves: ['Heat Wave', 'Solar Beam', 'Protect', 'Air Slash'] },
  { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel', moves: ['Make It Rain', 'Shadow Ball', 'Thunderbolt', 'Protect'] },
  { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
  { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark', moves: ['Wicked Blow', 'Close Combat', 'Sucker Punch', 'Protect'] },
  { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass', moves: ['Grassy Glide', 'Fake Out', 'Wood Hammer', 'U-turn'] },
  { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Fake Out', 'Flare Blitz', 'Parting Shot', 'Snarl'] },
];

const p1TournamentRun = {
  id: 'tournament-completed-1',
  name: 'San Diego Regional Championships 2024',
  date: '2024-02-10',
  location: 'San Diego Convention Center, CA',
  totalPlayers: 580,
  status: 'completed',
  team: alexTeam,
  rounds: [
    {
      round: 1,
      opponent: 'Sarah Chen',
      opponentTeam: [
        { name: 'Flutter Mane' }, { name: 'Iron Hands' }, { name: 'Landorus-T' }, { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
      ],
      result: 'win',
      score: '2-1',
      table: 3
    },
    {
      round: 2,
      opponent: 'Marcus Johnson',
      opponentTeam: [
        { name: 'Garchomp' }, { name: 'Tornadus' }, { name: 'Rillaboom' }, { name: 'Chi-Yu' }, { name: 'Iron Bundle' }, { name: 'Arcanine' }
      ],
      result: 'win',
      score: '2-0',
      table: 1
    },
    {
      round: 3,
      opponent: 'Lars Andersen',
      opponentTeam: [
        { name: 'Calyrex-Ice' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, { name: 'Incineroar' }, { name: 'Tornadus' }, { name: 'Raging Bolt' }
      ],
      result: 'loss',
      score: '1-2',
      table: 2
    },
    {
      round: 4,
      opponent: 'Sophie Müller',
      opponentTeam: [
        { name: 'Flutter Mane' }, { name: 'Iron Bundle' }, { name: 'Landorus-T' }, { name: 'Rillaboom' }, { name: 'Heatran' }, { name: 'Amoonguss' }
      ],
      result: 'win',
      score: '2-0',
      table: 4
    },
    {
      round: 5,
      opponent: 'Pierre Dubois',
      opponentTeam: [
        { name: 'Gholdengo' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, { name: 'Rillaboom' }, { name: 'Incineroar' }, { name: 'Tornadus' }
      ],
      result: 'win',
      score: '2-1',
      table: 1
    },
    {
      round: 6,
      opponent: 'Maria Garcia',
      opponentTeam: [
        { name: 'Iron Hands' }, { name: 'Flutter Mane' }, { name: 'Landorus-T' }, { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
      ],
      result: 'win',
      score: '2-0',
      table: 2
    },
    {
      round: 7,
      opponent: 'Giuseppe Rossi',
      opponentTeam: [
        { name: 'Calyrex-Ice' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, { name: 'Incineroar' }, { name: 'Tornadus' }, { name: 'Raging Bolt' }
      ],
      result: 'win',
      score: '2-1',
      table: 3
    },
    {
      round: 8,
      opponent: 'Yuki Tanaka',
      opponentTeam: [
        { name: 'Garchomp' }, { name: 'Tornadus' }, { name: 'Rillaboom' }, { name: 'Chi-Yu' }, { name: 'Iron Bundle' }, { name: 'Arcanine' }
      ],
      result: 'win',
      score: '2-0',
      table: 1
    }
  ]
};

// Patch Alex Rodriguez's player object
mockPlayerData[0].tournaments = [p1TournamentRun];

const manrajIndex = mockPlayerData.findIndex(p => p.id === 'manraj-sidhu');
if (manrajIndex !== -1) {
  mockPlayerData[manrajIndex] = {
    ...mockPlayerData[manrajIndex],
    tournaments: mockPlayerData[manrajIndex].tournaments || [],
    teams: mockPlayerData[manrajIndex].teams || [],
    matchHistory: mockPlayerData[manrajIndex].matchHistory || [],
    achievements: mockPlayerData[manrajIndex].achievements || [],
    statistics: mockPlayerData[manrajIndex].statistics || {
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: mockPlayerData[manrajIndex].winRate || 0,
      bestFinish: 0,
      tournamentsPlayed: 0,
      championships: mockPlayerData[manrajIndex].championships || 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePlacement: 0,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: mockPlayerData[manrajIndex].preferences || {
      notifications: {
        email: false,
        push: false,
        sms: false,
        tournamentUpdates: false,
        pairingNotifications: false,
        roundStartReminders: false,
        socialInteractions: false,
        achievementUnlocks: false
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: mockPlayerData[manrajIndex].accessibilitySettings || {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    },
    privacySettings: mockPlayerData[manrajIndex].privacySettings || {
      profileVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none'
    }
  };
}

// Helper to shuffle an array
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate Swiss pairings for 8 rounds
function generateSwissPairings(players: Player[], rounds: number): TournamentPairing[] {
  // Limit rounds to 8 maximum
  const maxRounds = Math.min(rounds, 8);
  
  // Track player records and previous opponents
  const records: Record<string, { wins: number; losses: number }> = {};
  const previousOpponents: Record<string, Set<string>> = {};
  players.forEach(p => {
    records[p.id] = { wins: 0, losses: 0 };
    previousOpponents[p.id] = new Set();
  });
  
  let pairings: TournamentPairing[] = [];
  let currentPlayers = players.map(p => p.id);

  // Helper function to get display name with distinction for duplicates
  const getDisplayName = (playerId: string): string => {
    const player = players.find(p => p.id === playerId);
    if (!player) return '';
    
    // Check if there are multiple players with the same name
    const sameNamePlayers = players.filter(p => p.name === player.name);
    if (sameNamePlayers.length > 1) {
      // Add region/country distinction
      return `${player.name} (${player.country})`;
    }
    return player.name;
  };

  for (let round = 1; round <= maxRounds; round++) {
    // Group players by record
    const buckets: Record<string, string[]> = {};
    currentPlayers.forEach(pid => {
      const rec = `${records[pid].wins}-${records[pid].losses}`;
      if (!buckets[rec]) buckets[rec] = [];
      buckets[rec].push(pid);
    });
    
    // Sort buckets by wins descending
    const sortedBuckets = Object.keys(buckets)
      .sort((a, b) => {
        const [aw, al] = a.split('-').map(Number);
        const [bw, bl] = b.split('-').map(Number);
        return bw - aw || al - bl;
      });
    
    // Pair within buckets, avoiding previous opponents
    let roundPairings: TournamentPairing[] = [];
    let used = new Set<string>();
    
    for (let b = 0; b < sortedBuckets.length; b++) {
      let group = buckets[sortedBuckets[b]].filter(pid => !used.has(pid));
      
      // If odd, try to downpair one
      if (group.length % 2 === 1 && b < sortedBuckets.length - 1) {
        const downpair = group.pop();
        if (downpair) buckets[sortedBuckets[b + 1]].push(downpair);
      }
      
      // Shuffle and pair up, avoiding previous opponents
      group = shuffle(group);
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 < group.length) {
          const p1 = group[i];
          const p2 = group[i + 1];
          
          // Check if they've played before
          if (previousOpponents[p1].has(p2)) {
            // Try to find alternative pairing
            let alternativeFound = false;
            for (let j = i + 2; j < group.length; j++) {
              const altP2 = group[j];
              if (!used.has(altP2) && !previousOpponents[p1].has(altP2)) {
                // Swap players
                group[i + 1] = altP2;
                group[j] = p2;
                break;
              }
            }
          }
          
          const finalP1 = group[i];
          const finalP2 = group[i + 1];
          
          used.add(finalP1);
          used.add(finalP2);
          
          // Record this matchup
          previousOpponents[finalP1].add(finalP2);
          previousOpponents[finalP2].add(finalP1);
          
          // Assign result randomly, but allow for some upsets
          let p1Wins = records[finalP1].wins;
          let p2Wins = records[finalP2].wins;
          let winner: string;
          let score: string;
          
          if (Math.random() < 0.5 + 0.1 * (p1Wins - p2Wins)) {
            winner = finalP1;
            score = '2-0';
            records[finalP1].wins++;
            records[finalP2].losses++;
          } else {
            winner = finalP2;
            score = '2-1';
            records[finalP2].wins++;
            records[finalP1].losses++;
          }
          
          roundPairings.push({
            round,
            table: roundPairings.length + 1,
            player1: {
              id: finalP1,
              name: getDisplayName(finalP1),
              record: `${records[finalP1].wins}-${records[finalP1].losses}`
            },
            player2: {
              id: finalP2,
              name: getDisplayName(finalP2),
              record: `${records[finalP2].wins}-${records[finalP2].losses}`
            },
            result: { winner, score }
          });
        }
      }
    }
    
    pairings.push(...roundPairings);
  }
  
  return pairings;
}

const swissPairings = generateSwissPairings(swissPlayers, 8); // Exactly 8 rounds

// Generate proper pairings for Phoenix Regional (600 players = 300 pairings per round)
function generatePhoenixRegionalPairings(): TournamentPairing[] {
  const totalPlayers = 600;
  const pairingsPerRound = totalPlayers / 2; // 300 pairings per round
  const rounds = 8; // Standard Swiss tournament
  const pairings: TournamentPairing[] = [];

  // Create player pool for Phoenix Regional
  const phoenixPlayers = Array.from({ length: totalPlayers }, (_, i) => ({
    id: `phoenix-player-${i + 1}`,
    name: `Player ${i + 1}`,
    record: '0-0',
    team: [
      { name: 'Charizard', item: 'Focus Sash', ability: 'Blaze', teraType: 'Fire' },
      { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
      { name: 'Urshifu', item: 'Choice Band', ability: 'Unseen Fist', teraType: 'Water' },
      { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
      { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Grass' },
      { name: 'Indeedee', item: 'Psychic Seed', ability: 'Psychic Surge', teraType: 'Psychic' }
    ]
  }));

  // Add some known players at specific positions
  phoenixPlayers[0] = {
    id: 'manraj-sidhu',
    name: 'Manraj Sidhu',
    record: '0-0',
    team: [
      { name: 'Charizard', item: 'Focus Sash', ability: 'Blaze', teraType: 'Fire' },
      { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
      { name: 'Urshifu', item: 'Choice Band', ability: 'Unseen Fist', teraType: 'Water' },
      { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
      { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Grass' },
      { name: 'Indeedee', item: 'Psychic Seed', ability: 'Psychic Surge', teraType: 'Psychic' }
    ]
  };

  phoenixPlayers[427] = {
    id: 'david-kim',
    name: 'David Kim',
    record: '0-0',
    team: [
      { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
      { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
      { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
      { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
      { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
      { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
    ]
  };

  // Track player records and previous opponents
  const records: Record<string, { wins: number; losses: number }> = {};
  const previousOpponents: Record<string, Set<string>> = {};
  
  phoenixPlayers.forEach(p => {
    records[p.id] = { wins: 0, losses: 0 };
    previousOpponents[p.id] = new Set();
  });

  for (let round = 1; round <= rounds; round++) {
    // Group players by record
    const buckets: Record<string, string[]> = {};
    phoenixPlayers.forEach(p => {
      const rec = `${records[p.id].wins}-${records[p.id].losses}`;
      if (!buckets[rec]) buckets[rec] = [];
      buckets[rec].push(p.id);
    });
    
    // Sort buckets by wins descending
    const sortedBuckets = Object.keys(buckets)
      .sort((a, b) => {
        const [aw, al] = a.split('-').map(Number);
        const [bw, bl] = b.split('-').map(Number);
        return bw - aw || al - bl;
      });
    
    // Pair within buckets, avoiding previous opponents
    let roundPairings: TournamentPairing[] = [];
    let used = new Set<string>();
    
    for (let b = 0; b < sortedBuckets.length; b++) {
      let group = buckets[sortedBuckets[b]].filter(pid => !used.has(pid));
      
      // If odd, try to downpair one
      if (group.length % 2 === 1 && b < sortedBuckets.length - 1) {
        const downpair = group.pop();
        if (downpair) buckets[sortedBuckets[b + 1]].push(downpair);
      }
      
      // Shuffle and pair up, avoiding previous opponents
      group = shuffle(group);
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 < group.length) {
          const p1 = group[i];
          const p2 = group[i + 1];
          
          // Check if they've played before
          if (previousOpponents[p1].has(p2)) {
            // Try to find alternative pairing
            let alternativeFound = false;
            for (let j = i + 2; j < group.length; j++) {
              const altP2 = group[j];
              if (!used.has(altP2) && !previousOpponents[p1].has(altP2)) {
                // Swap players
                group[i + 1] = altP2;
                group[j] = p2;
                break;
              }
            }
          }
          
          const finalP1 = group[i];
          const finalP2 = group[i + 1];
          
          used.add(finalP1);
          used.add(finalP2);
          
          // Record this matchup
          previousOpponents[finalP1].add(finalP2);
          previousOpponents[finalP2].add(finalP1);
          
          // Get player data
          const player1Data = phoenixPlayers.find(p => p.id === finalP1)!;
          const player2Data = phoenixPlayers.find(p => p.id === finalP2)!;
          
          // Assign result randomly for completed rounds (1-4), null for ongoing rounds (5-8)
          let result = null;
          if (round <= 4) {
            let p1Wins = records[finalP1].wins;
            let p2Wins = records[finalP2].wins;
            let winner: string;
            let score: string;
            
            if (Math.random() < 0.5 + 0.1 * (p1Wins - p2Wins)) {
              winner = finalP1;
              score = '2-0';
              records[finalP1].wins++;
              records[finalP2].losses++;
            } else {
              winner = finalP2;
              score = '2-1';
              records[finalP2].wins++;
              records[finalP1].losses++;
            }
            
            result = { winner, score };
          }
          
          // Update player records for display
          player1Data.record = `${records[finalP1].wins}-${records[finalP1].losses}`;
          player2Data.record = `${records[finalP2].wins}-${records[finalP2].losses}`;
          
          roundPairings.push({
            round,
            table: roundPairings.length + 1,
            player1: {
              id: finalP1,
              name: player1Data.name,
              record: player1Data.record,
              team: player1Data.team
            },
            player2: {
              id: finalP2,
              name: player2Data.name,
              record: player2Data.record,
              team: player2Data.team
            },
            result
          });
        }
      }
    }
    
    // Special handling for Round 3: Ensure Manraj Sidhu vs David Kim at Table 12
    if (round === 3) {
      // Remove any pairings involving Manraj Sidhu or David Kim in this round
      let manrajIndex = roundPairings.findIndex(p => p.player1.id === 'manraj-sidhu' || p.player2.id === 'manraj-sidhu');
      let davidIndex = roundPairings.findIndex(p => p.player1.id === 'david-kim' || p.player2.id === 'david-kim');
      // If both are in the same pairing, just use that
      let manrajPairing = null;
      if (manrajIndex !== -1 && manrajIndex === davidIndex) {
        manrajPairing = roundPairings[manrajIndex];
        // Remove from current position
        roundPairings.splice(manrajIndex, 1);
      } else {
        // Remove both pairings (if different)
        if (manrajIndex !== -1) {
          roundPairings.splice(manrajIndex, 1);
          // If davidIndex was after manrajIndex, it shifts
          if (davidIndex > manrajIndex) davidIndex--;
        }
        if (davidIndex !== -1) {
          roundPairings.splice(davidIndex, 1);
        }
        // Create the correct pairing
        const manraj = phoenixPlayers.find(p => p.id === 'manraj-sidhu');
        const david = phoenixPlayers.find(p => p.id === 'david-kim');
        manrajPairing = {
          round: 3,
          table: 12,
          player1: {
            id: manraj.id,
            name: manraj.name,
            record: manraj.record,
            team: manraj.team
          },
          player2: {
            id: david.id,
            name: david.name,
            record: david.record,
            team: david.team
          },
          result: null
        };
      }
      // Insert at table 12 (index 11)
      roundPairings.splice(11, 0, manrajPairing);
      // Re-number tables
      roundPairings.forEach((p, idx) => { p.table = idx + 1; });
    }
    
    pairings.push(...roundPairings);
  }
  
  return pairings;
}

// Validation function to ensure pairings are correct
function validatePairings(pairings: TournamentPairing[], totalPlayers: number): void {
  const result = validateTournamentPairings(pairings, totalPlayers);
  logPairingValidation(result, `Tournament with ${totalPlayers} players`);
  
  // Check for Manraj vs David at Round 3, Table 12 (for Phoenix Regional)
  if (totalPlayers === 600) {
    const round3Table12 = pairings.find(p => p.round === 3 && p.table === 12);
    if (round3Table12) {
      const hasManraj = round3Table12.player1.id === 'manraj-sidhu' || round3Table12.player2.id === 'manraj-sidhu';
      const hasDavid = round3Table12.player1.id === 'david-kim' || round3Table12.player2.id === 'david-kim';
      
      if (hasManraj && hasDavid) {
        console.log('✅ Manraj Sidhu vs David Kim correctly placed at Round 3, Table 12');
      } else {
        console.warn('⚠️ Round 3, Table 12 does not contain Manraj Sidhu vs David Kim');
      }
    } else {
      console.warn('⚠️ Round 3, Table 12 not found');
    }
  }
}

const phoenixPairings = generatePhoenixRegionalPairings();

// Validate the pairings
validatePairings(phoenixPairings, 600);

// Generate pairings for completed tournaments with proper player counts
function generateCompletedTournamentPairings(tournamentName: string, totalPlayers: number): TournamentPairing[] {
  const pairingsPerRound = totalPlayers / 2;
  const rounds = 8; // Standard Swiss tournament
  const pairings: TournamentPairing[] = [];

  // Create player pool
  const players = Array.from({ length: totalPlayers }, (_, i) => ({
    id: `${tournamentName.toLowerCase().replace(/\s+/g, '-')}-player-${i + 1}`,
    name: `Player ${i + 1}`,
    record: '0-0',
    team: [
      { name: 'Charizard', item: 'Focus Sash', ability: 'Blaze', teraType: 'Fire' },
      { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
      { name: 'Urshifu', item: 'Choice Band', ability: 'Unseen Fist', teraType: 'Water' },
      { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
      { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Grass' },
      { name: 'Indeedee', item: 'Psychic Seed', ability: 'Psychic Surge', teraType: 'Psychic' }
    ]
  }));

  // Track player records and previous opponents
  const records: Record<string, { wins: number; losses: number }> = {};
  const previousOpponents: Record<string, Set<string>> = {};
  
  players.forEach(p => {
    records[p.id] = { wins: 0, losses: 0 };
    previousOpponents[p.id] = new Set();
  });

  for (let round = 1; round <= rounds; round++) {
    // Group players by record
    const buckets: Record<string, string[]> = {};
    players.forEach(p => {
      const rec = `${records[p.id].wins}-${records[p.id].losses}`;
      if (!buckets[rec]) buckets[rec] = [];
      buckets[rec].push(p.id);
    });
    
    // Sort buckets by wins descending
    const sortedBuckets = Object.keys(buckets)
      .sort((a, b) => {
        const [aw, al] = a.split('-').map(Number);
        const [bw, bl] = b.split('-').map(Number);
        return bw - aw || al - bl;
      });
    
    // Pair within buckets, avoiding previous opponents
    let roundPairings: TournamentPairing[] = [];
    let used = new Set<string>();
    
    for (let b = 0; b < sortedBuckets.length; b++) {
      let group = buckets[sortedBuckets[b]].filter(pid => !used.has(pid));
      
      // If odd, try to downpair one
      if (group.length % 2 === 1 && b < sortedBuckets.length - 1) {
        const downpair = group.pop();
        if (downpair) buckets[sortedBuckets[b + 1]].push(downpair);
      }
      
      // Shuffle and pair up, avoiding previous opponents
      group = shuffle(group);
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 < group.length) {
          const p1 = group[i];
          const p2 = group[i + 1];
          
          // Check if they've played before
          if (previousOpponents[p1].has(p2)) {
            // Try to find alternative pairing
            for (let j = i + 2; j < group.length; j++) {
              const altP2 = group[j];
              if (!used.has(altP2) && !previousOpponents[p1].has(altP2)) {
                // Swap players
                group[i + 1] = altP2;
                group[j] = p2;
                break;
              }
            }
          }
          
          const finalP1 = group[i];
          const finalP2 = group[i + 1];
          
          used.add(finalP1);
          used.add(finalP2);
          
          // Record this matchup
          previousOpponents[finalP1].add(finalP2);
          previousOpponents[finalP2].add(finalP1);
          
          // Get player data
          const player1Data = players.find(p => p.id === finalP1)!;
          const player2Data = players.find(p => p.id === finalP2)!;
          
          // Assign result randomly for completed tournaments
          let p1Wins = records[finalP1].wins;
          let p2Wins = records[finalP2].wins;
          let winner: string;
          let score: string;
          
          if (Math.random() < 0.5 + 0.1 * (p1Wins - p2Wins)) {
            winner = finalP1;
            score = '2-0';
            records[finalP1].wins++;
            records[finalP2].losses++;
          } else {
            winner = finalP2;
            score = '2-1';
            records[finalP2].wins++;
            records[finalP1].losses++;
          }
          
          // Update player records for display
          player1Data.record = `${records[finalP1].wins}-${records[finalP1].losses}`;
          player2Data.record = `${records[finalP2].wins}-${records[finalP2].losses}`;
          
          roundPairings.push({
            round,
            table: roundPairings.length + 1,
            player1: {
              id: finalP1,
              name: player1Data.name,
              record: player1Data.record,
              team: player1Data.team
            },
            player2: {
              id: finalP2,
              name: player2Data.name,
              record: player2Data.record,
              team: player2Data.team
            },
            result: { winner, score }
          });
        }
      }
    }
    
    pairings.push(...roundPairings);
  }
  
  return pairings;
}

// Generate pairings for each completed tournament
const sanDiegoPairings = generateCompletedTournamentPairings('San Diego Regional Championships 2024', 580);
const orlandoPairings = generateCompletedTournamentPairings('Orlando Regional Championships 2024', 520);
const vancouverPairings = generateCompletedTournamentPairings('Vancouver Regional Championships 2024', 450);

// Validate completed tournament pairings
validatePairings(sanDiegoPairings, 580);
validatePairings(orlandoPairings, 520);
validatePairings(vancouverPairings, 450);

export const mockTournaments: Tournament[] = [
  // Completed Tournaments
  {
    id: 'tournament-completed-1',
    name: 'San Diego Regional Championships 2024',
    date: '2024-02-10',
    location: 'San Diego Convention Center, CA',
    totalPlayers: 580,
    status: 'completed',
    registrationStart: '2024-01-10T10:00:00Z',
    registrationEnd: '2024-02-05T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 600,
    currentRegistrations: 580,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: sanDiegoPairings
  },
  {
    id: 'tournament-completed-2',
    name: 'Orlando Regional Championships 2024',
    date: '2024-01-20',
    location: 'Orange County Convention Center, FL',
    totalPlayers: 520,
    status: 'completed',
    registrationStart: '2024-12-20T10:00:00Z',
    registrationEnd: '2024-01-15T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 550,
    currentRegistrations: 520,
    waitlistEnabled: true,
    waitlistCapacity: 80,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: orlandoPairings
  },
  {
    id: 'tournament-completed-3',
    name: 'Vancouver Regional Championships 2024',
    date: '2024-01-05',
    location: 'Vancouver Convention Centre, BC',
    totalPlayers: 450,
    status: 'completed',
    registrationStart: '2023-12-05T10:00:00Z',
    registrationEnd: '2023-12-30T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 500,
    currentRegistrations: 450,
    waitlistEnabled: true,
    waitlistCapacity: 50,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: vancouverPairings
  },
  // Ongoing Tournaments
  {
    id: 'tournament-1',
    name: 'Phoenix Regional Championships',
    date: '2024-03-15',
    location: 'Phoenix Convention Center, AZ',
    totalPlayers: 600,
    status: 'ongoing',
    registrationStart: '2024-02-15T10:00:00Z',
    registrationEnd: '2024-03-10T23:59:59Z',
    isRegistered: true,
    requiresLottery: true,
    registrationFee: 25,
    maxCapacity: 700,
    currentRegistrations: 650,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 50,
    registrationType: 'first-come-first-served',
    pairings: phoenixPairings
  },
  {
    id: 'tournament-2',
    name: 'Los Angeles Regional Championships',
    date: '2024-04-20',
    location: 'Los Angeles Convention Center, CA',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-03-20T10:00:00Z',
    registrationEnd: '2024-04-15T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 800,
    currentRegistrations: 450, // Medium capacity - normal registration
    waitlistEnabled: true,
    waitlistCapacity: 150,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-6',
    name: 'London Regional Championships',
    date: '2024-04-05',
    location: 'ExCeL London, UK',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-03-05T10:00:00Z',
    registrationEnd: '2024-03-30T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 600,
    currentRegistrations: 380,
    waitlistEnabled: true,
    waitlistCapacity: 120,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-9',
    name: 'Tokyo Regional Championships',
    date: '2024-04-12',
    location: 'Tokyo Big Sight, Japan',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-03-12T10:00:00Z',
    registrationEnd: '2024-04-07T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 40,
    maxCapacity: 800,
    currentRegistrations: 720,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 45,
    registrationType: 'lottery'
  },
  // Upcoming Tournaments
  {
    id: 'tournament-3',
    name: 'New York Regional Championships',
    date: '2024-05-10',
    location: 'Javits Center, NY',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-04-10T10:00:00Z',
    registrationEnd: '2024-05-05T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 35,
    maxCapacity: 600,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-4',
    name: 'World Championships 2024',
    date: '2024-08-15',
    location: 'Hawaii Convention Center, HI',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-07-01T10:00:00Z',
    registrationEnd: '2024-07-31T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 75,
    maxCapacity: 1000,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 300,
    currentWaitlist: 0,
    registrationType: 'lottery'
  },
  {
    id: 'tournament-5',
    name: 'Seattle Regional Championships',
    date: '2024-06-01',
    location: 'Washington State Convention Center, WA',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-05-01T10:00:00Z',
    registrationEnd: '2024-05-25T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 500,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-7',
    name: 'Berlin Regional Championships',
    date: '2024-05-18',
    location: 'Messe Berlin, Germany',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-04-18T10:00:00Z',
    registrationEnd: '2024-05-13T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 550,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-8',
    name: 'Paris Regional Championships',
    date: '2024-06-22',
    location: 'Paris Expo Porte de Versailles, France',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-05-22T10:00:00Z',
    registrationEnd: '2024-06-17T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 500,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 80,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-10',
    name: 'Seoul Regional Championships',
    date: '2024-05-25',
    location: 'COEX Convention Center, South Korea',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-04-25T10:00:00Z',
    registrationEnd: '2024-05-20T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 35,
    maxCapacity: 600,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 150,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  },
  {
    id: 'tournament-11',
    name: 'Taipei Regional Championships',
    date: '2024-06-08',
    location: 'Taipei World Trade Center, Taiwan',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-05-08T10:00:00Z',
    registrationEnd: '2024-06-03T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 450,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  }
];

// Enhance the first 10 tables of the completed tournament with both teams for each player in round 1
const sampleTeams = [
  [
    { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire', moves: ['Heat Wave', 'Solar Beam', 'Protect', 'Air Slash'] },
    { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel', moves: ['Make It Rain', 'Shadow Ball', 'Thunderbolt', 'Protect'] },
    { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
    { name: 'Landorus-Therian', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Flying', moves: ['Earthquake', 'U-turn', 'Rock Slide', 'Knock Off'] },
    { name: 'Flutter Mane', item: 'Focus Sash', ability: 'Protosynthesis', teraType: 'Fairy', moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Protect'] },
    { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Electric', moves: ['Wild Charge', 'Drain Punch', 'Fake Out', 'Volt Switch'] },
  ],
  [
    { name: 'Tornadus', item: 'Covert Cloak', ability: 'Prankster', teraType: 'Flying', moves: ['Tailwind', 'Bleakwind Storm', 'Taunt', 'Protect'] },
    { name: 'Urshifu-Rapid-Strike', item: 'Choice Band', ability: 'Unseen Fist', teraType: 'Water', moves: ['Surging Strikes', 'Close Combat', 'Aqua Jet', 'U-turn'] },
    { name: 'Rillaboom', item: 'Miracle Seed', ability: 'Grassy Surge', teraType: 'Grass', moves: ['Grassy Glide', 'Fake Out', 'Wood Hammer', 'Protect'] },
    { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Grass', moves: ['Heat Wave', 'Earth Power', 'Protect', 'Flash Cannon'] },
    { name: 'Chien-Pao', item: 'Focus Sash', ability: 'Sword of Ruin', teraType: 'Ice', moves: ['Icicle Crash', 'Sucker Punch', 'Sacred Sword', 'Protect'] },
    { name: 'Dragonite', item: 'Lum Berry', ability: 'Multiscale', teraType: 'Normal', moves: ['Extreme Speed', 'Dragon Dance', 'Earthquake', 'Protect'] },
  ],
  [
    { name: 'Garchomp', item: 'Yache Berry', ability: 'Rough Skin', teraType: 'Ground', moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Protect'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
    { name: 'Gastrodon', item: 'Leftovers', ability: 'Storm Drain', teraType: 'Water', moves: ['Muddy Water', 'Earth Power', 'Recover', 'Protect'] },
    { name: 'Tornadus', item: 'Mental Herb', ability: 'Prankster', teraType: 'Flying', moves: ['Tailwind', 'Taunt', 'Bleakwind Storm', 'Protect'] },
    { name: 'Iron Bundle', item: 'Booster Energy', ability: 'Quark Drive', teraType: 'Ice', moves: ['Freeze-Dry', 'Icy Wind', 'Hydro Pump', 'Protect'] },
    { name: 'Kingambit', item: 'Black Glasses', ability: 'Defiant', teraType: 'Dark', moves: ['Kowtow Cleave', 'Sucker Punch', 'Iron Head', 'Protect'] },
  ],
  [
    { name: 'Palafin', item: 'Choice Band', ability: 'Zero to Hero', teraType: 'Water', moves: ['Jet Punch', 'Wave Crash', 'Ice Punch', 'Flip Turn'] },
    { name: 'Amoonguss', item: 'Rocky Helmet', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
    { name: 'Ting-Lu', item: 'Leftovers', ability: 'Vessel of Ruin', teraType: 'Poison', moves: ['Ruination', 'Stomping Tantrum', 'Heavy Slam', 'Protect'] },
    { name: 'Flutter Mane', item: 'Booster Energy', ability: 'Protosynthesis', teraType: 'Fairy', moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Protect'] },
    { name: 'Iron Hands', item: 'Sitrus Berry', ability: 'Quark Drive', teraType: 'Electric', moves: ['Wild Charge', 'Drain Punch', 'Fake Out', 'Volt Switch'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
  ],
  [
    { name: 'Roaring Moon', item: 'Booster Energy', ability: 'Protosynthesis', teraType: 'Flying', moves: ['Acrobatics', 'Throat Chop', 'Dragon Dance', 'Protect'] },
    { name: 'Gholdengo', item: 'Leftovers', ability: 'Good as Gold', teraType: 'Steel', moves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'] },
    { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
    { name: 'Iron Bundle', item: 'Focus Sash', ability: 'Quark Drive', teraType: 'Ice', moves: ['Freeze-Dry', 'Icy Wind', 'Hydro Pump', 'Protect'] },
    { name: 'Ting-Lu', item: 'Leftovers', ability: 'Vessel of Ruin', teraType: 'Poison', moves: ['Ruination', 'Stomping Tantrum', 'Heavy Slam', 'Protect'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
  ],
  [
    { name: 'Iron Valiant', item: 'Booster Energy', ability: 'Quark Drive', teraType: 'Fairy', moves: ['Close Combat', 'Moonblast', 'Knock Off', 'Protect'] },
    { name: 'Glimmora', item: 'Focus Sash', ability: 'Toxic Debris', teraType: 'Rock', moves: ['Power Gem', 'Sludge Bomb', 'Spiky Shield', 'Earth Power'] },
    { name: 'Tornadus', item: 'Covert Cloak', ability: 'Prankster', teraType: 'Flying', moves: ['Tailwind', 'Bleakwind Storm', 'Taunt', 'Protect'] },
    { name: 'Landorus-Therian', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Flying', moves: ['Earthquake', 'U-turn', 'Rock Slide', 'Knock Off'] },
    { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Grass', moves: ['Heat Wave', 'Earth Power', 'Protect', 'Flash Cannon'] },
    { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
  ],
  [
    { name: 'Tornadus', item: 'Mental Herb', ability: 'Prankster', teraType: 'Flying', moves: ['Tailwind', 'Taunt', 'Bleakwind Storm', 'Protect'] },
    { name: 'Urshifu-Single-Strike', item: 'Choice Band', ability: 'Unseen Fist', teraType: 'Dark', moves: ['Wicked Blow', 'Close Combat', 'Sucker Punch', 'U-turn'] },
    { name: 'Rillaboom', item: 'Miracle Seed', ability: 'Grassy Surge', teraType: 'Grass', moves: ['Grassy Glide', 'Fake Out', 'Wood Hammer', 'Protect'] },
    { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Grass', moves: ['Heat Wave', 'Earth Power', 'Protect', 'Flash Cannon'] },
    { name: 'Chien-Pao', item: 'Focus Sash', ability: 'Sword of Ruin', teraType: 'Ice', moves: ['Icicle Crash', 'Sucker Punch', 'Sacred Sword', 'Protect'] },
    { name: 'Dragonite', item: 'Lum Berry', ability: 'Multiscale', teraType: 'Normal', moves: ['Extreme Speed', 'Dragon Dance', 'Earthquake', 'Protect'] },
  ],
  [
    { name: 'Garchomp', item: 'Yache Berry', ability: 'Rough Skin', teraType: 'Ground', moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Protect'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
    { name: 'Gastrodon', item: 'Leftovers', ability: 'Storm Drain', teraType: 'Water', moves: ['Muddy Water', 'Earth Power', 'Recover', 'Protect'] },
    { name: 'Tornadus', item: 'Mental Herb', ability: 'Prankster', teraType: 'Flying', moves: ['Tailwind', 'Taunt', 'Bleakwind Storm', 'Protect'] },
    { name: 'Iron Bundle', item: 'Booster Energy', ability: 'Quark Drive', teraType: 'Ice', moves: ['Freeze-Dry', 'Icy Wind', 'Hydro Pump', 'Protect'] },
    { name: 'Kingambit', item: 'Black Glasses', ability: 'Defiant', teraType: 'Dark', moves: ['Kowtow Cleave', 'Sucker Punch', 'Iron Head', 'Protect'] },
  ],
  [
    { name: 'Palafin', item: 'Choice Band', ability: 'Zero to Hero', teraType: 'Water', moves: ['Jet Punch', 'Wave Crash', 'Ice Punch', 'Flip Turn'] },
    { name: 'Amoonguss', item: 'Rocky Helmet', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
    { name: 'Ting-Lu', item: 'Leftovers', ability: 'Vessel of Ruin', teraType: 'Poison', moves: ['Ruination', 'Stomping Tantrum', 'Heavy Slam', 'Protect'] },
    { name: 'Flutter Mane', item: 'Booster Energy', ability: 'Protosynthesis', teraType: 'Fairy', moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Protect'] },
    { name: 'Iron Hands', item: 'Sitrus Berry', ability: 'Quark Drive', teraType: 'Electric', moves: ['Wild Charge', 'Drain Punch', 'Fake Out', 'Volt Switch'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
  ],
  [
    { name: 'Roaring Moon', item: 'Booster Energy', ability: 'Protosynthesis', teraType: 'Flying', moves: ['Acrobatics', 'Throat Chop', 'Dragon Dance', 'Protect'] },
    { name: 'Gholdengo', item: 'Leftovers', ability: 'Good as Gold', teraType: 'Steel', moves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'] },
    { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
    { name: 'Iron Bundle', item: 'Focus Sash', ability: 'Quark Drive', teraType: 'Ice', moves: ['Freeze-Dry', 'Icy Wind', 'Hydro Pump', 'Protect'] },
    { name: 'Ting-Lu', item: 'Leftovers', ability: 'Vessel of Ruin', teraType: 'Poison', moves: ['Ruination', 'Stomping Tantrum', 'Heavy Slam', 'Protect'] },
    { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
  ],
];

// Find the completed tournament
const completedTournament = mockTournaments.find(t => t.id === 'tournament-completed-1');
if (completedTournament && completedTournament.pairings && completedTournament.pairings.length > 0) {
  // For round 1, first 10 tables, assign both teams
  for (let i = 0; i < 10; i++) {
    const pairing = completedTournament.pairings.find(p => p.round === 1 && p.table === i + 1);
    if (pairing) {
      pairing.player1.team = sampleTeams[i % sampleTeams.length];
      pairing.player2.team = sampleTeams[(i + 1) % sampleTeams.length];
    }
  }
}

// Add Sarah Kim with a full tournament run
const sarahKim: Player = {
  id: 'p1001',
  name: 'Sarah Kim',
      playerId: '30303030',
  region: 'Europe',
  division: 'master',
  championships: 1,
  winRate: 74,
  rating: 1920,
  isVerified: true,
  achievements: ['London Regional Champion 2024', 'Top 16 Worlds 2023'],
  tournaments: [
    {
      id: 'tournament-london-2024',
      name: 'London Regional Championships 2024',
      date: '2024-03-10',
      location: 'ExCeL London, UK',
      placement: 1,
      totalPlayers: 512,
      wins: 8,
      losses: 0,
      resistance: 72.5,
      team: [
        { name: 'Flutter Mane', item: 'Focus Sash', ability: 'Protosynthesis', teraType: 'Fairy', moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Protect'] },
        { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Electric', moves: ['Wild Charge', 'Drain Punch', 'Fake Out', 'Volt Switch'] },
        { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire', moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'] },
        { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water', moves: ['Spore', 'Pollen Puff', 'Rage Powder', 'Protect'] },
        { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel', moves: ['Make It Rain', 'Shadow Ball', 'Thunderbolt', 'Protect'] },
        { name: 'Landorus-Therian', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Flying', moves: ['Earthquake', 'U-turn', 'Rock Slide', 'Knock Off'] },
      ],
      format: 'VGC 2024',
      status: 'completed',
      maxCapacity: 512,
      currentRegistrations: 512,
      waitlistEnabled: false,
      waitlistCapacity: 0,
      currentWaitlist: 0,
      registrationType: 'first-come-first-served',
      tournamentType: 'swiss',
      structure: {
        totalRounds: 8,
        currentRound: 8,
        playersPerTable: 2,
        timePerRound: 50,
        breakTime: 15
      },
      rounds: [
        {
          round: 1,
          opponent: 'Pierre Dubois',
          opponentTeam: [
            { name: 'Garchomp' }, { name: 'Arcanine' }, { name: 'Gastrodon' }, { name: 'Tornadus' }, { name: 'Iron Bundle' }, { name: 'Kingambit' }
          ],
          result: 'win',
          score: '2-0',
          table: 1
        },
        {
          round: 2,
          opponent: 'Sophie Müller',
          opponentTeam: [
            { name: 'Tornadus' }, { name: 'Urshifu-Rapid-Strike' }, { name: 'Rillaboom' }, { name: 'Heatran' }, { name: 'Chien-Pao' }, { name: 'Dragonite' }
          ],
          result: 'win',
          score: '2-1',
          table: 2
        },
        {
          round: 3,
          opponent: 'Giuseppe Rossi',
          opponentTeam: [
            { name: 'Palafin' }, { name: 'Amoonguss' }, { name: 'Ting-Lu' }, { name: 'Flutter Mane' }, { name: 'Iron Hands' }, { name: 'Arcanine' }
          ],
          result: 'win',
          score: '2-0',
          table: 3
        },
        {
          round: 4,
          opponent: 'Lars Andersen',
          opponentTeam: [
            { name: 'Roaring Moon' }, { name: 'Gholdengo' }, { name: 'Amoonguss' }, { name: 'Iron Bundle' }, { name: 'Ting-Lu' }, { name: 'Arcanine' }
          ],
          result: 'win',
          score: '2-1',
          table: 1
        },
        {
          round: 5,
          opponent: 'Maria Garcia',
          opponentTeam: [
            { name: 'Iron Valiant' }, { name: 'Glimmora' }, { name: 'Tornadus' }, { name: 'Landorus-Therian' }, { name: 'Heatran' }, { name: 'Amoonguss' }
          ],
          result: 'win',
          score: '2-0',
          table: 2
        },
        {
          round: 6,
          opponent: 'Pierre Dubois',
          opponentTeam: [
            { name: 'Garchomp' }, { name: 'Arcanine' }, { name: 'Gastrodon' }, { name: 'Tornadus' }, { name: 'Iron Bundle' }, { name: 'Kingambit' }
          ],
          result: 'win',
          score: '2-1',
          table: 1
        },
        {
          round: 7,
          opponent: 'Sophie Müller',
          opponentTeam: [
            { name: 'Tornadus' }, { name: 'Urshifu-Single-Strike' }, { name: 'Rillaboom' }, { name: 'Heatran' }, { name: 'Chien-Pao' }, { name: 'Dragonite' }
          ],
          result: 'win',
          score: '2-0',
          table: 2
        },
        {
          round: 8,
          opponent: 'Lars Andersen',
          opponentTeam: [
            { name: 'Roaring Moon' }, { name: 'Gholdengo' }, { name: 'Amoonguss' }, { name: 'Iron Bundle' }, { name: 'Ting-Lu' }, { name: 'Arcanine' }
          ],
          result: 'win',
          score: '2-1',
          table: 1
        }
      ]
    }
  ],
  teams: [],
  matchHistory: [],
  statistics: {
    totalMatches: 8,
    totalWins: 8,
    totalLosses: 0,
    totalDraws: 0,
    winRate: 100,
    bestFinish: 1,
    tournamentsPlayed: 1,
    championships: 1,
    currentStreak: 8,
    longestStreak: 8,
    averagePlacement: 1,
    mostUsedPokemon: [],
    mostUsedItems: [],
    mostUsedMoves: [],
    seasonalStats: []
  },
  preferences: {
    notifications: {
      email: false,
      push: false,
      sms: false,
      tournamentUpdates: false,
      pairingNotifications: false,
      roundStartReminders: false,
      socialInteractions: false,
      achievementUnlocks: false
    },
    privacy: {
      profileVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none'
    },
    display: {
      theme: 'light',
      compactMode: false,
      showAdvancedStats: false,
      defaultView: 'dashboard'
    },
    accessibility: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    },
    language: 'en',
    timezone: 'UTC'
  },
  accessibilitySettings: {
    screenReader: false,
    highContrast: false,
    dyslexiaFriendly: false,
    fontSize: 'medium',
    reducedMotion: false,
    keyboardNavigation: false,
    colorBlindSupport: false
  },
  privacySettings: {
    profileVisibility: 'public',
    allowTeamReports: true,
    showTournamentHistory: true,
    allowQRCodeGeneration: true,
    showOnlineStatus: true,
    dataSharing: 'none'
  }
};

// Combine only the comprehensive players for search
export const mockPlayers: Player[] = [
  sarahKim,
  ...mockPlayerData.slice(0, 10).map(player => ({
    ...player,
    tournaments: player.tournaments || [],
    teams: player.teams || [],
    matchHistory: player.matchHistory || [],
    achievements: player.achievements || [],
    statistics: player.statistics || {
      totalMatches: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: player.winRate || 0,
      bestFinish: 0,
      tournamentsPlayed: 0,
      championships: player.championships || 0,
      currentStreak: 0,
      longestStreak: 0,
      averagePlacement: 0,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: player.preferences || {
      notifications: {
        email: false,
        push: false,
        sms: false,
        tournamentUpdates: false,
        pairingNotifications: false,
        roundStartReminders: false,
        socialInteractions: false,
        achievementUnlocks: false
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: player.accessibilitySettings || {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    },
    privacySettings: player.privacySettings || {
      profileVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none'
    }
  }))
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Official VGC 2024 Meta Analysis - Regulation H',
    content: 'As the official meta analyst for the Pokémon Company, I\'m excited to share insights into the current VGC 2024 Regulation H meta...',
    author: {
      id: '1',
      name: 'Alex Rodriguez',
      avatar: 'AR',
      isVerified: true,
      achievements: ['Worlds Champion 2023', 'Official Meta Analyst', 'Content Creator'],
      isPokemonCompanyApproved: true,
      approvalLevel: 'official_analyst',
      specialBadges: ['Official Meta Analyst', 'Worlds Champion 2023', 'Content Creator']
    },
    category: 'pokemon-company-content',
    tags: ['Official', 'Meta Analysis', 'Regulation H', 'Pokémon Company', 'VGC 2024'],
    status: 'approved',
    createdAt: '2024-03-15T10:00:00Z',
    publishedAt: '2024-03-15T10:00:00Z',
    readTime: 15,
    likes: 245,
    comments: 23,
    isLiked: false,
    isBookmarked: false,
    summary: 'Official meta analysis for VGC 2024 Regulation H from the Pokémon Company\'s official analyst.',
    isOfficialContent: true,
    requiresApproval: false,
    approvalStatus: 'approved',
    approvedBy: 'pokemon-company',
    approvedAt: '2024-03-15T09:30:00Z'
  },
  {
    id: '2',
    title: 'Building Teams for Success: A Comprehensive Guide',
    content: 'Team building is one of the most crucial aspects of competitive Pokémon...',
    author: {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'SC',
      isVerified: true,
      achievements: ['Regional Champion', 'Meta Expert', 'Content Creator'],
      isPokemonCompanyApproved: true,
      approvalLevel: 'content_creator',
      specialBadges: ['Official Content Creator', 'Regional Champion', 'Meta Expert']
    },
    category: 'team-building',
    tags: ['Team Building', 'Strategy', 'Beginner Guide', 'Official Content'],
    status: 'approved',
    createdAt: '2024-03-14T14:00:00Z',
    publishedAt: '2024-03-14T14:00:00Z',
    readTime: 12,
    likes: 189,
    comments: 15,
    isLiked: false,
    isBookmarked: false,
    summary: 'A comprehensive guide to team building from an official Pokémon Company content creator.',
    isOfficialContent: true,
    requiresApproval: false,
    approvalStatus: 'approved',
    approvedBy: 'pokemon-company',
    approvedAt: '2024-03-14T13:30:00Z'
  },
  {
    id: '3',
    title: 'Community Spotlight: Rising Stars in VGC',
    content: 'The VGC community continues to grow with amazing new talent emerging...',
    author: {
      id: '3',
      name: 'Marcus Johnson',
      avatar: 'MJ',
      isVerified: true,
      achievements: ['Community Leader', 'Tournament Organizer'],
      isPokemonCompanyApproved: true,
      approvalLevel: 'brand_ambassador',
      specialBadges: ['Brand Ambassador', 'Community Leader', 'Tournament Organizer']
    },
    category: 'tournament-report',
    tags: ['Community', 'Rising Stars', 'Spotlight', 'Official Content'],
    status: 'approved',
    createdAt: '2024-03-13T16:00:00Z',
    publishedAt: '2024-03-13T16:00:00Z',
    readTime: 8,
    likes: 156,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    summary: 'Spotlight on rising stars in the VGC community from our official brand ambassador.',
    isOfficialContent: true,
    requiresApproval: false,
    approvalStatus: 'approved',
    approvedBy: 'pokemon-company',
    approvedAt: '2024-03-13T15:30:00Z'
  }
];

export const mockPlayerStats = {
  totalTournaments: 12,
  winRate: 0,
  bestFinish: '-',
  seasonWins: 0,
  seasonLosses: 0,
  resistance: 0,
  opponentsBeat: 0,
  monthlyGames: 0
};

// Enrich the first 50 players with full profile data
mockPlayers.slice(0, 50).forEach((player, idx) => {
  // Add 2 tournaments per player
  player.tournaments = [
    {
      id: `tournament-completed-${idx+1}`,
      name: `Regional Championship ${2023 + (idx % 2)}`,
      date: `202${3 + (idx % 2)}-0${(idx % 9) + 1}-10`,
      location: ['San Diego', 'London', 'Tokyo', 'Paris', 'New York'][idx % 5],
      totalPlayers: 512,
      status: 'completed',
      team: [
        { name: 'Charizard' }, { name: 'Gholdengo' }, { name: 'Urshifu' }, { name: 'Rillaboom' }, { name: 'Amoonguss' }, { name: 'Indeedee' }
      ],
      rounds: [
        { 
          round: 1, 
          opponent: 'Opponent A', 
          opponentTeam: [
            { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
            { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
            { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
            { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
            { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
            { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
          ], 
          result: 'win', 
          score: '2-0', 
          table: 1 
        },
        { 
          round: 2, 
          opponent: 'Opponent B', 
          opponentTeam: [
            { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
            { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
            { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
            { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
            { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
            { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
          ], 
          result: 'loss', 
          score: '1-2', 
          table: 2 
        },
        { 
          round: 3, 
          opponent: 'Opponent C', 
          opponentTeam: [
            { name: 'Calyrex-Ice', item: 'Weakness Policy', ability: 'As One', teraType: 'Ice' },
            { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
            { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
            { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' },
            { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
            { name: 'Raging Bolt', item: 'Assault Vest', ability: 'Protosynthesis', teraType: 'Electric' }
          ], 
          result: 'win', 
          score: '2-1', 
          table: 3 
        }
      ]
    },
    {
      id: `tournament-completed-alt-${idx+1}`,
      name: `International Challenge ${2022 + (idx % 3)}`,
      date: `202${2 + (idx % 3)}-0${(idx % 9) + 1}-20`,
      location: ['Berlin', 'Sydney', 'Toronto', 'Madrid', 'Los Angeles'][idx % 5],
      totalPlayers: 256,
      status: 'completed',
      team: [
        { name: 'Miraidon' }, { name: 'Flutter Mane' }, { name: 'Annihilape' }, { name: 'Torkoal' }, { name: 'Dondozo' }, { name: 'Tatsugiri' }
      ],
      rounds: [
        { 
          round: 1, 
          opponent: 'Opponent X', 
          opponentTeam: [
            { name: 'Garchomp', item: 'Choice Scarf', ability: 'Rough Skin', teraType: 'Ground' },
            { name: 'Tornadus', item: 'Choice Scarf', ability: 'Prankster', teraType: 'Flying' },
            { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
            { name: 'Chi-Yu', item: 'Choice Specs', ability: 'Beads of Ruin', teraType: 'Fire' },
            { name: 'Iron Bundle', item: 'Focus Sash', ability: 'Quark Drive', teraType: 'Ice' },
            { name: 'Arcanine', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
          ], 
          result: 'win', 
          score: '2-1', 
          table: 1 
        },
        { 
          round: 2, 
          opponent: 'Opponent Y', 
          opponentTeam: [
            { name: 'Flutter Mane', item: 'Choice Specs', ability: 'Protosynthesis', teraType: 'Fairy' },
            { name: 'Iron Hands', item: 'Assault Vest', ability: 'Quark Drive', teraType: 'Fighting' },
            { name: 'Landorus-T', item: 'Choice Scarf', ability: 'Intimidate', teraType: 'Ground' },
            { name: 'Heatran', item: 'Leftovers', ability: 'Flash Fire', teraType: 'Fire' },
            { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
            { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' }
          ], 
          result: 'win', 
          score: '2-0', 
          table: 2 
        },
        { 
          round: 3, 
          opponent: 'Opponent Z', 
          opponentTeam: [
            { name: 'Charizard', item: 'Life Orb', ability: 'Solar Power', teraType: 'Fire' },
            { name: 'Gholdengo', item: 'Choice Specs', ability: 'Good as Gold', teraType: 'Steel' },
            { name: 'Urshifu', item: 'Focus Sash', ability: 'Unseen Fist', teraType: 'Dark' },
            { name: 'Rillaboom', item: 'Assault Vest', ability: 'Grassy Surge', teraType: 'Grass' },
            { name: 'Amoonguss', item: 'Sitrus Berry', ability: 'Regenerator', teraType: 'Water' },
            { name: 'Incineroar', item: 'Safety Goggles', ability: 'Intimidate', teraType: 'Fire' }
          ], 
          result: 'loss', 
          score: '1-2', 
          table: 3 
        }
      ]
    }
  ];
  // Add achievements
  player.achievements = [
    `Top 8 at ${player.tournaments[0].name}`,
    `Qualified for ${player.tournaments[1].name}`,
    `Reached 1700+ rating in ${player.tournaments[0].date}`
  ];
  // Add statistics
  player.statistics = {
    totalMatches: 30 + idx,
    totalWins: 20 + (idx % 10),
    totalLosses: 10 + (idx % 5),
    totalDraws: idx % 2,
    winRate: Math.round((20 + (idx % 10)) / (30 + idx) * 100),
    bestFinish: idx % 4 === 0 ? 1 : (idx % 8) + 2,
    tournamentsPlayed: 2 + (idx % 3),
    championships: player.championships || 0,
    currentStreak: idx % 5,
    longestStreak: 3 + (idx % 4),
    averagePlacement: 8 + (idx % 10),
    mostUsedPokemon: ['Charizard', 'Gholdengo', 'Urshifu'],
    mostUsedItems: ['Life Orb', 'Choice Specs'],
    mostUsedMoves: ['Heat Wave', 'Protect', 'Fake Out'],
    seasonalStats: []
  };
  // Set privacy settings
  player.privacySettings = {
    profileVisibility: 'public',
    allowTeamReports: true,
    showTournamentHistory: true,
    allowQRCodeGeneration: true,
    showOnlineStatus: true,
    dataSharing: 'none'
  };
});

// Mock user session (for demo, usually comes from auth)
export const mockUserSession: UserSession = {
  userId: '12345678',
  email: 'player@example.com',
  division: 'master',
  isAdmin: false,
  isProfessor: false,
  isPokemonCompanyOfficial: false,
  isGuardian: false,
  permissions: ['read', 'write'],
  dateOfBirth: '1995-06-15',
  name: 'Alex Rodriguez'
};

// Top 5 Completed Tournament Players for League Table Profile Mockup
export const top5CompletedPlayers: Player[] = [
  {
    id: 'vikram-kumar',
    name: 'Vikram Kumar',
    playerId: '10000001',
    region: 'Asia-Pacific',
    country: 'Malaysia',
    division: 'master',
    championships: 2,
    winRate: 88,
    rating: 2100,
    championshipPoints: 1200,
    tournaments: [
      {
        id: 'tournament-completed-3',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-01-05',
        location: 'Vancouver Convention Centre, BC',
        placement: 1,
        totalPlayers: 450,
        wins: 8,
        losses: 0,
        resistance: 78.5,
        team: [
          { name: 'Flutter Mane' }, { name: 'Iron Hands' }, { name: 'Landorus-T' }, { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
        ],
        status: 'completed',
      }
    ],
    isVerified: true,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    achievements: ['Regional Champion', 'Top 8 Worlds 2023'],
    teams: [],
    matchHistory: [],
    statistics: {
      totalMatches: 30,
      totalWins: 28,
      totalLosses: 2,
      totalDraws: 0,
      winRate: 93,
      bestFinish: 1,
      tournamentsPlayed: 5,
      championships: 2,
      currentStreak: 8,
      longestStreak: 8,
      averagePlacement: 2,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        tournamentUpdates: true,
        pairingNotifications: true,
        roundStartReminders: true,
        socialInteractions: true,
        achievementUnlocks: true
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    }
  },
  {
    id: 'brian-lewis',
    name: 'Brian Lewis',
    playerId: '10000002',
    region: 'Latin America',
    country: 'Mexico',
    division: 'master',
    championships: 1,
    winRate: 85,
    rating: 2050,
    championshipPoints: 1100,
    tournaments: [
      {
        id: 'tournament-completed-3',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-01-05',
        location: 'Vancouver Convention Centre, BC',
        placement: 2,
        totalPlayers: 450,
        wins: 7,
        losses: 1,
        resistance: 75.2,
        team: [
          { name: 'Charizard' }, { name: 'Gholdengo' }, { name: 'Urshifu' }, { name: 'Rillaboom' }, { name: 'Amoonguss' }, { name: 'Indeedee' }
        ],
        status: 'completed',
      }
    ],
    isVerified: true,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    achievements: ['Regional Runner-Up', 'Top 16 Internationals'],
    teams: [],
    matchHistory: [],
    statistics: {
      totalMatches: 28,
      totalWins: 24,
      totalLosses: 4,
      totalDraws: 0,
      winRate: 86,
      bestFinish: 2,
      tournamentsPlayed: 4,
      championships: 1,
      currentStreak: 7,
      longestStreak: 7,
      averagePlacement: 3,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        tournamentUpdates: true,
        pairingNotifications: true,
        roundStartReminders: true,
        socialInteractions: true,
        achievementUnlocks: true
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    }
  },
  {
    id: 'sarah-kim',
    name: 'Sarah Kim',
    playerId: '10000003',
    region: 'Europe',
    country: 'United Kingdom',
    division: 'master',
    championships: 1,
    winRate: 82,
    rating: 2020,
    championshipPoints: 1050,
    tournaments: [
      {
        id: 'tournament-completed-3',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-01-05',
        location: 'Vancouver Convention Centre, BC',
        placement: 3,
        totalPlayers: 450,
        wins: 7,
        losses: 1,
        resistance: 74.1,
        team: [
          { name: 'Miraidon' }, { name: 'Flutter Mane' }, { name: 'Annihilape' }, { name: 'Torkoal' }, { name: 'Dondozo' }, { name: 'Tatsugiri' }
        ],
        status: 'completed',
      }
    ],
    isVerified: true,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    achievements: ['Regional Top 4', 'Top 8 Worlds'],
    teams: [],
    matchHistory: [],
    statistics: {
      totalMatches: 27,
      totalWins: 22,
      totalLosses: 5,
      totalDraws: 0,
      winRate: 81,
      bestFinish: 3,
      tournamentsPlayed: 4,
      championships: 1,
      currentStreak: 6,
      longestStreak: 6,
      averagePlacement: 4,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        tournamentUpdates: true,
        pairingNotifications: true,
        roundStartReminders: true,
        socialInteractions: true,
        achievementUnlocks: true
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    }
  },
  {
    id: 'lars-andersen',
    name: 'Lars Andersen',
    playerId: '10000004',
    region: 'Europe',
    country: 'Denmark',
    division: 'master',
    championships: 1,
    winRate: 80,
    rating: 2000,
    championshipPoints: 1000,
    tournaments: [
      {
        id: 'tournament-completed-3',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-01-05',
        location: 'Vancouver Convention Centre, BC',
        placement: 4,
        totalPlayers: 450,
        wins: 6,
        losses: 2,
        resistance: 72.0,
        team: [
          { name: 'Calyrex-Ice' }, { name: 'Incineroar' }, { name: 'Grimmsnarl' }, { name: 'Raging Bolt' }, { name: 'Landorus-T' }, { name: 'Ogerpon-W' }
        ],
        status: 'completed',
      }
    ],
    isVerified: true,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    achievements: ['Regional Top 8', 'Top 16 Internationals'],
    teams: [],
    matchHistory: [],
    statistics: {
      totalMatches: 25,
      totalWins: 20,
      totalLosses: 5,
      totalDraws: 0,
      winRate: 80,
      bestFinish: 4,
      tournamentsPlayed: 3,
      championships: 1,
      currentStreak: 5,
      longestStreak: 5,
      averagePlacement: 5,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        tournamentUpdates: true,
        pairingNotifications: true,
        roundStartReminders: true,
        socialInteractions: true,
        achievementUnlocks: true
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    }
  },
  {
    id: 'sophie-muller',
    name: 'Sophie Müller',
    playerId: '10000005',
    region: 'Europe',
    country: 'Germany',
    division: 'master',
    championships: 1,
    winRate: 78,
    rating: 1980,
    championshipPoints: 980,
    tournaments: [
      {
        id: 'tournament-completed-3',
        name: 'Vancouver Regional Championships 2024',
        date: '2024-01-05',
        location: 'Vancouver Convention Centre, BC',
        placement: 5,
        totalPlayers: 450,
        wins: 6,
        losses: 2,
        resistance: 71.5,
        team: [
          { name: 'Charizard' }, { name: 'Gholdengo' }, { name: 'Urshifu' }, { name: 'Rillaboom' }, { name: 'Amoonguss' }, { name: 'Indeedee' }
        ],
        status: 'completed',
      }
    ],
    isVerified: true,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true,
      showOnlineStatus: true,
      dataSharing: 'none',
    },
    achievements: ['Regional Top 8', 'Top 32 Worlds'],
    teams: [],
    matchHistory: [],
    statistics: {
      totalMatches: 24,
      totalWins: 19,
      totalLosses: 5,
      totalDraws: 0,
      winRate: 79,
      bestFinish: 5,
      tournamentsPlayed: 3,
      championships: 1,
      currentStreak: 4,
      longestStreak: 4,
      averagePlacement: 6,
      mostUsedPokemon: [],
      mostUsedItems: [],
      mostUsedMoves: [],
      seasonalStats: []
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
        tournamentUpdates: true,
        pairingNotifications: true,
        roundStartReminders: true,
        socialInteractions: true,
        achievementUnlocks: true
      },
      privacy: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true,
        showOnlineStatus: true,
        dataSharing: 'none'
      },
      display: {
        theme: 'light',
        compactMode: false,
        showAdvancedStats: false,
        defaultView: 'dashboard'
      },
      accessibility: {
        screenReader: false,
        highContrast: false,
        dyslexiaFriendly: false,
        fontSize: 'medium',
        reducedMotion: false,
        keyboardNavigation: false,
        colorBlindSupport: false
      },
      language: 'en',
      timezone: 'UTC'
    },
    accessibilitySettings: {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: false,
      colorBlindSupport: false
    }
  }
];

// After phoenixPairings is generated, add a validation log
validatePairings(phoenixPairings, 600);
const round3Table12 = phoenixPairings.find(p => p.round === 3 && p.table === 12);
if (round3Table12) {
  const hasManraj = round3Table12.player1.id === 'manraj-sidhu' || round3Table12.player2.id === 'manraj-sidhu';
  const hasDavid = round3Table12.player1.id === 'david-kim' || round3Table12.player2.id === 'david-kim';
  if (hasManraj && hasDavid) {
    console.log('✅ Manraj Sidhu vs David Kim correctly placed at Round 3, Table 12');
  } else {
    console.warn('❌ Round 3, Table 12 does not contain Manraj Sidhu vs David Kim');
  }
} else {
  console.warn('❌ Round 3, Table 12 not found');
}

// Mock Team Slot Data
const mockPokemon: Pokemon[] = [
  {
    name: 'Charizard',
    item: 'Focus Sash',
    ability: 'Solar Power',
    teraType: 'Fire',
    moves: ['Heat Wave', 'Solar Beam', 'Focus Blast', 'Protect'],
    nature: 'Modest',
    level: 50
  },
  {
    name: 'Gholdengo',
    item: 'Leftovers',
    ability: 'Good as Gold',
    teraType: 'Ghost',
    moves: ['Make It Rain', 'Shadow Ball', 'Protect', 'Nasty Plot'],
    nature: 'Modest',
    level: 50
  },
  {
    name: 'Urshifu',
    item: 'Choice Band',
    ability: 'Unseen Fist',
    teraType: 'Dark',
    moves: ['Wicked Blow', 'Close Combat', 'Sucker Punch', 'U-turn'],
    nature: 'Jolly',
    level: 50
  },
  {
    name: 'Rillaboom',
    item: 'Assault Vest',
    ability: 'Grassy Surge',
    teraType: 'Grass',
    moves: ['Fake Out', 'Wood Hammer', 'U-turn', 'High Horsepower'],
    nature: 'Adamant',
    level: 50
  },
  {
    name: 'Amoonguss',
    item: 'Sitrus Berry',
    ability: 'Regenerator',
    teraType: 'Water',
    moves: ['Spore', 'Rage Powder', 'Pollen Puff', 'Protect'],
    nature: 'Bold',
    level: 50
  },
  {
    name: 'Indeedee',
    item: 'Focus Sash',
    ability: 'Psychic Surge',
    teraType: 'Psychic',
    moves: ['Expanding Force', 'Hyper Voice', 'Follow Me', 'Protect'],
    nature: 'Modest',
    level: 50
  }
];

export const mockTeamSlotManager: TeamSlotManager = {
  slots: [
    {
      slotId: 'slot-1',
      slotNumber: 1,
      team: {
        id: 'team-1',
        name: 'Sun Squad',
        pokemon: mockPokemon.slice(0, 6),
        format: 'VGC 2024',
        description: 'Sun-based team with Charizard as the main attacker',
        isPublic: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-14T15:30:00Z',
        createdBy: 'manraj-sidhu',
        tags: ['Sun', 'Meta', 'Regional Winner'],
        usageCount: 15,
        winRate: 78,
        exportFormat: 'showdown',
        slotNumber: 1,
        isFavorite: true,
        battleTeamName: 'Sun Squad',
        switchProfile: 'ManrajVGC',
        switchModel: 'Switch OLED',
        rentalTeamId: 'CHAR1ZRD'
      },
      isLocked: false,
      lastModified: '2024-03-15T08:00:00Z',
      quickAccessName: 'Championship Team'
    },
    {
      slotId: 'slot-2',
      slotNumber: 2,
      team: {
        id: 'team-2',
        name: 'Trick Room Control',
        pokemon: [
          {
            name: 'Dondozo',
            item: 'Leftovers',
            ability: 'Unaware',
            teraType: 'Grass',
            moves: ['Wave Crash', 'Earthquake', 'Order Up', 'Protect'],
            nature: 'Brave',
            level: 50
          },
          {
            name: 'Tatsugiri',
            item: 'Focus Sash',
            ability: 'Commander',
            teraType: 'Steel',
            moves: ['Muddy Water', 'Dragon Pulse', 'Icy Wind', 'Protect'],
            nature: 'Quiet',
            level: 50
          },
          {
            name: 'Arcanine',
            item: 'Sitrus Berry',
            ability: 'Intimidate',
            teraType: 'Normal',
            moves: ['Flare Blitz', 'Extreme Speed', 'Will-O-Wisp', 'Protect'],
            nature: 'Brave',
            level: 50
          },
          {
            name: 'Annihilape',
            item: 'Assault Vest',
            ability: 'Defiant',
            teraType: 'Fire',
            moves: ['Rage Fist', 'Drain Punch', 'Ice Punch', 'Shadow Claw'],
            nature: 'Brave',
            level: 50
          }
        ],
        format: 'VGC 2024',
        description: 'Trick Room team built around Dondozo-Tatsugiri combo',
        isPublic: false,
        createdAt: '2024-02-01T12:00:00Z',
        updatedAt: '2024-02-28T18:45:00Z',
        createdBy: 'manraj-sidhu',
        tags: ['Trick Room', 'Commander', 'Anti-Meta'],
        usageCount: 8,
        winRate: 62,
        slotNumber: 2,
        isFavorite: false,
        battleTeamName: 'TR Control',
        switchProfile: 'ManrajVGC',
        switchModel: 'Switch OLED'
      },
      isLocked: false,
      lastModified: '2024-02-28T18:45:00Z',
      quickAccessName: 'TR Setup'
    },
    {
      slotId: 'slot-3',
      slotNumber: 3,
      team: null,
      isLocked: false,
      lastModified: '2024-01-01T00:00:00Z',
    },
    {
      slotId: 'slot-4',
      slotNumber: 4,
      team: null,
      isLocked: false,
      lastModified: '2024-01-01T00:00:00Z',
    },
    {
      slotId: 'slot-5',
      slotNumber: 5,
      team: null,
      isLocked: false,
      lastModified: '2024-01-01T00:00:00Z',
    },
    {
      slotId: 'slot-6',
      slotNumber: 6,
      team: null,
      isLocked: true,
      lastModified: '2024-01-01T00:00:00Z',
      quickAccessName: 'Reserved Slot'
    },
    {
      slotId: 'slot-7',
      slotNumber: 7,
      team: null,
      isLocked: false,
      lastModified: '2024-01-01T00:00:00Z',
    },
    {
      slotId: 'slot-8',
      slotNumber: 8,
      team: null,
      isLocked: false,
      lastModified: '2024-01-01T00:00:00Z',
    }
  ],
  maxSlots: 8,
  activeSlot: 1,
  lastModified: '2024-03-15T08:00:00Z'
};

