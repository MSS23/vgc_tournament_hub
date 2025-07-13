import { validateTournamentPairings, logPairingValidation, findSpecificPairing } from './pairingValidator';
import { mockTournaments } from '../data/mockData';

export function testAllTournamentPairings(): void {
  console.log('🧪 Testing Tournament Pairings Validation\n');
  
  mockTournaments.forEach(tournament => {
    if (tournament.pairings && tournament.pairings.length > 0) {
      const result = validateTournamentPairings(tournament.pairings, tournament.totalPlayers);
      logPairingValidation(result, tournament.name);
      
      // Test specific pairings for Phoenix Regional
      if (tournament.name.includes('Phoenix')) {
        console.log('\n🔍 Testing Phoenix Regional specific pairings:');
        
        // Check Manraj vs David at Round 3, Table 12
        const manrajVsDavid = findSpecificPairing(tournament.pairings, 'manraj-sidhu', 'david-kim', 3);
        if (manrajVsDavid) {
          console.log(`✅ Found Manraj vs David at Round 3, Table ${manrajVsDavid.table}`);
        } else {
          console.log('❌ Manraj vs David not found at Round 3');
        }
        
        // Check total pairings for each round
        const rounds = Array.from(new Set(tournament.pairings.map(p => p.round))).sort((a, b) => a - b);
        console.log('\n📊 Round-by-round pairing counts:');
        rounds.forEach(round => {
          const roundPairings = tournament.pairings.filter(p => p.round === round);
          console.log(`   Round ${round}: ${roundPairings.length} pairings`);
        });
      }
    } else {
      console.log(`\n⏭️ Skipping ${tournament.name} - no pairings data`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  });
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testAllTournamentPairings();
} 