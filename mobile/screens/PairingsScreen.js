import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';

// Mock tournaments data
const tournaments = [
  { id: '1', name: 'Phoenix Regional Championships', date: '2024-03-15', status: 'ongoing', rounds: 5 },
  { id: '2', name: 'San Diego Regional Championships', date: '2024-02-10', status: 'completed', rounds: 8 },
  { id: '3', name: 'London Regional Championships', date: '2024-04-05', status: 'upcoming', rounds: 0 },
];

// Mock pairings by tournament and round
const pairingsData = {
  '1': {
    1: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'David Kim', status: 'Completed' },
      { table: 2, player1: 'Alex Rodriguez', player2: 'Sarah Chen', status: 'Completed' },
    ],
    2: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Sarah Chen', status: 'Completed' },
      { table: 2, player1: 'David Kim', player2: 'Alex Rodriguez', status: 'Completed' },
    ],
    3: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Alex Rodriguez', status: 'Completed' },
      { table: 2, player1: 'Sarah Chen', player2: 'David Kim', status: 'Completed' },
    ],
    4: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'David Kim', status: 'In Progress' },
      { table: 2, player1: 'Alex Rodriguez', player2: 'Sarah Chen', status: 'In Progress' },
    ],
    5: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Sarah Chen', status: 'In Progress' },
      { table: 2, player1: 'David Kim', player2: 'Alex Rodriguez', status: 'In Progress' },
    ],
  },
  '2': {
    1: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Emily Davis', status: 'Completed' },
      { table: 2, player1: 'Sarah Chen', player2: 'Marcus Johnson', status: 'Completed' },
    ],
    2: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Marcus Johnson', status: 'Completed' },
      { table: 2, player1: 'Emily Davis', player2: 'Sarah Chen', status: 'Completed' },
    ],
    3: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Sarah Chen', status: 'Completed' },
      { table: 2, player1: 'Marcus Johnson', player2: 'Emily Davis', status: 'Completed' },
    ],
    4: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Emily Davis', status: 'Completed' },
      { table: 2, player1: 'Sarah Chen', player2: 'Marcus Johnson', status: 'Completed' },
    ],
    5: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Marcus Johnson', status: 'Completed' },
      { table: 2, player1: 'Emily Davis', player2: 'Sarah Chen', status: 'Completed' },
    ],
    6: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Sarah Chen', status: 'Completed' },
      { table: 2, player1: 'Marcus Johnson', player2: 'Emily Davis', status: 'Completed' },
    ],
    7: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Emily Davis', status: 'Completed' },
      { table: 2, player1: 'Sarah Chen', player2: 'Marcus Johnson', status: 'Completed' },
    ],
    8: [
      { table: 1, player1: 'Manraj Sidhu', player2: 'Marcus Johnson', status: 'Completed' },
      { table: 2, player1: 'Emily Davis', player2: 'Sarah Chen', status: 'Completed' },
    ],
  },
};

function getDefaultTournament() {
  const ongoing = tournaments.find(t => t.status === 'ongoing');
  if (ongoing) return ongoing;
  const past = tournaments.filter(t => t.status === 'completed').sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (past) return past;
  return tournaments.find(t => t.status === 'upcoming') || tournaments[0];
}

export default function PairingsScreen() {
  const [selectedTournament, setSelectedTournament] = useState(getDefaultTournament());
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRound, setSelectedRound] = useState(selectedTournament.rounds > 0 ? selectedTournament.rounds : 1);

  React.useEffect(() => {
    setSelectedRound(selectedTournament.rounds > 0 ? selectedTournament.rounds : 1);
  }, [selectedTournament]);

  const pairings = pairingsData[selectedTournament.id]?.[selectedRound] || [];

  const ongoing = tournaments.filter(t => t.status === 'ongoing');
  const past = tournaments.filter(t => t.status === 'completed');
  const upcoming = tournaments.filter(t => t.status === 'upcoming');

  return (
    <View style={styles.container}>
      {/* Tournament Selector Card */}
      <TouchableOpacity style={styles.selectorCard} onPress={() => setShowDropdown(true)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.selectorTitle}>{selectedTournament.name}</Text>
          <Text style={styles.selectorSubtitle}>{selectedTournament.date}</Text>
        </View>
        <View style={styles.statusPill(selectedTournament.status)}>
          <Text style={styles.statusPillText}>{selectedTournament.status.charAt(0).toUpperCase() + selectedTournament.status.slice(1)}</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDropdown(false)} activeOpacity={1}>
          <View style={styles.dropdownModal}>
            <Text style={styles.dropdownHeader}>Ongoing</Text>
            {ongoing.length === 0 && <Text style={styles.dropdownEmpty}>No ongoing tournaments</Text>}
            {ongoing.map(t => (
              <TouchableOpacity key={t.id} style={styles.dropdownItemCard} onPress={() => { setSelectedTournament(t); setShowDropdown(false); }}>
                <Text style={styles.dropdownItemText}>{t.name}</Text>
                <View style={styles.statusPill('ongoing')}><Text style={styles.statusPillText}>Live</Text></View>
              </TouchableOpacity>
            ))}
            <Text style={styles.dropdownHeader}>Past</Text>
            {past.length === 0 && <Text style={styles.dropdownEmpty}>No past tournaments</Text>}
            {past.map(t => (
              <TouchableOpacity key={t.id} style={styles.dropdownItemCard} onPress={() => { setSelectedTournament(t); setShowDropdown(false); }}>
                <Text style={styles.dropdownItemText}>{t.name}</Text>
                <View style={styles.statusPill('completed')}><Text style={styles.statusPillText}>Completed</Text></View>
              </TouchableOpacity>
            ))}
            <Text style={styles.dropdownHeader}>Upcoming</Text>
            {upcoming.length === 0 && <Text style={styles.dropdownEmpty}>No upcoming tournaments</Text>}
            {upcoming.map(t => (
              <TouchableOpacity key={t.id} style={styles.dropdownItemCard} onPress={() => { setSelectedTournament(t); setShowDropdown(false); }}>
                <Text style={styles.dropdownItemText}>{t.name}</Text>
                <View style={styles.statusPill('upcoming')}><Text style={styles.statusPillText}>Upcoming</Text></View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Round Selector Cards */}
      {selectedTournament.rounds > 0 && (
        <View style={styles.roundSelectorRow}>
          {[...Array(selectedTournament.rounds)].map((_, i) => (
            <TouchableOpacity
              key={i + 1}
              style={[styles.roundCard, selectedRound === i + 1 && styles.roundCardActive]}
              onPress={() => setSelectedRound(i + 1)}
            >
              <Text style={[styles.roundCardText, selectedRound === i + 1 && styles.roundCardTextActive]}>Round {i + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Pairings List as Cards */}
      {selectedTournament.status === 'upcoming' ? (
        <View style={styles.upcomingBox}>
          <Text style={styles.upcomingText}>Pairings will be available once the tournament begins.</Text>
        </View>
      ) : (
        <FlatList
          data={pairings}
          keyExtractor={item => item.table.toString()}
          renderItem={({ item }) => (
            <View style={styles.pairingCard}>
              <View style={styles.pairingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.table}>Table {item.table}</Text>
                  <Text style={styles.players}>{item.player1}</Text>
                </View>
                <Text style={styles.vs}>vs</Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={styles.table}>&nbsp;</Text>
                  <Text style={styles.players}>{item.player2}</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={[styles.status, item.status === 'Completed' ? styles.completed : styles.inProgress]}>{item.status}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No pairings for this round.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181C24',
    padding: 16,
  },
  selectorCard: {
    backgroundColor: '#23283A',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  selectorTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 2,
  },
  selectorSubtitle: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 2,
  },
  statusPill: (status) => ({
    backgroundColor:
      status === 'completed' ? '#059669' :
      status === 'ongoing' ? '#F59E42' :
      status === 'upcoming' ? '#3B82F6' : '#6B7280',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginLeft: 12,
    minWidth: 80,
    alignItems: 'center',
  }),
  statusPillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#23283A',
    borderRadius: 22,
    padding: 18,
    width: '90%',
    maxWidth: 420,
  },
  dropdownHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  dropdownEmpty: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 10,
  },
  dropdownItemCard: {
    backgroundColor: '#23283A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    fontWeight: 'bold',
  },
  roundSelectorRow: {
    flexDirection: 'row',
    marginBottom: 18,
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  roundCard: {
    backgroundColor: '#23283A',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 6,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  roundCardActive: {
    backgroundColor: '#3B82F6',
  },
  roundCardText: {
    color: '#A0AEC0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roundCardTextActive: {
    color: '#fff',
  },
  pairingCard: {
    backgroundColor: '#23283A',
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  pairingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  table: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  players: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  vs: {
    color: '#A0AEC0',
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 2,
  },
  completed: {
    backgroundColor: '#059669',
    color: '#fff',
  },
  inProgress: {
    backgroundColor: '#F59E42',
    color: '#fff',
  },
  upcomingBox: {
    backgroundColor: '#23283A',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  upcomingText: {
    color: '#A0AEC0',
    fontSize: 17,
    textAlign: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
}); 