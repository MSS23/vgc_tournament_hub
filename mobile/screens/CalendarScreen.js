import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';

const events = [
  { id: '1', name: 'Phoenix Regional Championships', date: '2024-03-15', location: 'Phoenix, AZ', type: 'tournament' },
  { id: '2', name: 'San Diego Regional Championships', date: '2024-02-10', location: 'San Diego, CA', type: 'tournament' },
  { id: '3', name: 'London Regional Championships', date: '2024-04-05', location: 'London, UK', type: 'tournament' },
  { id: '4', name: 'VGC Meetup - Los Angeles', date: '2024-03-22', location: 'Los Angeles, CA', type: 'meetup' },
];

function EventModal({ visible, onClose, event }) {
  if (!event) return null;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{event.name}</Text>
        <Text style={styles.modalInfo}>{event.date} • {event.location}</Text>
        <Text style={styles.modalInfo}>Type: {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

export default function CalendarScreen() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenEvent(item)}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.info}>{item.date} • {item.location}</Text>
            <Text style={styles.type}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <EventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        event={selectedEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181C24', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#23283A', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 },
  eventName: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  info: { fontSize: 14, color: '#A0AEC0', marginBottom: 4 },
  type: { fontSize: 13, color: '#059669', marginBottom: 8 },
  modalContainer: { flex: 1, backgroundColor: '#23283A', padding: 24, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
  modalInfo: { fontSize: 15, color: '#A0AEC0', marginBottom: 8, textAlign: 'center' },
  closeButton: { backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 24, width: '100%' },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 