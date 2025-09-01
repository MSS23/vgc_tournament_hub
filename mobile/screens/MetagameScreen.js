import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const topPokemon = [
  { name: 'Flutter Mane', usage: 78, winRate: 62 },
  { name: 'Chi-Yu', usage: 65, winRate: 59 },
  { name: 'Iron Bundle', usage: 60, winRate: 57 },
  { name: 'Amoonguss', usage: 55, winRate: 54 },
];
const topItems = [
  { name: 'Choice Specs', usage: 40 },
  { name: 'Focus Sash', usage: 38 },
  { name: 'Booster Energy', usage: 35 },
];
const topTera = [
  { name: 'Tera Fairy', usage: 32 },
  { name: 'Tera Water', usage: 28 },
  { name: 'Tera Ghost', usage: 25 },
];

export default function MetagameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metagame Analysis</Text>
      <Text style={styles.sectionTitle}>Top Pokémon</Text>
      <FlatList
        data={topPokemon}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) => (
          <Text style={styles.row}>{index + 1}. {item.name} — {item.usage}% usage, {item.winRate}% win rate</Text>
        )}
        scrollEnabled={false}
      />
      <Text style={styles.sectionTitle}>Top Items</Text>
      <FlatList
        data={topItems}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) => (
          <Text style={styles.row}>{index + 1}. {item.name} — {item.usage}% usage</Text>
        )}
        scrollEnabled={false}
      />
      <Text style={styles.sectionTitle}>Top Tera Types</Text>
      <FlatList
        data={topTera}
        keyExtractor={item => item.name}
        renderItem={({ item, index }) => (
          <Text style={styles.row}>{index + 1}. {item.name} — {item.usage}% usage</Text>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginTop: 18, marginBottom: 8 },
  row: { fontSize: 15, color: '#fff', marginBottom: 6, backgroundColor: '#23283A', borderRadius: 12, padding: 12, marginBottom: 8 },
}); 