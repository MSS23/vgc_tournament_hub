import { TournamentPairing } from '../types';

export interface PairingValidationResult {
  isValid: boolean;
  totalPlayers: number;
  expectedPairingsPerRound: number;
  rounds: {
    round: number;
    actualPairings: number;
    expectedPairings: number;
    actualPlayers: number;
    expectedPlayers: number;
    isValid: boolean;
    issues: string[];
  }[];
  summary: {
    totalRounds: number;
    totalPairings: number;
    totalExpectedPairings: number;
    overallValid: boolean;
  };
}

export function validateTournamentPairings(
  pairings: TournamentPairing[], 
  totalPlayers: number
): PairingValidationResult {
  const rounds = Array.from(new Set(pairings.map(p => p.round))).sort((a, b) => a - b);
  const expectedPairingsPerRound = totalPlayers / 2;
  
  const roundValidations = rounds.map(round => {
    const roundPairings = pairings.filter(p => p.round === round);
    const actualPairings = roundPairings.length;
    const expectedPairings = expectedPairingsPerRound;
    
    // Count unique players in this round
    const playersInRound = new Set<string>();
    roundPairings.forEach(p => {
      playersInRound.add(p.player1.id);
      playersInRound.add(p.player2.id);
    });
    const actualPlayers = playersInRound.size;
    const expectedPlayers = totalPlayers;
    
    const issues: string[] = [];
    if (actualPairings !== expectedPairings) {
      issues.push(`Expected ${expectedPairings} pairings, got ${actualPairings}`);
    }
    if (actualPlayers !== expectedPlayers) {
      issues.push(`Expected ${expectedPlayers} unique players, got ${actualPlayers}`);
    }
    
    // Check for duplicate players in the same round
    const playerCounts = new Map<string, number>();
    roundPairings.forEach(p => {
      playerCounts.set(p.player1.id, (playerCounts.get(p.player1.id) || 0) + 1);
      playerCounts.set(p.player2.id, (playerCounts.get(p.player2.id) || 0) + 1);
    });
    
    const duplicatePlayers = Array.from(playerCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([playerId, count]) => `${playerId} appears ${count} times`);
    
    if (duplicatePlayers.length > 0) {
      issues.push(`Duplicate players: ${duplicatePlayers.join(', ')}`);
    }
    
    // Check for self-pairings
    const selfPairings = roundPairings.filter(p => p.player1.id === p.player2.id);
    if (selfPairings.length > 0) {
      issues.push(`Self-pairings found: ${selfPairings.length}`);
    }
    
    return {
      round,
      actualPairings,
      expectedPairings,
      actualPlayers,
      expectedPlayers,
      isValid: issues.length === 0,
      issues
    };
  });
  
  const totalPairings = pairings.length;
  const totalExpectedPairings = expectedPairingsPerRound * rounds.length;
  const overallValid = roundValidations.every(r => r.isValid) && 
                      totalPairings === totalExpectedPairings;
  
  return {
    isValid: overallValid,
    totalPlayers,
    expectedPairingsPerRound,
    rounds: roundValidations,
    summary: {
      totalRounds: rounds.length,
      totalPairings,
      totalExpectedPairings,
      overallValid
    }
  };
}

export function logPairingValidation(result: PairingValidationResult, tournamentName: string): void {
  console.log(`\n🔍 Validating ${tournamentName}`);
  console.log(`📊 Total Players: ${result.totalPlayers}`);
  console.log(`🎯 Expected Pairings per Round: ${result.expectedPairingsPerRound}`);
  console.log(`📈 Total Rounds: ${result.summary.totalRounds}`);
  console.log(`🔢 Total Pairings: ${result.summary.totalPairings} (expected: ${result.summary.totalExpectedPairings})`);
  
  if (result.isValid) {
    console.log('✅ All pairings are valid!');
  } else {
    console.log('❌ Pairing validation failed!');
    
    result.rounds.forEach(round => {
      if (!round.isValid) {
        console.log(`\n⚠️ Round ${round.round} issues:`);
        round.issues.forEach(issue => console.log(`   - ${issue}`));
      }
    });
  }
  
  console.log('\n📋 Round-by-round breakdown:');
  result.rounds.forEach(round => {
    const status = round.isValid ? '✅' : '❌';
    console.log(`${status} Round ${round.round}: ${round.actualPairings}/${round.expectedPairings} pairings, ${round.actualPlayers}/${round.expectedPlayers} players`);
  });
}

export function findSpecificPairing(
  pairings: TournamentPairing[], 
  player1Id: string, 
  player2Id: string, 
  round?: number
): TournamentPairing | null {
  return pairings.find(p => {
    const hasPlayer1 = p.player1.id === player1Id || p.player2.id === player1Id;
    const hasPlayer2 = p.player1.id === player2Id || p.player2.id === player2Id;
    const roundMatch = round ? p.round === round : true;
    return hasPlayer1 && hasPlayer2 && roundMatch;
  }) || null;
}

export function getPlayerPairings(
  pairings: TournamentPairing[], 
  playerId: string
): TournamentPairing[] {
  return pairings.filter(p => 
    p.player1.id === playerId || p.player2.id === playerId
  );
} 