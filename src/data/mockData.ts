import { Tournament, Player, TournamentPairing } from '../types';

// Comprehensive mock player data across multiple regions
const mockPlayerData = [
  // Manraj Sidhu - Active Live Tournament Player
  {
    id: 'manraj-sidhu',
    name: 'Manraj Sidhu',
    playerId: 'MS2024',
    region: 'North America',
    division: 'master',
    championships: 1,
    winRate: 75,
    rating: 1950,
    isVerified: true,
    achievements: ['Regional Champion 2023', 'Top 8 Worlds 2023', 'Live Tournament Player'],
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
    }
  },
  // North America - Top Players
  {
    id: 'p1',
    name: 'Alex Rodriguez',
    playerId: 'AR2024',
    region: 'North America',
    division: 'master',
    championships: 3,
    winRate: 78,
    rating: 2100,
    isVerified: true,
    achievements: ['Worlds Champion 2023', 'North America Champion 2022', 'Regional Champion x5'],
    country: 'United States'
  },
  {
    id: 'p2',
    name: 'Sarah Chen',
    playerId: 'SC2024',
    region: 'North America',
    division: 'master',
    championships: 2,
    winRate: 72,
    rating: 1950,
    isVerified: true,
    achievements: ['Regional Champion x3', 'Top 8 Worlds 2023', 'Meta Expert'],
    country: 'Canada'
  },
  {
    id: 'p3',
    name: 'Marcus Johnson',
    playerId: 'MJ2024',
    region: 'North America',
    division: 'master',
    championships: 1,
    winRate: 68,
    rating: 1850,
    isVerified: true,
    achievements: ['Regional Champion 2023', 'Community Leader'],
    country: 'Mexico'
  },
  {
    id: 'p4',
    name: 'Emily Davis',
    playerId: 'ED2024',
    region: 'North America',
    division: 'senior',
    championships: 0,
    winRate: 65,
    rating: 1750,
    isVerified: false,
    achievements: ['Top 16 Regionals 2023', 'Rising Star'],
    country: 'Unknown'
  },
  {
    id: 'p5',
    name: 'David Kim',
    playerId: 'DK2024',
    region: 'North America',
    division: 'master',
    championships: 0,
    winRate: 62,
    rating: 1700,
    isVerified: false,
    achievements: ['Top 32 Regionals 2023'],
    country: 'Unknown'
  },

  // Europe - Top Players
  {
    id: 'p6',
    name: 'Lars Andersen',
    playerId: 'LA2024',
    region: 'Europe',
    division: 'master',
    championships: 2,
    winRate: 75,
    rating: 2000,
    isVerified: true,
    achievements: ['European Champion 2023', 'Worlds Top 4 2023', 'Regional Champion x4'],
    country: 'United Kingdom'
  },
  {
    id: 'p7',
    name: 'Sophie Müller',
    playerId: 'SM2024',
    region: 'Europe',
    division: 'master',
    championships: 1,
    winRate: 70,
    rating: 1900,
    isVerified: true,
    achievements: ['German Champion 2023', 'Top 8 Worlds 2022'],
    country: 'Germany'
  },
  {
    id: 'p8',
    name: 'Pierre Dubois',
    playerId: 'PD2024',
    region: 'Europe',
    division: 'master',
    championships: 0,
    winRate: 67,
    rating: 1800,
    isVerified: false,
    achievements: ['French Regional Champion 2023'],
    country: 'France'
  },
  {
    id: 'p9',
    name: 'Maria Garcia',
    playerId: 'MG2024',
    region: 'Europe',
    division: 'senior',
    championships: 0,
    winRate: 63,
    rating: 1650,
    isVerified: false,
    achievements: ['Spanish Regional Top 8 2023'],
    country: 'Spain'
  },
  {
    id: 'p10',
    name: 'Giuseppe Rossi',
    playerId: 'GR2024',
    region: 'Europe',
    division: 'master',
    championships: 0,
    winRate: 60,
    rating: 1600,
    isVerified: false,
    achievements: ['Italian Regional Participant 2023'],
    country: 'Italy'
  },

  // Asia-Pacific - Top Players
  {
    id: 'p11',
    name: 'Yuki Tanaka',
    playerId: 'YT2024',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 3,
    winRate: 80,
    rating: 2150,
    isVerified: true,
    achievements: ['Worlds Champion 2022', 'Japan Champion 2023', 'Regional Champion x6'],
    country: 'Japan'
  },
  {
    id: 'p12',
    name: 'Min-ji Park',
    playerId: 'MP2024',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 2,
    winRate: 73,
    rating: 1950,
    isVerified: true,
    achievements: ['Korean Champion 2023', 'Top 4 Worlds 2023', 'Regional Champion x3'],
    country: 'South Korea'
  },
  {
    id: 'p13',
    name: 'Wei Chen',
    playerId: 'WC2024',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 1,
    winRate: 69,
    rating: 1850,
    isVerified: true,
    achievements: ['Taiwan Champion 2023', 'Top 8 Worlds 2022'],
    country: 'Taiwan'
  },
  {
    id: 'p14',
    name: 'Akira Yamamoto',
    playerId: 'AY2024',
    region: 'Asia-Pacific',
    division: 'senior',
    championships: 0,
    winRate: 66,
    rating: 1750,
    isVerified: false,
    achievements: ['Japan Regional Top 16 2023'],
    country: 'Japan'
  },
  {
    id: 'p15',
    name: 'Jin-woo Kim',
    playerId: 'JK2024',
    region: 'Asia-Pacific',
    division: 'master',
    championships: 0,
    winRate: 64,
    rating: 1700,
    isVerified: false,
    achievements: ['Korean Regional Top 32 2023'],
    country: 'South Korea'
  },

  // Latin America - Top Players
  {
    id: 'p16',
    name: 'Carlos Rodriguez',
    playerId: 'CR2024',
    region: 'Latin America',
    division: 'master',
    championships: 2,
    winRate: 71,
    rating: 1900,
    isVerified: true,
    achievements: ['Latin America Champion 2023', 'Top 8 Worlds 2023', 'Regional Champion x4'],
    country: 'Brazil'
  },
  {
    id: 'p17',
    name: 'Ana Silva',
    playerId: 'AS2024',
    region: 'Latin America',
    division: 'master',
    championships: 1,
    winRate: 68,
    rating: 1800,
    isVerified: true,
    achievements: ['Brazilian Champion 2023', 'Top 16 Worlds 2022'],
    country: 'Brazil'
  },
  {
    id: 'p18',
    name: 'Miguel Torres',
    playerId: 'MT2024',
    region: 'Latin America',
    division: 'master',
    championships: 0,
    winRate: 65,
    rating: 1750,
    isVerified: false,
    achievements: ['Mexican Regional Champion 2023'],
    country: 'Mexico'
  },
  {
    id: 'p19',
    name: 'Valentina Morales',
    playerId: 'VM2024',
    region: 'Latin America',
    division: 'senior',
    championships: 0,
    winRate: 62,
    rating: 1650,
    isVerified: false,
    achievements: ['Chilean Regional Top 8 2023'],
    country: 'Chile'
  },
  {
    id: 'p20',
    name: 'Diego Fernandez',
    playerId: 'DF2024',
    region: 'Latin America',
    division: 'master',
    championships: 0,
    winRate: 59,
    rating: 1600,
    isVerified: false,
    achievements: ['Argentine Regional Participant 2023'],
    country: 'Argentina'
  },

  // Junior Division Players
  {
    id: 'p21',
    name: 'Lucas Thompson',
    playerId: 'LT2024',
    region: 'North America',
    division: 'junior',
    championships: 1,
    winRate: 70,
    rating: 1650,
    isVerified: true,
    achievements: ['Junior Regional Champion 2023', 'Top 4 Junior Worlds 2023'],
    country: 'Unknown'
  },
  {
    id: 'p22',
    name: 'Emma Wilson',
    playerId: 'EW2024',
    region: 'North America',
    division: 'junior',
    championships: 0,
    winRate: 65,
    rating: 1550,
    isVerified: false,
    achievements: ['Junior Regional Top 8 2023'],
    country: 'Unknown'
  },
  {
    id: 'p23',
    name: 'Hiroshi Sato',
    playerId: 'HS2024',
    region: 'Asia-Pacific',
    division: 'junior',
    championships: 2,
    winRate: 75,
    rating: 1700,
    isVerified: true,
    achievements: ['Junior World Champion 2023', 'Japan Junior Champion 2023'],
    country: 'Japan'
  },
  {
    id: 'p24',
    name: 'Isabella Costa',
    playerId: 'IC2024',
    region: 'Latin America',
    division: 'junior',
    championships: 0,
    winRate: 60,
    rating: 1500,
    isVerified: false,
    achievements: ['Brazilian Junior Regional Top 16 2023'],
    country: 'Unknown'
  },

  // Senior Division Players
  {
    id: 'p25',
    name: 'Ryan O\'Connor',
    playerId: 'RO2024',
    region: 'North America',
    division: 'senior',
    championships: 1,
    winRate: 68,
    rating: 1750,
    isVerified: true,
    achievements: ['Senior Regional Champion 2023', 'Top 8 Senior Worlds 2023'],
    country: 'Unknown'
  },
  {
    id: 'p26',
    name: 'Lisa Anderson',
    playerId: 'LA2024',
    region: 'North America',
    division: 'senior',
    championships: 0,
    winRate: 63,
    rating: 1650,
    isVerified: false,
    achievements: ['Senior Regional Top 16 2023'],
    country: 'Unknown'
  },
  {
    id: 'p27',
    name: 'Felix Weber',
    playerId: 'FW2024',
    region: 'Europe',
    division: 'senior',
    championships: 1,
    winRate: 69,
    rating: 1750,
    isVerified: true,
    achievements: ['German Senior Champion 2023', 'Top 4 Senior Worlds 2023'],
    country: 'Germany'
  },
  {
    id: 'p28',
    name: 'Yuki Nakamura',
    playerId: 'YN2024',
    region: 'Asia-Pacific',
    division: 'senior',
    championships: 0,
    winRate: 64,
    rating: 1650,
    isVerified: false,
    achievements: ['Japan Senior Regional Top 8 2023'],
    country: 'Japan'
  }
];

// Add a helper to map region to a country
const regionCountryMapForMock = {
  'North America': ['United States', 'Canada', 'Mexico'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain'],
  'Asia-Pacific': ['Japan', 'South Korea', 'Taiwan', 'Australia', 'China'],
  'Latin America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia']
};

// Patch mockPlayerData to add a country field
mockPlayerData.forEach(player => {
  if (!player.country) {
    const countries = regionCountryMapForMock[player.region] || ['Unknown'];
    player.country = countries[Math.floor(Math.random() * countries.length)];
  }
});

// Generate additional players to reach 600 total
const additionalPlayers: Player[] = Array.from({ length: 572 }, (_, i) => {
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
  const divisions = ['junior', 'senior', 'master'];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const division = divisions[Math.floor(Math.random() * divisions.length)];
  const names = generateRegionalName(region);
  const playerId = `${names.split(' ').map(n => n[0]).join('')}${2024 + Math.floor(Math.random() * 10)}`;
  const countries = regionCountryMapForMock[region] || ['Unknown'];
  const country = countries[Math.floor(Math.random() * countries.length)];
  return {
    id: `p${i + 29}`,
    name: names,
    playerId: playerId,
    region: region as any,
    country: country,
    division: division as any,
    championships: Math.floor(Math.random() * 2),
    winRate: 45 + Math.floor(Math.random() * 35),
    rating: 1400 + Math.floor(Math.random() * 400),
    tournaments: [],
    isVerified: Math.random() < 0.15,
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true
    }
  };
});

// Helper function to generate regional names
function generateRegionalName(region: string): string {
  const northAmericanNames = [
    'Michael Brown', 'Jessica Lee', 'Christopher Davis', 'Amanda Wilson', 'Daniel Martinez',
    'Ashley Taylor', 'Matthew Anderson', 'Nicole Garcia', 'Joshua Rodriguez', 'Stephanie Lopez',
    'Andrew White', 'Rachel Moore', 'Kevin Jackson', 'Lauren Martin', 'Steven Thompson',
    'Megan Clark', 'Brian Lewis', 'Amber Hall', 'Timothy Young', 'Samantha King'
  ];
  
  const europeanNames = [
    'Hans Mueller', 'Anna Schmidt', 'Thomas Wagner', 'Claudia Fischer', 'Wolfgang Meyer',
    'Petra Weber', 'Klaus Schulz', 'Monika Hoffmann', 'Dieter Koch', 'Gabriele Bauer',
    'Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'François Petit',
    'Isabella Rossi', 'Marco Bianchi', 'Giulia Romano', 'Luca Ferrari', 'Valentina Costa'
  ];
  
  const asiaPacificNames = [
    'Takashi Yamamoto', 'Yuki Tanaka', 'Hiroshi Sato', 'Aiko Watanabe', 'Kenji Suzuki',
    'Min-ji Park', 'Jin-woo Kim', 'Soo-jin Lee', 'Hyun-woo Choi', 'Ji-eun Kim',
    'Wei Chen', 'Li Wang', 'Zhang Liu', 'Yang Zhao', 'Hui Wu',
    'Arjun Patel', 'Priya Sharma', 'Raj Singh', 'Anjali Gupta', 'Vikram Kumar'
  ];
  
  const latinAmericanNames = [
    'Carlos Rodriguez', 'Ana Silva', 'Miguel Torres', 'Valentina Morales', 'Diego Fernandez',
    'Isabella Costa', 'Gabriel Santos', 'Camila Lima', 'Rafael Oliveira', 'Mariana Pereira',
    'Javier Martinez', 'Sofia Gonzalez', 'Alejandro Lopez', 'Valeria Ramirez', 'Carlos Herrera',
    'Maria Garcia', 'Luis Rodriguez', 'Carmen Torres', 'Roberto Morales', 'Patricia Silva'
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
  
  return namePool[Math.floor(Math.random() * namePool.length)];
}

// Combine all players
const swissPlayers: Player[] = [
  ...mockPlayerData.map(player => ({
    ...player,
    tournaments: [],
    privacySettings: {
      profileVisibility: 'public',
      teamShowcaseVisibility: 'public',
      allowTeamReports: true,
      showTournamentHistory: true,
      allowQRCodeGeneration: true
    }
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

// Add tournament runs for other players
const p2TournamentRun = {
  id: 'tournament-completed-2',
  name: 'Charlotte Regional Championships',
  date: '2024-03-10',
  location: 'Charlotte Convention Center, NC',
  totalPlayers: 520,
  status: 'completed',
  team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
  rounds: [
    { round: 1, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'loss', score: '1-2', table: 3 },
    { round: 2, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-1', table: 4 },
    { round: 3, opponent: 'Emily Davis', opponentTeam: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 2 },
    { round: 4, opponent: 'David Kim', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'win', score: '2-1', table: 1 },
    { round: 5, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'loss', score: '0-2', table: 3 },
    { round: 6, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-1', table: 2 },
    { round: 7, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-0', table: 4 },
    { round: 8, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-1', table: 1 }
  ]
};

const p3TournamentRun = {
  id: 'tournament-completed-3',
  name: 'San Diego Regional Championships',
  date: '2024-03-08',
  location: 'San Diego Convention Center, CA',
  totalPlayers: 580,
  status: 'completed',
  team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'],
  rounds: [
    { round: 1, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 1 },
    { round: 2, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'win', score: '2-0', table: 2 },
    { round: 3, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 1 },
    { round: 4, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-0', table: 3 },
    { round: 5, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-1', table: 2 },
    { round: 6, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 1 },
    { round: 7, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 3 },
    { round: 8, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'loss', score: '1-2', table: 1 }
  ]
};

// Add tournament runs to players
mockPlayerData[1].tournaments = [p2TournamentRun]; // Sarah Chen (p2)
mockPlayerData[2].tournaments = [p3TournamentRun]; // Marcus Johnson (p3)

// Add teams data for players
mockPlayerData[0].teams = [
  {
    id: 'team-1',
    name: 'Charizard Core',
    pokemon: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-02-15',
    description: 'Balanced team with Charizard as the main attacker'
  },
  {
    id: 'team-2',
    name: 'Koraidon Offense',
    pokemon: ['Koraidon', 'Chien-Pao', 'Amoonguss', 'Incineroar', 'Grimmsnarl', 'Electabuzz'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-20',
    description: 'Hyper offense team built around Koraidon'
  }
];

mockPlayerData[1].teams = [
  {
    id: 'team-3',
    name: 'Miraidon Offense',
    pokemon: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-03-01',
    description: 'Hyper offense team built around Miraidon'
  },
  {
    id: 'team-4',
    name: 'Worlds Team 2023',
    pokemon: ['Miraidon', 'Flutter Mane', 'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2023-11-15',
    description: 'Team used at World Championships 2023'
  }
];

mockPlayerData[2].teams = [
  {
    id: 'team-5',
    name: 'Calyrex Control',
    pokemon: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-02-20',
    description: 'Control team with Calyrex-Ice as the centerpiece'
  }
];

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
  // Track player records
  const records: Record<string, { wins: number; losses: number }> = {};
  players.forEach(p => (records[p.id] = { wins: 0, losses: 0 }));
  let pairings: TournamentPairing[] = [];
  let currentPlayers = players.map(p => p.id);

  for (let round = 1; round <= rounds; round++) {
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
    // Pair within buckets, with rare downpairing
    let roundPairings: TournamentPairing[] = [];
    let used = new Set<string>();
    for (let b = 0; b < sortedBuckets.length; b++) {
      let group = shuffle(buckets[sortedBuckets[b]].filter(pid => !used.has(pid)));
      // If odd, try to downpair one
      if (group.length % 2 === 1 && b < sortedBuckets.length - 1) {
        // Move one to next bucket
        const downpair = group.pop();
        if (downpair) buckets[sortedBuckets[b + 1]].push(downpair);
      }
      // Pair up
      for (let i = 0; i < group.length; i += 2) {
        if (i + 1 < group.length) {
          const p1 = group[i];
          const p2 = group[i + 1];
          used.add(p1);
          used.add(p2);
          // Assign result randomly, but allow for some upsets
          let p1Wins = records[p1].wins;
          let p2Wins = records[p2].wins;
          let winner: string;
          let score: string;
          if (Math.random() < 0.5 + 0.1 * (p1Wins - p2Wins)) {
            winner = p1;
            score = '2-0';
            records[p1].wins++;
            records[p2].losses++;
          } else {
            winner = p2;
            score = '2-1';
            records[p2].wins++;
            records[p1].losses++;
          }
          roundPairings.push({
            round,
            table: roundPairings.length + 1,
            player1: {
              id: p1,
              name: swissPlayers.find(p => p.id === p1)?.name || '',
              record: `${records[p1].wins}-${records[p1].losses}`
            },
            player2: {
              id: p2,
              name: swissPlayers.find(p => p.id === p2)?.name || '',
              record: `${records[p2].wins}-${records[p2].losses}`
            },
            result: { winner, score }
          });
        }
      }
    }
    pairings = pairings.concat(roundPairings);
  }
  return pairings;
}

const swissPairings = generateSwissPairings(swissPlayers, 8);

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
    pairings: swissPairings
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
    pairings: swissPairings
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
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-4',
    name: 'Charlotte Regional Championships 2024',
    date: '2024-03-10',
    location: 'Charlotte Convention Center, NC',
    totalPlayers: 480,
    status: 'completed',
    registrationStart: '2024-02-10T10:00:00Z',
    registrationEnd: '2024-03-05T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 500,
    currentRegistrations: 480,
    waitlistEnabled: true,
    waitlistCapacity: 50,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-5',
    name: 'EUIC 2024',
    date: '2024-02-25',
    location: 'London, UK',
    totalPlayers: 1200,
    status: 'completed',
    registrationStart: '2024-01-25T10:00:00Z',
    registrationEnd: '2024-02-20T23:59:59Z',
    isRegistered: true,
    requiresLottery: true,
    registrationFee: 50,
    maxCapacity: 1200,
    currentRegistrations: 1200,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-6',
    name: 'World Championships 2023',
    date: '2023-08-15',
    location: 'Yokohama, Japan',
    totalPlayers: 800,
    status: 'completed',
    registrationStart: '2023-07-15T10:00:00Z',
    registrationEnd: '2023-08-10T23:59:59Z',
    isRegistered: true,
    requiresLottery: true,
    registrationFee: 75,
    maxCapacity: 800,
    currentRegistrations: 800,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-7',
    name: 'European International Championships 2024',
    date: '2024-02-15',
    location: 'London, UK',
    totalPlayers: 1000,
    status: 'completed',
    registrationStart: '2024-01-15T10:00:00Z',
    registrationEnd: '2024-02-10T23:59:59Z',
    isRegistered: true,
    requiresLottery: true,
    registrationFee: 45,
    maxCapacity: 1000,
    currentRegistrations: 1000,
    waitlistEnabled: true,
    waitlistCapacity: 150,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-8',
    name: 'German National Championships 2024',
    date: '2024-01-30',
    location: 'Berlin, Germany',
    totalPlayers: 350,
    status: 'completed',
    registrationStart: '2024-01-01T10:00:00Z',
    registrationEnd: '2024-01-25T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 20,
    maxCapacity: 400,
    currentRegistrations: 350,
    waitlistEnabled: true,
    waitlistCapacity: 50,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-9',
    name: 'Japan National Championships 2024',
    date: '2024-02-05',
    location: 'Tokyo, Japan',
    totalPlayers: 800,
    status: 'completed',
    registrationStart: '2024-01-05T10:00:00Z',
    registrationEnd: '2024-01-30T23:59:59Z',
    isRegistered: true,
    requiresLottery: true,
    registrationFee: 30,
    maxCapacity: 800,
    currentRegistrations: 800,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: swissPairings
  },
  {
    id: 'tournament-completed-10',
    name: 'Korean National Championships 2024',
    date: '2024-02-12',
    location: 'Seoul, South Korea',
    totalPlayers: 600,
    status: 'completed',
    registrationStart: '2024-01-12T10:00:00Z',
    registrationEnd: '2024-02-07T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 600,
    currentRegistrations: 600,
    waitlistEnabled: true,
    waitlistCapacity: 80,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: swissPairings
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
    pairings: swissPairings
  },
  {
    id: 'tournament-2',
    name: 'Seattle Spring Championships',
    date: '2024-04-05',
    location: 'Seattle Convention Center, WA',
    totalPlayers: 0,
    status: 'ongoing',
    registrationStart: '2024-03-05T10:00:00Z',
    registrationEnd: '2024-03-30T23:59:59Z',
    isRegistered: true,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 600,
    currentRegistrations: 520,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: swissPairings
  },
  // Registration Open Tournaments
  {
    id: 'tournament-3',
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
    currentRegistrations: 450,
    waitlistEnabled: true,
    waitlistCapacity: 150,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  {
    id: 'tournament-4',
    name: 'Chicago Regional Championships',
    date: '2024-05-10',
    location: 'McCormick Place, IL',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-04-10T10:00:00Z',
    registrationEnd: '2024-05-05T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 25,
    maxCapacity: 700,
    currentRegistrations: 650,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 50,
    registrationType: 'lottery',
    pairings: []
  },
  {
    id: 'tournament-5',
    name: 'Toronto Regional Championships',
    date: '2024-05-25',
    location: 'Metro Toronto Convention Centre, ON',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-04-25T10:00:00Z',
    registrationEnd: '2024-05-20T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 30,
    maxCapacity: 600,
    currentRegistrations: 320,
    waitlistEnabled: true,
    waitlistCapacity: 100,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  {
    id: 'tournament-6',
    name: 'Paris Regional Championships',
    date: '2024-04-15',
    location: 'Paris Expo Porte de Versailles, France',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-03-15T10:00:00Z',
    registrationEnd: '2024-04-10T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 25,
    maxCapacity: 500,
    currentRegistrations: 380,
    waitlistEnabled: true,
    waitlistCapacity: 80,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  {
    id: 'tournament-7',
    name: 'Madrid Regional Championships',
    date: '2024-05-05',
    location: 'IFEMA Madrid, Spain',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-04-05T10:00:00Z',
    registrationEnd: '2024-04-30T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 20,
    maxCapacity: 400,
    currentRegistrations: 250,
    waitlistEnabled: true,
    waitlistCapacity: 60,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  {
    id: 'tournament-8',
    name: 'Sydney Regional Championships',
    date: '2024-04-30',
    location: 'Sydney Convention Centre, Australia',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-03-30T10:00:00Z',
    registrationEnd: '2024-04-25T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 35,
    maxCapacity: 450,
    currentRegistrations: 280,
    waitlistEnabled: true,
    waitlistCapacity: 70,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  {
    id: 'tournament-9',
    name: 'Singapore Regional Championships',
    date: '2024-05-15',
    location: 'Marina Bay Sands, Singapore',
    totalPlayers: 0,
    status: 'registration',
    registrationStart: '2024-04-15T10:00:00Z',
    registrationEnd: '2024-05-10T23:59:59Z',
    isRegistered: false,
    requiresLottery: false,
    registrationFee: 40,
    maxCapacity: 350,
    currentRegistrations: 200,
    waitlistEnabled: true,
    waitlistCapacity: 50,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served',
    pairings: []
  },
  // Upcoming Tournaments
  {
    id: 'tournament-10',
    name: 'World Championships 2024',
    date: '2024-08-20',
    location: 'Honolulu, Hawaii',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-07-20T10:00:00Z',
    registrationEnd: '2024-08-15T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 100,
    maxCapacity: 1000,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: []
  },
  {
    id: 'tournament-11',
    name: 'North America International Championships 2024',
    date: '2024-06-15',
    location: 'Nashville, TN',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-05-15T10:00:00Z',
    registrationEnd: '2024-06-10T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 60,
    maxCapacity: 1200,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 300,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: []
  },
  {
    id: 'tournament-12',
    name: 'Asia-Pacific International Championships 2024',
    date: '2024-07-10',
    location: 'Bangkok, Thailand',
    totalPlayers: 0,
    status: 'upcoming',
    registrationStart: '2024-06-10T10:00:00Z',
    registrationEnd: '2024-07-05T23:59:59Z',
    isRegistered: false,
    requiresLottery: true,
    registrationFee: 55,
    maxCapacity: 800,
    currentRegistrations: 0,
    waitlistEnabled: true,
    waitlistCapacity: 150,
    currentWaitlist: 0,
    registrationType: 'lottery',
    pairings: []
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
  playerId: 'SK2024',
  region: 'Europe',
  division: 'master',
  championships: 1,
  winRate: 74,
  rating: 1920,
  isVerified: true,
  achievements: ['London Regional Champion 2024', 'Top 16 Worlds 2023'],
  privacySettings: {
    profileVisibility: 'public',
    teamShowcaseVisibility: 'public',
    allowTeamReports: true,
    showTournamentHistory: true,
    allowQRCodeGeneration: true
  },
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
  ]
};

// Insert Sarah Kim into mockPlayers
export const mockPlayers: Player[] = [
  sarahKim,
  ...swissPlayers
];

export const mockPlayerStats: PlayerStats = {
  totalTournaments: 24,
  winRate: 68,
  bestFinish: 4,
  seasonWins: 42,
  seasonLosses: 18,
  resistance: 65.3,
  opponentsBeat: 156,
  monthlyGames: 28,
};

export const mockMetagameData: Record<string, MetagameData> = {
  '2024-regionals': {
    pokemon: [
      { name: 'Charizard', usage: 34.2, winRate: 52.1, popularity: 85 },
      { name: 'Gholdengo', usage: 31.8, winRate: 54.7, popularity: 82 },
      { name: 'Urshifu', usage: 28.9, winRate: 51.3, popularity: 78 },
      { name: 'Rillaboom', usage: 26.4, winRate: 49.8, popularity: 72 },
      { name: 'Amoonguss', usage: 23.7, winRate: 53.2, popularity: 68 },
      { name: 'Incineroar', usage: 21.5, winRate: 50.9, popularity: 65 },
      { name: 'Miraidon', usage: 19.8, winRate: 55.4, popularity: 61 },
      { name: 'Flutter Mane', usage: 18.3, winRate: 48.7, popularity: 58 },
      { name: 'Calyrex-Ice', usage: 16.9, winRate: 56.2, popularity: 54 },
      { name: 'Grimmsnarl', usage: 15.2, winRate: 47.8, popularity: 51 },
    ],
    items: [
      { name: 'Focus Sash', usage: 28.4, winRate: 52.3, popularity: 78 },
      { name: 'Leftovers', usage: 24.7, winRate: 51.8, popularity: 72 },
      { name: 'Choice Specs', usage: 19.2, winRate: 53.9, popularity: 65 },
      { name: 'Sitrus Berry', usage: 16.8, winRate: 50.4, popularity: 58 },
      { name: 'Clear Amulet', usage: 14.3, winRate: 54.2, popularity: 52 },
      { name: 'Eject Button', usage: 12.9, winRate: 49.7, popularity: 48 },
      { name: 'Booster Energy', usage: 11.5, winRate: 55.1, popularity: 45 },
      { name: 'Light Clay', usage: 9.8, winRate: 48.3, popularity: 41 },
      { name: 'Assault Vest', usage: 8.7, winRate: 52.6, popularity: 38 },
      { name: 'Choice Band', usage: 7.9, winRate: 51.2, popularity: 35 },
    ],
    tera: [
      { name: 'Fire', usage: 22.3, winRate: 51.7, popularity: 68 },
      { name: 'Water', usage: 18.9, winRate: 53.2, popularity: 62 },
      { name: 'Electric', usage: 16.4, winRate: 52.8, popularity: 58 },
      { name: 'Flying', usage: 14.7, winRate: 50.9, popularity: 54 },
      { name: 'Grass', usage: 13.2, winRate: 49.3, popularity: 49 },
      { name: 'Psychic', usage: 11.8, winRate: 54.1, popularity: 45 },
      { name: 'Fighting', usage: 10.9, winRate: 48.7, popularity: 42 },
      { name: 'Steel', usage: 9.5, winRate: 52.4, popularity: 38 },
      { name: 'Dragon', usage: 8.3, winRate: 50.6, popularity: 35 },
      { name: 'Ghost', usage: 7.2, winRate: 51.9, popularity: 32 },
    ],
    totalPlayers: 15420,
    tournaments: 48,
    uniquePokemon: 187,
    diversityIndex: 73,
  },
  '2024-worlds': {
    pokemon: [
      { name: 'Miraidon', usage: 42.1, winRate: 58.3, popularity: 92 },
      { name: 'Flutter Mane', usage: 38.7, winRate: 54.9, popularity: 89 },
      { name: 'Calyrex-Ice', usage: 35.2, winRate: 61.2, popularity: 85 },
      { name: 'Incineroar', usage: 32.8, winRate: 52.7, popularity: 81 },
      { name: 'Grimmsnarl', usage: 29.4, winRate: 49.8, popularity: 76 },
      { name: 'Raging Bolt', usage: 26.9, winRate: 57.1, popularity: 72 },
      { name: 'Landorus-T', usage: 24.5, winRate: 53.4, popularity: 68 },
      { name: 'Ogerpon-W', usage: 21.7, winRate: 55.8, popularity: 64 },
      { name: 'Chien-Pao', usage: 19.3, winRate: 51.6, popularity: 59 },
      { name: 'Amoonguss', usage: 17.8, winRate: 50.2, popularity: 56 },
    ],
    items: [
      { name: 'Booster Energy', usage: 31.2, winRate: 56.8, popularity: 82 },
      { name: 'Focus Sash', usage: 26.8, winRate: 53.1, popularity: 75 },
      { name: 'Clear Amulet', usage: 22.4, winRate: 58.9, popularity: 69 },
      { name: 'Leftovers', usage: 19.7, winRate: 52.3, popularity: 64 },
      { name: 'Choice Specs', usage: 17.3, winRate: 55.4, popularity: 58 },
      { name: 'Sitrus Berry', usage: 15.9, winRate: 51.7, popularity: 54 },
      { name: 'Assault Vest', usage: 13.5, winRate: 54.2, popularity: 49 },
      { name: 'Light Clay', usage: 11.8, winRate: 49.6, popularity: 45 },
      { name: 'Wellspring Mask', usage: 9.4, winRate: 57.3, popularity: 41 },
      { name: 'Eject Button', usage: 8.2, winRate: 48.9, popularity: 37 },
    ],
    tera: [
      { name: 'Electric', usage: 25.7, winRate: 55.2, popularity: 74 },
      { name: 'Psychic', usage: 21.3, winRate: 57.8, popularity: 68 },
      { name: 'Fire', usage: 18.9, winRate: 52.4, popularity: 62 },
      { name: 'Water', usage: 16.4, winRate: 54.1, popularity: 58 },
      { name: 'Fighting', usage: 14.8, winRate: 50.7, popularity: 53 },
      { name: 'Ice', usage: 12.3, winRate: 56.9, popularity: 48 },
      { name: 'Ground', usage: 11.7, winRate: 53.8, popularity: 45 },
      { name: 'Dark', usage: 10.2, winRate: 49.3, popularity: 41 },
      { name: 'Grass', usage: 9.8, winRate: 51.6, popularity: 38 },
      { name: 'Dragon', usage: 8.4, winRate: 52.9, popularity: 35 },
    ],
    totalPlayers: 892,
    tournaments: 1,
    uniquePokemon: 156,
    diversityIndex: 68,
  },
};

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
  },
  // European Content
  {
    id: '4',
    title: 'European VGC Scene: A Regional Perspective',
    content: 'The European VGC scene has evolved dramatically over the past few years...',
    author: {
      id: '6',
      name: 'Lars Andersen',
      avatar: 'LA',
      isVerified: true,
      achievements: ['European Champion 2023', 'Worlds Top 4 2023', 'Regional Champion x4'],
      isPokemonCompanyApproved: true,
      approvalLevel: 'content_creator',
      specialBadges: ['European Champion', 'Worlds Top 4', 'Content Creator']
    },
    category: 'tournament-report',
    tags: ['Europe', 'Regional Analysis', 'Community', 'Tournament Scene'],
    status: 'approved',
    createdAt: '2024-03-12T12:00:00Z',
    publishedAt: '2024-03-12T12:00:00Z',
    readTime: 10,
    likes: 134,
    comments: 18,
    isLiked: false,
    isBookmarked: false,
    summary: 'An in-depth look at the European VGC competitive scene and its unique characteristics.',
    isOfficialContent: true,
    requiresApproval: false,
    approvalStatus: 'approved',
    approvedBy: 'pokemon-company',
    approvedAt: '2024-03-12T11:30:00Z'
  },
  {
    id: '5',
    title: 'Speed Control in Modern VGC: European Strategies',
    content: 'Speed control has become increasingly important in the current meta...',
    author: {
      id: '7',
      name: 'Sophie Müller',
      avatar: 'SM',
      isVerified: true,
      achievements: ['German Champion 2023', 'Top 8 Worlds 2022'],
      isPokemonCompanyApproved: false,
      approvalLevel: undefined,
      specialBadges: ['German Champion', 'Meta Expert']
    },
    category: 'strategy-guide',
    tags: ['Speed Control', 'Strategy', 'European Meta', 'Advanced'],
    status: 'approved',
    createdAt: '2024-03-11T15:00:00Z',
    publishedAt: '2024-03-11T15:00:00Z',
    readTime: 14,
    likes: 98,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    summary: 'Advanced speed control strategies from a German VGC champion.',
    isOfficialContent: false,
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: 'community-moderator',
    approvedAt: '2024-03-11T14:30:00Z'
  },
  // Asia-Pacific Content
  {
    id: '6',
    title: 'Japanese VGC Philosophy: Precision and Preparation',
    content: 'The Japanese approach to VGC emphasizes meticulous preparation and execution...',
    author: {
      id: '11',
      name: 'Yuki Tanaka',
      avatar: 'YT',
      isVerified: true,
      achievements: ['Worlds Champion 2022', 'Japan Champion 2023', 'Regional Champion x6'],
      isPokemonCompanyApproved: true,
      approvalLevel: 'official_analyst',
      specialBadges: ['Worlds Champion 2022', 'Japan Champion', 'Official Analyst']
    },
    category: 'strategy-guide',
    tags: ['Japanese Meta', 'Strategy', 'Preparation', 'Worlds Champion'],
    status: 'approved',
    createdAt: '2024-03-10T09:00:00Z',
    publishedAt: '2024-03-10T09:00:00Z',
    readTime: 16,
    likes: 287,
    comments: 31,
    isLiked: false,
    isBookmarked: false,
    summary: 'Insights into Japanese VGC philosophy from a former World Champion.',
    isOfficialContent: true,
    requiresApproval: false,
    approvalStatus: 'approved',
    approvedBy: 'pokemon-company',
    approvedAt: '2024-03-10T08:30:00Z'
  },
  {
    id: '7',
    title: 'Korean VGC Scene: Innovation and Adaptation',
    content: 'The Korean VGC community is known for its innovative team compositions...',
    author: {
      id: '12',
      name: 'Min-ji Park',
      avatar: 'MP',
      isVerified: true,
      achievements: ['Korean Champion 2023', 'Top 4 Worlds 2023', 'Regional Champion x3'],
      isPokemonCompanyApproved: false,
      approvalLevel: undefined,
      specialBadges: ['Korean Champion', 'Meta Innovator']
    },
    category: 'meta-analysis',
    tags: ['Korean Meta', 'Innovation', 'Team Building', 'Regional Analysis'],
    status: 'approved',
    createdAt: '2024-03-09T11:00:00Z',
    publishedAt: '2024-03-09T11:00:00Z',
    readTime: 13,
    likes: 145,
    comments: 22,
    isLiked: false,
    isBookmarked: false,
    summary: 'Exploring the innovative approaches of the Korean VGC community.',
    isOfficialContent: false,
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: 'community-moderator',
    approvedAt: '2024-03-09T10:30:00Z'
  },
  // Latin America Content
  {
    id: '8',
    title: 'Latin American VGC: Passion and Community',
    content: 'The Latin American VGC scene is characterized by its passionate community...',
    author: {
      id: '16',
      name: 'Carlos Rodriguez',
      avatar: 'CR',
      isVerified: true,
      achievements: ['Latin America Champion 2023', 'Top 8 Worlds 2023', 'Regional Champion x4'],
      isPokemonCompanyApproved: false,
      approvalLevel: undefined,
      specialBadges: ['Latin America Champion', 'Community Leader']
    },
    category: 'tournament-report',
    tags: ['Latin America', 'Community', 'Tournament Scene', 'Regional Analysis'],
    status: 'approved',
    createdAt: '2024-03-08T14:00:00Z',
    publishedAt: '2024-03-08T14:00:00Z',
    readTime: 9,
    likes: 112,
    comments: 16,
    isLiked: false,
    isBookmarked: false,
    summary: 'A celebration of the passionate Latin American VGC community.',
    isOfficialContent: false,
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: 'community-moderator',
    approvedAt: '2024-03-08T13:30:00Z'
  },
  {
    id: '9',
    title: 'Brazilian VGC Strategies: Adapting to Local Meta',
    content: 'The Brazilian VGC scene has developed unique strategies adapted to local conditions...',
    author: {
      id: '17',
      name: 'Ana Silva',
      avatar: 'AS',
      isVerified: true,
      achievements: ['Brazilian Champion 2023', 'Top 16 Worlds 2022'],
      isPokemonCompanyApproved: false,
      approvalLevel: undefined,
      specialBadges: ['Brazilian Champion', 'Meta Expert']
    },
    category: 'strategy-guide',
    tags: ['Brazilian Meta', 'Strategy', 'Local Adaptation', 'Regional Analysis'],
    status: 'approved',
    createdAt: '2024-03-07T16:00:00Z',
    publishedAt: '2024-03-07T16:00:00Z',
    readTime: 11,
    likes: 89,
    comments: 12,
    isLiked: false,
    isBookmarked: false,
    summary: 'How Brazilian players adapt strategies to their local competitive environment.',
    isOfficialContent: false,
    requiresApproval: true,
    approvalStatus: 'approved',
    approvedBy: 'community-moderator',
    approvedAt: '2024-03-07T15:30:00Z'
  }
];

export const mockTournamentCreationRequests: TournamentCreationRequest[] = [
  {
    id: 'req-1',
    professorId: '1',
    professorName: 'Alex Rodriguez',
    professorLevel: 'full',
    certificationNumber: 'PROF-2023-001',
    tournamentData: {
      name: 'Phoenix Regional Championships 2024',
      date: '2024-03-15',
      location: 'Phoenix Convention Center, AZ',
      maxCapacity: 700,
      format: 'VGC 2024 Regulation H',
      rules: 'Standard VGC rules with Regulation H restrictions',
      prizes: 'Championship Points, TCG Booster Packs, Trophy',
      venueDetails: 'Phoenix Convention Center, Hall A. Parking available on-site.',
      contactInfo: 'alex.rodriguez@vgc-hub.com',
      specialRequirements: ['Age verification required', 'Guardian consent for minors']
    },
    status: 'approved',
    submittedAt: '2024-01-15T10:00:00Z',
    reviewedAt: '2024-01-20T14:30:00Z',
    reviewedBy: 'pokemon-company-admin',
    reviewerRole: 'Tournament Coordinator',
    comments: 'Approved with minor venue capacity adjustments',
    requiresPokemonCompanyApproval: true,
    pokemonCompanyStatus: 'approved',
    pokemonCompanyReviewer: {
      id: 'pkmn-admin-1',
      name: 'Jennifer Smith',
      role: 'Senior Tournament Coordinator'
    },
    pokemonCompanyComments: 'Tournament meets all requirements. Venue capacity confirmed.'
  },
  {
    id: 'req-2',
    professorId: '2',
    professorName: 'Sarah Chen',
    professorLevel: 'associate',
    certificationNumber: 'PROF-2023-045',
    tournamentData: {
      name: 'Seattle Spring Championships 2024',
      date: '2024-04-20',
      location: 'Seattle Convention Center, WA',
      maxCapacity: 500,
      format: 'VGC 2024 Regulation H',
      rules: 'Standard VGC rules with Regulation H restrictions',
      prizes: 'Championship Points, TCG Booster Packs, Trophy',
      venueDetails: 'Seattle Convention Center, Main Hall. Accessible venue with parking.',
      contactInfo: 'sarah.chen@vgc-hub.com',
      specialRequirements: ['Age verification required']
    },
    status: 'pending',
    submittedAt: '2024-03-18T16:00:00Z',
    requiresPokemonCompanyApproval: true,
    pokemonCompanyStatus: 'pending'
  },
  {
    id: 'req-3',
    professorId: '4',
    professorName: 'Emily Chen',
    professorLevel: 'assistant',
    certificationNumber: 'PROF-2024-012',
    tournamentData: {
      name: 'Austin Local Tournament 2024',
      date: '2024-05-10',
      location: 'Austin Game Store, TX',
      maxCapacity: 64,
      format: 'VGC 2024 Regulation H',
      rules: 'Standard VGC rules with Regulation H restrictions',
      prizes: 'TCG Booster Packs, Trophy',
      venueDetails: 'Austin Game Store, 123 Main St. Limited parking available.',
      contactInfo: 'emily.chen@vgc-hub.com',
      specialRequirements: ['Age verification required']
    },
    status: 'draft',
    submittedAt: '2024-03-19T09:00:00Z',
    requiresPokemonCompanyApproval: false
  }
];

// Add more tournament runs for variety
const p1TournamentRun2 = {
  id: 'tournament-completed-4',
  name: 'EUIC 2024',
  date: '2024-02-25',
  location: 'London, UK',
  totalPlayers: 1200,
  status: 'completed',
  team: ['Koraidon', 'Chien-Pao', 'Amoonguss', 'Incineroar', 'Grimmsnarl', 'Electabuzz'],
  rounds: [
    { round: 1, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 5 },
    { round: 2, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-0', table: 2 },
    { round: 3, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'loss', score: '1-2', table: 1 },
    { round: 4, opponent: 'Min-ji Park', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 4 },
    { round: 5, opponent: 'Wei Chen', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-0', table: 3 },
    { round: 6, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-1', table: 2 },
    { round: 7, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'loss', score: '0-2', table: 1 },
    { round: 8, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 3 },
    { round: 9, opponent: 'Emily Davis', opponentTeam: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 4 }
  ]
};

const p2TournamentRun2 = {
  id: 'tournament-completed-5',
  name: 'World Championships 2023',
  date: '2023-08-15',
  location: 'Yokohama, Japan',
  totalPlayers: 800,
  status: 'completed',
  team: ['Miraidon', 'Flutter Mane', 'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt'],
  rounds: [
    { round: 1, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'win', score: '2-1', table: 3 },
    { round: 2, opponent: 'Min-ji Park', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'loss', score: '1-2', table: 1 },
    { round: 3, opponent: 'Wei Chen', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-0', table: 4 },
    { round: 4, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 2 },
    { round: 5, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'loss', score: '0-2', table: 1 },
    { round: 6, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-1', table: 3 },
    { round: 7, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 4 },
    { round: 8, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 2 }
  ]
};

// Add more tournament runs to players
mockPlayerData[0].tournaments = [p1TournamentRun, p1TournamentRun2]; // Alex Rodriguez
mockPlayerData[1].tournaments = [p2TournamentRun, p2TournamentRun2]; // Sarah Chen
mockPlayerData[2].tournaments = [p3TournamentRun]; // Marcus Johnson

// Add tournament data for other players
const p4TournamentRun = {
  id: 'tournament-completed-6',
  name: 'Vancouver Regional Championships 2024',
  date: '2024-01-05',
  location: 'Vancouver Convention Centre, BC',
  totalPlayers: 450,
  status: 'completed',
  team: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'],
  rounds: [
    { round: 1, opponent: 'David Kim', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'win', score: '2-1', table: 2 },
    { round: 2, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'loss', score: '1-2', table: 1 },
    { round: 3, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-0', table: 3 },
    { round: 4, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'loss', score: '0-2', table: 1 },
    { round: 5, opponent: 'Emily Davis', opponentTeam: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-1', table: 4 },
    { round: 6, opponent: 'David Kim', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'win', score: '2-0', table: 2 },
    { round: 7, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'loss', score: '1-2', table: 1 },
    { round: 8, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 3 }
  ]
};

const p5TournamentRun = {
  id: 'tournament-completed-7',
  name: 'Orlando Regional Championships 2024',
  date: '2024-01-20',
  location: 'Orange County Convention Center, FL',
  totalPlayers: 520,
  status: 'completed',
  team: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'],
  rounds: [
    { round: 1, opponent: 'Emily Davis', opponentTeam: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'loss', score: '1-2', table: 3 },
    { round: 2, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'loss', score: '0-2', table: 1 },
    { round: 3, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 4 },
    { round: 4, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'loss', score: '1-2', table: 2 },
    { round: 5, opponent: 'Emily Davis', opponentTeam: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 3 },
    { round: 6, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'loss', score: '0-2', table: 1 },
    { round: 7, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 4 },
    { round: 8, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'loss', score: '1-2', table: 2 }
  ]
};

// Add tournament data and teams for other players
mockPlayerData[3].tournaments = [p4TournamentRun]; // Emily Davis
mockPlayerData[4].tournaments = [p5TournamentRun]; // David Kim

mockPlayerData[3].teams = [
  {
    id: 'team-6',
    name: 'Flutter Mane Core',
    pokemon: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-10',
    description: 'Balanced team with Flutter Mane as the main attacker'
  }
];

mockPlayerData[4].teams = [
  {
    id: 'team-7',
    name: 'Garchomp Offense',
    pokemon: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-05',
    description: 'Offensive team built around Garchomp'
  }
];

// Add tournament data for European players
const p6TournamentRun = {
  id: 'tournament-completed-8',
  name: 'European International Championships 2024',
  date: '2024-02-15',
  location: 'London, UK',
  totalPlayers: 1000,
  status: 'completed',
  team: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'],
  rounds: [
    { round: 1, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-1', table: 1 },
    { round: 2, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-0', table: 2 },
    { round: 3, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-1', table: 3 },
    { round: 4, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-0', table: 1 },
    { round: 5, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'win', score: '2-1', table: 2 },
    { round: 6, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-0', table: 3 },
    { round: 7, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-1', table: 1 },
    { round: 8, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'loss', score: '1-2', table: 2 },
    { round: 9, opponent: 'Min-ji Park', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-0', table: 3 }
  ]
};

const p7TournamentRun = {
  id: 'tournament-completed-9',
  name: 'German National Championships 2024',
  date: '2024-01-30',
  location: 'Berlin, Germany',
  totalPlayers: 350,
  status: 'completed',
  team: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'],
  rounds: [
    { round: 1, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-1', table: 2 },
    { round: 2, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-0', table: 1 },
    { round: 3, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 3 },
    { round: 4, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'loss', score: '1-2', table: 1 },
    { round: 5, opponent: 'Pierre Dubois', opponentTeam: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus'], result: 'win', score: '2-0', table: 2 },
    { round: 6, opponent: 'Maria Garcia', opponentTeam: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu'], result: 'win', score: '2-1', table: 3 },
    { round: 7, opponent: 'Giuseppe Rossi', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-0', table: 1 },
    { round: 8, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'loss', score: '1-2', table: 2 }
  ]
};

// Add tournament data and teams for European players
mockPlayerData[5].tournaments = [p6TournamentRun]; // Lars Andersen
mockPlayerData[6].tournaments = [p7TournamentRun]; // Sophie Müller

mockPlayerData[5].teams = [
  {
    id: 'team-8',
    name: 'European Control',
    pokemon: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-25',
    description: 'Control team used in European tournaments'
  }
];

mockPlayerData[6].teams = [
  {
    id: 'team-9',
    name: 'German Offense',
    pokemon: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-20',
    description: 'Offensive team used in German Nationals'
  }
];

// Add tournament data for Asia-Pacific players
const p11TournamentRun = {
  id: 'tournament-completed-10',
  name: 'Japan National Championships 2024',
  date: '2024-02-05',
  location: 'Tokyo, Japan',
  totalPlayers: 800,
  status: 'completed',
  team: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'],
  rounds: [
    { round: 1, opponent: 'Min-ji Park', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 1 },
    { round: 2, opponent: 'Wei Chen', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-0', table: 2 },
    { round: 3, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'win', score: '2-1', table: 3 },
    { round: 4, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-0', table: 1 },
    { round: 5, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-1', table: 2 },
    { round: 6, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-0', table: 3 },
    { round: 7, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-1', table: 1 },
    { round: 8, opponent: 'Min-ji Park', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-0', table: 2 },
    { round: 9, opponent: 'Wei Chen', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-1', table: 3 }
  ]
};

const p12TournamentRun = {
  id: 'tournament-completed-11',
  name: 'Korean National Championships 2024',
  date: '2024-02-12',
  location: 'Seoul, South Korea',
  totalPlayers: 600,
  status: 'completed',
  team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
  rounds: [
    { round: 1, opponent: 'Wei Chen', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-1', table: 2 },
    { round: 2, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'loss', score: '1-2', table: 1 },
    { round: 3, opponent: 'Alex Rodriguez', opponentTeam: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'], result: 'win', score: '2-0', table: 3 },
    { round: 4, opponent: 'Sarah Chen', opponentTeam: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'], result: 'win', score: '2-1', table: 1 },
    { round: 5, opponent: 'Marcus Johnson', opponentTeam: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W'], result: 'win', score: '2-0', table: 2 },
    { round: 6, opponent: 'Lars Andersen', opponentTeam: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'], result: 'win', score: '2-1', table: 3 },
    { round: 7, opponent: 'Sophie Müller', opponentTeam: ['Flutter Mane', 'Iron Bundle', 'Landorus-T', 'Rillaboom', 'Heatran', 'Amoonguss'], result: 'win', score: '2-0', table: 1 },
    { round: 8, opponent: 'Yuki Tanaka', opponentTeam: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'], result: 'loss', score: '1-2', table: 2 }
  ]
};

// Add tournament data and teams for Asia-Pacific players
mockPlayerData[10].tournaments = [p11TournamentRun]; // Yuki Tanaka
mockPlayerData[11].tournaments = [p12TournamentRun]; // Min-ji Park

mockPlayerData[10].teams = [
  {
    id: 'team-10',
    name: 'Japanese Offense',
    pokemon: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-01-30',
    description: 'Offensive team used in Japanese Nationals'
  }
];

mockPlayerData[11].teams = [
  {
    id: 'team-11',
    name: 'Korean Miraidon',
    pokemon: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
    format: 'VGC 2024',
    isPublic: true,
    createdAt: '2024-02-01',
    description: 'Miraidon team used in Korean Nationals'
  }
];