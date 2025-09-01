import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';

const tournaments = [
  { id: '1', name: 'Phoenix Regional Championships', date: '2024-03-15', time: '9:00 AM', location: 'Phoenix, AZ', status: 'ongoing', registered: true, totalPlayers: 600, logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/usa.png' },
  { id: '2', name: 'San Diego Regional Championships', date: '2024-02-10', time: '10:00 AM', location: 'San Diego, CA', status: 'completed', registered: true, totalPlayers: 580, logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/usa.png' },
  { id: '3', name: 'London Regional Championships', date: '2024-04-05', time: '11:00 AM', location: 'London, UK', status: 'registration', registered: false, totalPlayers: 0, logo: 'https://assets.pokemon.com/assets/cms2/img/misc/countries/uk.png' },
];

const pairings = [
  { table: 1, player1: 'Manraj Sidhu', player2: 'David Kim', status: 'In Progress' },
  { table: 2, player1: 'Alex Rodriguez', player2: 'Sarah Chen', status: 'Completed' },
  { table: 3, player2: 'Marcus Johnson', player1: 'Emily Davis', status: 'In Progress' },
];

const attendees = [
  'Manraj Sidhu', 'David Kim', 'Alex Rodriguez', 'Sarah Chen', 'Marcus Johnson', 'Emily Davis',
];

function TournamentDetailsModal({ visible, onClose, tournament }) {
  if (!tournament) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Image source={{ uri: tournament.logo }} style={styles.modalLogo} />
        <Text style={styles.modalTitle}>{tournament.name}</Text>
        <Text style={styles.modalInfo}>{tournament.date} • {tournament.time}</Text>
        <Text style={styles.modalInfo}>{tournament.location}</Text>
        <Text style={styles.modalStatus}>Status: {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}</Text>
        <Text style={styles.modalSection}>Registration</Text>
        <Text style={styles.modalText}>{tournament.registered ? 'You are registered.' : 'Not registered.'}</Text>
        <Text style={styles.modalSection}>Leaderboard</Text>
        <Text style={styles.modalText}>1. Alex Rodriguez\n2. Sarah Chen\n3. Marcus Johnson</Text>
        <Text style={styles.modalSection}>Pairings (Round 3)</Text>
        {pairings.map(p => (
          <Text key={p.table} style={styles.modalText}>Table {p.table}: {p.player1} vs {p.player2} ({p.status})</Text>
        ))}
        <Text style={styles.modalSection}>Attendees</Text>
        <FlatList
          data={attendees}
          keyExtractor={item => item}
          renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
          style={{ maxHeight: 100 }}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default function TournamentsScreen() {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetails = (tournament) => {
    setSelectedTournament(tournament);
    setModalVisible(true);
  };

  return (
    <View style={styles.gradientBg}>
      <Text style={styles.title}>Tournaments</Text>
      <FlatList
        data={tournaments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenDetails(item)}>
            <View style={styles.cardRow}>
              <Image source={{ uri: item.logo }} style={styles.tournamentLogo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.tournamentName}>{item.name}</Text>
                <Text style={styles.tournamentDate}>{item.date} • {item.time}</Text>
                <Text style={styles.tournamentLocation}>{item.location}</Text>
              </View>
              <View style={styles.statusPill(item.status)}>
                <Text style={styles.statusPillText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TournamentDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        tournament={selectedTournament}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    backgroundColor: '#181C24',
    paddingTop: 24,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#23283A',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 24,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tournamentLogo: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  tournamentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  tournamentDate: {
    fontSize: 13,
    color: '#A0AEC0',
    marginBottom: 2,
  },
  tournamentLocation: {
    fontSize: 13,
    color: '#A0AEC0',
  },
  statusPill: (status) => ({
    backgroundColor:
      status === 'completed' ? '#059669' :
      status === 'ongoing' ? '#F59E42' :
      status === 'registration' ? '#3B82F6' : '#6B7280',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginLeft: 12,
  }),
  statusPillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#23283A',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLogo: {
    width: 64,
    height: 64,
    marginBottom: 16,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalInfo: {
    fontSize: 15,
    color: '#A0AEC0',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalStatus: {
    fontSize: 14,
    color: '#F59E42',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  modalText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  closeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 