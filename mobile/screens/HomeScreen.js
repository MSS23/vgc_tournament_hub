import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const tournaments = [
  { id: '1', name: 'Phoenix Regional', date: '2024-03-15', time: '9:00 AM', location: 'Phoenix, AZ', logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/usa.png' },
  { id: '2', name: 'San Diego Regional', date: '2024-02-10', time: '10:00 AM', location: 'San Diego, CA', logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/usa.png' },
  { id: '3', name: 'London Regional', date: '2024-04-05', time: '11:00 AM', location: 'London, UK', logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/uk.png' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.gradientBg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.headerRow}>
          <Image source={{ uri: 'https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png' }} style={styles.logo} />
          <Text style={styles.headerTitle}>VGC Hub</Text>
        </View>
        <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {tournaments.map(t => (
            <View key={t.id} style={styles.tournamentCard}>
              <Image source={{ uri: t.logo }} style={styles.tournamentLogo} />
              <Text style={styles.tournamentName}>{t.name}</Text>
              <Text style={styles.tournamentDate}>{t.date} • {t.time}</Text>
              <Text style={styles.tournamentLocation}>{t.location}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation && navigation.navigate('Tournaments')}
        >
          <Text style={styles.buttonText}>Browse All Tournaments</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    backgroundColor: '#181C24',
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  logo: {
    width: 48,
    height: 28,
    marginRight: 12,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  tournamentCard: {
    backgroundColor: '#23283A',
    borderRadius: 18,
    padding: 18,
    marginLeft: 24,
    marginRight: 8,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  tournamentLogo: {
    width: 48,
    height: 48,
    marginBottom: 10,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  tournamentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  tournamentDate: {
    fontSize: 13,
    color: '#A0AEC0',
    marginBottom: 2,
    textAlign: 'center',
  },
  tournamentLocation: {
    fontSize: 13,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
}); 