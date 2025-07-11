// Minimal move database for VGC Pokémon (expandable)
// Only include legal moves for each Pokémon
export const legalMoves: Record<string, string[]> = {
  Charizard: [
    'Flamethrower', 'Heat Wave', 'Air Slash', 'Solar Beam', 'Protect', 'Dragon Pulse', 'Hurricane', 'Overheat', 'Tailwind', 'Roost',
  ],
  Gholdengo: [
    'Make It Rain', 'Shadow Ball', 'Thunderbolt', 'Nasty Plot', 'Protect', 'Steel Beam', 'Recover', 'Dazzling Gleam', 'Trick',
  ],
  Urshifu: [
    'Wicked Blow', 'Close Combat', 'Aqua Jet', 'Surging Strikes', 'Protect', 'Detect', 'Iron Head', 'U-turn', 'Ice Punch',
  ],
  Rillaboom: [
    'Grassy Glide', 'Fake Out', 'Wood Hammer', 'U-turn', 'Protect', 'High Horsepower', 'Knock Off', 'Drum Beating',
  ],
  Amoonguss: [
    'Spore', 'Rage Powder', 'Protect', 'Sludge Bomb', 'Pollen Puff', 'Giga Drain', 'Clear Smog', 'Foul Play',
  ],
  Indeedee: [
    'Follow Me', 'Expanding Force', 'Protect', 'Psychic', 'Helping Hand', 'Dazzling Gleam', 'Heal Pulse',
  ],
  Miraidon: [
    'Electro Drift', 'Draco Meteor', 'Thunderbolt', 'Volt Switch', 'Protect', 'Parabolic Charge', 'Dragon Pulse',
  ],
  FlutterMane: [
    'Shadow Ball', 'Moonblast', 'Dazzling Gleam', 'Protect', 'Thunderbolt', 'Mystical Fire', 'Calm Mind',
  ],
  Annihilape: [
    'Rage Fist', 'Drain Punch', 'Protect', 'Bulk Up', 'Shadow Claw', 'U-turn', 'Taunt',
  ],
  Torkoal: [
    'Eruption', 'Heat Wave', 'Protect', 'Solar Beam', 'Yawn', 'Body Press', 'Earth Power',
  ],
  Dondozo: [
    'Wave Crash', 'Order Up', 'Protect', 'Earthquake', 'Rest', 'Sleep Talk', 'Heavy Slam',
  ],
  Tatsugiri: [
    'Muddy Water', 'Draco Meteor', 'Protect', 'Icy Wind', 'Taunt', 'Soak', 'Dragon Pulse',
  ],
  CalyrexIce: [
    'Glacial Lance', 'High Horsepower', 'Protect', 'Trick Room', 'Close Combat', 'Heavy Slam',
  ],
  Incineroar: [
    'Fake Out', 'Flare Blitz', 'Parting Shot', 'Snarl', 'Darkest Lariat', 'Protect', 'U-turn',
  ],
  Grimmsnarl: [
    'Spirit Break', 'Reflect', 'Light Screen', 'Thunder Wave', 'Taunt', 'Fake Out', 'Protect',
  ],
  RagingBolt: [
    'Thunderclap', 'Thunderbolt', 'Draco Meteor', 'Protect', 'Snarl', 'Volt Switch',
  ],
  LandorusT: [
    'Earthquake', 'Rock Slide', 'U-turn', 'Protect', 'Fly', 'Stone Edge', 'Swords Dance',
  ],
  OgerponW: [
    'Ivy Cudgel', 'Horn Leech', 'Protect', 'Knock Off', 'Spiky Shield', 'Play Rough',
  ],
};

// Utility to check if a move is legal for a given Pokémon
export function isLegalMove(pokemon: string, move: string): boolean {
  const moves = legalMoves[pokemon.replace(/[-\s]/g, '')] || [];
  return moves.includes(move);
}

// Utility to get legal moves for a given Pokémon
export function getLegalMoves(pokemon: string): string[] {
  return legalMoves[pokemon.replace(/[-\s]/g, '')] || [];
} 