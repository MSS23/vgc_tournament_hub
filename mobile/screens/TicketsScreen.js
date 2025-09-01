import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image } from 'react-native';

// Mock tickets for Manraj Sidhu
const tickets = [
  {
    id: '1',
    tournament: 'Phoenix Regional Championships',
    date: '2024-03-15',
    location: 'Phoenix, AZ',
    division: 'Master',
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PHX2024-MANRAJ',
    status: 'checked-in',
  },
  {
    id: '2',
    tournament: 'San Diego Regional Championships',
    date: '2024-02-10',
    location: 'San Diego, CA',
    division: 'Master',
    qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SD2024-MANRAJ',
    status: 'pending',
  },
];

function TicketModal({ visible, onClose, ticket }) {
  if (!ticket) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{ticket.tournament}</Text>
        <Text style={styles.modalInfo}>{ticket.date} • {ticket.location}</Text>
        <Text style={styles.modalInfo}>Division: {ticket.division}</Text>
        <Image source={{ uri: ticket.qr }} style={styles.qrImage} />
        <Text style={styles.status}>Status: {ticket.status === 'checked-in' ? 'Checked In' : 'Pending'}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default function TicketsScreen() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tickets</Text>
      <FlatList
        data={tickets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenTicket(item)}>
            <Text style={styles.tournament}>{item.tournament}</Text>
            <Text style={styles.info}>{item.date} • {item.location}</Text>
            <Text style={styles.info}>Division: {item.division}</Text>
            <Text style={styles.status}>Status: {item.status === 'checked-in' ? 'Checked In' : 'Pending'}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan QR for Check-In</Text>
      </TouchableOpacity>
      <TicketModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        ticket={selectedTicket}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#23283A', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  tournament: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  info: { fontSize: 14, color: '#A0AEC0', marginBottom: 4 },
  status: { fontSize: 13, color: '#059669', marginBottom: 8 },
  scanButton: { backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  scanButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  modalContainer: { flex: 1, backgroundColor: '#23283A', padding: 24, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
  modalInfo: { fontSize: 15, color: '#A0AEC0', marginBottom: 8, textAlign: 'center' },
  qrImage: { width: 180, height: 180, marginVertical: 24, backgroundColor: '#181C24', borderRadius: 18 },
  closeButton: { backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 24, width: '100%' },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 